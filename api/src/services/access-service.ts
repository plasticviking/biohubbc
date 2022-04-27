import { ACCESS_REQUEST_APPROVAL_ADMIN_EMAIL } from '../constants/notifications';
import { ApiBuildSQLError, ApiGeneralError } from '../errors/custom-error';
import { updateAdministrativeActivity } from '../paths/administrative-activity';
import { queries } from '../queries/queries';
import { GCNotifyService } from './gcnotify-service';
import { KeycloakService } from './keycloak-service';
import { DBService } from './service';
import { UserService } from './user-service';

const APP_HOST = process.env.APP_HOST;
const NODE_ENV = process.env.NODE_ENV;

interface IPutAccessRequest {
  userIdentifier: string;
  identitySource: string;
  requestId: number;
  requestStatusTypeId: number;
  roleIds: number[];
}

export enum ADMINISTRATIVE_ACTIVITY_STATUS_TYPE {
  PENDING = 'Pending',
  ACTIONED = 'Actioned',
  REJECTED = 'Rejected'
}

export const getAllAdministrativeActivityStatusTypes = (): string[] =>
  Object.values(ADMINISTRATIVE_ACTIVITY_STATUS_TYPE);

export class AccessService extends DBService {
  async updateAccessRequest(body: IPutAccessRequest) {
    const userIdentifier = body?.userIdentifier;
    const identitySource = body?.identitySource;
    const administrativeActivityId = Number(body?.requestId);
    const administrativeActivityStatusTypeId = Number(body?.requestStatusTypeId);
    const roleIds: number[] = body?.roleIds;

    const userService = new UserService(this.connection);

    // Get the system user (adding or activating them if they already existed).
    const systemUserObject = await userService.ensureSystemUser(userIdentifier, identitySource);

    // Filter out any system roles that have already been added to the user
    const rolesIdsToAdd = roleIds.filter((roleId) => !systemUserObject.role_ids.includes(roleId));

    if (rolesIdsToAdd?.length) {
      // Add any missing roles (if any)
      await userService.addUserSystemRoles(systemUserObject.id, rolesIdsToAdd);
    }

    // Update the access request record status
    await updateAdministrativeActivity(administrativeActivityId, administrativeActivityStatusTypeId, this.connection);

    //if the access request is an approval send Approval email
    this.sendApprovalEmail(administrativeActivityStatusTypeId, userIdentifier, identitySource);
  }

  async sendApprovalEmail(adminActivityTypeId: number, userIdentifier: string, identitySource: string) {
    if (await this.checkIfAccessRequestIsApproval(adminActivityTypeId)) {
      const userEmail = await this.getUserKeycloakEmail(userIdentifier, identitySource);
      this.sendAccessRequestApprovalEmail(userEmail);
    }
  }

  async checkIfAccessRequestIsApproval(adminActivityTypeId: number): Promise<boolean> {
    const adminActivityStatusTypeSQLStatment = queries.administrativeActivity.getAdministrativeActivityById(
      adminActivityTypeId
    );

    if (!adminActivityStatusTypeSQLStatment) {
      throw new ApiBuildSQLError('Failed to build SQL select statement');
    }

    const response = await this.connection.query(
      adminActivityStatusTypeSQLStatment.text,
      adminActivityStatusTypeSQLStatment.values
    );

    if (response.rows?.[0]?.name === 'Actioned') {
      return true;
    }
    return false;
  }

  async getUserKeycloakEmail(userIdentifier: string, identitySource: string): Promise<string> {
    const keycloakService = new KeycloakService();
    const userDetails = await keycloakService.getUserByUsername(`${userIdentifier}@${identitySource}`);
    return userDetails.email;
  }

  async sendAccessRequestApprovalEmail(userEmail: string) {
    const gcnotifyService = new GCNotifyService();

    const url = `${APP_HOST}/`;
    const hrefUrl = `[click here.](${url})`;
    try {
      await gcnotifyService.sendEmailGCNotification(userEmail, {
        ...ACCESS_REQUEST_APPROVAL_ADMIN_EMAIL,
        subject: `${NODE_ENV}: ${ACCESS_REQUEST_APPROVAL_ADMIN_EMAIL.subject}`,
        body1: `${ACCESS_REQUEST_APPROVAL_ADMIN_EMAIL.body1} ${hrefUrl}`,
        footer: `${APP_HOST}`
      });
    } catch (error) {
      throw new ApiGeneralError('Failed to send gcNotification approval email', [(error as Error).message]);
    }
  }

  async getAdministrativeActivities(typeName: string, statusTypes: string[]) {
    const sqlStatement = queries.administrativeActivity.getAdministrativeActivitiesSQL(typeName, statusTypes);

    if (!sqlStatement) {
      throw new ApiBuildSQLError('Failed to build SQL select statement');
    }

    const response = await this.connection.query(sqlStatement.text, sqlStatement.values);

    const result = (response && response.rowCount && response.rows) || [];

    return result;
  }
}
