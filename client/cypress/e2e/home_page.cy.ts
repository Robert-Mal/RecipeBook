/// <reference types="cypress" />

describe("The Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("successfully loads", () => {
    cy.get("#header").should("exist");
    cy.get("#content").should("exist");
  });

  it("goes to search page after clicking search icon", () => {
    cy.get("#search").click();
    cy.url().should("contain", "/dashboard/search");
  });

  it("goes to sign up page after clicking 'sign up button'", () => {
    cy.get("#sign-up").click();
    cy.url().should("contain", "/signup");
  });

  it("goes to sign in page after clicking 'sign in' button", () => {
    cy.get("#sign-in").click();
    cy.url().should("contain", "/signin");
  });

  it("goes to search page after clicking 'browse now...' link", () => {
    cy.get("#search").click();
    cy.url().should("contain", "/dashboard/search");
  });

  it("blocks protected routes", () => {
    cy.visit("/dashboard");
    cy.url().should("contain", "/signin");
  });
});
