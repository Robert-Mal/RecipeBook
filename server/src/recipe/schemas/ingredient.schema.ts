import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IngredientDocument = Ingredient & Document;

@Schema({ _id: false, versionKey: false })
@ObjectType()
export class Ingredient {
  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => Number)
  quantity: number;

  @Prop()
  @Field(() => String, { nullable: true })
  unit?: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
