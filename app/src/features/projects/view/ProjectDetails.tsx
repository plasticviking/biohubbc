import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import assert from 'assert';
import { ProjectContext } from 'contexts/projectContext';
import { useContext } from 'react';
import GeneralInformation from './components/GeneralInformation';
import ProjectObjectives from './components/ProjectObjectives';

const useStyles = makeStyles((theme: Theme) => ({
  projectMetadata: {
    '& section + section': {
      marginTop: theme.spacing(4)
    },
    '& dt': {
      flex: '0 0 40%'
    },
    '& dd': {
      flex: '1 1 auto'
    },
    '& .MuiListItem-root': {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5)
    },
    '& .MuiListItem-root:first-of-type': {
      paddingTop: 0
    },
    '& .MuiListItem-root:last-of-type': {
      paddingBottom: 0
    }
  },
  projectMetaSectionHeader: {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.02rem',
    textTransform: 'uppercase',
    color: grey[600],
    '& + hr': {
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(1.5)
    }
  }
}));

/**
 * Project details content for a project.
 *
 * @return {*}
 */
const ProjectDetails = () => {
  const classes = useStyles();
  const projectContext = useContext(ProjectContext);

  // Project data must be loaded by a parent before this component is rendered
  assert(projectContext.projectDataLoader.data);

  return (
    <Box>
      <Toolbar>
        <Typography variant="h4" component="h3">
          Project Details
        </Typography>
      </Toolbar>
      <Divider></Divider>
      <Box p={3} className={classes.projectMetadata}>
        <Box component="section">
          <Typography component="h4" className={classes.projectMetaSectionHeader}>
            Project Objectives
          </Typography>
          <Divider></Divider>
          <ProjectObjectives />
        </Box>

        <Box component="section">
          <Typography component="h4" className={classes.projectMetaSectionHeader}>
            General Information
          </Typography>
          <Divider></Divider>
          <GeneralInformation />
        </Box>

        {/* TODO: (https://apps.nrs.gov.bc.ca/int/jira/browse/SIMSBIOHUB-162) Commenting out IUCN form (view) temporarily, while its decided if IUCN information is desired */}
        {/* <Box component="section" mb={0}>
          <Typography component="h4" className={classes.projectMetaSectionHeader}>
            IUCN Classification
          </Typography>
          <Divider></Divider>
          <IUCNClassification />
        </Box> */}
      </Box>
    </Box>
  );
};

export default ProjectDetails;
