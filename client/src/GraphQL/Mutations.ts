import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation signUp($signUpInput: SignUpInput!) {
    signUp(signUpInput: $signUpInput) {
      username
    }
  }
`;

export const SIGN_IN = gql`
  mutation signIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      accessToken
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      username
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation createRecipe($createRecipeInput: CreateRecipeInput!) {
    createRecipe(createRecipeInput: $createRecipeInput) {
      _id
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation updateRecipe($updateRecipeInput: UpdateRecipeInput!) {
    updateRecipe(updateRecipeInput: $updateRecipeInput) {
      _id
      isPublic
    }
  }
`;

export const REMOVE_RECIPE = gql`
  mutation removeRecipe($id: String!) {
    removeRecipe(id: $id) {
      _id
    }
  }
`;

export const SAVE_RECIPE = gql`
  mutation saveRecipe($id: String!) {
    saveRecipe(id: $id) {
      _id
    }
  }
`;

export const UNSAVE_RECIPE = gql`
  mutation unsaveRecipe($id: String!) {
    unsaveRecipe(id: $id) {
      _id
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      username
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      username
    }
  }
`;
