import { useMutation, useQuery } from "@apollo/client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { CREATE_SHOPPING_LIST } from "../GraphQL/ShoppingLists/Mutations";
import {
  GET_MY_RECIPES_AND_EATING_PLANS,
  GET_SHOPPING_LISTS,
} from "../GraphQL/ShoppingLists/Queries";
import EatingPlan from "../shared/types/eating-plan.type";
import Ingredient from "../shared/types/ingredient.type";
import Recipe from "../shared/types/recipe.type";

type AddedItem = {
  id: string;
  name: string;
  multiplier: number;
  ingredients: Ingredient[];
};

const NewShoppingList = () => {
  const {
    data: myRecipesAndEatingPlans,
    loading: myRecipesAndEatingPlansLoading,
  } = useQuery(GET_MY_RECIPES_AND_EATING_PLANS, {
    onCompleted: (data) => {
      const allRecipes: Recipe[] = [...data.me.recipes]
        .concat([...data.me.privateRecipes])
        .concat([...data.me.savedRecipes]);
      allRecipes.sort((recipe1: Recipe, recipe2: Recipe) =>
        recipe1.name.localeCompare(recipe2.name)
      );
      setRecipes(allRecipes);
      const allEatingPlans: EatingPlan[] = [...data.me.eatingPlans].concat(
        [...data.me.privateEatingPlans].concat([...data.me.savedEatingPlans])
      );
      allEatingPlans.sort((eatingPlan1: EatingPlan, eatingPlan2: EatingPlan) =>
        eatingPlan1.name.localeCompare(eatingPlan2.name)
      );
      setEatingPlans(allEatingPlans);
    },
  });
  const [createShoppingList] = useMutation(CREATE_SHOPPING_LIST, {
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_SHOPPING_LISTS }],
    onCompleted: (data) => {
      toast.success("Shopping list created");
      navigate("/dashboard/shoppingList/" + data.createShoppingList._id, {
        replace: true,
      });
    },
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [eatingPlans, setEatingPlans] = useState<EatingPlan[]>([]);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [summary, setSummary] = useState<Ingredient[]>([]);
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });
  const watchIngredients = watch("ingredients");
  const navigate = useNavigate();

  useEffect(() => {
    createSummary();
  }, [addedItems, watchIngredients]);

  const onSubmit = (data: any) => {
    if (!summary.length) {
      toast.info("Cannot create empty shopping list");
      return;
    }
    const newIngredients: any[] = [...summary];
    for (const ingredient of newIngredients) {
      delete ingredient.__typename;
    }
    data.ingredients = [...summary];
    createShoppingList({ variables: { createShoppingListInput: data } });
  };

  const addRecipeToShoppingList = (recipe: Recipe) => {
    const foundRecipeIdInShoppingList = addedItems.findIndex(
      (addedItem: AddedItem) => addedItem.id === recipe._id
    );
    if (foundRecipeIdInShoppingList >= 0) {
      const newAddedItems = [...addedItems];
      newAddedItems[foundRecipeIdInShoppingList].multiplier += 1;
      setAddedItems(newAddedItems);
      return;
    }

    let ingredients: Ingredient[] = [];
    for (const ingredient of recipe.ingredients) {
      ingredients = ingredients.concat({ ...ingredient });
    }

    setAddedItems([
      ...addedItems,
      {
        id: recipe._id,
        name: recipe.name,
        multiplier: 1,
        ingredients: ingredients,
      },
    ]);
  };

  const addEatingPlanToShoppingList = (eatingPlan: EatingPlan) => {
    const foundEatingPlanIdInShoppingList = addedItems.findIndex(
      (addedItem: AddedItem) => addedItem.id === eatingPlan._id
    );
    if (foundEatingPlanIdInShoppingList >= 0) {
      const newAddedItems = [...addedItems];
      newAddedItems[foundEatingPlanIdInShoppingList].multiplier += 1;
      setAddedItems(newAddedItems);
      return;
    }

    let ingredients: Ingredient[] = [];
    for (const meal of eatingPlan.meals) {
      for (const recipe of meal.recipes) {
        for (const ingredient of recipe.ingredients) {
          ingredients = ingredients.concat({ ...ingredient });
        }
      }
    }

    setAddedItems([
      ...addedItems,
      {
        id: eatingPlan._id,
        name: eatingPlan.name,
        multiplier: 1,
        ingredients: ingredients,
      },
    ]);
  };

  const removeItemFromAddedItems = (index: number) => {
    const newAddedItems = [...addedItems];
    newAddedItems.splice(index, 1);
    setAddedItems(newAddedItems);
  };

  const removeIngredientFromAddedItem = (
    itemIndex: number,
    ingredientIndex: number
  ) => {
    const newAddedItems = [...addedItems];
    newAddedItems[itemIndex].ingredients.splice(ingredientIndex, 1);
    setAddedItems(newAddedItems);
    if (!newAddedItems[itemIndex].ingredients.length) {
      removeItemFromAddedItems(itemIndex);
    }
  };

  const changeMultiplier = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (+e.target.value <= 0) {
      return;
    }
    const newAddedItems = [...addedItems];
    newAddedItems[index].multiplier = +e.target.value;
    setAddedItems(newAddedItems);
  };

  const changeIngredientQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    itemIndex: number,
    ingredientIndex: number
  ) => {
    if (+e.target.value <= 0) {
      return;
    }
    const newAddedItems = [...addedItems];
    newAddedItems[itemIndex].ingredients[ingredientIndex].quantity =
      +e.target.value;
    setAddedItems(newAddedItems);
  };

  const createSummary = () => {
    let ingredients: Ingredient[] = [];
    for (const addedItem of addedItems) {
      for (const ingredient of addedItem.ingredients) {
        const newIngredient = { ...ingredient };
        newIngredient.quantity *= addedItem.multiplier;
        ingredients = ingredients.concat(newIngredient);
      }
    }
    if (watchIngredients) {
      for (const ingredient of watchIngredients) {
        if (ingredient.name && ingredient.quantity) {
          ingredients = ingredients.concat({ ...ingredient });
        }
      }
    }
    if (ingredients.length) {
      const ingredientsReduced = ingredients.reduce((previous, current) => {
        const groupKey = current.name.toLowerCase();
        const group = previous[groupKey] || [];
        if (group.length) {
          for (const item of group) {
            if (item.unit === current.unit) {
              item.quantity += current.quantity;
              return { ...previous, [groupKey]: group };
            }
          }
        }
        group.push(current);
        return { ...previous, [groupKey]: group };
      }, {});
      setSummary(Object.values(ingredientsReduced).flat());
      return Object.values(ingredientsReduced).flat();
    }
    setSummary(ingredients);
    return ingredients;
  };

  if (myRecipesAndEatingPlansLoading) {
    return <Loader />;
  }

  if (!myRecipesAndEatingPlans) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full p-10 overflow-y-auto">
      <p className="text-4xl font-semibold">Create Shopping List</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5"
      >
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="shadow appearance-none border rounded mt-5 mx-5 mb-2 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-10"
            {...register("name", { required: true })}
          />
          {errors.name ? (
            <p className="text-red-500 text-sm ml-9">This field is required</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <p className="text-xl font-semibold mb-5">Add recipes</p>
          <ul className="flex flex-wrap h-full w-full p-5 overflow-y-auto shadow-inner rounded-lg bg-gray-100">
            {recipes.length ? (
              recipes.map((recipe: Recipe, index: number) => (
                <li
                  key={index}
                  className="relative flex h-min mb-2 mr-2 rounded shadow cursor-pointer group"
                >
                  {recipe.thumbnail ? (
                    <img
                      src={
                        import.meta.env.VITE_SERVER_URL +
                        "/public/" +
                        recipe.thumbnail
                      }
                      className="w-36 h-36"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-36 h-36"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  <div className="absolute bottom-0 flex items-end h-1/2 pl-2 pt-2 pb-1 bg-gradient-to-t text-white from-gray-400 w-full">
                    <span className="text-white truncate">{recipe.name}</span>
                  </div>
                  <div
                    onClick={() => addRecipeToShoppingList(recipe)}
                    className="hidden absolute h-full w-full backdrop-blur-sm group-hover:block"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-1/2 h-1/2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>You have not created any recipe yet</p>
            )}
          </ul>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-semibold mb-5">Add eating plan</p>
          <ul className="flex flex-wrap h-full w-full p-5 gap-x-5 gap-y-2 overflow-y-auto shadow-inner rounded-lg bg-gray-100">
            {eatingPlans.length ? (
              eatingPlans.map((eatingPlan: EatingPlan, index: number) => (
                <li
                  key={index}
                  className="flex relative items-center w-48 pr-2 bg-white rounded group"
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-14 h-14 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>
                  <p className="font-semibold truncate">{eatingPlan.name}</p>
                  <div
                    onClick={() => addEatingPlanToShoppingList(eatingPlan)}
                    className="hidden absolute h-full w-full backdrop-blur-sm group-hover:block"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-1/2 h-1/2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div>You have not created any eating plan yet</div>
            )}
          </ul>
        </div>

        <div>
          <p className="text-xl font-semibold mb-4">Added Items</p>
          {addedItems.map((addedItem: AddedItem, itemIndex: number) => (
            <div key={itemIndex} className="flex flex-col mb-4">
              <div className="flex flex-col">
                <div className="flex gap-x-3">
                  <p className="mr-2 text-lg">{addedItem.name}</p>
                  <input
                    type="number"
                    value={addedItem.multiplier}
                    onChange={(e) => changeMultiplier(e, itemIndex)}
                    className="w-16 shadow rounded"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    onClick={() => removeItemFromAddedItems(itemIndex)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <ul className="flex flex-col gap-y-2 ml-5 pt-2 border-l">
                  {addedItem.ingredients.map(
                    (ingredient: Ingredient, ingredientIndex: number) => (
                      <li key={ingredientIndex} className="flex gap-2 p-2">
                        {ingredient.name}
                        <input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) =>
                            changeIngredientQuantity(
                              e,
                              itemIndex,
                              ingredientIndex
                            )
                          }
                          className="w-16 shadow rounded"
                        />
                        x {addedItem.multiplier} ={" "}
                        {ingredient.quantity * addedItem.multiplier}{" "}
                        {ingredient.unit}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                          onClick={() =>
                            removeIngredientFromAddedItem(
                              itemIndex,
                              ingredientIndex
                            )
                          }
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xl font-semibold mb-5">Add ingredients</p>
          <div className="flex mb-4 items-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                append({});
              }}
              className="flex px-2 items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <p className="block text-gray-700 font-bold">Add Ingredient</p>
            </div>
          </div>
          <ul className="pl-7">
            {fields.map((field, index) => (
              <li
                key={field.id}
                className="flex items-start gap-5 w-3/4 h-min mb-5"
              >
                <div className="w-1/3">
                  <input
                    type="text"
                    placeholder="Name"
                    className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-full h-10"
                    {...register(`ingredients.${index}.name`, {
                      required: true,
                      onChange: () => {
                        createSummary();
                      },
                    })}
                  />
                  {errors.ingredients?.[index]?.name ? (
                    <p className="text-red-500 text-sm ml-3 mt-2">
                      This field is required
                    </p>
                  ) : null}
                </div>
                <div className="w-1/3">
                  <input
                    type="number"
                    step={0.1}
                    placeholder="Quantity"
                    className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-full h-10"
                    {...register(`ingredients.${index}.quantity`, {
                      required: true,
                      valueAsNumber: true,
                      min: 0.1,
                      onChange: () => {
                        createSummary();
                      },
                    })}
                  />
                  {errors.ingredients?.[index]?.quantity?.type ===
                  "required" ? (
                    <p className="text-red-500 text-sm ml-3 mt-2">
                      This field is required
                    </p>
                  ) : null}
                  {errors.ingredients?.[index]?.quantity?.type === "min" ? (
                    <p className="text-red-500 text-sm ml-3 mt-2">
                      This must be greater than 0
                    </p>
                  ) : null}
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    placeholder="Unit (optional)"
                    className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-full h-10"
                    {...register(`ingredients.${index}.unit`)}
                  />
                </div>
                <div className="flex items-center h-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => remove(index)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xl font-semibold mb-2">Summary</p>
          <ul className="flex flex-col gap-2 pl-2">
            {summary.map((item: Ingredient, index: number) => (
              <li key={index}>
                {item.name}: {item.quantity} {item.unit}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="mb-5 text-lg font-semibold bg-gray-800 w-96 text-white rounded-lg px-6 py-3 block shadow-xl hover:text-white hover:bg-black"
        >
          Create Shopping List
        </button>
      </form>
    </div>
  );
};

export default NewShoppingList;
