import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop()
  decription?: string;

  @Prop()
  estimatedTime?: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
