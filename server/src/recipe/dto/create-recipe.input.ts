import { Field, InputType } from '@nestjs/graphql';
import { Ingredient } from '../schemas/ingredient.schema';
import { IngredientInput } from './ingredient.input';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';

@InputType()
export class CreateRecipeInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  thumbnail?: Promise<FileUpload>;

  @Field(() => [IngredientInput], { nullable: true })
  ingredients?: Ingredient[];

  @Field(() => String, { nullable: true })
  instructions?: string;

  @Field(() => String, { nullable: true })
  estimatedTime?: string;

  @Field(() => String, { nullable: true })
  difficulty?: string;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;
}
