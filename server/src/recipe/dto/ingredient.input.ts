import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class IngredientInput {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => String, { nullable: true })
  unit?: string;
}
