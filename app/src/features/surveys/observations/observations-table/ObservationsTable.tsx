import { mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { cyan, grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import AutocompleteDataGridEditCell from 'components/data-grid/autocomplete/AutocompleteDataGridEditCell';
import AutocompleteDataGridViewCell from 'components/data-grid/autocomplete/AutocompleteDataGridViewCell';
import ConditionalAutocompleteDataGridEditCell from 'components/data-grid/conditional-autocomplete/ConditionalAutocompleteDataGridEditCell';
import ConditionalAutocompleteDataGridViewCell from 'components/data-grid/conditional-autocomplete/ConditionalAutocompleteDataGridViewCell';
import TaxonomyDataGridEditCell from 'components/data-grid/taxonomy/TaxonomyDataGridEditCell';
import TaxonomyDataGridViewCell from 'components/data-grid/taxonomy/TaxonomyDataGridViewCell';
import TextFieldDataGrid from 'components/data-grid/TextFieldDataGrid';
import TimePickerDataGrid from 'components/data-grid/TimePickerDataGrid';
import { SkeletonTable } from 'components/loading/SkeletonLoaders';
import { DATE_FORMAT } from 'constants/dateTimeFormats';
import { CodesContext } from 'contexts/codesContext';
import { ObservationsContext } from 'contexts/observationsContext';
import { IObservationTableRow, ObservationsTableContext } from 'contexts/observationsTableContext';
import { SurveyContext } from 'contexts/surveyContext';
import { default as dayjs } from 'dayjs';
import {
  IGetSampleLocationRecord,
  IGetSampleMethodRecord,
  IGetSamplePeriodRecord
} from 'interfaces/useSurveyApi.interface';
import { has } from 'lodash-es';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { getCodesName, getFormattedDate } from 'utils/Utils';

type ISampleSiteOption = {
  survey_sample_site_id: number;
  sample_site_name: string;
};

type ISampleMethodOption = {
  survey_sample_method_id: number;
  survey_sample_site_id: number;
  sample_method_name: string;
};

type ISamplePeriodOption = {
  survey_sample_period_id: number;
  survey_sample_method_id: number;
  sample_period_name: string;
};
export interface ISpeciesObservationTableProps {
  isLoading?: boolean;
}

const ObservationsTable = (props: ISpeciesObservationTableProps) => {
  const location = useLocation();
  const observationsTableContext = useContext(ObservationsTableContext);
  const observationsContext = useContext(ObservationsContext);
  const surveyContext = useContext(SurveyContext);
  const codesContext = useContext(CodesContext);
  const hasLoadedCodes = Boolean(codesContext.codesDataLoader.data);

  const apiRef = observationsTableContext._muiDataGridApiRef;

  const hasError = useCallback(
    (params: GridCellParams): boolean => {
      return Boolean(
        observationsTableContext.validationModel[params.row.id]?.some((error) => {
          return error.field === params.field;
        })
      );
    },
    [observationsTableContext.validationModel]
  );

  const isLoading = useMemo(() => {
    return [
      observationsContext.observationsDataLoader.isLoading && !observationsContext.observationsDataLoader.hasLoaded,
      props.isLoading,
      surveyContext.sampleSiteDataLoader.isLoading,
      observationsTableContext.isLoading,
      observationsTableContext.isSaving
    ].some(Boolean);
  }, [
    observationsContext.observationsDataLoader.isLoading,
    observationsContext.observationsDataLoader.hasLoaded,
    props.isLoading,
    surveyContext.sampleSiteDataLoader.isLoading,
    observationsTableContext.isLoading,
    observationsTableContext.isSaving
  ]);

  // Collect sample sites
  const surveySampleSites: IGetSampleLocationRecord[] = surveyContext.sampleSiteDataLoader.data?.sampleSites ?? [];
  const sampleSiteOptions: ISampleSiteOption[] =
    surveySampleSites.map((site) => ({
      survey_sample_site_id: site.survey_sample_site_id,
      sample_site_name: site.name
    })) ?? [];

  // Collect sample methods
  const surveySampleMethods: IGetSampleMethodRecord[] = surveySampleSites
    .filter((sampleSite) => Boolean(sampleSite.sample_methods))
    .map((sampleSite) => sampleSite.sample_methods as IGetSampleMethodRecord[])
    .flat(2);
  const sampleMethodOptions: ISampleMethodOption[] = hasLoadedCodes
    ? surveySampleMethods.map((method) => ({
        survey_sample_method_id: method.survey_sample_method_id,
        survey_sample_site_id: method.survey_sample_site_id,
        sample_method_name:
          getCodesName(codesContext.codesDataLoader.data, 'sample_methods', method.method_lookup_id) ?? ''
      }))
    : [];

  // Collect sample periods
  const samplePeriodOptions: ISamplePeriodOption[] = surveySampleMethods
    .filter((sampleMethod) => Boolean(sampleMethod.sample_periods))
    .map((sampleMethod) => sampleMethod.sample_periods as IGetSamplePeriodRecord[])
    .flat(2)
    .map((samplePeriod: IGetSamplePeriodRecord) => ({
      survey_sample_period_id: samplePeriod.survey_sample_period_id,
      survey_sample_method_id: samplePeriod.survey_sample_method_id,
      sample_period_name: `${samplePeriod.start_date} ${samplePeriod.start_time || ''} - ${samplePeriod.end_date} ${
        samplePeriod.end_time || ''
      }`
    }));

  const observationColumns: GridColDef<IObservationTableRow>[] = [
    {
      field: 'wldtaxonomic_units_id',
      headerName: 'Species',
      editable: true,
      hideable: true,
      flex: 1,
      minWidth: 250,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      valueSetter: (params) => {
        return { ...params.row, wldtaxonomic_units_id: Number(params.value) };
      },
      renderCell: (params) => {
        return <TaxonomyDataGridViewCell dataGridProps={params} error={hasError(params)} />;
      },
      renderEditCell: (params) => {
        return <TaxonomyDataGridEditCell dataGridProps={params} error={hasError(params)} />;
      }
    },
    {
      field: 'survey_sample_site_id',
      headerName: 'Sampling Site',
      editable: true,
      hideable: true,
      flex: 1,
      minWidth: 250,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <AutocompleteDataGridViewCell<IObservationTableRow, number>
            dataGridProps={params}
            options={sampleSiteOptions.map((item) => ({
              label: item.sample_site_name,
              value: item.survey_sample_site_id
            }))}
            error={hasError(params)}
          />
        );
      },
      renderEditCell: (params) => {
        return (
          <AutocompleteDataGridEditCell<IObservationTableRow, number>
            dataGridProps={params}
            options={sampleSiteOptions.map((item) => ({
              label: item.sample_site_name,
              value: item.survey_sample_site_id
            }))}
            error={hasError(params)}
          />
        );
      }
    },
    {
      field: 'survey_sample_method_id',
      headerName: 'Sampling Method',
      editable: true,
      hideable: true,
      flex: 1,
      minWidth: 250,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <ConditionalAutocompleteDataGridViewCell<IObservationTableRow, ISampleMethodOption, number>
            dataGridProps={params}
            optionsGetter={(row, allOptions) => {
              return allOptions
                .filter((item) => item.survey_sample_site_id === row.survey_sample_site_id)
                .map((item) => ({ label: item.sample_method_name, value: item.survey_sample_method_id }));
            }}
            allOptions={sampleMethodOptions}
            error={hasError(params)}
          />
        );
      },
      renderEditCell: (params) => {
        return (
          <ConditionalAutocompleteDataGridEditCell<IObservationTableRow, ISampleMethodOption, number>
            dataGridProps={params}
            optionsGetter={(row, allOptions) => {
              return allOptions
                .filter((item) => item.survey_sample_site_id === row.survey_sample_site_id)
                .map((item) => ({ label: item.sample_method_name, value: item.survey_sample_method_id }));
            }}
            allOptions={sampleMethodOptions}
            error={hasError(params)}
          />
        );
      }
    },
    {
      field: 'survey_sample_period_id',
      headerName: 'Sampling Period',
      editable: true,
      hideable: true,
      flex: 0,
      width: 250,
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <ConditionalAutocompleteDataGridViewCell<IObservationTableRow, ISamplePeriodOption, number>
            dataGridProps={params}
            optionsGetter={(row, allOptions) => {
              return allOptions
                .filter((item) => item.survey_sample_method_id === row.survey_sample_method_id)
                .map((item) => ({
                  label: item.sample_period_name,
                  value: item.survey_sample_period_id
                }));
            }}
            allOptions={samplePeriodOptions}
            error={hasError(params)}
          />
        );
      },
      renderEditCell: (params) => {
        return (
          <ConditionalAutocompleteDataGridEditCell<IObservationTableRow, ISamplePeriodOption, number>
            dataGridProps={params}
            optionsGetter={(row, allOptions) => {
              return allOptions
                .filter((item) => item.survey_sample_method_id === row.survey_sample_method_id)
                .map((item) => ({
                  label: item.sample_period_name,
                  value: item.survey_sample_period_id
                }));
            }}
            allOptions={samplePeriodOptions}
            error={hasError(params)}
          />
        );
      }
    },
    {
      field: 'count',
      headerName: 'Count',
      editable: true,
      hideable: true,
      type: 'number',
      minWidth: 110,
      disableColumnMenu: true,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
          {params.value}
        </Typography>
      ),
      renderEditCell: (params) => {
        const error: boolean = hasError(params);

        return (
          <TextFieldDataGrid
            dataGridProps={params}
            textFieldProps={{
              name: params.field,
              onChange: (event) => {
                if (!/^\d{0,7}$/.test(event.target.value)) {
                  // If the value is not a number, return
                  return;
                }

                apiRef?.current.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: event.target.value
                });
              },
              error
            }}
          />
        );
      }
    },
    {
      field: 'observation_date',
      headerName: 'Date',
      editable: true,
      hideable: true,
      type: 'date',
      minWidth: 150,
      valueGetter: (params) => (params.row.observation_date ? dayjs(params.row.observation_date).toDate() : null),
      disableColumnMenu: true,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
          {getFormattedDate(DATE_FORMAT.ShortDateFormatMonthFirst, params.value)}
        </Typography>
      ),
      renderEditCell: (params) => {
        const error = hasError(params);

        return (
          <TextFieldDataGrid
            dataGridProps={params}
            textFieldProps={{
              name: params.field,
              type: 'date',
              value: params.value ? dayjs(params.value).format('YYYY-MM-DD') : '',
              onChange: (event) => {
                const value = dayjs(event.target.value).toDate();
                apiRef?.current.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value
                });
              },

              error
            }}
          />
        );
      }
    },
    {
      field: 'observation_time',
      headerName: 'Time',
      editable: true,
      hideable: true,
      type: 'string',
      width: 150,
      disableColumnMenu: true,
      headerAlign: 'right',
      align: 'right',
      valueSetter: (params) => {
        return { ...params.row, observation_time: params.value };
      },
      valueParser: (value) => {
        if (!value) {
          return null;
        }

        if (dayjs.isDayjs(value)) {
          return value.format('HH:mm:ss');
        }

        return dayjs(value, 'HH:mm:ss').format('HH:mm:ss');
      },
      renderCell: (params) => {
        if (!params.value) {
          return null;
        }

        return (
          <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
            {params.value}
          </Typography>
        );
      },
      renderEditCell: (params) => {
        const error = hasError(params);

        return (
          <TimePickerDataGrid
            dataGridProps={params}
            dateFieldProps={{
              slotProps: {
                textField: {
                  error,
                  name: params.field
                }
              }
            }}
          />
        );
      }
    },
    {
      field: 'latitude',
      headerName: 'Lat',
      editable: true,
      hideable: true,
      width: 120,
      disableColumnMenu: true,
      headerAlign: 'right',
      align: 'right',
      valueSetter: (params) => {
        if (/^-?\d{1,3}(?:\.\d{0,12})?$/.test(params.value)) {
          // If the value is a legal latitude value
          // Valid entries: `-1`, `-1.1`, `-123.456789` `1`, `1.1, `123.456789`
          return { ...params.row, latitude: Number(params.value) };
        }

        const value = parseFloat(params.value);
        return { ...params.row, latitude: isNaN(value) ? null : value };
      },
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
          {params.value}
        </Typography>
      ),
      renderEditCell: (params) => {
        const error: boolean = hasError(params);

        return (
          <TextFieldDataGrid
            dataGridProps={params}
            textFieldProps={{
              name: params.field,
              onChange: (event) => {
                if (!/^-?\d{0,3}(?:\.\d{0,12})?$/.test(event.target.value)) {
                  // If the value is not a subset of a legal latitude value, prevent the value from being applied
                  return;
                }

                apiRef?.current.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: event.target.value
                });
              },
              error
            }}
          />
        );
      }
    },
    {
      field: 'longitude',
      headerName: 'Long',
      editable: true,
      hideable: true,
      width: 120,
      disableColumnMenu: true,
      headerAlign: 'right',
      align: 'right',
      valueSetter: (params) => {
        if (/^-?\d{1,3}(?:\.\d{0,12})?$/.test(params.value)) {
          // If the value is a legal longitude value
          // Valid entries: `-1`, `-1.1`, `-123.456789` `1`, `1.1, `123.456789`
          return { ...params.row, longitude: Number(params.value) };
        }

        const value = parseFloat(params.value);
        return { ...params.row, longitude: isNaN(value) ? null : value };
      },
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
          {params.value}
        </Typography>
      ),
      renderEditCell: (params) => {
        const error: boolean = hasError(params);

        return (
          <TextFieldDataGrid
            dataGridProps={params}
            textFieldProps={{
              name: params.field,
              onChange: (event) => {
                if (!/^-?\d{0,3}(?:\.\d{0,12})?$/.test(event.target.value)) {
                  // If the value is not a subset of a legal longitude value, prevent the value from being applied
                  return;
                }

                apiRef?.current.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: event.target.value
                });
              },
              error
            }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      width: 70,
      disableColumnMenu: true,
      resizable: false,
      cellClassName: 'pinnedColumn',
      getActions: (params) => [
        <IconButton
          onClick={() => observationsTableContext.deleteObservationRecords([params.row])}
          disabled={observationsTableContext.isSaving}
          key={`actions[${params.id}].handleDeleteRow`}>
          <Icon path={mdiTrashCanOutline} size={1} />
        </IconButton>
      ]
    }
  ];

  /**
   * On first render, pre-selected the observation row based on the URL
   */
  useEffect(() => {
    if (location.hash.startsWith('#view-')) {
      const selectedId = location.hash.split('-')[1];
      observationsTableContext.onRowSelectionModelChange([selectedId]);
    }
  }, [location.hash, observationsTableContext]);

  return (
    <>
      {isLoading && <SkeletonTable />}

      <DataGrid
        checkboxSelection
        disableRowSelectionOnClick
        rowHeight={56}
        apiRef={apiRef}
        editMode="row"
        columns={observationColumns}
        rows={observationsTableContext.rows}
        rowCount={observationsTableContext.observationCount}
        paginationModel={observationsTableContext.paginationModel}
        pageSizeOptions={[10, 15, 20]}
        onPaginationModelChange={(model) => observationsTableContext.updatePaginationModel(model)}
        paginationMode="server"
        sortingMode="server"
        sortModel={observationsTableContext.sortModel}
        onSortModelChange={(model) => observationsTableContext.updateSortModel(model)}
        onRowEditStart={(params) => observationsTableContext.onRowEditStart(params.id)}
        onRowEditStop={(_params, event) => {
          event.defaultMuiPrevented = true;
        }}
        localeText={{
          noRowsLabel: 'No Records'
        }}
        onRowSelectionModelChange={observationsTableContext.onRowSelectionModelChange}
        rowSelectionModel={observationsTableContext.rowSelectionModel}
        getRowHeight={() => 'auto'}
        getRowClassName={(params) => (has(observationsTableContext.validationModel, params.row.id) ? 'error' : '')}
        sx={{
          border: 'none',
          borderRadius: 0,
          '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 100,
            height: 55,
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%)'
          },
          '& .pinnedColumn': {
            position: 'sticky',
            right: 0,
            top: 0,
            borderLeft: '1px solid' + grey[300]
          },
          '& .MuiDataGrid-columnHeaders': {
            position: 'relative'
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
            background: grey[200]
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'text.secondary'
          },
          '& .MuiDataGrid-cell': {
            py: 0.75,
            background: '#fff',
            '&.MuiDataGrid-cell--editing:focus-within': {
              outline: 'none'
            },
            '&.MuiDataGrid-cell--editing': {
              p: 0.5,
              backgroundColor: cyan[100]
            }
          },
          '& .MuiDataGrid-row--editing': {
            boxShadow: 'none',
            backgroundColor: cyan[50],
            '& .MuiDataGrid-cell': {
              backgroundColor: cyan[50]
            },
            '&.error': {
              '& .MuiDataGrid-cell, .MuiDataGrid-cell--editing': {
                backgroundColor: 'rgb(251, 237, 238)'
              }
            }
          },
          '& .MuiDataGrid-editInputCell': {
            border: '1px solid #ccc',
            '&:hover': {
              borderColor: 'primary.main'
            },
            '&.Mui-focused': {
              borderColor: 'primary.main',
              outlineWidth: '2px',
              outlineStyle: 'solid',
              outlineColor: 'primary.main',
              outlineOffset: '-2px'
            }
          },
          '& .MuiInputBase-root': {
            height: '40px',
            borderRadius: '4px',
            background: '#fff',
            fontSize: '0.875rem',
            '&.MuiDataGrid-editInputCell': {
              padding: 0
            }
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            background: '#fff',
            border: 'none',
            '&:hover': {
              borderColor: 'primary.main'
            },
            '&:hover > fieldset': {
              border: '1px solid primary.main'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid ' + grey[300],
            '&.Mui-focused': {
              borderColor: 'primary.main'
            }
          },
          '& .MuiDataGrid-virtualScrollerContent, .MuiDataGrid-overlay': {
            background: grey[100]
          }
        }}
      />
    </>
  );
};

export default ObservationsTable;