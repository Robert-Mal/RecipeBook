/// <reference types="cypress" />

const recipe = {
  name: "Pizza",
  description: "This is an excellent pizza recipe",
  ingredients: [
    { name: "Dough", quantity: "400", unit: "g" },
    { name: "Tomato Sauce", quantity: "200", unit: "ml" },
    { name: "Shredded Chees", quantity: "300", unit: "g" },
    { name: "Salami", quantity: "100", unit: "g" },
    { name: "Olive", quantity: "10" },
  ],
  instructions:
    "- roll out the dough\n- spread the sauce evelny\n- add cheese on top\n- add salami\n- add olives",
  estimatedTime: "00:45",
  difficulty: "Easy",
};

describe("New Recipe Page", () => {
  beforeEach(() => {
    cy.signin("test1", "test123");
    cy.get("#link-recipes").click();
    cy.url().should("contain", "/dashboard/recipes");
    cy.get("#link-create-recipe").click();
    cy.url().should("contain", "/dashboard/recipe/new");
  });

  it("should create new recipe", () => {
    cy.get("[data-cy='name']").type(recipe.name);
    cy.get("[data-cy='description']").type(recipe.description);
    for (let i = 0; i < recipe.ingredients.length; i++) {
      cy.get("[data-cy='add-ingredient']").click();
      cy.get(`[data-cy="ingredients.${i}.name"]`).type(
        recipe.ingredients[i].name
      );
      cy.get(`[data-cy="ingredients.${i}.quantity"]`).type(
        recipe.ingredients[i].quantity
      );
      recipe.ingredients[i].unit &&
        cy
          .get(`[data-cy="ingredients.${i}.unit"]`)
          .type(recipe.ingredients[i].unit);
    }
    cy.get("[data-cy='instructions']").type(recipe.instructions);
    cy.get("[data-cy='estimatedTime']").type(recipe.estimatedTime);
    cy.get("[data-cy='difficulty']").select(recipe.difficulty);
    cy.get("[data-cy='toggle']").click();
    cy.get("[data-cy='submit']").click();
    cy.url().should("contain", "/dashboard/recipe/");
    cy.get("[data-cy='name']").should("contain", recipe.name);
  });

  it("should show errors under required inputs", () => {
    cy.get("[data-cy='submit']").click();
    cy.url().should("contain", "/dashboard/recipe/new");
    cy.get("[data-cy='error-name']").should("be.visible");
    cy.get("[data-cy='error-instructions']").should("be.visible");
  });
});
