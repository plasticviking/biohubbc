import { SQL, SQLStatement } from 'sql-template-strings';
import { getLogger } from '../../utils/logger';

const defaultLog = getLogger('queries/project/project-create-queries');

/**
 * SQL query to get project stakeholder partnerships.
 * @param {number} projectId
 * @returns {SQLStatement} sql query object
 */
export const getStakeholderPartnershipsByProjectSQL = (projectId: number): SQLStatement | null => {
  defaultLog.debug({ label: 'getStakeholderPartnershipsByProjectSQL', message: 'params', projectId });

  if (!projectId) {
    return null;
  }

  const sqlStatement = SQL`
    SELECT
      name
    FROM
      stakeholder_partnership
    WHERE
      p_id = ${projectId};
  `;

  defaultLog.debug({
    label: 'getStakeholderPartnershipsByProjectSQL',
    message: 'sql',
    'sqlStatement.text': sqlStatement.text,
    'sqlStatement.values': sqlStatement.values
  });

  return sqlStatement;
};

/**
 * SQL query to get project focal species for update purposes.
 *
 * @param {number} projectId
 * @returns {SQLStatement} sql query object
 */
export const getFocalSpeciesByProjectSQL = (projectId: number): SQLStatement | null => {
  defaultLog.debug({ label: 'getFocalSpeciesByProjectSQL', message: 'params', projectId });

  if (!projectId) {
    return null;
  }

  const sqlStatement = SQL`
    SELECT
      name
    FROM
      focal_species
    where p_id = ${projectId};
  `;

  defaultLog.debug({
    label: 'getFocalSpeciesByProjectSQL',
    message: 'sql',
    'sqlStatement.text': sqlStatement.text,
    'sqlStatement.values': sqlStatement.values
  });

  return sqlStatement;
};

/**
 * SQL query to get project ancillary species for update purposes.
 *
 * @param {number} projectId
 * @returns {SQLStatement} sql query object
 */
export const getAncillarySpeciesByProjectSQL = (projectId: number): SQLStatement | null => {
  defaultLog.debug({ label: 'getAncillarySpeciesByProjectSQL', message: 'params', projectId });

  if (!projectId) {
    return null;
  }

  const sqlStatement = SQL`
    SELECT
      name
    FROM
      ancillary_species
    where p_id = ${projectId};
  `;

  defaultLog.debug({
    label: 'getAncillarySpeciesByProjectSQL',
    message: 'sql',
    'sqlStatement.text': sqlStatement.text,
    'sqlStatement.values': sqlStatement.values
  });

  return sqlStatement;
};