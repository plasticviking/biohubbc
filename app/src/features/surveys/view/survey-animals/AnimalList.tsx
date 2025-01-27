import { mdiChevronDown, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography
} from '@mui/material';
import grey from '@mui/material/colors/grey';
import { Box } from '@mui/system';
import { SurveyAnimalsI18N } from 'constants/i18n';
import { useQuery } from 'hooks/useQuery';
import { IDetailedCritterWithInternalId } from 'interfaces/useSurveyApi.interface';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ANIMAL_SECTIONS_FORM_MAP, IAnimalSections } from './animal-sections';

interface IAnimalListProps {
  isLoading?: boolean;
  critterData?: IDetailedCritterWithInternalId[];
  selectedSection: IAnimalSections;
  onSelectSection: (section: IAnimalSections) => void;
  onAddButton: () => void;
}

const ListPlaceholder = (props: { displaySkeleton: boolean }) =>
  props.displaySkeleton ? (
    <Box
      flexDirection="column"
      sx={{
        px: 2,
        py: 1.2,
        height: '70px',
        borderBottom: '1px solid ' + grey[300],
        background: '#fff'
      }}>
      <Skeleton variant="text" sx={{ fontSize: '1.125rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="50%" />
    </Box>
  ) : (
    <Box display="flex" flex="1 1 auto" height="100%" alignItems="center" justifyContent="center">
      <Typography variant="body2">No Animals</Typography>
    </Box>
  );

const AnimalList = (props: IAnimalListProps) => {
  const { isLoading, selectedSection, onSelectSection, critterData, onAddButton } = props;
  const { cid: survey_critter_id } = useQuery();

  const history = useHistory();

  const sortedCritterData = useMemo(() => {
    return [...(critterData ?? [])].sort(
      (a, b) => new Date(a.create_timestamp).getTime() - new Date(b.create_timestamp).getTime()
    );
  }, [critterData]);

  const handleCritterSelect = (id: string) => {
    if (id === survey_critter_id) {
      history.replace(history.location.pathname);
    } else {
      history.push(`?cid=${id}`);
    }
    onSelectSection(SurveyAnimalsI18N.animalGeneralTitle);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Toolbar
        sx={{
          flex: '0 0 auto'
        }}>
        <Typography
          component="h2"
          variant="h5"
          sx={{
            flexGrow: '1'
          }}>
          Animals
        </Typography>
        <Button
          variant="contained"
          sx={{
            mr: -1,
            fontWeight: 700
          }}
          color="primary"
          startIcon={<Icon path={mdiPlus} size={1} />}
          onClick={onAddButton}>
          Add
        </Button>
      </Toolbar>

      <Divider flexItem></Divider>
      <Box flex="1 1 auto" sx={{ position: 'relative', background: grey[100] }}>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            p: 1,
            overflowY: 'auto',
            zIndex: 1000
          }}>
          {!sortedCritterData.length ? (
            <ListPlaceholder displaySkeleton={!!isLoading && !sortedCritterData?.length} />
          ) : (
            sortedCritterData.map((critter) => (
              <Accordion
                disableGutters
                sx={{
                  boxShadow: 'none',
                  '&.Mui-expanded::before': {
                    opacity: 1
                  }
                }}
                key={critter.critter_id}
                expanded={critter.survey_critter_id.toString() === survey_critter_id}>
                <Box display="flex" overflow="hidden" alignItems="center" className="sampleSiteHeader">
                  <AccordionSummary
                    expandIcon={<Icon path={mdiChevronDown} size={1} />}
                    onClick={() => handleCritterSelect(critter.survey_critter_id.toString())}
                    aria-controls="panel1bh-content"
                    sx={{
                      flex: '1 1 auto',
                      gap: '16px',
                      height: '70px',
                      px: 2,
                      overflow: 'hidden',
                      '& .MuiAccordionSummary-content': {
                        flex: '1 1 auto',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }
                    }}>
                    <Box>
                      <Typography fontWeight="bold" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {critter.animal_id}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        {critter.taxon} • {critter.sex}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                </Box>
                <AccordionDetails
                  sx={{
                    p: 0
                  }}>
                  <List
                    disablePadding
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem'
                      }
                    }}>
                    {(Object.keys(ANIMAL_SECTIONS_FORM_MAP) as IAnimalSections[]).map((section) => (
                      <ListItemButton
                        sx={{
                          px: 3
                        }}
                        key={section}
                        divider
                        selected={section === selectedSection}
                        onClick={() => {
                          onSelectSection(section);
                        }}>
                        <ListItemIcon>
                          <Icon path={ANIMAL_SECTIONS_FORM_MAP[section].mdiIcon} size={1} />
                        </ListItemIcon>
                        <ListItemText>{section}</ListItemText>
                      </ListItemButton>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AnimalList;
