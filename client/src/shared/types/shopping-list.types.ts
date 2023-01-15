import Ingredient from "./ingredient.type";

type ShoppingList = {
  _id: string;
  name: string;
  ingredients: Ingredient[];
  createdAt: string;
};

export default ShoppingList;
