import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { REMOVE_SHOPPING_LIST } from "../GraphQL/ShoppingLists/Mutations";
import {
  GET_SHOPPING_LIST,
  GET_SHOPPING_LISTS,
} from "../GraphQL/ShoppingLists/Queries";
import Ingredient from "../shared/types/ingredient.type";
import timePassed from "../shared/utils/timePassed";

const ShoppingList = () => {
  const { id } = useParams();
  const {
    client,
    data: shoppingList,
    loading: shoppingListLoading,
  } = useQuery(GET_SHOPPING_LIST, {
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    variables: { id },
  });
  const [removeShoppingList] = useMutation(REMOVE_SHOPPING_LIST, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_SHOPPING_LISTS }],
    onCompleted: () => {
      toast.success("Shopping list deleted");
      navigate("/dashboard/shoppingLists", { replace: true });
    },
  });
  const navigate = useNavigate();

  if (shoppingListLoading) {
    return <Loader />;
  }

  if (!shoppingList) {
    return (
      <div className="flex w-full h-full items-center justify-center font-semibold text-2xl">
        Shopping list does not exist
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-10 pr-24">
      <div className="flex items-center justify-between mb-3">
        <p className="text-5xl font-semibold">
          {shoppingList.shoppingList.name}
        </p>
        <div className="relative flex items-center">
          <button className="relative flex justify-center items-center py-2 px-3 rounded focus:outline-none focus:ring ring-gray-200 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
              />
            </svg>
            <div className="absolute hidden top-full group-focus:block">
              <ul className="text-left w-52 border rounded mt-1">
                <li className="flex items-center w-full py-2 px-3 hover:bg-gray-100 border-b">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit shopping list
                </li>
                <li
                  onClick={() => removeShoppingList()}
                  className="flex items-center w-full py-2 px-3 hover:bg-gray-100 border-b"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete shopping list
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
      <p className="text-sm pl-5 mb-9">
        Created: {timePassed(shoppingList.shoppingList.createdAt)}
      </p>
      <p className="text-xl font-semibold mb-2">Ingredients: </p>
      <ul className="flex flex-col gap-y-1 pl-3">
        {shoppingList.shoppingList.ingredients.map(
          (ingredient: Ingredient, index: number) => (
            <li key={index}>
              {ingredient.name}: {ingredient.quantity} {ingredient.unit}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ShoppingList;
