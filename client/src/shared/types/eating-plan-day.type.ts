import Meal from "./meal-planning.type";

type EatingPlanDay = {
  id: string;
  title: string;
  meals: Meal[];
};

export default EatingPlanDay;
