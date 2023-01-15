import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { UpdateShoppingListInput } from './dto/update-shopping-list.input';
import { CreateShoppingListInput } from './dto/create-shopping-list.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ShoppingList,
  ShoppingListDocument,
} from './schemas/shopping-list.schema';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectModel(ShoppingList.name)
    private readonly shoppingListModel: Model<ShoppingListDocument>,
  ) {}

  async create(
    createShoppingListInput: CreateShoppingListInput,
    { sub }: JwtPayload,
  ): Promise<ShoppingList> {
    const shoppingList = new this.shoppingListModel({
      ...createShoppingListInput,
      userId: sub,
    });

    return await shoppingList.save();
  }

  async findOne(
    id: Types.ObjectId,
    { sub }: JwtPayload,
  ): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListModel.findById(id).exec();
    if (!shoppingList) {
      throw new NotFoundException('Shopping list does not exist');
    }
    if (!shoppingList.userId.equals(sub)) {
      throw new ForbiddenException('No permission to view this shopping list');
    }

    return shoppingList;
  }

  async findAllByUserId(userId: Types.ObjectId): Promise<ShoppingList[]> {
    return await this.shoppingListModel.find({ userId });
  }

  async update(
    { _id, ...data }: UpdateShoppingListInput,
    { sub }: JwtPayload,
  ): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListModel.findById(_id).exec();
    if (!shoppingList) {
      throw new NotFoundException('Shopping list does not exist');
    }
    if (!shoppingList.userId.equals(sub)) {
      throw new ForbiddenException(
        'No permission to update that shopping list',
      );
    }
    return await this.shoppingListModel.findByIdAndUpdate(_id, data).exec();
  }

  async remove(id: Types.ObjectId, { sub }: JwtPayload): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListModel.findById(id).exec();
    if (!shoppingList) {
      throw new NotFoundException('Shopping list does not exist');
    }
    if (!shoppingList.userId.equals(sub)) {
      throw new ForbiddenException(
        'No permission to remove that shopping list',
      );
    }

    return await shoppingList.remove();
  }
}
