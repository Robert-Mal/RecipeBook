import { gql } from "@apollo/client";

export const CREATE_EATING_PLAN = gql`
  mutation createEatingPlan($createEatingPlanInput: CreateEatingPlanInput!) {
    createEatingPlan(createEatingPlanInput: $createEatingPlanInput) {
      _id
    }
  }
`;

export const REMOVE_EATING_PLAN = gql`
  mutation removeEatingPlan($id: String!) {
    removeEatingPlan(id: $id) {
      _id
    }
  }
`;

export const SAVE_EATING_PLAN = gql`
  mutation saveEatingPlan($id: String!) {
    saveEatingPlan(id: $id) {
      _id
    }
  }
`;

export const UNSAVE_EATING_PLAN = gql`
  mutation unsaveEatingPlan($id: String!) {
    unsaveEatingPlan(id: $id) {
      _id
    }
  }
`;
