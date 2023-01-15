import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly model: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await new this.model({
      ...createTaskDto,
    }).save();
  }

  async findAll(): Promise<Task[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    return await this.model.findById(id).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.model.findByIdAndUpdate(id, updateTaskDto).exec();
  }

  async remove(id: string): Promise<Task> {
    return this.model.findByIdAndRemove(id).exec();
  }
}
