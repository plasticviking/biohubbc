--
-- ER/Studio Data Architect SQL Code Generation
-- Project :      BioHub.DM1
--
-- Date Created : Thursday, July 15, 2021 11:04:24
-- Target DBMS : PostgreSQL 10.x-12.x
--

-- 
-- TABLE: activity 
--

CREATE TABLE activity(
    activity_id              integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(300),
    record_end_date          date,
    record_effective_date    date              NOT NULL,
    description              varchar(250),
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT activity_pk PRIMARY KEY (activity_id)
)
;



COMMENT ON COLUMN activity.activity_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN activity.name IS 'Name of the First Nation.'
;
COMMENT ON COLUMN activity.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN activity.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN activity.description IS 'The description of the record.'
;
COMMENT ON COLUMN activity.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN activity.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN activity.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN activity.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN activity.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE activity IS 'A list of project activities.'
;

-- 
-- TABLE: administrative_activity 
--

CREATE TABLE administrative_activity(
    administrative_activity_id                integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    administrative_activity_status_type_id    integer           NOT NULL,
    administrative_activity_type_id           integer           NOT NULL,
    reported_system_user_id                   integer           NOT NULL,
    assigned_system_user_id                   integer,
    description                               varchar(3000),
    data                                      json,
    notes                                     varchar(3000),
    create_date                               timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                               integer           NOT NULL,
    update_date                               timestamptz(6),
    update_user                               integer,
    revision_count                            integer           DEFAULT 0 NOT NULL,
    CONSTRAINT administrative_activity_pk PRIMARY KEY (administrative_activity_id)
)
;



COMMENT ON COLUMN administrative_activity.administrative_activity_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity.administrative_activity_status_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity.administrative_activity_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity.reported_system_user_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity.assigned_system_user_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity.description IS 'The description of the record.'
;
COMMENT ON COLUMN administrative_activity.data IS 'The json data associated with the record.'
;
COMMENT ON COLUMN administrative_activity.notes IS 'Notes associated with the record.'
;
COMMENT ON COLUMN administrative_activity.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN administrative_activity.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN administrative_activity.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN administrative_activity.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN administrative_activity.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE administrative_activity IS 'Administrative activity is a list of activities to be performed in order to maintain the business processes of the system.'
;

-- 
-- TABLE: administrative_activity_status_type 
--

CREATE TABLE administrative_activity_status_type(
    administrative_activity_status_type_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                                      varchar(50)       NOT NULL,
    record_end_date                           date,
    record_effective_date                     date              NOT NULL,
    description                               varchar(250),
    create_date                               timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                               integer           NOT NULL,
    update_date                               timestamptz(6),
    update_user                               integer,
    revision_count                            integer           DEFAULT 0 NOT NULL,
    CONSTRAINT administrative_activity_status_type_pk PRIMARY KEY (administrative_activity_status_type_id)
)
;



COMMENT ON COLUMN administrative_activity_status_type.administrative_activity_status_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity_status_type.name IS 'The name of the record.'
;
COMMENT ON COLUMN administrative_activity_status_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN administrative_activity_status_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN administrative_activity_status_type.description IS 'The description of the record.'
;
COMMENT ON COLUMN administrative_activity_status_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN administrative_activity_status_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN administrative_activity_status_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN administrative_activity_status_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN administrative_activity_status_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE administrative_activity_status_type IS 'Administrative activity status type describes a class of statuses that describe the state of an administrative activity record.'
;

-- 
-- TABLE: administrative_activity_type 
--

CREATE TABLE administrative_activity_type(
    administrative_activity_type_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                               varchar(50)       NOT NULL,
    record_end_date                    date,
    record_effective_date              date              NOT NULL,
    description                        varchar(250),
    create_date                        timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                        integer           NOT NULL,
    update_date                        timestamptz(6),
    update_user                        integer,
    revision_count                     integer           DEFAULT 0 NOT NULL,
    CONSTRAINT administrative_activity_type_pk PRIMARY KEY (administrative_activity_type_id)
)
;



COMMENT ON COLUMN administrative_activity_type.administrative_activity_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN administrative_activity_type.name IS 'The name of the record.'
;
COMMENT ON COLUMN administrative_activity_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN administrative_activity_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN administrative_activity_type.description IS 'The description of the record.'
;
COMMENT ON COLUMN administrative_activity_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN administrative_activity_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN administrative_activity_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN administrative_activity_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN administrative_activity_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE administrative_activity_type IS 'Administrative activity type describes a class of administrative activities that is performed in order to maintain the business processes of the application.'
;

-- 
-- TABLE: audit_log 
--

CREATE TABLE audit_log(
    audit_log_id      integer         GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    system_user_id    integer         NOT NULL,
    create_date       TIMESTAMPTZ     DEFAULT now() NOT NULL,
    table_name        varchar(200)    NOT NULL,
    operation         varchar(20)     NOT NULL,
    before_value      json,
    after_value       json,
    CONSTRAINT audit_log_pk PRIMARY KEY (audit_log_id)
)
;



COMMENT ON COLUMN audit_log.audit_log_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN audit_log.system_user_id IS 'The system user id affecting the data change.'
;
COMMENT ON COLUMN audit_log.create_date IS 'The date and time of record creation.'
;
COMMENT ON COLUMN audit_log.table_name IS 'The table name of the data record.'
;
COMMENT ON COLUMN audit_log.operation IS 'The operation that affected the data change (ie. INSERT, UPDATE, DELETE, TRUNCATE).'
;
COMMENT ON COLUMN audit_log.before_value IS 'The JSON representation of the before value of the record.'
;
COMMENT ON COLUMN audit_log.after_value IS 'The JSON representation of the after value of the record.'
;
COMMENT ON TABLE audit_log IS 'Holds record level audit log data for the entire database.'
;

-- 
-- TABLE: climate_change_initiative 
--

CREATE TABLE climate_change_initiative(
    climate_change_initiative_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                            varchar(50)       NOT NULL,
    record_end_date                 date,
    record_effective_date           date              NOT NULL,
    description                     varchar(250),
    create_date                     timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                     integer           NOT NULL,
    update_date                     timestamptz(6),
    update_user                     integer,
    revision_count                  integer           DEFAULT 0 NOT NULL,
    CONSTRAINT climate_change_initiative_pk PRIMARY KEY (climate_change_initiative_id)
)
;



COMMENT ON COLUMN climate_change_initiative.climate_change_initiative_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN climate_change_initiative.name IS 'The name of the record.'
;
COMMENT ON COLUMN climate_change_initiative.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN climate_change_initiative.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN climate_change_initiative.description IS 'The description of the record.'
;
COMMENT ON COLUMN climate_change_initiative.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN climate_change_initiative.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN climate_change_initiative.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN climate_change_initiative.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN climate_change_initiative.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE climate_change_initiative IS 'Identifies the climate change initiative for the project.'
;

-- 
-- TABLE: first_nations 
--

CREATE TABLE first_nations(
    first_nations_id         integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(300)      NOT NULL,
    record_effective_date    date              NOT NULL,
    record_end_date          date,
    description              varchar(250),
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT first_nations_pk PRIMARY KEY (first_nations_id)
)
;



COMMENT ON COLUMN first_nations.first_nations_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN first_nations.name IS 'Name of the First Nation.'
;
COMMENT ON COLUMN first_nations.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN first_nations.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN first_nations.description IS 'The description of the record.'
;
COMMENT ON COLUMN first_nations.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN first_nations.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN first_nations.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN first_nations.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN first_nations.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE first_nations IS 'A list of first nations.'
;

-- 
-- TABLE: funding_source 
--

CREATE TABLE funding_source(
    funding_source_id        integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(100)      NOT NULL,
    record_end_date          date,
    record_effective_date    date              NOT NULL,
    description              varchar(250),
    project_id_optional      boolean           NOT NULL,
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT funding_source_pk PRIMARY KEY (funding_source_id)
)
;



COMMENT ON COLUMN funding_source.funding_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN funding_source.name IS 'The name of the funding source.'
;
COMMENT ON COLUMN funding_source.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN funding_source.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN funding_source.description IS 'The description of the record.'
;
COMMENT ON COLUMN funding_source.project_id_optional IS 'Provides whether the project id for the identified funding source is optional. A value of "Y" provides that the project id is optional and a value of "N" provides that the project id is not optional.'
;
COMMENT ON COLUMN funding_source.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN funding_source.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN funding_source.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN funding_source.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN funding_source.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE funding_source IS 'Agency or Ministry funding the project.'
;

-- 
-- TABLE: investment_action_category 
--

CREATE TABLE investment_action_category(
    investment_action_category_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    funding_source_id                integer           NOT NULL,
    name                             varchar(300),
    record_end_date                  date,
    record_effective_date            date              NOT NULL,
    description                      varchar(250),
    create_date                      timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                      integer           NOT NULL,
    update_date                      timestamptz(6),
    update_user                      integer,
    revision_count                   integer           DEFAULT 0 NOT NULL,
    CONSTRAINT investment_action_category_pk PRIMARY KEY (investment_action_category_id)
)
;



COMMENT ON COLUMN investment_action_category.investment_action_category_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN investment_action_category.funding_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN investment_action_category.name IS 'The name of the investment or action category.'
;
COMMENT ON COLUMN investment_action_category.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN investment_action_category.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN investment_action_category.description IS 'The description of the record.'
;
COMMENT ON COLUMN investment_action_category.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN investment_action_category.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN investment_action_category.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN investment_action_category.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN investment_action_category.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE investment_action_category IS 'The investment or action categories associated with the funding source. Funding sources may have no investment or action category thus the default category of Not Applicable is used.'
;

-- 
-- TABLE: iucn_conservation_action_level_1_classification 
--

CREATE TABLE iucn_conservation_action_level_1_classification(
    iucn_conservation_action_level_1_classification_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                                                  varchar(300),
    record_end_date                                       date,
    record_effective_date                                 date              NOT NULL,
    description                                           varchar(3000),
    create_date                                           timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                                           integer           NOT NULL,
    update_date                                           timestamptz(6),
    update_user                                           integer,
    revision_count                                        integer           DEFAULT 0 NOT NULL,
    CONSTRAINT iucn_conservation_action_level_1_classification_pk PRIMARY KEY (iucn_conservation_action_level_1_classification_id)
)
;



COMMENT ON COLUMN iucn_conservation_action_level_1_classification.iucn_conservation_action_level_1_classification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.name IS 'The name of the record.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.description IS 'The description of the record.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN iucn_conservation_action_level_1_classification.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE iucn_conservation_action_level_1_classification IS 'List of IUCN conservation level 1 action classifications.'
;

-- 
-- TABLE: iucn_conservation_action_level_2_subclassification 
--

CREATE TABLE iucn_conservation_action_level_2_subclassification(
    iucn_conservation_action_level_2_subclassification_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    iucn_conservation_action_level_1_classification_id       integer           NOT NULL,
    name                                                     varchar(300),
    record_end_date                                          date,
    record_effective_date                                    date              NOT NULL,
    description                                              varchar(3000),
    create_date                                              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                                              integer           NOT NULL,
    update_date                                              timestamptz(6),
    update_user                                              integer,
    revision_count                                           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT iucn_conservation_action_level_2_subclassification_pk PRIMARY KEY (iucn_conservation_action_level_2_subclassification_id)
)
;



COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.iucn_conservation_action_level_2_subclassification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.iucn_conservation_action_level_1_classification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.name IS 'The name of the record.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.description IS 'The description of the record.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN iucn_conservation_action_level_2_subclassification.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE iucn_conservation_action_level_2_subclassification IS 'List of IUCN conservation action level 2 subclassifications.'
;

-- 
-- TABLE: iucn_conservation_action_level_3_subclassification 
--

CREATE TABLE iucn_conservation_action_level_3_subclassification(
    iucn_conservation_action_level_3_subclassification_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    iucn_conservation_action_level_2_subclassification_id    integer           NOT NULL,
    name                                                     varchar(300),
    record_end_date                                          date,
    record_effective_date                                    date              NOT NULL,
    description                                              varchar(3000),
    create_date                                              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                                              integer           NOT NULL,
    update_date                                              timestamptz(6),
    update_user                                              integer,
    revision_count                                           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT iucn_conservation_action_level_3_subclassification_pk PRIMARY KEY (iucn_conservation_action_level_3_subclassification_id)
)
;



COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.iucn_conservation_action_level_3_subclassification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.iucn_conservation_action_level_2_subclassification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.name IS 'The name of the IUCN action classification sublevel 2.
'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.description IS 'The description of the record.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN iucn_conservation_action_level_3_subclassification.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE iucn_conservation_action_level_3_subclassification IS 'List of IUCN conservation action level 3 subclassifications.'
;

-- 
-- TABLE: management_action_type 
--

CREATE TABLE management_action_type(
    management_action_type_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                         varchar(50)       NOT NULL,
    record_end_date              date,
    record_effective_date        date              NOT NULL,
    description                  varchar(250),
    create_date                  timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                  integer           NOT NULL,
    update_date                  timestamptz(6),
    update_user                  integer,
    revision_count               integer           DEFAULT 0 NOT NULL,
    CONSTRAINT management_action_type_pk PRIMARY KEY (management_action_type_id)
)
;



COMMENT ON COLUMN management_action_type.management_action_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN management_action_type.name IS 'The name of the record.'
;
COMMENT ON COLUMN management_action_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN management_action_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN management_action_type.description IS 'The description of the record.'
;
COMMENT ON COLUMN management_action_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN management_action_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN management_action_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN management_action_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN management_action_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE management_action_type IS 'List of Management Actions.'
;

-- 
-- TABLE: occurrence 
--

CREATE TABLE occurrence(
    occurrence_id               integer                     GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    occurrence_submission_id    integer                     NOT NULL,
    taxonid                     varchar(3000),
    lifestage                   varchar(3000),
    vernacularname              varchar(3000),
    eventdate                   TIMESTAMPTZ                 NOT NULL,
    individualcount             varchar(3000),
    organismquantity            varchar(3000),
    organismquantitytype        varchar(3000),
    data                        json,
    geometry                    geometry(geometry, 3005),
    geography                   geography(geometry),
    create_date                 timestamptz(6)              DEFAULT now() NOT NULL,
    create_user                 integer                     NOT NULL,
    update_date                 timestamptz(6),
    update_user                 integer,
    revision_count              integer                     DEFAULT 0 NOT NULL,
    CONSTRAINT occurrence_pk PRIMARY KEY (occurrence_id)
)
;



COMMENT ON COLUMN occurrence.occurrence_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN occurrence.occurrence_submission_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN occurrence.taxonid IS 'A string representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.lifestage IS 'A string representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.vernacularname IS 'A string representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.eventdate IS 'A datetime representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.individualcount IS 'A string representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.organismquantity IS 'A string representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.organismquantitytype IS 'A string representation of the value provided for the given Darwin Core term.'
;
COMMENT ON COLUMN occurrence.data IS 'The json data associated with the record.'
;
COMMENT ON COLUMN occurrence.geometry IS 'The containing geometry of the record.'
;
COMMENT ON COLUMN occurrence.geography IS 'The containing geography of the record.'
;
COMMENT ON COLUMN occurrence.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN occurrence.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN occurrence.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN occurrence.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN occurrence.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE occurrence IS 'Occurrence records that have been ingested from submissions sources.'
;

-- 
-- TABLE: occurrence_submission 
--

CREATE TABLE occurrence_submission(
    occurrence_submission_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    survey_id                   integer           NOT NULL,
    source                      varchar(300)      NOT NULL,
    event_timestamp             TIMESTAMPTZ       NOT NULL,
    key                         varchar(1000),
    create_date                 timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                 integer           NOT NULL,
    update_date                 timestamptz(6),
    update_user                 integer,
    revision_count              integer           DEFAULT 0 NOT NULL,
    CONSTRAINT occurrence_submission_pk PRIMARY KEY (occurrence_submission_id)
)
;



COMMENT ON COLUMN occurrence_submission.occurrence_submission_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN occurrence_submission.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN occurrence_submission.source IS 'The name of the source system that is supplying the data.'
;
COMMENT ON COLUMN occurrence_submission.event_timestamp IS 'The timestamp of the associated event.'
;
COMMENT ON COLUMN occurrence_submission.key IS 'The identifying key to the file in the storage system.'
;
COMMENT ON COLUMN occurrence_submission.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN occurrence_submission.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN occurrence_submission.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN occurrence_submission.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN occurrence_submission.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE occurrence_submission IS 'Provides a historical listing of published dates and pointers to raw data versions for occurrence submissions.'
;

-- 
-- TABLE: permit 
--

CREATE TABLE permit(
    permit_id                    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    survey_id                    integer,
    project_id                   integer,
    number                       varchar(100)      NOT NULL,
    type                         varchar(300)      NOT NULL,
    coordinator_first_name       varchar(50),
    coordinator_last_name        varchar(50),
    coordinator_email_address    varchar(500),
    coordinator_agency_name      varchar(300),
    issue_date                   date,
    end_date                     date,
    create_date                  timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                  integer           NOT NULL,
    update_date                  timestamptz(6),
    update_user                  integer,
    revision_count               integer           DEFAULT 0 NOT NULL,
    CONSTRAINT permit_pk PRIMARY KEY (permit_id)
)
;



COMMENT ON COLUMN permit.permit_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN permit.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN permit.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN permit.number IS 'Permit number provided by FrontCounter BC.'
;
COMMENT ON COLUMN permit.type IS 'The tye of the permit.'
;
COMMENT ON COLUMN permit.coordinator_first_name IS 'The first name of the permit coordinator.'
;
COMMENT ON COLUMN permit.coordinator_last_name IS 'The last name of the permit coordinator.
'
;
COMMENT ON COLUMN permit.coordinator_email_address IS 'The email address.'
;
COMMENT ON COLUMN permit.coordinator_agency_name IS 'The permit coordinator agency name.'
;
COMMENT ON COLUMN permit.issue_date IS 'The date the permit was issued.'
;
COMMENT ON COLUMN permit.end_date IS 'The date the permit is no longer valid.'
;
COMMENT ON COLUMN permit.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN permit.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN permit.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN permit.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN permit.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE permit IS 'Provides a record of scientific permits. Note that permits are first class objects in the data model and do not require an association to either a project or survey. Additionally:
- Association to a survey or project implies that sampling was conducted related to the permit 
- No association to a survey or project implies that sampling was not conducted related to the permit
- Permits that are associated with a project should eventually be related to a survey
- Permits can be associated with one or zero projects
- Permits can only be associated with one survey
- Permits that have no association with a project or survey require values for coordinator first name, last name, email address and agency name

NOTE: there are conceptual problems with associating permits to projects early instead of at the survey level and these should be addressed in subsequent versions of the application.'
;

-- 
-- TABLE: project 
--

CREATE TABLE project(
    project_id                    integer                     GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_type_id               integer                     NOT NULL,
    name                          varchar(50)                 NOT NULL,
    objectives                    varchar(3000)               NOT NULL,
    management_recovery_action    character(1),
    location_description          varchar(3000),
    start_date                    date                        NOT NULL,
    end_date                      date,
    caveats                       varchar(3000),
    comments                      varchar(3000),
    coordinator_first_name        varchar(50)                 NOT NULL,
    coordinator_last_name         varchar(50)                 NOT NULL,
    coordinator_email_address     varchar(500)                NOT NULL,
    coordinator_agency_name       varchar(300)                NOT NULL,
    coordinator_public            boolean                     NOT NULL,
    publish_timestamp             TIMESTAMPTZ,
    geometry                      geometry(geometry, 3005),
    geography                     geography(geometry),
    create_date                   timestamptz(6)              DEFAULT now() NOT NULL,
    create_user                   integer                     NOT NULL,
    update_date                   timestamptz(6),
    update_user                   integer,
    revision_count                integer                     DEFAULT 0 NOT NULL,
    CONSTRAINT project_pk PRIMARY KEY (project_id)
)
;



COMMENT ON COLUMN project.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project.project_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project.name IS 'Name given to a project.'
;
COMMENT ON COLUMN project.objectives IS 'The objectives for the project.'
;
COMMENT ON COLUMN project.management_recovery_action IS 'Identifies if the project addresses a management or recovery action.'
;
COMMENT ON COLUMN project.location_description IS 'The location description.'
;
COMMENT ON COLUMN project.start_date IS 'The start date of the project.'
;
COMMENT ON COLUMN project.end_date IS 'The end date of the project.'
;
COMMENT ON COLUMN project.caveats IS 'Important stipulations, conditions, or limitations to the project results.'
;
COMMENT ON COLUMN project.comments IS 'Comments about the project.'
;
COMMENT ON COLUMN project.coordinator_first_name IS 'The first name of the person directly responsible for the project.'
;
COMMENT ON COLUMN project.coordinator_last_name IS 'The last name of the person directly responsible for the project.'
;
COMMENT ON COLUMN project.coordinator_email_address IS 'The coordinators email address.'
;
COMMENT ON COLUMN project.coordinator_agency_name IS 'Name of agency the project coordinator works for.'
;
COMMENT ON COLUMN project.coordinator_public IS 'A flag that determines whether personal coordinator details are public. A value of "Y" provides that personal details are public.'
;
COMMENT ON COLUMN project.publish_timestamp IS 'A timestamp that indicates that the project metadata has been approved for discovery. If the timestamp is not null then project metadata is public. If the timestamp is null the project metadata is not yet public.'
;
COMMENT ON COLUMN project.geometry IS 'The containing geometry of the record.'
;
COMMENT ON COLUMN project.geography IS 'The containing geography of the record.'
;
COMMENT ON COLUMN project.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project IS 'The top level organizational structure for project data collection. '
;

-- 
-- TABLE: project_activity 
--

CREATE TABLE project_activity(
    project_activity_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id             integer           NOT NULL,
    activity_id            integer           NOT NULL,
    create_date            timestamptz(6)    DEFAULT now() NOT NULL,
    create_user            integer           NOT NULL,
    update_date            timestamptz(6),
    update_user            integer,
    revision_count         integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_activity_pk PRIMARY KEY (project_activity_id)
)
;



COMMENT ON COLUMN project_activity.project_activity_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_activity.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_activity.activity_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_activity.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_activity.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_activity.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_activity.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_activity.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_activity IS 'A associative entity that joins projects and project activity types.'
;

-- 
-- TABLE: project_attachment 
--

CREATE TABLE project_attachment(
    project_attachment_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id               integer           NOT NULL,
    file_name                varchar(300),
    title                    varchar(300),
    description              varchar(250),
    key                      varchar(1000)     NOT NULL,
    file_size                integer,
    security_token           uuid,
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_attachment_pk PRIMARY KEY (project_attachment_id)
)
;



COMMENT ON COLUMN project_attachment.project_attachment_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_attachment.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_attachment.file_name IS 'The name of the file attachment.'
;
COMMENT ON COLUMN project_attachment.title IS 'The title of the file.'
;
COMMENT ON COLUMN project_attachment.description IS 'The description of the record.'
;
COMMENT ON COLUMN project_attachment.key IS 'The identifying key to the file in the storage system.'
;
COMMENT ON COLUMN project_attachment.file_size IS 'The size of the file in bytes.'
;
COMMENT ON COLUMN project_attachment.security_token IS 'The token indicates that this is a non-public row and it will trigger activation of the security rules defined for this row.'
;
COMMENT ON COLUMN project_attachment.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_attachment.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_attachment.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_attachment.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_attachment.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_attachment IS 'A list of project attachments.'
;

-- 
-- TABLE: project_climate_initiative 
--

CREATE TABLE project_climate_initiative(
    project_climate_initiative_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    climate_change_initiative_id     integer           NOT NULL,
    project_id                       integer           NOT NULL,
    create_date                      timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                      integer           NOT NULL,
    update_date                      timestamptz(6),
    update_user                      integer,
    revision_count                   integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_climate_initiative_pk PRIMARY KEY (project_climate_initiative_id)
)
;



COMMENT ON COLUMN project_climate_initiative.project_climate_initiative_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_climate_initiative.climate_change_initiative_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_climate_initiative.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_climate_initiative.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_climate_initiative.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_climate_initiative.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_climate_initiative.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_climate_initiative.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_climate_initiative IS 'A associative entity that joins that joins projects and climate change initiative types.'
;

-- 
-- TABLE: project_first_nation 
--

CREATE TABLE project_first_nation(
    project_first_nation_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    first_nations_id           integer           NOT NULL,
    project_id                 integer           NOT NULL,
    create_date                timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                integer           NOT NULL,
    update_date                timestamptz(6),
    update_user                integer,
    revision_count             integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_first_nation_pk PRIMARY KEY (project_first_nation_id)
)
;



COMMENT ON COLUMN project_first_nation.project_first_nation_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_first_nation.first_nations_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_first_nation.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_first_nation.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_first_nation.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_first_nation.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_first_nation.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_first_nation.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_first_nation IS 'A associative entity that joins projects and first nations.'
;

-- 
-- TABLE: project_funding_source 
--

CREATE TABLE project_funding_source(
    project_funding_source_id        integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    investment_action_category_id    integer           NOT NULL,
    project_id                       integer           NOT NULL,
    funding_source_project_id        varchar(50),
    funding_amount                   money             NOT NULL,
    funding_start_date               date              NOT NULL,
    funding_end_date                 date              NOT NULL,
    create_date                      timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                      integer           NOT NULL,
    update_date                      timestamptz(6),
    update_user                      integer,
    revision_count                   integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_funding_source_pk PRIMARY KEY (project_funding_source_id)
)
;



COMMENT ON COLUMN project_funding_source.project_funding_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_funding_source.investment_action_category_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_funding_source.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_funding_source.funding_source_project_id IS 'Idenfification number used by funding source to reference the project'
;
COMMENT ON COLUMN project_funding_source.funding_amount IS 'Funding amount from funding source.'
;
COMMENT ON COLUMN project_funding_source.funding_start_date IS 'Start date for funding from the source.'
;
COMMENT ON COLUMN project_funding_source.funding_end_date IS 'End date for funding from the source.'
;
COMMENT ON COLUMN project_funding_source.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_funding_source.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_funding_source.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_funding_source.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_funding_source.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_funding_source IS 'A associative entity that joins projects and funding source details.'
;

-- 
-- TABLE: project_iucn_action_classification 
--

CREATE TABLE project_iucn_action_classification(
    project_iucn_action_classification_id                    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id                                               integer           NOT NULL,
    iucn_conservation_action_level_3_subclassification_id    integer           NOT NULL,
    create_date                                              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                                              integer           NOT NULL,
    update_date                                              timestamptz(6),
    update_user                                              integer,
    revision_count                                           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_iucn_action_classification_pk PRIMARY KEY (project_iucn_action_classification_id)
)
;



COMMENT ON COLUMN project_iucn_action_classification.project_iucn_action_classification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_iucn_action_classification.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_iucn_action_classification.iucn_conservation_action_level_3_subclassification_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_iucn_action_classification.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_iucn_action_classification.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_iucn_action_classification.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_iucn_action_classification.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_iucn_action_classification.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_iucn_action_classification IS 'An associative entity that links projects and IUCN classifications.'
;

-- 
-- TABLE: project_management_actions 
--

CREATE TABLE project_management_actions(
    project_management_actions_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    management_action_type_id        integer           NOT NULL,
    project_id                       integer           NOT NULL,
    create_date                      timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                      integer           NOT NULL,
    update_date                      timestamptz(6),
    update_user                      integer,
    revision_count                   integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_management_actions_pk PRIMARY KEY (project_management_actions_id)
)
;



COMMENT ON COLUMN project_management_actions.project_management_actions_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_management_actions.management_action_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_management_actions.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_management_actions.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_management_actions.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_management_actions.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_management_actions.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_management_actions.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_management_actions IS 'A associative entity that joins projects and management action types.'
;

-- 
-- TABLE: project_participation 
--

CREATE TABLE project_participation(
    project_participation_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id                  integer           NOT NULL,
    system_user_id              integer           NOT NULL,
    project_role_id             integer           NOT NULL,
    create_date                 timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                 integer           NOT NULL,
    update_date                 timestamptz(6),
    update_user                 integer,
    revision_count              integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_participation_pk PRIMARY KEY (project_participation_id)
)
;



COMMENT ON COLUMN project_participation.project_participation_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_participation.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_participation.system_user_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_participation.project_role_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_participation.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_participation.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_participation.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_participation.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_participation.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_participation IS 'A associative entity that joins projects, system users and project role types.'
;

-- 
-- TABLE: project_region 
--

CREATE TABLE project_region(
    project_region_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id           integer           NOT NULL,
    name                 varchar(200)      NOT NULL,
    create_date          timestamptz(6)    DEFAULT now() NOT NULL,
    create_user          integer           NOT NULL,
    update_date          timestamptz(6),
    update_user          integer,
    revision_count       integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_region_pk PRIMARY KEY (project_region_id)
)
;



COMMENT ON COLUMN project_region.project_region_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_region.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_region.name IS 'The region name.'
;
COMMENT ON COLUMN project_region.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_region.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_region.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_region.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_region.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_region IS 'The region of a project.'
;

-- 
-- TABLE: project_role 
--

CREATE TABLE project_role(
    project_role_id          integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(50)       NOT NULL,
    record_effective_date    date              NOT NULL,
    record_end_date          date,
    description              varchar(250)      NOT NULL,
    notes                    varchar(3000),
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT project_role_pk PRIMARY KEY (project_role_id)
)
;



COMMENT ON COLUMN project_role.project_role_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_role.name IS 'The name of the project role.'
;
COMMENT ON COLUMN project_role.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN project_role.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN project_role.description IS 'The description of the project role.'
;
COMMENT ON COLUMN project_role.notes IS 'Notes associated with the record.'
;
COMMENT ON COLUMN project_role.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_role.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_role.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_role.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_role.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_role IS 'Project participation roles.'
;

-- 
-- TABLE: project_type 
--

CREATE TABLE project_type(
    project_type_id          integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(50)       NOT NULL,
    record_effective_date    date              NOT NULL,
    description              varchar(250),
    record_end_date          date,
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT pk49_1_3_1 PRIMARY KEY (project_type_id)
)
;



COMMENT ON COLUMN project_type.project_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN project_type.name IS 'The name of the project role.'
;
COMMENT ON COLUMN project_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN project_type.description IS 'The description of the project type.'
;
COMMENT ON COLUMN project_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN project_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN project_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN project_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN project_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN project_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE project_type IS 'Broad classification for the project.'
;

-- 
-- TABLE: proprietor_type 
--

CREATE TABLE proprietor_type(
    proprietor_type_id       integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(50)       NOT NULL,
    record_effective_date    date              NOT NULL,
    record_end_date          date,
    description              varchar(250),
    is_first_nation          boolean           NOT NULL,
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT proprietor_type_pk PRIMARY KEY (proprietor_type_id)
)
;



COMMENT ON COLUMN proprietor_type.proprietor_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN proprietor_type.name IS 'The name of the proprietary type.'
;
COMMENT ON COLUMN proprietor_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN proprietor_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN proprietor_type.description IS 'The description of the record.'
;
COMMENT ON COLUMN proprietor_type.is_first_nation IS 'Defines whether the type is first nations related and thus requires child records to be associated with a first nations name reference.'
;
COMMENT ON COLUMN proprietor_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN proprietor_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN proprietor_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN proprietor_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN proprietor_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE proprietor_type IS 'Identifies the available reasons that subject data can be proprietary.'
;

-- 
-- TABLE: stakeholder_partnership 
--

CREATE TABLE stakeholder_partnership(
    stakeholder_partnership_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id                    integer           NOT NULL,
    name                          varchar(300),
    create_date                   timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                   integer           NOT NULL,
    update_date                   timestamptz(6),
    update_user                   integer,
    revision_count                integer           DEFAULT 0 NOT NULL,
    CONSTRAINT stakeholder_partnership_pk PRIMARY KEY (stakeholder_partnership_id)
)
;



COMMENT ON COLUMN stakeholder_partnership.stakeholder_partnership_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN stakeholder_partnership.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN stakeholder_partnership.name IS 'The name of the stakeholder.'
;
COMMENT ON COLUMN stakeholder_partnership.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN stakeholder_partnership.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN stakeholder_partnership.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN stakeholder_partnership.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN stakeholder_partnership.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE stakeholder_partnership IS 'Stakeholder partnerships associated with the project.'
;

-- 
-- TABLE: study_species 
--

CREATE TABLE study_species(
    study_species_id         integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    survey_id                integer           NOT NULL,
    wldtaxonomic_units_id    integer           NOT NULL,
    is_focal                 boolean           NOT NULL,
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT study_species_pk PRIMARY KEY (study_species_id)
)
;



COMMENT ON COLUMN study_species.study_species_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN study_species.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN study_species.wldtaxonomic_units_id IS 'System generated UID for a taxon.'
;
COMMENT ON COLUMN study_species.is_focal IS 'Define whether the species association is focal or not. A true value defines the association as focal.'
;
COMMENT ON COLUMN study_species.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN study_species.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN study_species.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN study_species.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN study_species.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE study_species IS 'The study species for the survey.'
;

-- 
-- TABLE: submission_message 
--

CREATE TABLE submission_message(
    submission_message_id         integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    submission_message_type_id    integer           NOT NULL,
    submission_status_id          integer           NOT NULL,
    event_timestamp               TIMESTAMPTZ       NOT NULL,
    message                       varchar(3000),
    create_date                   timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                   integer           NOT NULL,
    update_date                   timestamptz(6),
    update_user                   integer,
    revision_count                integer           DEFAULT 0 NOT NULL,
    CONSTRAINT submission_message_pk PRIMARY KEY (submission_message_id)
)
;



COMMENT ON COLUMN submission_message.submission_message_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_message.submission_message_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_message.submission_status_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_message.event_timestamp IS 'The timestamp of the associated event.'
;
COMMENT ON COLUMN submission_message.message IS 'The description of the record.'
;
COMMENT ON COLUMN submission_message.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN submission_message.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_message.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN submission_message.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_message.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE submission_message IS 'Intersection table to track submission messages.'
;

-- 
-- TABLE: submission_message_type 
--

CREATE TABLE submission_message_type(
    submission_message_type_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                          varchar(50)       NOT NULL,
    record_end_date               date,
    record_effective_date         date              NOT NULL,
    description                   varchar(250),
    create_date                   timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                   integer           NOT NULL,
    update_date                   timestamptz(6),
    update_user                   integer,
    revision_count                integer           DEFAULT 0 NOT NULL,
    CONSTRAINT submission_message_type_pk PRIMARY KEY (submission_message_type_id)
)
;



COMMENT ON COLUMN submission_message_type.submission_message_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_message_type.name IS 'The name of the record.'
;
COMMENT ON COLUMN submission_message_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN submission_message_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN submission_message_type.description IS 'The description of the record.'
;
COMMENT ON COLUMN submission_message_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN submission_message_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_message_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN submission_message_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_message_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE submission_message_type IS 'The types of submission messages available to report. These messages may include metrics and validation concerns.'
;

-- 
-- TABLE: submission_status 
--

CREATE TABLE submission_status(
    submission_status_id         integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    occurrence_submission_id     integer           NOT NULL,
    submission_status_type_id    integer           NOT NULL,
    event_timestamp              TIMESTAMPTZ       NOT NULL,
    create_date                  timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                  integer           NOT NULL,
    update_date                  timestamptz(6),
    update_user                  integer,
    revision_count               integer           DEFAULT 0 NOT NULL,
    CONSTRAINT submission_status_pk PRIMARY KEY (submission_status_id)
)
;



COMMENT ON COLUMN submission_status.submission_status_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_status.occurrence_submission_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_status.submission_status_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_status.event_timestamp IS 'The timestamp of the associated event.'
;
COMMENT ON COLUMN submission_status.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN submission_status.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_status.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN submission_status.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_status.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE submission_status IS 'Provides a history of submission statuses.'
;

-- 
-- TABLE: submission_status_type 
--

CREATE TABLE submission_status_type(
    submission_status_type_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                         varchar(50)       NOT NULL,
    record_end_date              date,
    record_effective_date        date              NOT NULL,
    description                  varchar(250),
    create_date                  timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                  integer           NOT NULL,
    update_date                  timestamptz(6),
    update_user                  integer,
    revision_count               integer           DEFAULT 0 NOT NULL,
    CONSTRAINT submission_status_type_pk PRIMARY KEY (submission_status_type_id)
)
;



COMMENT ON COLUMN submission_status_type.submission_status_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN submission_status_type.name IS 'The name of the record.'
;
COMMENT ON COLUMN submission_status_type.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN submission_status_type.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN submission_status_type.description IS 'The description of the record.'
;
COMMENT ON COLUMN submission_status_type.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN submission_status_type.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_status_type.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN submission_status_type.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN submission_status_type.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE submission_status_type IS 'The status types of submissions. Typical status types are those that represent submissions being submitted or rejected.'
;

-- 
-- TABLE: survey 
--

CREATE TABLE survey(
    survey_id               integer                     GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_id              integer                     NOT NULL,
    name                    varchar(300),
    objectives              varchar(3000)               NOT NULL,
    start_date              date                        NOT NULL,
    lead_first_name         varchar(50)                 NOT NULL,
    lead_last_name          varchar(50)                 NOT NULL,
    end_date                date,
    location_description    varchar(3000),
    location_name           varchar(300)                NOT NULL,
    publish_timestamp       TIMESTAMPTZ,
    geometry                geometry(geometry, 3005),
    geography               geography(geometry),
    create_date             timestamptz(6)              DEFAULT now() NOT NULL,
    create_user             integer                     NOT NULL,
    update_date             timestamptz(6),
    update_user             integer,
    revision_count          integer                     DEFAULT 0 NOT NULL,
    CONSTRAINT survey_pk PRIMARY KEY (survey_id)
)
;



COMMENT ON COLUMN survey.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey.project_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey.name IS 'Name given to a survey.'
;
COMMENT ON COLUMN survey.objectives IS 'The objectives for the survey.'
;
COMMENT ON COLUMN survey.start_date IS 'The start date of the survey.
'
;
COMMENT ON COLUMN survey.lead_first_name IS 'The first name of the person who is the lead for the survey.'
;
COMMENT ON COLUMN survey.lead_last_name IS 'The last name of the person who is the lead for the survey.'
;
COMMENT ON COLUMN survey.end_date IS 'The end date of the survey.'
;
COMMENT ON COLUMN survey.location_description IS 'The location description.'
;
COMMENT ON COLUMN survey.location_name IS 'The name of the survey location.'
;
COMMENT ON COLUMN survey.publish_timestamp IS 'A timestamp that indicates that the survey metadata has been approved for discovery. If the timestamp is not null then project metadata is public. If the timestamp is null the survey metadata is not yet public.'
;
COMMENT ON COLUMN survey.geometry IS 'The containing geometry of the record.'
;
COMMENT ON COLUMN survey.geography IS 'The containing geography of the record.'
;
COMMENT ON COLUMN survey.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN survey.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN survey.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN survey.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN survey.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE survey IS 'The top level organizational structure for survey data collection. '
;

-- 
-- TABLE: survey_attachment 
--

CREATE TABLE survey_attachment(
    survey_attachment_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    survey_id               integer           NOT NULL,
    file_name               varchar(300),
    title                   varchar(300),
    description             varchar(250),
    key                     varchar(1000)     NOT NULL,
    file_size               integer,
    security_token          uuid,
    create_date             timestamptz(6)    DEFAULT now() NOT NULL,
    create_user             integer           NOT NULL,
    update_date             timestamptz(6),
    update_user             integer,
    revision_count          integer           DEFAULT 0 NOT NULL,
    CONSTRAINT survey_attachment_pk PRIMARY KEY (survey_attachment_id)
)
;



COMMENT ON COLUMN survey_attachment.survey_attachment_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_attachment.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_attachment.file_name IS 'The name of the file attachment.'
;
COMMENT ON COLUMN survey_attachment.title IS 'The title of the file.'
;
COMMENT ON COLUMN survey_attachment.description IS 'The description of the record.'
;
COMMENT ON COLUMN survey_attachment.key IS 'The identifying key to the file in the storage system.'
;
COMMENT ON COLUMN survey_attachment.file_size IS 'The size of the file in bytes.'
;
COMMENT ON COLUMN survey_attachment.security_token IS 'The token indicates that this is a non-public row and it will trigger activation of the security rules defined for this row.'
;
COMMENT ON COLUMN survey_attachment.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN survey_attachment.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN survey_attachment.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN survey_attachment.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN survey_attachment.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE survey_attachment IS 'A list of survey attachments.'
;

-- 
-- TABLE: survey_funding_source 
--

CREATE TABLE survey_funding_source(
    survey_funding_source_id     integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    project_funding_source_id    integer           NOT NULL,
    survey_id                    integer           NOT NULL,
    create_date                  timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                  integer           NOT NULL,
    update_date                  timestamptz(6),
    update_user                  integer,
    revision_count               integer           DEFAULT 0 NOT NULL,
    CONSTRAINT survey_funding_source_pk PRIMARY KEY (survey_funding_source_id)
)
;



COMMENT ON COLUMN survey_funding_source.survey_funding_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_funding_source.project_funding_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_funding_source.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_funding_source.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN survey_funding_source.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN survey_funding_source.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN survey_funding_source.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN survey_funding_source.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE survey_funding_source IS 'A associative entity that joins surveys and funding source details.'
;

-- 
-- TABLE: survey_proprietor 
--

CREATE TABLE survey_proprietor(
    survey_proprietor_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    first_nations_id        integer,
    proprietor_type_id      integer           NOT NULL,
    survey_id               integer           NOT NULL,
    rationale               varchar(3000)     NOT NULL,
    proprietor_name         varchar(300),
    disa_required           boolean           NOT NULL,
    create_date             timestamptz(6)    DEFAULT now() NOT NULL,
    create_user             integer           NOT NULL,
    update_date             timestamptz(6),
    update_user             integer,
    revision_count          integer           DEFAULT 0 NOT NULL,
    CONSTRAINT survey_proprietor_pk PRIMARY KEY (survey_proprietor_id)
)
;



COMMENT ON COLUMN survey_proprietor.survey_proprietor_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_proprietor.first_nations_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_proprietor.proprietor_type_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_proprietor.survey_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN survey_proprietor.rationale IS 'Justification for identifying data as proprietary.'
;
COMMENT ON COLUMN survey_proprietor.proprietor_name IS 'Name of the proprietor of the data. This attribute is not required if a first nations relationship has been provided.'
;
COMMENT ON COLUMN survey_proprietor.disa_required IS 'Defines whether a data sharing agreement (DISA) is required. When set to TRUE then a DISA is required.'
;
COMMENT ON COLUMN survey_proprietor.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN survey_proprietor.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN survey_proprietor.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN survey_proprietor.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN survey_proprietor.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE survey_proprietor IS 'Intersection table associating surveys to proprietary types and associated meta data.'
;

-- 
-- TABLE: system_constant 
--

CREATE TABLE system_constant(
    system_constant_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    constant_name         varchar(50)       NOT NULL,
    character_value       varchar(300),
    numeric_value         numeric(10, 0),
    description           varchar(250),
    create_date           timestamptz(6)    DEFAULT now() NOT NULL,
    create_user           integer           NOT NULL,
    update_date           timestamptz(6),
    update_user           integer,
    revision_count        integer           DEFAULT 0 NOT NULL,
    CONSTRAINT system_constant_pk PRIMARY KEY (system_constant_id)
)
;



COMMENT ON COLUMN system_constant.system_constant_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_constant.constant_name IS 'The lookup name of the constant.'
;
COMMENT ON COLUMN system_constant.character_value IS 'The string value of the constant.'
;
COMMENT ON COLUMN system_constant.numeric_value IS 'The numeric value of the constant.'
;
COMMENT ON COLUMN system_constant.description IS 'The description of the record.'
;
COMMENT ON COLUMN system_constant.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN system_constant.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN system_constant.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN system_constant.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN system_constant.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE system_constant IS 'A list of system constants necessary for system functionality.'
;

-- 
-- TABLE: system_role 
--

CREATE TABLE system_role(
    system_role_id           integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(50)       NOT NULL,
    record_effective_date    date              NOT NULL,
    record_end_date          date,
    description              varchar(250)      NOT NULL,
    notes                    varchar(3000),
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT system_role_pk PRIMARY KEY (system_role_id)
)
;



COMMENT ON COLUMN system_role.system_role_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_role.name IS 'The name of the record.'
;
COMMENT ON COLUMN system_role.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN system_role.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN system_role.description IS 'The description of the record.'
;
COMMENT ON COLUMN system_role.notes IS 'Notes associated with the record.'
;
COMMENT ON COLUMN system_role.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN system_role.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN system_role.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN system_role.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN system_role.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE system_role IS 'Agency or Ministry funding the project.'
;

-- 
-- TABLE: system_user 
--

CREATE TABLE system_user(
    system_user_id             integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    user_identity_source_id    integer           NOT NULL,
    user_identifier            varchar(200)      NOT NULL,
    record_effective_date      date              NOT NULL,
    record_end_date            date,
    create_date                timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                integer           NOT NULL,
    update_date                timestamptz(6),
    update_user                integer,
    revision_count             integer           DEFAULT 0 NOT NULL,
    CONSTRAINT system_user_pk PRIMARY KEY (system_user_id)
)
;



COMMENT ON COLUMN system_user.system_user_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_user.user_identity_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_user.user_identifier IS 'The identifier of the user.'
;
COMMENT ON COLUMN system_user.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN system_user.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN system_user.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN system_user.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN system_user.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN system_user.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN system_user.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE system_user IS 'Agency or Ministry funding the project.'
;

-- 
-- TABLE: system_user_role 
--

CREATE TABLE system_user_role(
    system_user_role_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    system_user_id         integer           NOT NULL,
    system_role_id         integer           NOT NULL,
    create_date            timestamptz(6)    DEFAULT now() NOT NULL,
    create_user            integer           NOT NULL,
    update_date            timestamptz(6),
    update_user            integer,
    revision_count         integer           DEFAULT 0 NOT NULL,
    CONSTRAINT system_user_role_pk PRIMARY KEY (system_user_role_id)
)
;



COMMENT ON COLUMN system_user_role.system_user_role_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_user_role.system_user_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_user_role.system_role_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN system_user_role.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN system_user_role.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN system_user_role.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN system_user_role.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN system_user_role.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE system_user_role IS 'A associative entity that joins system users and system role types.'
;

-- 
-- TABLE: user_identity_source 
--

CREATE TABLE user_identity_source(
    user_identity_source_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                       varchar(50)       NOT NULL,
    record_effective_date      date              NOT NULL,
    record_end_date            date,
    description                varchar(250),
    notes                      varchar(3000),
    create_date                timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                integer           NOT NULL,
    update_date                timestamptz(6),
    update_user                integer,
    revision_count             integer           DEFAULT 0 NOT NULL,
    CONSTRAINT user_identity_source_pk PRIMARY KEY (user_identity_source_id)
)
;



COMMENT ON COLUMN user_identity_source.user_identity_source_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN user_identity_source.name IS 'The name of the record.'
;
COMMENT ON COLUMN user_identity_source.record_effective_date IS 'Record level effective date.'
;
COMMENT ON COLUMN user_identity_source.record_end_date IS 'Record level end date.'
;
COMMENT ON COLUMN user_identity_source.description IS 'The description of the record.'
;
COMMENT ON COLUMN user_identity_source.notes IS 'Notes associated with the record.'
;
COMMENT ON COLUMN user_identity_source.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN user_identity_source.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN user_identity_source.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN user_identity_source.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN user_identity_source.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE user_identity_source IS 'The source of the user identifier. This source is traditionally the system that authenticates the user. Example sources could include IDIR, BCEID and DATABASE.'
;

-- 
-- TABLE: webform_draft 
--

CREATE TABLE webform_draft(
    webform_draft_id    integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    system_user_id      integer           NOT NULL,
    name                varchar(300)      NOT NULL,
    data                json              NOT NULL,
    security_token      uuid,
    create_date         timestamptz(6)    DEFAULT now() NOT NULL,
    create_user         integer           NOT NULL,
    update_date         timestamptz(6),
    update_user         integer,
    revision_count      integer           DEFAULT 0 NOT NULL,
    CONSTRAINT webform_draft_pk PRIMARY KEY (webform_draft_id)
)
;



COMMENT ON COLUMN webform_draft.webform_draft_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN webform_draft.system_user_id IS 'System generated surrogate primary key identifier.'
;
COMMENT ON COLUMN webform_draft.name IS 'The name of the draft record.'
;
COMMENT ON COLUMN webform_draft.data IS 'The json data associated with the record.'
;
COMMENT ON COLUMN webform_draft.security_token IS 'The token indicates that this is a non-public row and it will trigger activation of the security rules defined for this row.'
;
COMMENT ON COLUMN webform_draft.create_date IS 'The datetime the record was created.'
;
COMMENT ON COLUMN webform_draft.create_user IS 'The id of the user who created the record as identified in the system user table.'
;
COMMENT ON COLUMN webform_draft.update_date IS 'The datetime the record was updated.'
;
COMMENT ON COLUMN webform_draft.update_user IS 'The id of the user who updated the record as identified in the system user table.'
;
COMMENT ON COLUMN webform_draft.revision_count IS 'Revision count used for concurrency control.'
;
COMMENT ON TABLE webform_draft IS 'A persistent store for draft webform data. For example, if a user starts a project creation process and wants to save that information as a draft then the webform data can be persisted for subsequent reload into the project creation process.'
;

-- 
-- TABLE: wldtaxonomic_units 
--

CREATE TABLE wldtaxonomic_units(
    wldtaxonomic_units_id      integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    unit_name1                 varchar(50)       NOT NULL,
    unit_name2                 varchar(50),
    unit_name3                 varchar(50),
    taxon_authority            varchar(100),
    code                       varchar(35),
    english_name               varchar(50),
    tty_kingdom                varchar(10)       NOT NULL,
    tty_name                   varchar(20)       NOT NULL,
    tcn_id                     numeric(10, 0),
    txn_id                     numeric(10, 0),
    sensitive_data_flag        varchar(1),
    breed_in_bc_flag           varchar(1),
    introduced_species_flag    varchar(1),
    phylo_sort_sequence        numeric(10, 0),
    start_date                 date,
    end_date                   date,
    note                       varchar(2000),
    element_subnational_id     numeric(10, 0),
    CONSTRAINT wldtaxonomic_units_pk PRIMARY KEY (wldtaxonomic_units_id)
)
;



COMMENT ON COLUMN wldtaxonomic_units.wldtaxonomic_units_id IS 'System generated UID for a taxon.'
;
COMMENT ON COLUMN wldtaxonomic_units.unit_name1 IS 'The first part of a species or taxon  name.'
;
COMMENT ON COLUMN wldtaxonomic_units.unit_name2 IS 'Idenifies the species.'
;
COMMENT ON COLUMN wldtaxonomic_units.unit_name3 IS 'Subspecies name.'
;
COMMENT ON COLUMN wldtaxonomic_units.taxon_authority IS 'Name of the author(s) who first described the species, eg. Linnae'
;
COMMENT ON COLUMN wldtaxonomic_units.code IS 'Code commonly used to identify a taxon usually at a species or su'
;
COMMENT ON COLUMN wldtaxonomic_units.english_name IS 'Common english name of the species or taxa. Ex. Grizzly Bear'
;
COMMENT ON COLUMN wldtaxonomic_units.tty_kingdom IS 'The kingdom the taxon hierarchy represents'
;
COMMENT ON COLUMN wldtaxonomic_units.tty_name IS 'The name of the taxon level, eg. PHYLUM, ORDER, GENUS, etc'
;
COMMENT ON COLUMN wldtaxonomic_units.tcn_id IS 'FK: WLD_COMMON_NAMES'
;
COMMENT ON COLUMN wldtaxonomic_units.txn_id IS 'System generated UID for a taxon.'
;
COMMENT ON COLUMN wldtaxonomic_units.sensitive_data_flag IS 'Indicates that the data is sensitive and access restricted'
;
COMMENT ON COLUMN wldtaxonomic_units.breed_in_bc_flag IS 'Indicates whether or not an animal breeds in BC.'
;
COMMENT ON COLUMN wldtaxonomic_units.introduced_species_flag IS 'Indicates that species is not native to British Columbia.'
;
COMMENT ON COLUMN wldtaxonomic_units.phylo_sort_sequence IS 'The phologenetic sequence order of the taxon.'
;
COMMENT ON COLUMN wldtaxonomic_units.start_date IS 'The date the taxon name becomes effective.'
;
COMMENT ON COLUMN wldtaxonomic_units.end_date IS 'The date a taxon becomes obsolete.'
;
COMMENT ON COLUMN wldtaxonomic_units.note IS 'Free form text about the taxon.'
;
COMMENT ON COLUMN wldtaxonomic_units.element_subnational_id IS 'Identifier that can be used to link this record to the matching Biotics field.'
;
COMMENT ON TABLE wldtaxonomic_units IS 'A table to mimic a view into SPI taxonomic data, specifically CWI_TXN.WLDTAXONOMIC_UNITS, for development purposes. This table should be replaced by live views of the data in production systems.'
;

-- 
-- INDEX: activity_nuk1 
--

CREATE UNIQUE INDEX activity_nuk1 ON activity(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: "Ref78143" 
--

CREATE INDEX "Ref78143" ON administrative_activity(assigned_system_user_id)
;
-- 
-- INDEX: "Ref78144" 
--

CREATE INDEX "Ref78144" ON administrative_activity(reported_system_user_id)
;
-- 
-- INDEX: "Ref148145" 
--

CREATE INDEX "Ref148145" ON administrative_activity(administrative_activity_type_id)
;
-- 
-- INDEX: "Ref152146" 
--

CREATE INDEX "Ref152146" ON administrative_activity(administrative_activity_status_type_id)
;
-- 
-- INDEX: administrative_activity_status_type_nuk1 
--

CREATE UNIQUE INDEX administrative_activity_status_type_nuk1 ON administrative_activity_status_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: administrative_activity_type_nuk1 
--

CREATE UNIQUE INDEX administrative_activity_type_nuk1 ON administrative_activity_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: climate_change_initiative_nuk1 
--

CREATE UNIQUE INDEX climate_change_initiative_nuk1 ON climate_change_initiative(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: first_nations_nuk1 
--

CREATE UNIQUE INDEX first_nations_nuk1 ON first_nations(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: funding_source_nuk1 
--

CREATE UNIQUE INDEX funding_source_nuk1 ON funding_source(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: investment_action_category_nuk1 
--

CREATE UNIQUE INDEX investment_action_category_nuk1 ON investment_action_category(name, record_end_date, funding_source_id)
;
-- 
-- INDEX: "Ref73136" 
--

CREATE INDEX "Ref73136" ON investment_action_category(funding_source_id)
;
-- 
-- INDEX: iucn_conservation_action_level_1_classification_nuk1 
--

CREATE UNIQUE INDEX iucn_conservation_action_level_1_classification_nuk1 ON iucn_conservation_action_level_1_classification(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: iucn_conservation_action_level_2_subclassification_nuk1 
--

CREATE UNIQUE INDEX iucn_conservation_action_level_2_subclassification_nuk1 ON iucn_conservation_action_level_2_subclassification(name, record_end_date, iucn_conservation_action_level_1_classification_id)
;
-- 
-- INDEX: "Ref137121" 
--

CREATE INDEX "Ref137121" ON iucn_conservation_action_level_2_subclassification(iucn_conservation_action_level_1_classification_id)
;
-- 
-- INDEX: iucn_conservation_action_level_3_subclassification_nuk1 
--

CREATE UNIQUE INDEX iucn_conservation_action_level_3_subclassification_nuk1 ON iucn_conservation_action_level_3_subclassification(name, record_end_date, iucn_conservation_action_level_2_subclassification_id)
;
-- 
-- INDEX: "Ref139122" 
--

CREATE INDEX "Ref139122" ON iucn_conservation_action_level_3_subclassification(iucn_conservation_action_level_2_subclassification_id)
;
-- 
-- INDEX: management_action_type_nuk1 
--

CREATE UNIQUE INDEX management_action_type_nuk1 ON management_action_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: "Ref165161" 
--

CREATE INDEX "Ref165161" ON occurrence(occurrence_submission_id)
;
-- 
-- INDEX: "Ref153160" 
--

CREATE INDEX "Ref153160" ON occurrence_submission(survey_id)
;
-- 
-- INDEX: permit_uk1 
--

CREATE UNIQUE INDEX permit_uk1 ON permit(number)
;
-- 
-- INDEX: "Ref45156" 
--

CREATE INDEX "Ref45156" ON permit(project_id)
;
-- 
-- INDEX: "Ref153157" 
--

CREATE INDEX "Ref153157" ON permit(survey_id)
;
-- 
-- INDEX: "Ref128119" 
--

CREATE INDEX "Ref128119" ON project(project_type_id)
;
-- 
-- INDEX: project_activity_uk1 
--

CREATE UNIQUE INDEX project_activity_uk1 ON project_activity(project_id, activity_id)
;
-- 
-- INDEX: "Ref45127" 
--

CREATE INDEX "Ref45127" ON project_activity(project_id)
;
-- 
-- INDEX: "Ref136128" 
--

CREATE INDEX "Ref136128" ON project_activity(activity_id)
;
-- 
-- INDEX: project_attachment_uk1 
--

CREATE UNIQUE INDEX project_attachment_uk1 ON project_attachment(file_name, project_id)
;
-- 
-- INDEX: "Ref45125" 
--

CREATE INDEX "Ref45125" ON project_attachment(project_id)
;
-- 
-- INDEX: project_climate_initiative_uk1 
--

CREATE UNIQUE INDEX project_climate_initiative_uk1 ON project_climate_initiative(climate_change_initiative_id, project_id)
;
-- 
-- INDEX: "Ref95129" 
--

CREATE INDEX "Ref95129" ON project_climate_initiative(climate_change_initiative_id)
;
-- 
-- INDEX: "Ref45130" 
--

CREATE INDEX "Ref45130" ON project_climate_initiative(project_id)
;
-- 
-- INDEX: project_first_nation_uk1 
--

CREATE UNIQUE INDEX project_first_nation_uk1 ON project_first_nation(first_nations_id, project_id)
;
-- 
-- INDEX: "Ref127132" 
--

CREATE INDEX "Ref127132" ON project_first_nation(first_nations_id)
;
-- 
-- INDEX: "Ref45133" 
--

CREATE INDEX "Ref45133" ON project_first_nation(project_id)
;
-- 
-- INDEX: project_funding_source_uk1 
--

CREATE UNIQUE INDEX project_funding_source_uk1 ON project_funding_source(funding_source_project_id, investment_action_category_id, project_id)
;
-- 
-- INDEX: "Ref83137" 
--

CREATE INDEX "Ref83137" ON project_funding_source(investment_action_category_id)
;
-- 
-- INDEX: "Ref45138" 
--

CREATE INDEX "Ref45138" ON project_funding_source(project_id)
;
-- 
-- INDEX: project_iucn_action_classification_uk1 
--

CREATE UNIQUE INDEX project_iucn_action_classification_uk1 ON project_iucn_action_classification(project_id, iucn_conservation_action_level_3_subclassification_id)
;
-- 
-- INDEX: "Ref45123" 
--

CREATE INDEX "Ref45123" ON project_iucn_action_classification(project_id)
;
-- 
-- INDEX: "Ref140124" 
--

CREATE INDEX "Ref140124" ON project_iucn_action_classification(iucn_conservation_action_level_3_subclassification_id)
;
-- 
-- INDEX: project_management_actions_uk1 
--

CREATE UNIQUE INDEX project_management_actions_uk1 ON project_management_actions(project_id, management_action_type_id)
;
-- 
-- INDEX: "Ref97134" 
--

CREATE INDEX "Ref97134" ON project_management_actions(management_action_type_id)
;
-- 
-- INDEX: "Ref45135" 
--

CREATE INDEX "Ref45135" ON project_management_actions(project_id)
;
-- 
-- INDEX: project_participation_uk1 
--

CREATE UNIQUE INDEX project_participation_uk1 ON project_participation(project_id, system_user_id, project_role_id)
;
-- 
-- INDEX: "Ref45148" 
--

CREATE INDEX "Ref45148" ON project_participation(project_id)
;
-- 
-- INDEX: "Ref78149" 
--

CREATE INDEX "Ref78149" ON project_participation(system_user_id)
;
-- 
-- INDEX: "Ref100150" 
--

CREATE INDEX "Ref100150" ON project_participation(project_role_id)
;
-- 
-- INDEX: project_region_uk1 
--

CREATE UNIQUE INDEX project_region_uk1 ON project_region(name, project_id)
;
-- 
-- INDEX: "Ref45131" 
--

CREATE INDEX "Ref45131" ON project_region(project_id)
;
-- 
-- INDEX: project_role_nuk1 
--

CREATE UNIQUE INDEX project_role_nuk1 ON project_role(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: project_type_nuk1 
--

CREATE UNIQUE INDEX project_type_nuk1 ON project_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: proprietor_type_nuk1 
--

CREATE UNIQUE INDEX proprietor_type_nuk1 ON proprietor_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: stakeholder_partnership_uk1 
--

CREATE UNIQUE INDEX stakeholder_partnership_uk1 ON stakeholder_partnership(name, project_id)
;
-- 
-- INDEX: "Ref45126" 
--

CREATE INDEX "Ref45126" ON stakeholder_partnership(project_id)
;
-- 
-- INDEX: study_species_uk1 
--

CREATE UNIQUE INDEX study_species_uk1 ON study_species(survey_id, wldtaxonomic_units_id)
;
-- 
-- INDEX: "Ref153158" 
--

CREATE INDEX "Ref153158" ON study_species(survey_id)
;
-- 
-- INDEX: "Ref160159" 
--

CREATE INDEX "Ref160159" ON study_species(wldtaxonomic_units_id)
;
-- 
-- INDEX: "Ref184166" 
--

CREATE INDEX "Ref184166" ON submission_message(submission_status_id)
;
-- 
-- INDEX: "Ref182167" 
--

CREATE INDEX "Ref182167" ON submission_message(submission_message_type_id)
;
-- 
-- INDEX: submission_message_type_nuk1 
--

CREATE UNIQUE INDEX submission_message_type_nuk1 ON submission_message_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: "Ref165163" 
--

CREATE INDEX "Ref165163" ON submission_status(occurrence_submission_id)
;
-- 
-- INDEX: "Ref183164" 
--

CREATE INDEX "Ref183164" ON submission_status(submission_status_type_id)
;
-- 
-- INDEX: submission_status_type_nuk1 
--

CREATE UNIQUE INDEX submission_status_type_nuk1 ON submission_status_type(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: "Ref45147" 
--

CREATE INDEX "Ref45147" ON survey(project_id)
;
-- 
-- INDEX: "Ref153168" 
--

CREATE INDEX "Ref153168" ON survey_attachment(survey_id)
;
-- 
-- INDEX: survey_funding_source_uk1 
--

CREATE UNIQUE INDEX survey_funding_source_uk1 ON survey_funding_source(project_funding_source_id, survey_id)
;
-- 
-- INDEX: "Ref74151" 
--

CREATE INDEX "Ref74151" ON survey_funding_source(project_funding_source_id)
;
-- 
-- INDEX: "Ref153152" 
--

CREATE INDEX "Ref153152" ON survey_funding_source(survey_id)
;
-- 
-- INDEX: "Ref159153" 
--

CREATE INDEX "Ref159153" ON survey_proprietor(proprietor_type_id)
;
-- 
-- INDEX: "Ref153154" 
--

CREATE INDEX "Ref153154" ON survey_proprietor(survey_id)
;
-- 
-- INDEX: "Ref127155" 
--

CREATE INDEX "Ref127155" ON survey_proprietor(first_nations_id)
;
-- 
-- INDEX: system_constant_uk1 
--

CREATE UNIQUE INDEX system_constant_uk1 ON system_constant(constant_name)
;
-- 
-- INDEX: system_role_nuk1 
--

CREATE UNIQUE INDEX system_role_nuk1 ON system_role(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: system_user_nuk1 
--

CREATE UNIQUE INDEX system_user_nuk1 ON system_user(user_identifier, record_end_date, user_identity_source_id)
;
-- 
-- INDEX: "Ref120120" 
--

CREATE INDEX "Ref120120" ON system_user(user_identity_source_id)
;
-- 
-- INDEX: system_user_role_uk1 
--

CREATE UNIQUE INDEX system_user_role_uk1 ON system_user_role(system_user_id, system_role_id)
;
-- 
-- INDEX: "Ref78139" 
--

CREATE INDEX "Ref78139" ON system_user_role(system_user_id)
;
-- 
-- INDEX: "Ref79140" 
--

CREATE INDEX "Ref79140" ON system_user_role(system_role_id)
;
-- 
-- INDEX: user_identity_source_nuk1 
--

CREATE UNIQUE INDEX user_identity_source_nuk1 ON user_identity_source(name, (record_end_date is NULL)) where record_end_date is null
;
-- 
-- INDEX: "Ref78141" 
--

CREATE INDEX "Ref78141" ON webform_draft(system_user_id)
;
-- 
-- TABLE: administrative_activity 
--

ALTER TABLE administrative_activity ADD CONSTRAINT "Refsystem_user143" 
    FOREIGN KEY (assigned_system_user_id)
    REFERENCES system_user(system_user_id)
;

ALTER TABLE administrative_activity ADD CONSTRAINT "Refsystem_user144" 
    FOREIGN KEY (reported_system_user_id)
    REFERENCES system_user(system_user_id)
;

ALTER TABLE administrative_activity ADD CONSTRAINT "Refadministrative_activity_type145" 
    FOREIGN KEY (administrative_activity_type_id)
    REFERENCES administrative_activity_type(administrative_activity_type_id)
;

ALTER TABLE administrative_activity ADD CONSTRAINT "Refadministrative_activity_status_type146" 
    FOREIGN KEY (administrative_activity_status_type_id)
    REFERENCES administrative_activity_status_type(administrative_activity_status_type_id)
;


-- 
-- TABLE: investment_action_category 
--

ALTER TABLE investment_action_category ADD CONSTRAINT "Reffunding_source136" 
    FOREIGN KEY (funding_source_id)
    REFERENCES funding_source(funding_source_id)
;


-- 
-- TABLE: iucn_conservation_action_level_2_subclassification 
--

ALTER TABLE iucn_conservation_action_level_2_subclassification ADD CONSTRAINT "Refiucn_conservation_action_level_1_classification121" 
    FOREIGN KEY (iucn_conservation_action_level_1_classification_id)
    REFERENCES iucn_conservation_action_level_1_classification(iucn_conservation_action_level_1_classification_id)
;


-- 
-- TABLE: iucn_conservation_action_level_3_subclassification 
--

ALTER TABLE iucn_conservation_action_level_3_subclassification ADD CONSTRAINT "Refiucn_conservation_action_level_2_subclassification122" 
    FOREIGN KEY (iucn_conservation_action_level_2_subclassification_id)
    REFERENCES iucn_conservation_action_level_2_subclassification(iucn_conservation_action_level_2_subclassification_id)
;


-- 
-- TABLE: occurrence 
--

ALTER TABLE occurrence ADD CONSTRAINT "Refoccurrence_submission161" 
    FOREIGN KEY (occurrence_submission_id)
    REFERENCES occurrence_submission(occurrence_submission_id)
;


-- 
-- TABLE: occurrence_submission 
--

ALTER TABLE occurrence_submission ADD CONSTRAINT "Refsurvey160" 
    FOREIGN KEY (survey_id)
    REFERENCES survey(survey_id)
;


-- 
-- TABLE: permit 
--

ALTER TABLE permit ADD CONSTRAINT "Refproject156" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;

ALTER TABLE permit ADD CONSTRAINT "Refsurvey157" 
    FOREIGN KEY (survey_id)
    REFERENCES survey(survey_id)
;


-- 
-- TABLE: project 
--

ALTER TABLE project ADD CONSTRAINT "Refproject_type119" 
    FOREIGN KEY (project_type_id)
    REFERENCES project_type(project_type_id)
;


-- 
-- TABLE: project_activity 
--

ALTER TABLE project_activity ADD CONSTRAINT "Refproject127" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;

ALTER TABLE project_activity ADD CONSTRAINT "Refactivity128" 
    FOREIGN KEY (activity_id)
    REFERENCES activity(activity_id)
;


-- 
-- TABLE: project_attachment 
--

ALTER TABLE project_attachment ADD CONSTRAINT "Refproject125" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: project_climate_initiative 
--

ALTER TABLE project_climate_initiative ADD CONSTRAINT "Refclimate_change_initiative129" 
    FOREIGN KEY (climate_change_initiative_id)
    REFERENCES climate_change_initiative(climate_change_initiative_id)
;

ALTER TABLE project_climate_initiative ADD CONSTRAINT "Refproject130" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: project_first_nation 
--

ALTER TABLE project_first_nation ADD CONSTRAINT "Reffirst_nations132" 
    FOREIGN KEY (first_nations_id)
    REFERENCES first_nations(first_nations_id)
;

ALTER TABLE project_first_nation ADD CONSTRAINT "Refproject133" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: project_funding_source 
--

ALTER TABLE project_funding_source ADD CONSTRAINT "Refinvestment_action_category137" 
    FOREIGN KEY (investment_action_category_id)
    REFERENCES investment_action_category(investment_action_category_id)
;

ALTER TABLE project_funding_source ADD CONSTRAINT "Refproject138" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: project_iucn_action_classification 
--

ALTER TABLE project_iucn_action_classification ADD CONSTRAINT "Refproject123" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;

ALTER TABLE project_iucn_action_classification ADD CONSTRAINT "Refiucn_conservation_action_level_3_subclassification124" 
    FOREIGN KEY (iucn_conservation_action_level_3_subclassification_id)
    REFERENCES iucn_conservation_action_level_3_subclassification(iucn_conservation_action_level_3_subclassification_id)
;


-- 
-- TABLE: project_management_actions 
--

ALTER TABLE project_management_actions ADD CONSTRAINT "Refmanagement_action_type134" 
    FOREIGN KEY (management_action_type_id)
    REFERENCES management_action_type(management_action_type_id)
;

ALTER TABLE project_management_actions ADD CONSTRAINT "Refproject135" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: project_participation 
--

ALTER TABLE project_participation ADD CONSTRAINT "Refproject148" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;

ALTER TABLE project_participation ADD CONSTRAINT "Refsystem_user149" 
    FOREIGN KEY (system_user_id)
    REFERENCES system_user(system_user_id)
;

ALTER TABLE project_participation ADD CONSTRAINT "Refproject_role150" 
    FOREIGN KEY (project_role_id)
    REFERENCES project_role(project_role_id)
;


-- 
-- TABLE: project_region 
--

ALTER TABLE project_region ADD CONSTRAINT "Refproject131" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: stakeholder_partnership 
--

ALTER TABLE stakeholder_partnership ADD CONSTRAINT "Refproject126" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: study_species 
--

ALTER TABLE study_species ADD CONSTRAINT "Refsurvey158" 
    FOREIGN KEY (survey_id)
    REFERENCES survey(survey_id)
;

ALTER TABLE study_species ADD CONSTRAINT "Refwldtaxonomic_units159" 
    FOREIGN KEY (wldtaxonomic_units_id)
    REFERENCES wldtaxonomic_units(wldtaxonomic_units_id)
;


-- 
-- TABLE: submission_message 
--

ALTER TABLE submission_message ADD CONSTRAINT "Refsubmission_status166" 
    FOREIGN KEY (submission_status_id)
    REFERENCES submission_status(submission_status_id)
;

ALTER TABLE submission_message ADD CONSTRAINT "Refsubmission_message_type167" 
    FOREIGN KEY (submission_message_type_id)
    REFERENCES submission_message_type(submission_message_type_id)
;


-- 
-- TABLE: submission_status 
--

ALTER TABLE submission_status ADD CONSTRAINT "Refoccurrence_submission163" 
    FOREIGN KEY (occurrence_submission_id)
    REFERENCES occurrence_submission(occurrence_submission_id)
;

ALTER TABLE submission_status ADD CONSTRAINT "Refsubmission_status_type164" 
    FOREIGN KEY (submission_status_type_id)
    REFERENCES submission_status_type(submission_status_type_id)
;


-- 
-- TABLE: survey 
--

ALTER TABLE survey ADD CONSTRAINT "Refproject147" 
    FOREIGN KEY (project_id)
    REFERENCES project(project_id)
;


-- 
-- TABLE: survey_attachment 
--

ALTER TABLE survey_attachment ADD CONSTRAINT "Refsurvey168" 
    FOREIGN KEY (survey_id)
    REFERENCES survey(survey_id)
;


-- 
-- TABLE: survey_funding_source 
--

ALTER TABLE survey_funding_source ADD CONSTRAINT "Refproject_funding_source151" 
    FOREIGN KEY (project_funding_source_id)
    REFERENCES project_funding_source(project_funding_source_id)
;

ALTER TABLE survey_funding_source ADD CONSTRAINT "Refsurvey152" 
    FOREIGN KEY (survey_id)
    REFERENCES survey(survey_id)
;


-- 
-- TABLE: survey_proprietor 
--

ALTER TABLE survey_proprietor ADD CONSTRAINT "Refproprietor_type153" 
    FOREIGN KEY (proprietor_type_id)
    REFERENCES proprietor_type(proprietor_type_id)
;

ALTER TABLE survey_proprietor ADD CONSTRAINT "Refsurvey154" 
    FOREIGN KEY (survey_id)
    REFERENCES survey(survey_id)
;

ALTER TABLE survey_proprietor ADD CONSTRAINT "Reffirst_nations155" 
    FOREIGN KEY (first_nations_id)
    REFERENCES first_nations(first_nations_id)
;


-- 
-- TABLE: system_user 
--

ALTER TABLE system_user ADD CONSTRAINT "Refuser_identity_source120" 
    FOREIGN KEY (user_identity_source_id)
    REFERENCES user_identity_source(user_identity_source_id)
;


-- 
-- TABLE: system_user_role 
--

ALTER TABLE system_user_role ADD CONSTRAINT "Refsystem_user139" 
    FOREIGN KEY (system_user_id)
    REFERENCES system_user(system_user_id)
;

ALTER TABLE system_user_role ADD CONSTRAINT "Refsystem_role140" 
    FOREIGN KEY (system_role_id)
    REFERENCES system_role(system_role_id)
;


-- 
-- TABLE: webform_draft 
--

ALTER TABLE webform_draft ADD CONSTRAINT "Refsystem_user141" 
    FOREIGN KEY (system_user_id)
    REFERENCES system_user(system_user_id)
;

