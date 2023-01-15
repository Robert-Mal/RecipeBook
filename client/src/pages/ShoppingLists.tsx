import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { GET_SHOPPING_LISTS } from "../GraphQL/ShoppingLists/Queries";
import ShoppingList from "../shared/types/shopping-list.types";
import timePassed from "../shared/utils/timePassed";

const ShoppingLists = () => {
  const { loading: shoppingListsLoading } = useQuery(GET_SHOPPING_LISTS, {
    onCompleted: (data) => {
      setShoppingLists([...data.me.shoppingLists].reverse());
    },
  });
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  if (shoppingListsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full h-full p-10">
      <div className="flex w-full justify-between mb-16">
        <span className="text-5xl font-semibold">Shopping Lists</span>
        <Link to="/dashboard/shoppingList/new">
          <button className="flex items-center bg-gray-900 text-white font-semibold py-2 px-3 h-min rounded transition hover:scale-105">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Shopping List
          </button>
        </Link>
      </div>

      {shoppingLists.length ? (
        <div className="flex flex-wrap gap-x-10 gap-y-2 pl-3 overflow-y-auto">
          {shoppingLists.map((shoppingList: ShoppingList) => (
            <Link
              key={shoppingList._id}
              to={"/dashboard/shoppingList/" + shoppingList._id}
              className="flex w-64 h-14 shadow-md rounded my-2 transition hover:scale-110 cursor-pointer"
            >
              <div className="flex items-center px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>

              <div className="flex flex-col justify-between px-2 py-1 truncate">
                <span className="font-semibold truncate">
                  {shoppingList.name}
                </span>

                <span className="text-xs">
                  Created: {timePassed(shoppingList.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-xl font-semibold">
            There is no shopping lists for now
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingLists;
