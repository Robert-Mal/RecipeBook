import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Recipe } from '../../recipe/schemas/recipe.schema';

export type MealDocument = Meal & Document;

@Schema({ versionKey: false, timestamps: false })
@ObjectType()
export class Meal {
  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Prop({ required: true })
  @Field(() => Number)
  day: number;

  @Prop()
  @Field(() => String, { nullable: true })
  time?: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: Recipe.name })
  @Field(() => [String])
  recipesId: [Types.ObjectId];
}

export const MealSchema = SchemaFactory.createForClass(Meal);
