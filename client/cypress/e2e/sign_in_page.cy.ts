/// <reference types="cypress" />

describe("Sign In Page", () => {
  it("should sign in user", () => {
    const username = "test1";
    const password = "test123";
    cy.visit("/signin");
    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.get("#submit").click();
    cy.url().should("contain", "/dashboard");
    cy.get("#sidebar-username").should("contain", username);
  });
});
