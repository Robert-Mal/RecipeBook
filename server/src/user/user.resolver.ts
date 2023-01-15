import { GqlAuthGuard } from './../auth/guards/gql-auth.guard';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EatingPlanService } from '../eating-plan/eating-plan.service';
import { EatingPlan } from '../eating-plan/schemas/eating-plan.schema';
import { RecipeService } from '../recipe/recipe.service';
import { Recipe } from '../recipe/schemas/recipe.schema';
import { LoggedUserOutput } from './dto/logged-user.output';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { UpdateUserInput } from './dto/udpate-user.input';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common/decorators';
import { Types } from 'mongoose';
import { ShoppingList } from '../shopping-list/schemas/shopping-list.schema';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly recipeService: RecipeService,
    private readonly eatingPlanService: EatingPlanService,
    private readonly shoppingListService: ShoppingListService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'me' })
  async me(@CurrentUser() { sub }: JwtPayload): Promise<User> {
    return await this.userService.findOne(sub);
  }

  @Query(() => [User], { name: 'users' })
  async findAllLike(
    @Args('like', { type: () => String }) like: string,
  ): Promise<User[]> {
    return await this.userService.findAllByUsernameLike(like);
  }

  @Query(() => User, { name: 'user' })
  async findOneByUsername(
    @Args('username', { type: () => String }) username: string,
  ): Promise<User> {
    return await this.userService.findOneByUsername(username);
  }

  @Mutation(() => User)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<User> {
    return await this.userService.create(signUpInput);
  }

  @Mutation(() => LoggedUserOutput)
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<LoggedUserOutput> {
    return this.userService.signIn(signInInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<User> {
    return await this.userService.update(updateUserInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Recipe)
  async saveRecipe(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<Recipe> {
    return await this.userService.saveRecipe(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Recipe)
  async unsaveRecipe(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<Recipe> {
    return await this.userService.unsaveRecipe(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EatingPlan)
  async saveEatingPlan(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<EatingPlan> {
    return await this.userService.saveEatingPlan(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EatingPlan)
  async unsaveEatingPlan(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<EatingPlan> {
    return await this.userService.unsaveEatingPlan(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async followUser(
    @Args('username', { type: () => String }) username: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<User> {
    return await this.userService.followUser(username, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async unfollowUser(
    @Args('username', { type: () => String }) username: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<User> {
    return await this.userService.unfollowUser(username, user);
  }

  @ResolveField('recipes', () => [Recipe])
  async recipes(@Parent() user: User): Promise<Recipe[]> {
    const { _id } = user;
    return await this.recipeService.findAllPublicByUserId(_id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('privateRecipes', () => [Recipe])
  async privateRecipes(
    @Parent() { _id }: User,
    @CurrentUser() { sub }: JwtPayload,
  ): Promise<Recipe[]> {
    if (!_id.equals(sub)) {
      return [];
    }
    return await this.recipeService.findAllPrivateByUserId(_id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('savedRecipes', () => [Recipe])
  async savedRecipes(
    @Parent() { _id, savedRecipesId }: User,
    @CurrentUser() { sub }: JwtPayload,
  ): Promise<Recipe[]> {
    if (!_id.equals(sub)) {
      return [];
    }
    return await this.recipeService.findAllPublicById(savedRecipesId);
  }

  @ResolveField('eatingPlans', () => [EatingPlan])
  async eatingPlans(@Parent() user: User): Promise<EatingPlan[]> {
    const { _id } = user;
    return await this.eatingPlanService.findAllPublicByUserId(_id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('privateEatingPlans', () => [EatingPlan])
  async privateEatingPlans(
    @Parent() { _id }: User,
    @CurrentUser() { sub }: JwtPayload,
  ): Promise<EatingPlan[]> {
    if (!_id.equals(sub)) {
      return [];
    }
    return await this.eatingPlanService.findAllPrivateByUserId(_id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('savedEatingPlans', () => [EatingPlan])
  async savedEatingPlans(
    @Parent() { _id, savedEatingPlansId }: User,
    @CurrentUser() { sub }: JwtPayload,
  ): Promise<EatingPlan[]> {
    if (!_id.equals(sub)) {
      return [];
    }
    return await this.eatingPlanService.findAllPublicById(savedEatingPlansId);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('shoppingLists', () => [ShoppingList])
  async shoppingLists(
    @Parent() { _id }: User,
    @CurrentUser() { sub }: JwtPayload,
  ): Promise<ShoppingList[]> {
    if (!_id.equals(sub)) {
      return [];
    }
    return await this.shoppingListService.findAllByUserId(_id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('followedUsers', () => [User])
  async followedUsers(
    @Parent() { _id }: User,
    @CurrentUser() { sub }: JwtPayload,
  ): Promise<User[]> {
    if (!_id.equals(sub)) {
      return [];
    }
    return await this.userService.getFollowedUsersById(sub);
  }
}
