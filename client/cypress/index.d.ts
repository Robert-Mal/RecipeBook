/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    signin(username: string, password: string): Chainable<any>;
  }
}
