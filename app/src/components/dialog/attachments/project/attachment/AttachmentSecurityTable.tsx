import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { mdiLockOpenOutline, mdiLockOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { DATE_FORMAT } from 'constants/dateTimeFormats';
import { IGetAttachmentDetails, IGetSecurityReasons } from 'interfaces/useProjectApi.interface';
import { default as React } from 'react';
import { getFormattedDateRangeString } from 'utils/Utils';

export interface IAttachmentSecurityTableProps {
  securityDetails: IGetAttachmentDetails | null;
  showAddSecurityDialog: (value: boolean) => void;
  showDeleteSecurityReasonDialog: (securityReasons: IGetSecurityReasons[]) => void;
  isAwaitingReview: boolean;
}

/**
 * General information content for a project.
 *
 * @return {*}
 */
const AttachmentSecurityTable: React.FC<IAttachmentSecurityTableProps> = (props) => {
  return (
    <>
      <Paper variant="outlined" style={{ marginTop: '24px' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h3">
            Security Reasons
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Icon path={mdiLockOutline} size={0.8} />}
              style={{ marginRight: '8px' }}
              onClick={() => props.showAddSecurityDialog(true)}>
              Add Security
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!props.isAwaitingReview && props.securityDetails?.security_reasons.length === 0}
              onClick={async () => {
                await props.showDeleteSecurityReasonDialog([]);
              }}
              startIcon={<Icon path={mdiLockOpenOutline} size={0.8} />}>
              Remove Security
            </Button>
          </Box>
        </Toolbar>
        <Divider></Divider>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="200">Category</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell width="160">Dates</TableCell>
                <TableCell width="160">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.securityDetails &&
                props.securityDetails?.security_reasons &&
                props.securityDetails?.security_reasons?.length > 0 &&
                props.securityDetails?.security_reasons?.map((row, index) => {
                  return (
                    <TableRow key={`${row.security_reason_id}-${index}`}>
                      <TableCell>Persecution or Harm</TableCell>
                      <TableCell>
                        <Typography style={{ fontWeight: 700 }}>{row.security_reason_title}</Typography>
                        <Typography variant="body1" color="textSecondary">
                          {row.security_reason_description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" component="div">
                          {getFormattedDateRangeString(DATE_FORMAT.ShortDateFormat, row.security_date_applied || '')}
                        </Typography>

                        <Typography variant="body2" component="div" color="textSecondary">
                          by {row.user_identifier}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="default"
                          onClick={() => props.showDeleteSecurityReasonDialog([row])}
                          startIcon={<Icon path={mdiTrashCanOutline} size={0.8} />}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {props.securityDetails &&
                props.securityDetails?.security_reasons &&
                props.securityDetails?.security_reasons?.length === 0 &&
                props.isAwaitingReview && (
                  <TableRow key={`0`}>
                    <TableCell>Security Administration</TableCell>
                    <TableCell>
                      <Typography style={{ fontWeight: 700 }}>Awaiting Security Review</Typography>
                      <Typography variant="body1" color="textSecondary">
                        Awaiting review to determine if security-reasons should be assigned
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" component="div">
                        Submitted
                      </Typography>
                      <Typography variant="body2" component="div" color="textSecondary">
                        {getFormattedDateRangeString(
                          DATE_FORMAT.ShortDateFormat,
                          props.securityDetails?.metadata?.last_modified || ''
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}

              {props.securityDetails &&
                props.securityDetails?.security_reasons &&
                props.securityDetails?.security_reasons?.length === 0 &&
                !props.isAwaitingReview && (
                  <TableRow key={`0`}>
                    <TableCell>Security Administration</TableCell>
                    <TableCell>
                      <Typography style={{ fontWeight: 700 }}>Unsecured</Typography>
                      <Typography variant="body1" color="textSecondary">
                        No security reasons required for this record
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" component="div">
                        Expiry Date
                      </Typography>
                      <Typography variant="body2" component="div" color="textSecondary">
                        No Expiry Date
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default AttachmentSecurityTable;