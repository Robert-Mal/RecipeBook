import { CreateEatingPlanInput } from './create-eating-plan.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class UpdateEatingPlanInput extends PartialType(CreateEatingPlanInput) {
  @Field(() => String)
  _id: Types.ObjectId;
}
