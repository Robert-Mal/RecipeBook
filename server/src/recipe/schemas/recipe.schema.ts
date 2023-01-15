import { Ingredient, IngredientSchema } from './ingredient.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type RecipeDocument = Recipe & Document;

@Schema({ versionKey: false, timestamps: true })
@ObjectType()
export class Recipe {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => String, { nullable: true })
  description?: string;

  @Prop()
  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Prop({ type: [IngredientSchema] })
  @Field(() => [Ingredient], { nullable: true })
  ingredients?: Ingredient[];

  @Prop()
  @Field(() => String, { nullable: true })
  instructions?: string;

  @Prop()
  @Field(() => String, { nullable: true })
  estimatedTime?: string;

  @Prop()
  @Field(() => String, { nullable: true })
  difficulty?: string;

  @Prop({ default: false })
  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Field(() => String)
  createdAt: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
