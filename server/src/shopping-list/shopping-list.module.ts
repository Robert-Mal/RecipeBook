import { ShoppingListResolver } from './shopping-list.resolver';
import { ShoppingListService } from './shopping-list.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  ShoppingListSchema,
  ShoppingList,
} from './schemas/shopping-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingList.name, schema: ShoppingListSchema },
    ]),
  ],
  providers: [ShoppingListService, ShoppingListResolver],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}
