import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import {
  GET_PRIVATE_RECIPES,
  GET_PROFILE_INFO,
  GET_RECIPE,
} from "../GraphQL/Queries";
import ReactMarkdown from "react-markdown";
import { REMOVE_RECIPE } from "../GraphQL/Mutations";
import { toast } from "react-toastify";
import Recipe from "../shared/types/recipe.type";
import Ingredient from "../shared/types/ingredient.type";
import timePassed from "../shared/utils/timePassed";

const PrivateRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  const { data, loading: profileLoading } = useQuery(GET_PROFILE_INFO);
  const { loading } = useQuery(GET_PRIVATE_RECIPES, {
    onCompleted: (data) => {
      if (data.me.privateRecipes.length) {
        const privateRecipe = data.me.privateRecipes.find(
          (recipe: Recipe) => recipe._id === id
        );
        setRecipe(privateRecipe);
      }
    },
  });
  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [
      { query: GET_PRIVATE_RECIPES },
      { query: GET_RECIPE, variables: { id } },
    ],
    onCompleted: () => {
      toast.success("Recipe deleted");
      navigate("/dashboard/recipes", { replace: true });
    },
  });
  const navigate = useNavigate();

  if (loading || profileLoading) {
    return <Loader />;
  }

  if (!recipe || !data) {
    return (
      <div className="flex w-full h-full items-center justify-center font-semibold text-2xl">
        Recipe does not exist
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-10 pr-16 mx-auto overflow-x-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-5xl font-semibold mb-3 mr-5">{recipe.name}</p>
          <div className="flex items-center font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            Private
          </div>
        </div>
        <div className="flex">
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
                <ul className="text-left border rounded mt-1">
                  <li
                    onClick={() =>
                      navigate("/dashboard/recipe/private/edit/" + id)
                    }
                    className="flex items-center w-40 py-2 px-3 hover:bg-gray-100 border-b"
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit recipe
                  </li>
                  <li
                    className="flex items-center w-40 py-2 px-3 hover:bg-gray-100 border-b"
                    onClick={() => {
                      removeRecipe();
                    }}
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
                    Delete recipe
                  </li>
                </ul>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="pl-5 mb-4 text-sm">
        <Link to={`/dashboard/user/${recipe.username}`} className="mr-5">
          Made by:{" "}
          <b>
            <u>{recipe.username}</u>
          </b>
        </Link>
        <span>Created: {timePassed(recipe.createdAt)}</span>
      </div>
      {recipe.description ? (
        <ReactMarkdown children={recipe.description} className="prose mb-5" />
      ) : null}
      <div className="flex mb-5">
        {recipe.estimatedTime ? (
          <div className="bg-gray-900 text-white text-sm rounded-full py-2 px-3 mr-2">
            Time: {recipe.estimatedTime}
          </div>
        ) : null}
        {recipe.difficulty ? (
          <div className="bg-gray-900 text-white text-sm rounded-full py-2 px-3">
            Difficulty: {recipe.difficulty}
          </div>
        ) : null}
      </div>
      <div className="flex mb-5">
        {recipe.ingredients.length ? (
          <div className="mr-24">
            <p className="text-xl font-semibold mb-2">Ingredients: </p>
            <ul>
              {recipe.ingredients.map(
                (ingredient: Ingredient, index: number) => (
                  <li key={index}>
                    {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                  </li>
                )
              )}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="text-xl font-semibold">Instructions: </p>
          <ReactMarkdown children={recipe.instructions} className="prose" />
        </div>
      </div>
      {recipe.thumbnail ? (
        <div className="flex">
          <img
            src={
              import.meta.env.VITE_SERVER_URL + "/public/" + recipe.thumbnail
            }
            className="w-96 h-96"
          />
        </div>
      ) : null}
    </div>
  );
};

export default PrivateRecipe;
