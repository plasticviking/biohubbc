import { Chip } from '@material-ui/core';
import { mdiAlertCircle, mdiLockCheckOutline, mdiLockOpenCheckOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { SYSTEM_ROLE } from 'constants/roles';
import { AuthStateContext } from 'contexts/authStateContext';
import React, { useContext } from 'react';

interface IAttachmentStatusChip {
  securityReviewTimestamp: string | null;
  securityRuleCount?: number;
}

const AttachmentStatusChip: React.FC<IAttachmentStatusChip> = (props) => {
  const { securityRuleCount, securityReviewTimestamp } = props;

  const { keycloakWrapper } = useContext(AuthStateContext);

  const isDataAdmin = keycloakWrapper?.hasSystemRole([SYSTEM_ROLE.DATA_ADMINISTRATOR]);

  let label = 'Submitted';
  let color: 'default' | 'primary' | 'secondary' | undefined = 'primary';
  let icon = undefined;

  if (securityReviewTimestamp) {
    if (securityRuleCount && securityRuleCount > 0) {
      label = securityRuleCount ? `Secured (${securityRuleCount})` : 'Secured';
      color = 'default';
      icon = mdiLockCheckOutline;
    } else {
      label = 'Unsecured';
      color = 'default';
      icon = mdiLockOpenCheckOutline;
    }
  } else if (isDataAdmin) {
    label = 'Pending review';
    color = 'secondary';
    icon = mdiAlertCircle;
  }

  return <Chip size="small" color={color} label={label} icon={icon ? <Icon path={icon} size={0.8} /> : undefined} />;
};

export default AttachmentStatusChip;