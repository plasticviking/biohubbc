import * as faker from "faker";

import { navigate, login, logout } from "../page-functions/common/login-page";

import {
  navigate_project,
  add_coordinator_info,
  add_permits,
  submit_project,
  next_page_project,
  previous_page_project,
  cancel_project,
  add_locations,
} from "../page-functions/project/project-create-page";

beforeEach(() => {
  navigate();
  login("", "");
});

afterEach(() => {
  navigate();
  logout();
});

var n = 0;
while (n < 1) { /* for future iterations */
  it("CreateProject", function () {
    /* ==== Open Create Project ==== */
    navigate_project();

    add_coordinator_info(null, null, null, null, null, false); //navloc,fname,lname,email,agency,noshare
    next_page_project();

    add_permits(null, null, null, "true"); //navloc, permit_nr, permit_type, sampling
    next_page_project();

    // Project Info
    cy.get("span.MuiStepLabel-iconContainer").eq(2).click(); // Click on the Navigation bar
    cy.contains("General Information").should("be.visible");
    cy.get("#project_name").clear();
    cy.get("#project_name").type(
      (faker.company.catchPhrase() + " " + faker.company.bs()).substring(0, 50)
    );
    cy.get("body").click();
    cy.get("#project_type").focus().type("{enter}");
    cy.get(
      '[data-value="' + faker.random.number({ min: 1, max: 4 }) + '"]'
    ).click();
    cy.get("#project_activities").click();
    cy.get("#project_activities-option-1").click();
    cy.get("#project_activities-option-2").click();
    cy.get("#project_activities-option-3").click();
    cy.get("#start_date").type("2010-01-01");
    cy.get("#end_date").type("2022-01-01");
    next_page_project();

    // Objectives
    cy.get("span.MuiStepLabel-iconContainer").eq(3).click(); // Click on the Navigation bar
    cy.get("#objectives").click();
    cy.get("#objectives").type(faker.lorem.paragraph());
    cy.get("#caveats").click();
    cy.get("#caveats").type(faker.lorem.paragraph());
    next_page_project();

    // Locations
    add_locations(null, null);
    next_page_project();

    submit_project();
  });
  n++;
}