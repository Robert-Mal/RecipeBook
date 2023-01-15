import { Field, InputType } from '@nestjs/graphql';
import { IngredientInput } from '../../recipe/dto/ingredient.input';
import { Ingredient } from '../../recipe/schemas/ingredient.schema';

@InputType()
export class CreateShoppingListInput {
  @Field(() => String)
  name: string;

  @Field(() => [IngredientInput])
  ingredients: Ingredient[];
}
