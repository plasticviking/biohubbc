import axios from 'axios';
import { KeycloakConfig } from 'keycloak-js';
import React, { useEffect, useState } from 'react';
import { ensureProtocol } from 'utils/Utils';

export interface IConfig {
  API_HOST: string;
  CHANGE_VERSION: string;
  NODE_ENV: string;
  REACT_APP_NODE_ENV: string;
  VERSION: string;
  KEYCLOAK_CONFIG: KeycloakConfig;
  SITEMINDER_LOGOUT_URL: string;
  MAX_UPLOAD_NUM_FILES: number;
  MAX_UPLOAD_FILE_SIZE: number;
  S3_PUBLIC_HOST_URL: string;
  FEATURE_FLAGS: {
    name: string;
    value: boolean;
  }[];
}

export const ConfigContext = React.createContext<IConfig | undefined>({
  API_HOST: '',
  CHANGE_VERSION: '',
  NODE_ENV: '',
  REACT_APP_NODE_ENV: '',
  VERSION: '',
  KEYCLOAK_CONFIG: {
    url: '',
    realm: '',
    clientId: ''
  },
  SITEMINDER_LOGOUT_URL: '',
  MAX_UPLOAD_NUM_FILES: 10,
  MAX_UPLOAD_FILE_SIZE: 52428800,
  S3_PUBLIC_HOST_URL: '',
  FEATURE_FLAGS: []
});

/**
 * Matches a string that is either:
 * - `''` (an empty string)
 * - `<string>:<true|false>` (a single instance)
 * - `<string>:<true|false>,<string>:<true|false>,<string>:<true|false>...` (multiple comma delimited instances)
 */
const validFeatureFlagStringRegex =
  /^(?:(?=\s*$)|(?:\w+:(?:true|false))|(?:\w+:(?:true|false)){1}(?:,\w+:(?:true|false))*)$/;

/**
 * Parses a valid feature flag string into an array of objects.
 * Note: returns an empty array if the feature flag string does not conform to the expected regex pattern.
 *
 * @param {string} featureFlagsString
 * @return {*}  {{ name: string; value: boolean }[]}
 */
const parseFeatureFlagsString = (featureFlagsString: string): { name: string; value: boolean }[] => {
  if (!featureFlagsString) {
    return [];
  }

  if (!validFeatureFlagStringRegex.test(featureFlagsString)) {
    return [];
  }

  const flags = featureFlagsString.split(',');
  return flags.map((flag) => {
    const parts = flag.split(':');
    return {
      name: parts[0],
      value: parts[1] === 'true'
    };
  });
};

/**
 * Return the app config based on locally set environment variables.
 *
 * @return {*}  {IConfig}
 */
const getLocalConfig = (): IConfig => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const API_URL = (API_PORT && `${API_HOST}:${API_PORT}`) || API_HOST || 'localhost';

  const OBJECT_STORE_URL = process.env.OBJECT_STORE_URL || 'nrs.objectstore.gov.bc.ca';
  const OBJECT_STORE_BUCKET_NAME = process.env.OBJECT_STORE_BUCKET_NAME || 'gblhvt';
  return {
    API_HOST: ensureProtocol(API_URL, 'http://'),
    CHANGE_VERSION: process.env.CHANGE_VERSION || 'NA',
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_NODE_ENV: process.env.REACT_APP_NODE_ENV || 'dev',
    VERSION: `${process.env.VERSION || 'NA'}(build #${process.env.CHANGE_VERSION || 'NA'})`,
    KEYCLOAK_CONFIG: {
      url: process.env.REACT_APP_KEYCLOAK_HOST || '',
      realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ''
    },
    SITEMINDER_LOGOUT_URL: process.env.REACT_APP_SITEMINDER_LOGOUT_URL || '',
    MAX_UPLOAD_NUM_FILES: Number(process.env.REACT_APP_MAX_UPLOAD_NUM_FILES) || 10,
    MAX_UPLOAD_FILE_SIZE: Number(process.env.REACT_APP_MAX_UPLOAD_FILE_SIZE) || 52428800,
    S3_PUBLIC_HOST_URL: ensureProtocol(`${OBJECT_STORE_URL}/${OBJECT_STORE_BUCKET_NAME}`, 'https://'),
    FEATURE_FLAGS: parseFeatureFlagsString(process.env.REACT_APP_FEATURE_FLAGS || '')
  };
};

/**
 * Return the app config based on a deployed app, running via `app/server/index.js`
 *
 * @return {*}  {Promise<IConfig>}
 */
const getDeployedConfig = async (): Promise<IConfig> => {
  const { data } = await axios.get<IConfig>('/config');

  return data;
};

/**
 * Return true if NODE_ENV=development, false otherwise.
 *
 * @return {*}  {boolean}
 */
const isDevelopment = (): boolean => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
};

/**
 * Provides environment variables.
 *
 * This will fetch env vars from either `process.env` if running with NODE_ENV=development, or from
 * `app/server/index.js` if running as a deployed NODE_ENV=production build.
 *
 * @param {*} props
 * @return {*}
 */
export const ConfigContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [config, setConfig] = useState<IConfig>();

  useEffect(() => {
    const loadConfig = async () => {
      if (isDevelopment()) {
        const localConfig = getLocalConfig();
        setConfig(localConfig);
      } else {
        const deployedConfig = await getDeployedConfig();
        setConfig(deployedConfig);
      }
    };

    if (!config) {
      loadConfig();
    }
  }, [config]);
  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
};
