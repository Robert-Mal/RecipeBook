import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EatingPlan, EatingPlanSchema } from './schemas/eating-plan.schema';
import { EatingPlanService } from './eating-plan.service';
import { EatingPlanResolver } from './eating-plan.resolver';
import { UserModule } from '../user/user.module';
import { RecipeModule } from '../recipe/recipe.module';
import { MealResolver } from './meal.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EatingPlan.name, schema: EatingPlanSchema },
    ]),
    RecipeModule,
    forwardRef(() => UserModule),
  ],
  providers: [EatingPlanService, EatingPlanResolver, MealResolver],
  exports: [EatingPlanService],
})
export class EatingPlanModule {}
