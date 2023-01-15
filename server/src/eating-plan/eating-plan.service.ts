import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateEatingPlanInput } from './dto/create-eating-plan.input';
import { UpdateEatingPlanInput } from './dto/update-eating-plan.input';
import { EatingPlan, EatingPlanDocument } from './schemas/eating-plan.schema';

@Injectable()
export class EatingPlanService {
  constructor(
    @InjectModel(EatingPlan.name)
    private readonly eatingPlanModel: Model<EatingPlanDocument>,
  ) {}

  async create(
    createEatingPlanInput: CreateEatingPlanInput,
    user: JwtPayload,
  ): Promise<EatingPlan> {
    const eatingPlan = new this.eatingPlanModel({
      ...createEatingPlanInput,
      userId: user.sub,
    });

    return await eatingPlan.save();
  }

  async findOne(id: Types.ObjectId): Promise<EatingPlan> {
    const eatingPlan = await this.eatingPlanModel
      .findOne({
        _id: id,
        isPublic: true,
      })
      .exec();
    if (!eatingPlan) {
      throw new NotFoundException('Eating plan not found');
    }

    return eatingPlan;
  }

  async findAllPublicByUserId(id: Types.ObjectId): Promise<EatingPlan[]> {
    return await this.eatingPlanModel.find({ userId: id, isPublic: true });
  }

  async findAllPrivateByUserId(id: Types.ObjectId): Promise<EatingPlan[]> {
    return await this.eatingPlanModel.find({ userId: id, isPublic: false });
  }

  async findAllPublicLike(like: string): Promise<EatingPlan[]> {
    return await this.eatingPlanModel.find({
      name: { $regex: like, $options: 'i' },
      isPublic: true,
    });
  }

  async findAllPublicById(ids: Types.ObjectId[]): Promise<EatingPlan[]> {
    return await this.eatingPlanModel.find({ _id: { $in: ids } });
  }

  async findAllByUserId(userId: Types.ObjectId): Promise<EatingPlan[]> {
    return await this.eatingPlanModel.find({ userId });
  }

  async update(
    { _id, ...data }: UpdateEatingPlanInput,
    user: JwtPayload,
  ): Promise<EatingPlan> {
    const eatingPlan = await this.eatingPlanModel.findById(_id);
    if (!eatingPlan) {
      throw new NotFoundException('Eating plan not found');
    }
    if (!eatingPlan.userId.equals(user.sub)) {
      throw new ForbiddenException('No access to update that eating plan');
    }

    return await this.eatingPlanModel
      .findByIdAndUpdate(_id, {
        ...data,
      })
      .exec();
  }

  async remove(id: Types.ObjectId, user: JwtPayload): Promise<EatingPlan> {
    const eatingPlan = await this.eatingPlanModel.findById(id);
    if (!eatingPlan.userId.equals(user.sub)) {
      throw new ForbiddenException('No access to remove that recipe');
    }
    return await this.eatingPlanModel.findByIdAndRemove(id).exec();
  }
}
