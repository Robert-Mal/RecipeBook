import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { GqlAuthGuard } from './../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { RecipeService } from './recipe.service';
import { Recipe } from './schemas/recipe.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Recipe)
  async createRecipe(
    @Args('createRecipeInput') createRecipeInput: CreateRecipeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.recipeService.create(createRecipeInput, user);
  }

  @Query(() => Recipe, { name: 'recipe' })
  async findOneRecipe(@Args('id', { type: () => String }) id: Types.ObjectId) {
    return await this.recipeService.findOne(id);
  }

  @Query(() => [Recipe], { name: 'recipes' })
  async findAllRecipes(@Args('like', { type: () => String }) like: string) {
    return await this.recipeService.findAllPublicLike(like);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Recipe)
  async updateRecipe(
    @Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.recipeService.update(updateRecipeInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Recipe)
  async removeRecipe(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.recipeService.remove(id, user);
  }

  @ResolveField('username', () => String)
  async username(@Parent() recipe: Recipe): Promise<string> {
    const { userId } = recipe;
    return await this.userService.findUsernameByUserId(userId);
  }
}
