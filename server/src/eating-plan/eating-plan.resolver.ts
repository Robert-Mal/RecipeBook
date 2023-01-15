import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EatingPlanService } from './eating-plan.service';
import { CreateEatingPlanInput } from './dto/create-eating-plan.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EatingPlan } from './schemas/eating-plan.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UpdateEatingPlanInput } from './dto/update-eating-plan.input';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';

@Resolver(() => EatingPlan)
export class EatingPlanResolver {
  constructor(
    private readonly eatingPlanService: EatingPlanService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EatingPlan, { description: 'Create eating plan' })
  async createEatingPlan(
    @Args('createEatingPlanInput') createEatingPlanInput: CreateEatingPlanInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<EatingPlan> {
    return await this.eatingPlanService.create(createEatingPlanInput, user);
  }

  @Query(() => EatingPlan, { name: 'eatingPlan' })
  async findOne(
    @Args('id', { type: () => String }) id: Types.ObjectId,
  ): Promise<EatingPlan> {
    return await this.eatingPlanService.findOne(id);
  }

  @Query(() => [EatingPlan], { name: 'eatingPlans' })
  async findAllPublicLike(
    @Args('like', { type: () => String }) like: string,
  ): Promise<EatingPlan[]> {
    return await this.eatingPlanService.findAllPublicLike(like);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EatingPlan)
  async updateEatingPlan(
    @Args('updateEatingPlanInput') updateEatingPlanInput: UpdateEatingPlanInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<EatingPlan> {
    return await this.eatingPlanService.update(updateEatingPlanInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EatingPlan)
  async removeEatingPlan(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<EatingPlan> {
    return await this.eatingPlanService.remove(id, user);
  }

  @ResolveField('username', () => String)
  async username(@Parent() eatingPlan: EatingPlan): Promise<string> {
    const { userId } = eatingPlan;
    return await this.userService.findUsernameByUserId(userId);
  }
}
