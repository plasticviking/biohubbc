import { Knex } from 'knex';

/**
 * Added new program and project_program for tracking programs (used to be project type)
 *
 * @export
 * @param {Knex} knex
 * @return {*}  {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`--sql

  -------------------------------------------------------------------------
  -- Drop existing views
  -------------------------------------------------------------------------
  SET SEARCH_PATH=biohub_dapi_v1;

  -- Drop view for funding_source table
  DROP VIEW IF EXISTS survey_funding_source;

  -------------------------------------------------------------------------
  -- Drop existing indexes/constraints
  -------------------------------------------------------------------------
  SET SEARCH_PATH=biohub, public;

  -- Drop survey_funding_source table constraints/indexes
  ALTER TABLE survey_funding_source DROP CONSTRAINT survey_funding_source_pk;
  DROP INDEX survey_funding_source_uk1;

  -------------------------------------------------------------------------
  -- Rename survey_funding_source to survey_funding_source_old
  -------------------------------------------------------------------------
  ALTER TABLE survey_funding_source RENAME TO survey_funding_source_old;

  -------------------------------------------------------------------------
  -- Create funding source and join table
  -------------------------------------------------------------------------

  CREATE TABLE funding_source(
    funding_source_id        integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name                     varchar(50)       NOT NULL,
    description              varchar(250)      NOT NULL,
    start_date               date,
    end_date                 date,
    record_effective_date    date              NOT NULL,
    record_end_date          date,
    create_date              timestamptz(6)    DEFAULT now() NOT NULL,
    create_user              integer           NOT NULL,
    update_date              timestamptz(6),
    update_user              integer,
    revision_count           integer           DEFAULT 0 NOT NULL,
    CONSTRAINT funding_source_pk PRIMARY KEY (funding_source_id)
  );

  COMMENT ON COLUMN funding_source.funding_source_id        IS 'System generated surrogate primary key identifier.';
  COMMENT ON COLUMN funding_source.name                     IS 'The name of the funding source.';
  COMMENT ON COLUMN funding_source.description              IS 'The description of the funding source.';
  COMMENT ON COLUMN funding_source.start_date               IS 'Funding start date.';
  COMMENT ON COLUMN funding_source.end_date                 IS 'Funding end date.';
  COMMENT ON COLUMN funding_source.record_effective_date    IS 'Record level effective date.';
  COMMENT ON COLUMN funding_source.record_end_date          IS 'Record level end date.';
  COMMENT ON COLUMN funding_source.create_date              IS 'The datetime the record was created.';
  COMMENT ON COLUMN funding_source.create_user              IS 'The id of the user who created the record as identified in the system user table.';
  COMMENT ON COLUMN funding_source.update_date              IS 'The datetime the record was updated.';
  COMMENT ON COLUMN funding_source.update_user              IS 'The id of the user who updated the record as identified in the system user table.';
  COMMENT ON COLUMN funding_source.revision_count           IS 'Revision count used for concurrency control.';
  COMMENT ON TABLE  funding_source                          IS 'Funding Source.';

  CREATE TABLE survey_funding_source(
    survey_funding_source_id              integer           GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    funding_source_id                     integer           NOT NULL,
    survey_id                             integer           NOT NULL,
    amount                                integer           NOT NULL,
    create_date                           timestamptz(6)    DEFAULT now() NOT NULL,
    create_user                           integer           NOT NULL,
    update_date                           timestamptz(6),
    update_user                           integer,
    revision_count                        integer           DEFAULT 0 NOT NULL,
    CONSTRAINT survey_funding_source_pk PRIMARY KEY (survey_funding_source_id)
  );

  COMMENT ON COLUMN survey_funding_source.survey_funding_source_id            IS 'System generated surrogate primary key identifier.';
  COMMENT ON COLUMN survey_funding_source.funding_source_id                   IS 'The id of the funding source.';
  COMMENT ON COLUMN survey_funding_source.survey_id                           IS 'The id of the survey.';
  COMMENT ON COLUMN survey_funding_source.create_date                         IS 'the datetime the record was created';
  COMMENT ON COLUMN survey_funding_source.create_user                         IS 'The id of the user who created the record as identified in the system user table.';
  COMMENT ON COLUMN survey_funding_source.update_date                         IS 'The datetime the record was updated.';
  COMMENT ON COLUMN survey_funding_source.update_user                         IS 'The id of the user who updated the record as identified in the system user table.';
  COMMENT ON COLUMN survey_funding_source.revision_count                      IS 'Revision count used for concurrency control.';
  COMMENT ON TABLE  survey_funding_source                                     IS 'A join table for project roles and their permissions.';

  -------------------------------------------------------------------------
  -- Create audit and journal triggers for new tables
  -------------------------------------------------------------------------
  CREATE TRIGGER audit_funding_source BEFORE INSERT OR UPDATE OR DELETE ON funding_source for each ROW EXECUTE PROCEDURE tr_audit_trigger();
  CREATE TRIGGER journal_funding_source AFTER INSERT OR UPDATE OR DELETE ON funding_source for each ROW EXECUTE PROCEDURE tr_journal_trigger();

  CREATE TRIGGER audit_survey_funding_source BEFORE INSERT OR UPDATE OR DELETE ON survey_funding_source for each ROW EXECUTE PROCEDURE tr_audit_trigger();
  CREATE TRIGGER journal_survey_funding_source AFTER INSERT OR UPDATE OR DELETE ON survey_funding_source for each ROW EXECUTE PROCEDURE tr_journal_trigger();

  ----------------------------------------------------------------------------------------
  -- Create Indexes and Constraints for new tables
  ----------------------------------------------------------------------------------------

  ALTER TABLE survey_funding_source ADD CONSTRAINT survey_funding_source_fk1
  FOREIGN KEY (funding_source_id)
  REFERENCES funding_source(funding_source_id);

  ALTER TABLE survey_funding_source ADD CONSTRAINT survey_funding_source_fk2
  FOREIGN KEY (survey_id)
  REFERENCES survey(survey_id);

  -- Add unique end-date key constraint (don't allow 2 entities with the same name and a NULL record_end_date)
  CREATE UNIQUE INDEX funding_source_nuk1 ON funding_source(name, (record_end_date is NULL)) where record_end_date is null;

  -- Add indexes on foreign key columns
  CREATE UNIQUE INDEX survey_funding_source_idx1 ON survey_funding_source(funding_source_id);
  CREATE UNIQUE INDEX survey_funding_source_idx2 ON survey_funding_source(survey_id);

  ----------------------------------------------------------------------------------------
  -- Insert old data into new tables
  ----------------------------------------------------------------------------------------

  --------------------------------------------------------------------------- Create views   -------------------------------------------------------------------------
  SET SEARCH_PATH=biohub_dapi_v1;
  CREATE OR REPLACE VIEW funding_source AS SELECT * FROM biohub.funding_source;
  CREATE OR REPLACE VIEW survey_funding_source AS SELECT * FROM biohub.survey_funding_source;
  CREATE OR REPLACE VIEW survey_funding_source_old AS SELECT * FROM biohub.survey_funding_source_old;
 `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(``);
}
