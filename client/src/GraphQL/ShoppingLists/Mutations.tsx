import { gql } from "@apollo/client";

export const CREATE_SHOPPING_LIST = gql`
  mutation createShoppingList(
    $createShoppingListInput: CreateShoppingListInput!
  ) {
    createShoppingList(createShoppingListInput: $createShoppingListInput) {
      _id
    }
  }
`;

export const REMOVE_SHOPPING_LIST = gql`
  mutation removeShoppingList($id: String!) {
    removeShoppingList(id: $id) {
      _id
    }
  }
`;
