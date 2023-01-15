/// <reference types="cypress" />

describe("Sign Up Page", () => {
  before(() => {
    cy.task("execute", "yarn db:reset");
  });
  beforeEach(() => {
    cy.visit("/signup");
  });

  const username = "test5";
  const password = "test123";
  const email = "test5@test.com";

  it("should sign up user", () => {
    cy.get("#username").type(username);
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#submit").click();
    cy.url().should("contain", "/signin");
  });

  it("should inform that username is taken", () => {
    cy.get("#username").type(username);
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#submit").click();
    cy.on("uncaught:exception", (err, runnable) => {
      runnable.run;
      return true;
    });
    cy.get("#errors").should("contain", "Username is taken");
  });

  it("should inform that email is already in use", () => {
    cy.get("#username").type("randomName");
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#submit").click();
    cy.on("uncaught:exception", (err, runnable) => {
      runnable.run;
      return true;
    });
    cy.get("#errors").should("contain", "Email is already in use");
  });
});
