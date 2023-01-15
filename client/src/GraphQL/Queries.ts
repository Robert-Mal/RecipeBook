import { gql } from "@apollo/client";

export const GET_RECIPES = gql`
  query getRecipes($like: String!) {
    recipes(like: $like) {
      _id
      name
      description
      thumbnail
      username
      createdAt
    }
  }
`;

export const GET_RECIPE = gql`
  query getRecipe($id: String!) {
    recipe(id: $id) {
      name
      description
      ingredients {
        name
        quantity
        unit
      }
      instructions
      thumbnail
      estimatedTime
      difficulty
      isPublic
      username
      createdAt
    }
  }
`;

export const GET_USERS = gql`
  query getUsers($like: String!) {
    users(like: $like) {
      username
      avatar
    }
  }
`;

export const GET_USER = gql`
  query getUser($username: String!) {
    user(username: $username) {
      username
      avatar
      bio
      recipes {
        _id
        name
        thumbnail
        createdAt
      }
      eatingPlans {
        _id
        name
        createdAt
      }
    }
  }
`;

export const GET_PROFILE_INFO = gql`
  query getProfileInfo {
    me {
      username
      avatar
      bio
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      recipes {
        _id
        name
        thumbnail
        createdAt
        isPublic
      }
      privateRecipes {
        _id
        name
        thumbnail
        createdAt
        isPublic
      }
    }
  }
`;

export const GET_PRIVATE_RECIPES = gql`
  query getPrivateRecipes {
    me {
      privateRecipes {
        _id
        name
        description
        ingredients {
          name
          quantity
          unit
        }
        instructions
        thumbnail
        estimatedTime
        difficulty
        isPublic
        username
        createdAt
      }
    }
  }
`;

export const GET_SAVED_RECIPES = gql`
  query getSavedRecipes {
    me {
      savedRecipes {
        _id
        name
        thumbnail
      }
    }
  }
`;

export const GET_SAVED_EATING_PLANS = gql`
  query getSavedEatingPlans {
    me {
      savedEatingPlans {
        _id
        name
      }
    }
  }
`;

export const GET_FOLLOWED_USERS = gql`
  query getFollowedUsers {
    me {
      followedUsers {
        username
        avatar
        recipes {
          _id
          name
          thumbnail
          createdAt
        }
        eatingPlans {
          _id
          name
          createdAt
        }
      }
    }
  }
`;
