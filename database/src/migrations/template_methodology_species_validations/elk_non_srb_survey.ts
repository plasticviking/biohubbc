import { basicCodeValidator, basicNumericValidator, ElkItems } from './picklist_variables/v0.2';

export const elkNonSRBJSON = {
  name: '',
  description: '',
  files: [
    {
      name: 'Effort & Site Conditions',
      description: '',
      columns: [
        {
          name: 'Total Time (hours)',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Total Time (mins)',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Time (mins)/block area (km2)',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Aircraft Type',
          description: '',
          validations: basicCodeValidator(ElkItems.aircraftType)
        },
        {
          name: 'Light',
          description: '',
          validations: basicCodeValidator(ElkItems.light)
        }
      ],
      validations: [
        {
          file_duplicate_columns_validator: {}
        },
        {
          file_required_columns_validator: {
            required_columns: [
              'Study Area',
              'Block ID/SU ID',
              'Population Unit',
              'Block/Population Unit Area (km2)',
              'Date',
              'Start Time 1 (24hrs)',
              'End Time 1 (24hrs)',
              'Start Time 2 (24hrs)',
              'End Time 2 (24hrs)',
              'Total Block Time',
              'Total Time (hours)',
              'Total Time (mins)',
              'Time (mins)/block area (km2)',
              'Aircraft Company',
              'Aircraft Type',
              'Pilot',
              'Navigator',
              'Rear Left Observer',
              'Air Temperature (C)',
              'Visibility',
              'Cloud Cover (%)',
              'Wind Speed',
              'Precipitation',
              'Light',
              'Snow Cover',
              'Snow Depth',
              'Days Since Snowfall',
              'Weather Description',
              'Habitat Description',
              'Effort & Site Comments'
            ]
          }
        }
      ]
    },
    {
      name: 'Observations',
      description: '',
      columns: [
        {
          name: 'UTM Zone',
          description: '',
          validations: basicCodeValidator(ElkItems.uTMZone)
        },
        {
          name: 'Easting',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Northing',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Datum',
          description: '',
          validations: basicCodeValidator(ElkItems.gPSDatum)
        },
        {
          name: 'Lat/Long Units',
          description: '',
          validations: basicCodeValidator(ElkItems.latLongUnits)
        },
        {
          name: 'Species',
          description: '',
          validations: basicCodeValidator(ElkItems.species)
        },
        {
          name: 'Yearling Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'RISC Class I Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'RISC Class II Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'RISC Class III Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'RISC Class IV Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Spike Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Raghorn Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: '<=3 Point Bulls',
          desription: '',
          validations: basicNumericValidator()
        },
        {
          name: '3 - 4 Point Bulls',
          desription: '',
          validations: basicNumericValidator()
        },
        {
          name: '3 - 5 Point Bulls',
          desription: '',
          validations: basicNumericValidator()
        },
        {
          name: '>=4 Point Bulls',
          desription: '',
          validations: basicNumericValidator()
        },
        {
          name: '>=5 Point Bulls',
          desription: '',
          validations: basicNumericValidator()
        },
        {
          name: '>=6 Point Bulls',
          desription: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Adult Bulls - Unclassified',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Unclassified Bulls',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Cows',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Calves',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Adult Unclassified Sex',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Yearling - Unclassified Sex',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Unclassified Age/Sex',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Total Count',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Sign Type',
          description: '',
          validations: basicCodeValidator(ElkItems.signType)
        },
        {
          name: 'Age of Sign',
          description: '',
          validations: basicCodeValidator(ElkItems.signAge)
        },
        {
          name: 'Topography',
          description: '',
          validations: basicCodeValidator(ElkItems.topography)
        },
        {
          name: 'Habitat',
          description: '',
          validations: basicCodeValidator(ElkItems.habitat)
        },
        {
          name: 'Veg Cover (%)',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Snow Cover (%)',
          description: '',
          validations: []
        },
        {
          name: 'Activity',
          description: '',
          validations: basicCodeValidator(ElkItems.activityObservation)
        },
        {
          name: 'Number of Marked Animals Observed',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Survey or Telemetry',
          description: '',
          validations: basicCodeValidator(ElkItems.searchType)
        }
      ],
      validations: [
        {
          file_duplicate_columns_validator: {}
        },
        {
          file_required_columns_validator: {
            required_columns: [
              'Study Area',
              'Block ID/SU ID',
              'Population Unit',
              'Date',
              'UTM Zone',
              'Easting',
              'Northing',
              'Datum',
              'Lat',
              'Long',
              'Lat/Long Units',
              'Species',
              'Yearling Bulls',
              'RISC Class I Bulls',
              'RISC Class II Bulls',
              'RISC Class III Bulls',
              'RISC Class IV Bulls',
              'Spike Bulls',
              'Raghorn Bulls',
              '<=3 Point Bulls',
              '3 - 4 Point Bulls',
              '3 - 5 Point Bulls',
              '>=4 Point Bulls',
              '>=5 Point Bulls',
              '>=6 Point Bulls',
              'Adult Bulls - Unclassified',
              'Unclassified Bulls',
              'Cows',
              'Calves',
              'Adult Unclassified Sex',
              'Yearling - Unclassified Sex',
              'Unclassified Age/Sex',
              'Total Count',
              'Sign Type',
              'Age of Sign',
              'Topography',
              'Habitat',
              'Veg Cover (%)',
              'Snow Cover (%)',
              'Activity',
              'Number of Marked Animals Observed',
              'Survey or Telemetry Search',
              'Photos',
              'Observation Comments'
            ]
          }
        }
      ]
    },
    {
      name: 'Marked Animals',
      description: '',
      columns: [
        {
          name: 'UTM Zone',
          description: '',
          validations: basicCodeValidator(ElkItems.uTMZone)
        },
        {
          name: 'Easting',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Northing',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Datum',
          description: '',
          validations: basicCodeValidator(ElkItems.gPSDatum)
        },
        {
          name: 'Lat/Long Units',
          description: '',
          validations: basicCodeValidator(ElkItems.latLongUnits)
        },
        {
          name: 'Targeted or Non-Targeted',
          description: '',
          validations: basicCodeValidator(ElkItems.targetType)
        },
        {
          name: 'Mark Type',
          description: '',
          validations: basicCodeValidator(ElkItems.markType)
        },
        {
          name: 'Frequency Unit',
          description: '',
          validations: basicCodeValidator(ElkItems.frequencyUnits)
        },
        {
          name: 'Location of Identifier on Individual',
          description: '',
          validations: basicCodeValidator(ElkItems.locationOfIdentifier)
        },
        {
          name: 'Shape',
          description: '',
          validations: basicCodeValidator(ElkItems.shape)
        },
        {
          name: 'Pattern',
          description: '',
          validations: basicCodeValidator(ElkItems.pattern)
        },
        {
          name: 'Color',
          description: '',
          validations: basicCodeValidator(ElkItems.color)
        }
      ],
      validations: [
        {
          file_duplicate_columns_validator: {}
        },
        {
          file_required_columns_validator: {
            required_columns: [
              'Study Area',
              'Block ID/SU ID',
              'Population Unit',
              'Date',
              'UTM Zone',
              'Easting',
              'Northing',
              'Datum',
              'Lat',
              'Long',
              'Lat/Long Units',
              'Targeted or Non-Targeted',
              'Wildlife Health ID',
              'Animal ID',
              'Mark Type',
              'Mark ID Value',
              'Frequency',
              'Frequency Unit',
              'Location of Identifier on Individual',
              'Shape',
              'Pattern',
              'Color',
              'Marked Animals Comments'
            ]
          }
        }
      ]
    },
    {
      name: 'Incidental Observations',
      description: '',
      columns: [
        {
          name: 'UTM Zone',
          description: '',
          validations: basicCodeValidator(ElkItems.uTMZone)
        },
        {
          name: 'Easting',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Northing',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Datum',
          description: '',
          validations: basicCodeValidator(ElkItems.gPSDatum)
        },
        {
          name: 'Lat/Long Units',
          description: '',
          validations: basicCodeValidator(ElkItems.latLongUnits)
        },
        {
          name: 'Adult Males',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Adilt Females',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Adult - Unclassified Sex',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Juvenile Males',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Juvenile Females',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Juveniles - Unclassified Sex',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Unknown Age/Sex',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Total Count',
          description: '',
          validations: basicNumericValidator()
        },
        {
          name: 'Species Occurrence Status',
          description: '',
          validations: basicCodeValidator(ElkItems.speciesOccurrenceStatus)
        },
        {
          name: 'Activity',
          description: '',
          validations: basicCodeValidator(ElkItems.activityIncidentalObservation)
        },
        {
          name: 'Feature Type',
          description: '',
          validations: basicCodeValidator(ElkItems.featureType)
        },
        {
          name: 'Sign Type',
          description: '',
          validations: basicCodeValidator(ElkItems.signType)
        }
      ],
      validations: [
        {
          file_duplicate_columns_validator: {}
        },
        {
          file_required_columns_validator: {
            required_columns: [
              'Study Area',
              'Block ID/SU ID',
              'Population Unit',
              'UTM Zone',
              'Easting',
              'Northing',
              'Datum',
              'Lat',
              'Long',
              'Lat/Long Units',
              'Date',
              'Species',
              'Adult Males',
              'Adult Females',
              'Adults - Unclassified Sex',
              'Juvenile Males',
              'Juvenile Females',
              'Juveniles - Unclassified Sex',
              'Unknown Age/Sex',
              'Total Count',
              'Species Occurrence Status',
              'Activity',
              'Feature Type',
              'Sign Type',
              'Photos',
              'Incidental Observation Comments'
            ]
          }
        }
      ]
    }
  ],
  validations: [
    {
      submission_required_files_validator: {
        required_files: ['Effort & Site Conditions', 'Observations', 'Marked Animals', 'Incidental Observations']
      }
    },
    {
      mimetype_validator: {
        reg_exps: ['application\\/vnd.*']
      }
    }
  ]
};

export const ITemplateValidation = {
  name: '',
  description: '',
  files: [
    {
      name: '',
      description: '',
      columns: [
        {
          name: '',
          description: '',
          validations: []
        }
      ],
      validations: [
        {
          file_duplicate_columns_validator: {}
        },
        {
          file_required_columns_validator: {
            required_columns: []
          }
        }
      ]
    }
  ],
  validations: [
    {
      submission_required_files_validator: {
        required_files: []
      }
    },
    {
      mimetype_validator: {
        reg_exps: []
      }
    }
  ]
};