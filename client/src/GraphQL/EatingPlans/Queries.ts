import { gql } from "@apollo/client";

export const CORE_MEAL_FIELDS = gql`
  fragment CoreMealFields on Meal {
    name
    day
    time
    recipes {
      _id
      name
      thumbnail
    }
  }
`;

export const GET_EATING_PLAN = gql`
  query getEatingPlan($id: String!) {
    eatingPlan(id: $id) {
      name
      description
      meals {
        name
        day
        time
        recipes {
          _id
          name
          thumbnail
        }
      }
      isPublic
      username
      createdAt
    }
  }
`;

export const GET_EATING_PLANS = gql`
  query getEatingPlans($like: String!) {
    eatingPlans(like: $like) {
      _id
      name
      description
      username
      createdAt
    }
  }
`;

export const GET_MY_EATING_PLANS = gql`
  ${CORE_MEAL_FIELDS}
  query getMyEatingPlans {
    me {
      eatingPlans {
        _id
        name
        isPublic
        createdAt
      }
      privateEatingPlans {
        _id
        name
        meals {
          ...CoreMealFields
        }
        isPublic
        createdAt
      }
      savedEatingPlans {
        _id
        name
        username
        createdAt
      }
    }
  }
`;
