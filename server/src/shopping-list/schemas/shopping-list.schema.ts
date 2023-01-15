import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Schema as MongooseSchema, Types } from 'mongoose';
import {
  Ingredient,
  IngredientSchema,
} from '../../recipe/schemas/ingredient.schema';
import { User } from '../../user/schemas/user.schema';

export type ShoppingListDocument = ShoppingList & Document;

@Schema({ versionKey: false, timestamps: true })
@ObjectType()
export class ShoppingList {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop({ type: [IngredientSchema] })
  @Field(() => [Ingredient])
  ingredients: Ingredient[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Field(() => String)
  createdAt: Date;
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);
