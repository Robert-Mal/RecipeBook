import { MealInput } from './meal.input';
import { Field, InputType } from '@nestjs/graphql';
import { Meal } from '../schemas/meal.schema';

@InputType()
export class CreateEatingPlanInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [MealInput])
  meals: Meal[];

  @Field(() => Boolean)
  isPublic: boolean;
}
