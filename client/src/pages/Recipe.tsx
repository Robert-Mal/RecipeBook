import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ME,
  GET_PRIVATE_RECIPES,
  GET_PROFILE_INFO,
  GET_RECIPE,
  GET_SAVED_RECIPES,
} from "../GraphQL/Queries";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  REMOVE_RECIPE,
  SAVE_RECIPE,
  UNSAVE_RECIPE,
} from "../GraphQL/Mutations";
import Ingredient from "../shared/types/ingredient.type";
import timePassed from "../shared/utils/timePassed";

type Recipe = {
  _id: string;
};

const Recipe = () => {
  const { id } = useParams<string>();
  const { data: profile, loading: profileLoading } = useQuery(GET_PROFILE_INFO);
  const { loading, data } = useQuery(GET_RECIPE, {
    variables: { id },
  });
  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [
      { query: GET_ME },
      { query: GET_RECIPE, variables: { id } },
      { query: GET_PRIVATE_RECIPES },
    ],
    onCompleted: () => {
      toast.success("Recipe deleted");
      navigate("/dashboard/recipes", { replace: true });
    },
  });
  const [saveRecipe] = useMutation(SAVE_RECIPE, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_SAVED_RECIPES }],
  });
  const [unsaveRecipe] = useMutation(UNSAVE_RECIPE, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_SAVED_RECIPES }],
  });
  const { loading: savedRecipeLoading } = useQuery(GET_SAVED_RECIPES, {
    onCompleted: (data) => {
      const found = data.me.savedRecipes.some((recipe: Recipe) => {
        return recipe._id === id;
      });
      setIsSaved(found);
    },
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const navigate = useNavigate();

  if (loading || profileLoading || savedRecipeLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="flex w-full h-full items-center justify-center font-semibold text-2xl">
        Recipe does not exist
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-10 pr-16 overflow-x-auto">
      <div className="flex items-center justify-between">
        <p data-cy="name" className="text-5xl font-semibold mb-3">
          {data.recipe.name}
        </p>
        <div className="flex">
          {profile ? (
            <>
              {data.recipe.username !== profile.me.username ? (
                !isSaved ? (
                  <button
                    onClick={() => saveRecipe()}
                    className="flex bg-gray-900 text-white h-min py-2 px-3 rounded transition hover:scale-110"
                  >
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
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => unsaveRecipe()}
                    className="flex items-center px-3 py-2 shadow rounded transition hover:scale-110"
                  >
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
                        d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
                      />
                    </svg>
                    Unsave
                  </button>
                )
              ) : (
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
                            navigate("/dashboard/recipe/edit/" + id)
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
              )}
            </>
          ) : null}
        </div>
      </div>
      <div className="pl-5 mb-4 text-sm">
        <Link to={`/dashboard/user/${data.recipe.username}`} className="mr-5">
          Made by:{" "}
          <b>
            <u>{data.recipe.username}</u>
          </b>
        </Link>
        <span>Created: {timePassed(data.recipe.createdAt)}</span>
      </div>
      {data.recipe.description ? (
        <ReactMarkdown
          children={data.recipe.description}
          className="prose mb-5"
        />
      ) : null}
      <div className="flex mb-5">
        {data.recipe.estimatedTime ? (
          <div className="bg-gray-900 text-white text-sm rounded-full py-2 px-3 mr-2">
            Time: {data.recipe.estimatedTime}
          </div>
        ) : null}
        {data.recipe.difficulty ? (
          <div className="bg-gray-900 text-white text-sm rounded-full py-2 px-3">
            Difficulty: {data.recipe.difficulty}
          </div>
        ) : null}
      </div>
      <div className="flex mb-5">
        {data.recipe.ingredients.length ? (
          <div className="mr-24">
            <p className="text-xl font-semibold mb-2">Ingredients: </p>
            <ul>
              {data.recipe.ingredients.map(
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
          <ReactMarkdown
            children={data.recipe.instructions}
            className="prose"
          />
        </div>
      </div>
      {data.recipe.thumbnail ? (
        <div className="flex">
          <img
            src={
              import.meta.env.VITE_SERVER_URL +
              "/public/" +
              data.recipe.thumbnail
            }
            className="w-96 h-96"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Recipe;
