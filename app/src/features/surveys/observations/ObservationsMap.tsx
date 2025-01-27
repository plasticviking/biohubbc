import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import BaseLayerControls from 'components/map/components/BaseLayerControls';
import { SetMapBounds } from 'components/map/components/Bounds';
import FullScreenScrollingEventHandler from 'components/map/components/FullScreenScrollingEventHandler';
import StaticLayers from 'components/map/components/StaticLayers';
import { MapBaseCss } from 'components/map/styles/MapBaseCss';
import { ALL_OF_BC_BOUNDARY, MAP_DEFAULT_CENTER } from 'constants/spatial';
import { ObservationsContext } from 'contexts/observationsContext';
import { SurveyContext } from 'contexts/surveyContext';
import { Feature, Position } from 'geojson';
import { LatLngBoundsExpression } from 'leaflet';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GeoJSON, LayersControl, MapContainer as LeafletMapContainer } from 'react-leaflet';
import { calculateUpdatedMapBounds } from 'utils/mapBoundaryUploadHelpers';
import { coloredPoint, INonEditableGeometries } from 'utils/mapUtils';
import { v4 as uuidv4 } from 'uuid';

const ObservationsMap = () => {
  const observationsContext = useContext(ObservationsContext);
  const surveyContext = useContext(SurveyContext);

  const surveyObservations: INonEditableGeometries[] = useMemo(() => {
    const observations = observationsContext.observationsDataLoader.data?.surveyObservations;

    if (!observations) {
      return [];
    }

    return observations
      .filter((observation) => observation.latitude !== undefined && observation.longitude !== undefined)
      .map((observation) => {
        /*
        const link = observation.survey_observation_id
          ? `observations/#view-${observation.survey_observation_id}`
          : 'observations'
        */

        return {
          feature: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [observation.longitude, observation.latitude] as Position
            }
          },
          popupComponent: undefined
          /*(
            <Popup>
              <div>{JSON.stringify(observation)}</div>
              <Button component={RouterLink} to={link}>
                Check 'er Out
              </Button>
            </Popup>
          )*/
        };
      });
  }, [observationsContext.observationsDataLoader.data]);

  const studyAreaFeatures: Feature[] = useMemo(() => {
    const locations = surveyContext.surveyDataLoader.data?.surveyData.locations;
    if (!locations) {
      return [];
    }

    return locations.flatMap((item) => item.geojson);
  }, [surveyContext.surveyDataLoader.data]);

  const sampleSiteFeatures: Feature[] = useMemo(() => {
    const sites = surveyContext.sampleSiteDataLoader.data?.sampleSites;
    if (!sites) {
      return [];
    }

    return sites.map((item) => item.geojson);
  }, [surveyContext.sampleSiteDataLoader.data]);

  const getDefaultMapBounds = useCallback((): LatLngBoundsExpression | undefined => {
    const features = surveyObservations.map((observation) => observation.feature);
    return calculateUpdatedMapBounds([...features, ...studyAreaFeatures, ...sampleSiteFeatures]);
  }, [surveyObservations, studyAreaFeatures, sampleSiteFeatures]);

  // set default bounds to encompass all of BC
  const [bounds, setBounds] = useState<LatLngBoundsExpression | undefined>(
    calculateUpdatedMapBounds([ALL_OF_BC_BOUNDARY])
  );

  const zoomToBoundaryExtent = useCallback(() => {
    setBounds(getDefaultMapBounds());
  }, [getDefaultMapBounds]);

  useEffect(() => {
    // Once all data loaders have finished loading it will zoom the map to include all features
    if (
      !surveyContext.surveyDataLoader.isLoading &&
      !surveyContext.sampleSiteDataLoader.isLoading &&
      !observationsContext.observationsDataLoader.isLoading
    ) {
      zoomToBoundaryExtent();
    }
  }, [
    observationsContext.observationsDataLoader.isLoading,
    surveyContext.sampleSiteDataLoader.isLoading,
    surveyContext.surveyDataLoader.isLoading,
    zoomToBoundaryExtent
  ]);

  return (
    <Box position="relative">
      <LeafletMapContainer
        data-testid="leaflet-survey_observations_map"
        id="survey_observations_map"
        center={MAP_DEFAULT_CENTER}
        scrollWheelZoom={false}
        fullscreenControl={true}
        style={{ height: 600 }}>
        <MapBaseCss />
        <FullScreenScrollingEventHandler bounds={bounds} scrollWheelZoom={false} />
        <SetMapBounds bounds={bounds} />

        {surveyObservations?.map((nonEditableGeo: INonEditableGeometries) => (
          <GeoJSON
            key={uuidv4()}
            data={nonEditableGeo.feature}
            pointToLayer={(_, latlng) => coloredPoint({ latlng, fillColor: '#F28C28' })}>
            {nonEditableGeo.popupComponent}
          </GeoJSON>
        ))}
        <LayersControl position="bottomright">
          <BaseLayerControls />
          <StaticLayers
            layers={[
              {
                layerName: 'Study Area',
                features: studyAreaFeatures.map((feature) => ({ geoJSON: feature, tooltip: <span>Study Area</span> }))
              },
              {
                layerName: 'Sample Sites',
                layerColors: { color: '#3C005A', fillColor: '#3C005A' },
                features: sampleSiteFeatures.map((feature) => ({
                  geoJSON: feature,
                  tooltip: <span>Sample Site</span>
                }))
              }
            ]}
          />
        </LayersControl>
      </LeafletMapContainer>
      {(surveyObservations.length > 0 || studyAreaFeatures.length > 0 || sampleSiteFeatures.length > 0) && (
        <Box position="absolute" top="126px" left="10px" zIndex="999">
          <IconButton
            sx={{
              padding: '3px',
              borderRadius: '4px',
              background: '#ffffff',
              color: '#000000',
              border: '2px solid rgba(0,0,0,0.2)',
              backgroundClip: 'padding-box',
              '&:hover': {
                backgroundColor: '#eeeeee'
              }
            }}
            aria-label="zoom to initial extent"
            title="Zoom to initial extent"
            onClick={() => zoomToBoundaryExtent()}>
            <Icon size={1} path={mdiRefresh} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ObservationsMap;
