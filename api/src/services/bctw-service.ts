import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import { z } from 'zod';
import { ApiError, ApiErrorType } from '../errors/api-error';
import { KeycloakService } from './keycloak-service';

export const IDeployDevice = z.object({
  device_id: z.number(),
  frequency: z.number(),
  manufacturer: z.string(),
  model: z.string(),
  attachment_start: z.string(),
  attachment_end: z.string(),
  critter_id: z.string()
});

export type IDeployDevice = z.infer<typeof IDeployDevice>;

export const IDeploymentUpdate = z.object({
  deployment_id: z.string(),
  attachment_start: z.string(),
  attachment_end: z.string()
});

export type IDeploymentUpdate = z.infer<typeof IDeploymentUpdate>;

export const IDeploymentRecord = z.object({
  assignment_id: z.string(),
  collar_id: z.string(),
  critter_id: z.string(),
  created_at: z.string(),
  created_by_user_id: z.string(),
  updated_at: z.string(),
  updated_by_user_id: z.string(),
  valid_from: z.string(),
  valid_to: z.string(),
  attachment_start: z.string(),
  attachment_end: z.string(),
  deployment_id: z.number()
});

export type IDeploymentRecord = z.infer<typeof IDeploymentRecord>;

export const IBctwUser = z.object({
  keycloak_guid: z.string(),
  username: z.string()
});

export type IBctwUser = z.infer<typeof IBctwUser>;

export const BCTW_API_HOST = process.env.BCTW_API_HOST || '';
export const DEPLOY_DEVICE_ENDPOINT = '/deploy-device';
export const GET_DEPLOYMENTS_ENDPOINT = '/get-deployments';
export const UPDATE_DEPLOYMENT_ENDPOINT = '/update-deployment';
export const GET_COLLAR_VENDORS_ENDPOINT = '/get-collar-vendors';
export const HEALTH_ENDPOINT = '/health';

export class BctwService {
  user: IBctwUser;
  keycloak: KeycloakService;
  axiosInstance: AxiosInstance;

  constructor(user: IBctwUser) {
    this.user = user;
    this.keycloak = new KeycloakService();
    this.axiosInstance = axios.create({
      headers: {
        user: this.getUserHeader()
      },
      baseURL: BCTW_API_HOST
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(
          new ApiError(ApiErrorType.UNKNOWN, `API request failed with status code ${error?.response?.status}`)
        );
      }
    );

    // Async request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        config.headers['Authorization'] = `Bearer ${token}`;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Return user information as a JSON string.
   *
   * @return {*}  {string}
   * @memberof BctwService
   */
  getUserHeader(): string {
    return JSON.stringify(this.user);
  }

  /**
   * Retrieve an authentication token using Keycloak service.
   *
   * @return {*}  {Promise<string>}
   * @memberof BctwService
   */
  async getToken(): Promise<string> {
    const token = await this.keycloak.getKeycloakServiceToken();
    return token;
  }

  /**
   * Send an authorized get request to the BCTW API.
   *
   * @param {string} endpoint
   * @param {Record<string, string>} [queryParams] - An object containing query parameters as key-value pairs
   * @return {*}
   * @memberof BctwService
   */
  async _makeGetRequest(endpoint: string, queryParams?: Record<string, string>) {
    let url = endpoint;
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  /**
   * Create a new deployment for a telemetry device on a critter.
   *
   * @param {IDeployDevice} device
   * @return {*}  {Promise<IDeploymentRecord>}
   * @memberof BctwService
   */
  async deployDevice(device: IDeployDevice): Promise<IDeploymentRecord> {
    return await this.axiosInstance.post(DEPLOY_DEVICE_ENDPOINT, device);
  }

  /**
   * Get all existing deployments.
   *
   * @return {*}  {Promise<IDeploymentRecord[]>}
   * @memberof BctwService
   */
  async getDeployments(): Promise<IDeploymentRecord[]> {
    return this._makeGetRequest(GET_DEPLOYMENTS_ENDPOINT);
  }

  /**
   * Update the start and end dates of an existing deployment.
   *
   * @param {IDeploymentUpdate} deployment
   * @return {*}  {Promise<IDeploymentRecord>}
   * @memberof BctwService
   */
  async updateDeployment(deployment: IDeploymentUpdate): Promise<IDeploymentRecord> {
    return await this.axiosInstance.patch(UPDATE_DEPLOYMENT_ENDPOINT, deployment);
  }

  /**
   * Get a list of all supported collar vendors.
   *
   * @return {*}  {Promise<string[]>}
   * @memberof BctwService
   */
  async getCollarVendors(): Promise<string[]> {
    return this._makeGetRequest(GET_COLLAR_VENDORS_ENDPOINT);
  }

  /**
   * Get the health of the platform.
   *
   * @return {*}  {Promise<string>}
   * @memberof BctwService
   */
  async getHealth(): Promise<string> {
    return this._makeGetRequest(HEALTH_ENDPOINT);
  }
}