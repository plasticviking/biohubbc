import { mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridColDef, GridEditInputCell, GridEventListener, GridRowModelUpdate } from '@mui/x-data-grid';
import YesNoDialog from 'components/dialog/YesNoDialog';
import { ObservationsTableI18N } from 'constants/i18n';
import { IObservationTableRow, ObservationsContext } from 'contexts/observationsContext';
import { useContext, useEffect, useState } from 'react';

const ObservationsTable = () => {
  const observationColumns: GridColDef<IObservationTableRow>[] = [
    {
      field: 'wldtaxonomic_units_id',
      headerName: 'Species',
      editable: true,
      flex: 1,
      minWidth: 250,
      disableColumnMenu: true,

      // TODO: To be addressed by https://apps.nrs.gov.bc.ca/int/jira/browse/SIMSBIOHUB-288
      renderCell: () => 'Moose (Alces Americanus)'
    },
    {
      field: 'samplingSite',
      headerName: 'Sampling Site',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Site 1', 'Site 2', 'Site 3', 'Site 4'],
      flex: 1,
      minWidth: 200,
      disableColumnMenu: true
    },
    {
      field: 'samplingMethod',
      headerName: 'Sampling Method',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Method 1', 'Method 2', 'Method 3', 'Method 4'],
      flex: 1,
      minWidth: 200,
      disableColumnMenu: true
    },
    {
      field: 'samplingPeriod',
      headerName: 'Sampling Period',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Undefined'],
      flex: 1,
      minWidth: 200,
      disableColumnMenu: true
    },
    {
      field: 'count',
      headerName: 'Count',
      editable: true,
      type: 'number',
      minWidth: 100,
      disableColumnMenu: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            min: 0,
            max: 99999
          }}
        />
      )
    },
    {
      field: 'observation_date',
      headerName: 'Date',
      editable: true,
      type: 'date',
      minWidth: 150,
      valueGetter: (params) => (params.row.observation_date ? new Date(params.row.observation_date) : null),
      disableColumnMenu: true
    },
    {
      field: 'observation_time',
      headerName: 'Time',
      editable: true,
      type: 'time',
      width: 150,
      disableColumnMenu: true
    },
    {
      field: 'latitude',
      headerName: 'Lat',
      type: 'number',
      editable: true,
      width: 150,
      disableColumnMenu: true,
      renderCell: (params) => String(params.row.latitude)
    },
    {
      field: 'longitude',
      headerName: 'Long',
      type: 'number',
      editable: true,
      width: 150,
      disableColumnMenu: true,
      renderCell: (params) => String(params.row.longitude)
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      width: 96,
      disableColumnMenu: true,
      resizable: false,
      getActions: (params) => [
        <IconButton onClick={() => handleConfirmDeleteRow(params.id)} key={`actions[${params.id}].handleDeleteRow`}>
          <Icon path={mdiTrashCanOutline} size={1} />
        </IconButton>
      ]
    }
  ];

  const observationsContext = useContext(ObservationsContext);
  const { observationsDataLoader } = observationsContext;
  const apiRef = observationsContext._muiDataGridApiRef;

  const [deletingObservation, setDeletingObservation] = useState<string | number | null>(null);
  const showConfirmDeleteDialog = Boolean(deletingObservation);

  useEffect(() => {
    if (observationsDataLoader.data?.surveyObservations) {
      const rows: IObservationTableRow[] = observationsDataLoader.data.surveyObservations.map(
        (row: IObservationTableRow) => ({
          ...row,
          id: String(row.survey_observation_id)
        })
      );

      observationsContext.setInitialRows(rows);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationsDataLoader.data]);

  const handleCancelDeleteRow = () => {
    setDeletingObservation(null);
  };

  const handleConfirmDeleteRow = (id: string | number) => {
    setDeletingObservation(id);
  };

  const handleDeleteRow = (id: string | number) => {
    observationsContext.markRecordWithUnsavedChanges(id);
    apiRef.current.updateRows([{ id, _action: 'delete' } as GridRowModelUpdate]);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (_params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellClick: GridEventListener<'cellClick'> = (params, event) => {
    const { id } = params.row;

    if (apiRef.current.state.editRows[id]) {
      return;
    }

    apiRef.current.startRowEditMode({ id, fieldToFocus: params.field });
    observationsContext.markRecordWithUnsavedChanges(id);
  };

  const handleProcessRowUpdate = (newRow: IObservationTableRow) => {
    const updatedRow = { ...newRow, wldtaxonomic_units_id: Number(newRow.wldtaxonomic_units_id) };
    return updatedRow;
  };

  return (
    <>
      <YesNoDialog
        dialogTitle={ObservationsTableI18N.removeRecordDialogTitle}
        dialogText={ObservationsTableI18N.removeRecordDialogText}
        yesButtonProps={{ color: 'error' }}
        yesButtonLabel={'Discard Record'}
        noButtonProps={{ color: 'primary', variant: 'outlined' }}
        noButtonLabel={'Cancel'}
        open={showConfirmDeleteDialog}
        onYes={() => {
          if (deletingObservation) {
            handleDeleteRow(deletingObservation);
          }
          setDeletingObservation(null);
        }}
        onClose={() => handleCancelDeleteRow()}
        onNo={() => handleCancelDeleteRow()}
      />
      <DataGrid
        apiRef={apiRef}
        editMode="row"
        onCellClick={handleCellClick}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={handleProcessRowUpdate}
        columns={observationColumns}
        rows={observationsContext.initialRows}
        disableRowSelectionOnClick
        localeText={{
          noRowsLabel: 'No Records'
        }}
        sx={{
          background: '#fff',
          border: 'none',
          '& .MuiDataGrid-pinnedColumns, .MuiDataGrid-pinnedColumnHeaders': {
            background: '#fff'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#999'
          },
          '& .test': {
            position: 'sticky',
            right: 0,
            top: 0,
            borderLeft: '1px solid #ccc',
            background: '#fff'
          },
          '& .MuiDataGrid-columnHeaders': {
            position: 'relative'
          },
          '& .MuiDataGrid-columnHeaders:after': {
            content: "''",
            position: 'absolute',
            right: 0,
            width: '96px',
            height: '80px',
            borderLeft: '1px solid #ccc',
            background: '#fff'
          },
          '& .MuiDataGrid-actionsCell': {
            gap: 0
          }
        }}
      />
    </>
  );
};

export default ObservationsTable;