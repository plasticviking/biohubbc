import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { mdiDotsVertical, mdiInformationOutline, mdiTrashCanOutline, mdiTrayArrowDown } from '@mdi/js';
import Icon from '@mdi/react';
import { AttachmentType } from 'constants/attachments';
import { IGetProjectAttachment } from 'interfaces/useProjectApi.interface';
import { IGetSurveyAttachment } from 'interfaces/useSurveyApi.interface';
import React, { useState } from 'react';

interface IAttachmentsListItemMenuButtonProps<T extends IGetProjectAttachment | IGetSurveyAttachment> {
  attachment: T;
  handleDownloadFile: (attachment: T) => void;
  handleDeleteFile: (attachment: T) => void;
  handleViewDetails: (attachment: T) => void;
}

const AttachmentsListItemMenuButton = <T extends IGetProjectAttachment | IGetSurveyAttachment>(
  props: IAttachmentsListItemMenuButtonProps<T>
) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box my={-1}>
        <Box>
          <IconButton aria-label="Document actions" onClick={handleClick} data-testid="attachment-action-menu">
            <Icon path={mdiDotsVertical} size={1} />
          </IconButton>
          <Menu
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}>
            <MenuItem
              onClick={() => {
                props.handleDownloadFile(props.attachment);
                setAnchorEl(null);
              }}
              data-testid="attachment-action-menu-download">
              <ListItemIcon>
                <Icon path={mdiTrayArrowDown} size={0.875} />
              </ListItemIcon>
              Download Document
            </MenuItem>
            {props.attachment.fileType === AttachmentType.REPORT && (
              <MenuItem
                onClick={() => {
                  props.handleViewDetails(props.attachment);
                  setAnchorEl(null);
                }}
                data-testid="attachment-action-menu-details">
                <ListItemIcon>
                  <Icon path={mdiInformationOutline} size={0.8} />
                </ListItemIcon>
                View Document Details
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                props.handleDeleteFile(props.attachment);
                setAnchorEl(null);
              }}
              data-testid="attachment-action-menu-delete">
              <ListItemIcon>
                <Icon path={mdiTrashCanOutline} size={0.8} />
              </ListItemIcon>
              Delete Document
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default AttachmentsListItemMenuButton;