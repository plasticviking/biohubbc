import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { mdiAlertCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import {
  IGetObservationSubmissionResponse,
  IGetObservationSubmissionResponseMessages
} from 'interfaces/useObservationApi.interface';
import React from 'react';

export interface IObservationMessagesCardProps {
  observationRecord: IGetObservationSubmissionResponse;
}

const ObservationMessagesCard = (props: IObservationMessagesCardProps) => {
  if (!props.observationRecord.surveyObservationData.messageTypes.length) {
    // No messages to display
    return <></>;
  }

  const errorMessageTypes = props.observationRecord.surveyObservationData.messageTypes
    .filter((item) => item.severityLabel === 'Error')
    .sort(alphabetizeSubmissionMessageTypes);

  const warningMessageTypes = props.observationRecord.surveyObservationData.messageTypes
    .filter((item) => item.severityLabel === 'Warning')
    .sort(alphabetizeSubmissionMessageTypes);

  const noticeMessageTypes = props.observationRecord.surveyObservationData.messageTypes
    .filter((item) => item.severityLabel === 'Notice')
    .sort(alphabetizeSubmissionMessageTypes);

  function alphabetizeSubmissionMessageTypes(
    messageA: IGetObservationSubmissionResponseMessages,
    messageB: IGetObservationSubmissionResponseMessages
  ) {
    // Message A is sorted before B
    if (messageA.messageTypeLabel < messageB.messageTypeLabel) {
      return -1;
    }
    // Message B is sorted before A
    if (messageA.messageTypeLabel > messageB.messageTypeLabel) {
      return 1;
    }
    // Items are already in order
    return 0;
  }

  function SubmissionMessage(props: { messageObject: { id: number; message: string } }) {
    return (
      <li key={props.messageObject.id}>
        <Typography variant="body2" component="span">
          {props.messageObject.message}
        </Typography>
      </li>
    );
  }

  function SubmissionMessageType(props: { messageType: IGetObservationSubmissionResponseMessages }) {
    return (
      <Box mt={3}>
        <Box component="section">
          <Typography variant="body2">
            <strong>{props.messageType.messageTypeLabel}</strong>
          </Typography>
          <Box component="ul" mt={1} mb={0} pl={4}>
            {props.messageType.messages.map((messageObject) => (
              <SubmissionMessage messageObject={messageObject} key={messageObject.id} />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  function ErrorMessages(props: { messageTypes: IGetObservationSubmissionResponseMessages[] }) {
    if (!props.messageTypes.length) {
      return <></>;
    }

    return (
      <Alert severity="error" icon={<Icon path={mdiAlertCircleOutline} size={1} />}>
        <AlertTitle>Failed to import observations</AlertTitle>
        One or more errors occurred while attempting to import your observations file.
        {props.messageTypes.map((messageType) => {
          return <SubmissionMessageType messageType={messageType} key={messageType.messageTypeLabel} />;
        })}
      </Alert>
    );
  }

  function WarningMessages(props: { messageTypes: IGetObservationSubmissionResponseMessages[] }) {
    if (!props.messageTypes.length) {
      return <></>;
    }

    return (
      <Alert severity="warning" icon={<Icon path={mdiAlertCircleOutline} size={1} />}>
        <AlertTitle>Warning</AlertTitle>
        {props.messageTypes.map((messageType) => {
          return <SubmissionMessageType messageType={messageType} key={messageType.messageTypeLabel} />;
        })}
      </Alert>
    );
  }

  function NoticeMessages(props: { messageTypes: IGetObservationSubmissionResponseMessages[] }) {
    if (!props.messageTypes.length) {
      return <></>;
    }

    return (
      <Alert severity="info" icon={<Icon path={mdiAlertCircleOutline} size={1} />}>
        <AlertTitle>Notice</AlertTitle>
        {props.messageTypes.map((messageType) => {
          return <SubmissionMessageType messageType={messageType} key={messageType.messageTypeLabel} />;
        })}
      </Alert>
    );
  }

  return (
    <Box mb={3}>
      <Box>
        <ErrorMessages messageTypes={errorMessageTypes} />
      </Box>
      <Box mt={1}>
        <WarningMessages messageTypes={warningMessageTypes} />
      </Box>
      <Box mt={1}>
        <NoticeMessages messageTypes={noticeMessageTypes} />
      </Box>
    </Box>
  );
};

export default ObservationMessagesCard;