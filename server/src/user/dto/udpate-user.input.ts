import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => GraphQLUpload, { nullable: true })
  avatar: Promise<FileUpload>;

  @Field(() => String, { nullable: true })
  bio: string;
}
