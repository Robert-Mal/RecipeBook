import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Meal, MealSchema } from './meal.schema';

export type EatingPlanDocument = EatingPlan & Document;

@Schema({ versionKey: false, timestamps: true })
@ObjectType()
export class EatingPlan {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => String, { nullable: true })
  description?: string;

  @Prop({ type: [MealSchema] })
  @Field(() => [Meal])
  meals: Meal[];

  @Prop({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isPublic: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Field(() => String)
  createdAt: string;
}

export const EatingPlanSchema = SchemaFactory.createForClass(EatingPlan);
