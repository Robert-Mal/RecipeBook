import Ingredient from "./ingredient.type";

type Recipe = {
  _id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  estimatedTime: string;
  difficulty: string;
  thumbnail: string;
  isPublic: boolean;
  username: string;
  createdAt: string;
};

export default Recipe;
