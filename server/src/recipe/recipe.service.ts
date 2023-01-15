import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { CreateRecipeInput } from './dto/create-recipe.input';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { createWriteStream } from 'fs';
import { join, parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
  ) {}

  async create(
    createRecipeInput: CreateRecipeInput,
    user: JwtPayload,
  ): Promise<Recipe> {
    let imageName = null;
    if (createRecipeInput.thumbnail) {
      const { createReadStream, filename } = await createRecipeInput.thumbnail;
      const stream = createReadStream();
      const { ext } = parse(filename);
      imageName = uuidv4() + ext;
      const url = join(process.cwd(), `./public/${imageName}`);
      const imageStream = await createWriteStream(url);
      await stream.pipe(imageStream);
    }

    const recipe = new this.recipeModel({
      ...createRecipeInput,
      thumbnail: imageName,
      userId: user.sub,
    });

    return await recipe.save();
  }

  async findOne(id: Types.ObjectId): Promise<Recipe> {
    const recipe = await this.recipeModel
      .findOne({ _id: id, isPublic: true })
      .exec();
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }

  async findAllPublicByUserId(userId: Types.ObjectId): Promise<Recipe[]> {
    return await this.recipeModel.find({ userId, isPublic: true }).exec();
  }

  async findAllPrivateByUserId(userId: Types.ObjectId): Promise<Recipe[]> {
    return await this.recipeModel.find({ userId, isPublic: false }).exec();
  }

  async findAllPublicLike(name: string): Promise<Recipe[]> {
    return await this.recipeModel.find({
      name: { $regex: name, $options: 'i' },
      isPublic: true,
    });
  }

  async update(
    { _id, ...data }: UpdateRecipeInput,
    user: JwtPayload,
  ): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(_id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    if (!recipe.userId.equals(user.sub)) {
      throw new ForbiddenException('No access to update that recipe');
    }

    if (data.thumbnail) {
      let imageName = null;
      if (data.thumbnail) {
        const { createReadStream, filename } = await data.thumbnail;
        const stream = createReadStream();
        const { ext } = parse(filename);
        imageName = uuidv4() + ext;
        const url = join(process.cwd(), `./public/${imageName}`);
        const imageStream = await createWriteStream(url);
        await stream.pipe(imageStream);

        return await this.recipeModel
          .findByIdAndUpdate(_id, {
            ...data,
            thumbnail: imageName,
          })
          .exec();
      }
    }

    delete data.thumbnail;

    return await this.recipeModel
      .findByIdAndUpdate(_id, {
        ...data,
      })
      .exec();
  }

  async remove(id: Types.ObjectId, user: JwtPayload): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe.userId.equals(user.sub)) {
      throw new ForbiddenException('No access to remove that recipe');
    }
    return await this.recipeModel.findByIdAndRemove(id).exec();
  }

  async findAllPublicById(ids: Types.ObjectId[]): Promise<Recipe[]> {
    return await this.recipeModel.find({ _id: { $in: ids }, isPublic: true });
  }

  async findAllById(ids: Types.ObjectId[]): Promise<Recipe[]> {
    return await this.recipeModel.find({ _id: { $in: ids } }).exec();
  }
}
