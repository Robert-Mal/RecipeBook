import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { UpdateUserInput } from './dto/udpate-user.input';
import { join, parse } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { RecipeService } from '../recipe/recipe.service';
import { Recipe } from '../recipe/schemas/recipe.schema';
import { EatingPlan } from '../eating-plan/schemas/eating-plan.schema';
import { EatingPlanService } from '../eating-plan/eating-plan.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly recipeService: RecipeService,
    private readonly eatingPlanService: EatingPlanService,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    const user = new this.userModel({ ...signUpInput });
    if (await this.userModel.findOne({ username: user.username })) {
      throw new BadRequestException('Username is taken');
    }
    if (await this.userModel.findOne({ email: user.email })) {
      throw new BadRequestException('Email is already in use');
    }
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    return user.save();
  }

  async findOne(id: Types.ObjectId): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async findAllByUsernameLike(username: string): Promise<User[]> {
    return await this.userModel
      .find({
        username: { $regex: username, $options: 'i' },
      })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return await this.userModel.findByIdAndRemove(id).exec();
  }

  async findUsernameByUserId(_id: Types.ObjectId): Promise<string> {
    const user = await this.userModel.findOne({ _id }).exec();
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user.username;
  }

  async signIn({ username, password }: SignInInput) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('Username or password are invalid');
    }

    return this.authService.generateUserCredentials(user);
  }

  async update(updateUserInput: UpdateUserInput, { sub }: JwtPayload) {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserInput.avatar) {
      let imageName = null;
      if (updateUserInput.avatar) {
        const { createReadStream, filename } = await updateUserInput.avatar;
        const stream = createReadStream();
        const { ext } = parse(filename);
        imageName = uuidv4() + ext;
        const url = join(process.cwd(), `./public/${imageName}`);
        const imageStream = await createWriteStream(url);
        await stream.pipe(imageStream);
      }

      return await this.userModel.findByIdAndUpdate(sub, {
        ...updateUserInput,
        avatar: imageName,
      });
    }

    delete updateUserInput.avatar;

    return await this.userModel.findByIdAndUpdate(sub, updateUserInput);
  }

  async saveRecipe(
    recipeId: Types.ObjectId,
    { sub }: JwtPayload,
  ): Promise<Recipe> {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const recipe = await this.recipeService.findOne(recipeId);
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist');
    }
    if (recipe.userId === sub) {
      throw new BadRequestException('Recipe is yours and cannot be saved');
    }

    const isSaved: boolean = user.savedRecipesId.some((id: Types.ObjectId) => {
      return id === recipeId;
    });
    if (!isSaved) {
      user.savedRecipesId.push(recipeId);
      await user.save();
    }

    return recipe;
  }

  async unsaveRecipe(
    recipeId: Types.ObjectId,
    { sub }: JwtPayload,
  ): Promise<Recipe> {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const recipe = await this.recipeService.findOne(recipeId);
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist');
    }

    const foundIndex: number = user.savedRecipesId.findIndex(
      (id: Types.ObjectId) => {
        return id === recipeId;
      },
    );
    if (foundIndex < 0) {
      throw new NotFoundException('Recipe not found');
    }

    user.savedRecipesId.splice(foundIndex, 1);
    await user.save();

    return recipe;
  }

  async saveEatingPlan(
    eatingPlanId: Types.ObjectId,
    { sub }: JwtPayload,
  ): Promise<EatingPlan> {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const eatingPlan = await this.eatingPlanService.findOne(eatingPlanId);
    if (!eatingPlan) {
      throw new NotFoundException('Eating plan does not exist');
    }
    if (eatingPlan.userId === sub) {
      throw new BadRequestException('Eating plan is yours and cannot be saved');
    }

    const isSaved = user.savedEatingPlansId.some(
      (id: Types.ObjectId) => id === eatingPlanId,
    );
    if (!isSaved) {
      user.savedEatingPlansId.push(eatingPlanId);
      await user.save();
    }

    return eatingPlan;
  }

  async unsaveEatingPlan(
    eatingPlanId: Types.ObjectId,
    { sub }: JwtPayload,
  ): Promise<EatingPlan> {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const eatingPlan = await this.eatingPlanService.findOne(eatingPlanId);
    if (!eatingPlan) {
      throw new NotFoundException('Eating plan does not exist');
    }

    const foundIndex = user.savedEatingPlansId.findIndex(
      (id: Types.ObjectId) => {
        return id === eatingPlanId;
      },
    );
    if (foundIndex < 0) {
      throw new NotFoundException('Eating plan not found');
    }

    user.savedEatingPlansId.splice(foundIndex, 1);
    await user.save();

    return eatingPlan;
  }

  async getFollowedUsersById(id: Types.ObjectId): Promise<User[]> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return await this.userModel.find({
      _id: { $in: user.followedUsers },
    });
  }

  async followUser(username: string, { sub }: JwtPayload): Promise<User> {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const userToFollow = await this.userModel.findOne({ username });
    if (!userToFollow) {
      throw new NotFoundException('The user to follow does not exist');
    }

    const isAlreadyFollowed: boolean = user.followedUsers.some(
      (id: Types.ObjectId) => {
        return userToFollow._id.equals(id);
      },
    );
    if (userToFollow._id === sub || isAlreadyFollowed) {
      return userToFollow;
    }

    user.followedUsers.push(userToFollow._id.toString());
    await user.save();

    return userToFollow;
  }

  async unfollowUser(username: string, { sub }: JwtPayload): Promise<User> {
    const user = await this.userModel.findById(sub);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const followedUser = await this.userModel.findOne({ username });
    if (!followedUser) {
      throw new NotFoundException('The user to follow does not exist');
    }

    const foundIndex = user.followedUsers.findIndex((id: Types.ObjectId) => {
      return followedUser._id.equals(id);
    });
    if (followedUser._id === sub || foundIndex < 0) {
      return followedUser;
    }

    user.followedUsers.splice(foundIndex, 1);
    await user.save();

    return followedUser;
  }
}
