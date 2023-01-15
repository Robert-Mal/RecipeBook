import { CreateRecipeInput } from './create-recipe.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class UpdateRecipeInput extends PartialType(CreateRecipeInput) {
  @Field(() => String)
  _id: Types.ObjectId;
}
