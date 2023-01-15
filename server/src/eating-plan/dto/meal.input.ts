import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class MealInput {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  day: number;

  @Field(() => String, { nullable: true })
  time?: string;

  @Field(() => [String])
  recipesId: Types.ObjectId[];
}
