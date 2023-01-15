import Meal from "./meal.type";

type EatingPlan = {
  _id: string;
  name: string;
  description: string;
  meals: Meal[];
  isPublic: boolean;
  username: string;
  createdAt: string;
};

export default EatingPlan;
