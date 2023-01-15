import Recipe from "./recipe.type";

type Meal = {
  id?: string;
  name: string;
  day: number;
  time?: string;
  recipesId: string[];
  recipes?: Recipe[];
};

export default Meal;
