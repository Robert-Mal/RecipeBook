import { CreateShoppingListInput } from './dto/create-shopping-list.input';
import { GqlAuthGuard } from './../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from './schemas/shopping-list.schema';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Types } from 'mongoose';
import { UpdateShoppingListInput } from './dto/update-shopping-list.input';

@Resolver(() => ShoppingList)
@UseGuards(GqlAuthGuard)
export class ShoppingListResolver {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Query(() => [ShoppingList], { name: 'shoppingLists' })
  async findAll(@CurrentUser() { sub }: JwtPayload): Promise<ShoppingList[]> {
    return await this.shoppingListService.findAllByUserId(sub);
  }

  @Query(() => ShoppingList, { name: 'shoppingList' })
  async findOne(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<ShoppingList> {
    return await this.shoppingListService.findOne(id, user);
  }

  @Mutation(() => ShoppingList)
  async createShoppingList(
    @Args('createShoppingListInput')
    createShoppingListInput: CreateShoppingListInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<ShoppingList> {
    return await this.shoppingListService.create(createShoppingListInput, user);
  }

  @Mutation(() => ShoppingList)
  async updateShoppingList(
    @Args('updateShoppingListInput')
    updateShoppingListInput: UpdateShoppingListInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<ShoppingList> {
    return await this.shoppingListService.update(updateShoppingListInput, user);
  }

  @Mutation(() => ShoppingList)
  async removeShoppingList(
    @Args('id', { type: () => String }) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload,
  ): Promise<ShoppingList> {
    return await this.shoppingListService.remove(id, user);
  }
}
