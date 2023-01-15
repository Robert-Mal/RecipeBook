/// <reference types="cypress" />

const user = { username: "test1", password: "test123" };

describe("Search Page", () => {
  it("search recipe as guest", () => {
    cy.visit("/dashboard/search");
    cy.url().should("contain", "/dashboard/search");
    cy.get("[data-cy='search-box']").type("pizza");
    cy.get("[data-cy='searched-recipes']").first().click();
    cy.url().should("contain", "/dashboard/recipe");
    cy.get("[data-cy='name']").should("contain", "Pizza");
  });

  it("search for recipe as logged in user", () => {
    cy.signin(user.username, user.password);
    cy.visit("/dashboard/search");
    cy.url().should("contain", "/dashboard/search");
    cy.get("[data-cy='search-box']").type("pizza");
    cy.get("[data-cy='searched-recipes']")
      .should("be.not.empty")
      .first()
      .click();
    cy.url().should("contain", "/dashboard/recipe");
    cy.get("[data-cy='name']").should("contain", "Pizza");
  });
});
