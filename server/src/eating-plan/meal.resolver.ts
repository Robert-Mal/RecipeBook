import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RecipeService } from '../recipe/recipe.service';
import { Recipe } from '../recipe/schemas/recipe.schema';
import { Meal } from './schemas/meal.schema';

@Resolver(() => Meal)
export class MealResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @ResolveField('recipes', () => [Recipe])
  async recipes(@Parent() meal: Meal): Promise<Recipe[]> {
    return this.recipeService.findAllPublicById(meal.recipesId);
  }
}
