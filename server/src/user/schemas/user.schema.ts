import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
@ObjectType()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @Field(() => String)
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  @Field(() => String, { nullable: true })
  avatar?: string;

  @Prop()
  @Field(() => String, { nullable: true })
  bio?: string;

  @Prop()
  followedUsers: Types.ObjectId[];

  @Prop()
  savedRecipesId: Types.ObjectId[];

  @Prop()
  savedEatingPlansId: Types.ObjectId[];

  @Prop({ default: 'user' })
  roles: Role[];

  @Field(() => String)
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
