import { PROJECT_ROLE, SYSTEM_ROLE } from 'constants/roles';
import { AuthStateContext } from 'contexts/authStateContext';
import { ConfigContext } from 'contexts/configContext';
import { ProjectAuthStateContext } from 'contexts/projectAuthStateContext';
import { PropsWithChildren, ReactElement, useContext } from 'react';
import { isAuthenticated } from 'utils/authUtils';

interface IGuardProps {
  /**
   * An optional backup ReactElement to render if the guard fails.
   *
   * @type {ReactElement}
   * @memberof IGuardProps
   */
  fallback?: ReactElement;
}

export interface ISystemRoleGuardProps extends IGuardProps {
  /**
   * An array of valid system roles. The user must have 1 or more matching system roles to pass the guard.
   *
   * @type {SYSTEM_ROLE[]}
   * @memberof ISystemRoleGuardProps
   */
  validSystemRoles: SYSTEM_ROLE[];
}

export interface IProjectRoleGuardProps extends IGuardProps {
  /**
   * An array of valid project roles. The user must have 1 or more matching project roles to pass the guard.
   *
   * @type {PROJECT_ROLE[]}
   * @memberof IProjectRoleGuardProps
   */
  validProjectRoles: PROJECT_ROLE[];
  /**
   * An array of valid system roles. The user may have 1 or more matching system roles to override the guard.
   *
   * @type {SYSTEM_ROLE[]}
   * @memberof IProjectRoleGuardProps
   */
  validSystemRoles?: SYSTEM_ROLE[];
}

export interface IFeatureFlagGuardProps extends IGuardProps {
  /**
   * An array of feature flag names.
   *
   * @type {string[]}
   * @memberof IFeatureFlagGuardProps
   */
  featureFlags: string[];
}

/**
 * Renders `props.children` only if the user is authenticated and has at least 1 of the specified valid system roles.
 *
 * @param {*} props
 * @return {*}
 */
export const SystemRoleGuard = (props: PropsWithChildren<ISystemRoleGuardProps>) => {
  const { keycloakWrapper } = useContext(AuthStateContext);
  const { validSystemRoles } = props;
  const hasSystemRole = keycloakWrapper?.hasSystemRole(validSystemRoles);

  if (!hasSystemRole) {
    if (props.fallback) {
      return <>{props.fallback}</>;
    } else {
      return <></>;
    }
  }

  return <>{props.children}</>;
};

/**
 * Renders `props.children` only if the user has the necessary roles as a project participant.
 *
 * @param {*} props
 * @return {*}
 */
export const ProjectRoleGuard = (props: PropsWithChildren<IProjectRoleGuardProps>) => {
  const { validProjectRoles, validSystemRoles } = props;
  const projectAuthStateContext = useContext(ProjectAuthStateContext);

  const hasSystemRole = projectAuthStateContext.hasSystemRole(validSystemRoles);
  const hasProjectRole = projectAuthStateContext.hasProjectRole(validProjectRoles);

  if (hasSystemRole || hasProjectRole) {
    return <>{props.children}</>;
  }

  if (props.fallback) {
    return <>{props.fallback}</>;
  }

  return <></>;
};

/**
 * Renders `props.children` only if the user is authenticated.
 *
 * @param {*} props
 * @return {*}
 */
export const AuthGuard = (props: PropsWithChildren<IGuardProps>) => {
  const { keycloakWrapper } = useContext(AuthStateContext);

  if (!isAuthenticated(keycloakWrapper)) {
    if (props.fallback) {
      return <>{props.fallback}</>;
    } else {
      return <></>;
    }
  }

  return <>{props.children}</>;
};

/**
 * Renders `props.children` only if the user is not authenticated.
 *
 * @param {*} props
 * @return {*}
 */
export const UnAuthGuard = (props: PropsWithChildren<IGuardProps>) => {
  const { keycloakWrapper } = useContext(AuthStateContext);

  if (isAuthenticated(keycloakWrapper)) {
    if (props.fallback) {
      return <>{props.fallback}</>;
    } else {
      return <></>;
    }
  }

  return <>{props.children}</>;
};

/**
 * Renders `props.children` if all of the specified feature flags exist and are `true`.
 *
 * Renders `props.fallback` if at least one of the specified feature flags exists and is `false`.
 *
 * Renders nothing if the feature flag does not exist.
 *
 * @param {*} props
 * @return {*}
 */
export const FeatureFlagGuard = (props: PropsWithChildren<IFeatureFlagGuardProps>) => {
  const config = useContext(ConfigContext);

  const matchingFeatureFlags = config?.FEATURE_FLAGS.filter((featureFlag) =>
    props.featureFlags.includes(featureFlag.name)
  );

  if (matchingFeatureFlags?.every((item) => item.value)) {
    // If all specified feature flags exist and are `true`
    return <>{props.children}</>;
  }

  if (matchingFeatureFlags?.some((item) => !item.value)) {
    // If at least one of the specified feature flags exists and is `false`
    return <>{props.fallback}</>;
  }

  // If none of the specified feature flags exist
  return <></>;
};
