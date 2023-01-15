import { ShoppingListModule } from './../shopping-list/shopping-list.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RecipeModule } from '../recipe/recipe.module';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { EatingPlanModule } from '../eating-plan/eating-plan.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => RecipeModule),
    forwardRef(() => EatingPlanModule),
    ShoppingListModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
