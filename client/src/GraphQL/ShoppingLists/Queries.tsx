import { gql } from "@apollo/client";

export const CORE_SHOPPING_LIST_FIELDS = gql`
  fragment CoreShoppingListFields on ShoppingList {
    _id
    name
    ingredients {
      name
      quantity
      unit
    }
    createdAt
  }
`;

export const CORE_RECIPE_FIELDS = gql`
  fragment CoreRecipeFields on Recipe {
    _id
    name
    thumbnail
    ingredients {
      name
      quantity
      unit
    }
  }
`;

export const CORE_EATING_PLAN_FIELDS = gql`
  ${CORE_RECIPE_FIELDS}
  fragment CoreEatingPlansFields on EatingPlan {
    _id
    name
    meals {
      recipes {
        ...CoreRecipeFields
      }
    }
  }
`;

export const GET_SHOPPING_LISTS = gql`
  ${CORE_SHOPPING_LIST_FIELDS}
  query getShoppingLists {
    me {
      shoppingLists {
        ...CoreShoppingListFields
      }
    }
  }
`;

export const GET_SHOPPING_LIST = gql`
  ${CORE_SHOPPING_LIST_FIELDS}
  query getShoppingList($id: String!) {
    shoppingList(id: $id) {
      ...CoreShoppingListFields
    }
  }
`;

export const GET_MY_RECIPES_AND_EATING_PLANS = gql`
  ${CORE_RECIPE_FIELDS}
  ${CORE_EATING_PLAN_FIELDS}
  query getMyRecipesAndEatingPlans {
    me {
      recipes {
        ...CoreRecipeFields
      }
      privateRecipes {
        ...CoreRecipeFields
      }
      savedRecipes {
        ...CoreRecipeFields
      }
      eatingPlans {
        ...CoreEatingPlansFields
      }
      privateEatingPlans {
        ...CoreEatingPlansFields
      }
      savedEatingPlans {
        ...CoreEatingPlansFields
      }
    }
  }
`;
