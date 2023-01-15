import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateShoppingListInput } from './create-shopping-list.input';

@InputType()
export class UpdateShoppingListInput extends PartialType(
  CreateShoppingListInput,
) {
  @Field(() => String)
  _id: Types.ObjectId;
}
