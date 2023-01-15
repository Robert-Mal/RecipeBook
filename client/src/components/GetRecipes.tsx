import React from "react";
import { useQuery } from "@apollo/client";
import { GET_RECIPES } from "../GraphQL/Queries";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";
import timePassed from "../shared/utils/timePassed";
import ReactMarkdown from "react-markdown";

type Prop = {
  like: string;
};

type Recipe = {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  username: string;
  createdAt: string;
};

const GetRecipes = ({ like }: Prop) => {
  const { loading, data } = useQuery(GET_RECIPES, {
    fetchPolicy: "no-cache",
    variables: { like },
    onError: () => {
      toast.error("Something went wrong. Try again later");
    },
  });
  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      {data.recipes.length ? (
        data.recipes.map((recipe: Recipe) => {
          return (
            <div
              key={recipe._id}
              onClick={() => navigate(`/dashboard/recipe/${recipe._id}`)}
              data-cy="searched-recipes"
              className="flex h-28 w-128 shadow-xl rounded mb-5 cursor-pointer transition hover:scale-105"
            >
              {recipe.thumbnail ? (
                <img
                  className="w-28 h-28"
                  src={`http://localhost:3000/public/${recipe.thumbnail}`}
                />
              ) : (
                <div className="flex w-36 h-28 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}
              <div className="flex w-full h-full flex-col justify-between py-2 px-5 truncate">
                <div className="w-full truncate">
                  <p className="text-xl font-bold truncate">{recipe.name}</p>
                  {recipe.description ? (
                    <ReactMarkdown
                      children={recipe.description}
                      className="prose text-gray-800 text-sm"
                    />
                  ) : null}
                </div>
                <div className="flex justify-between text-gray-800 text-xs">
                  <span>Made by: {recipe.username}</span>
                  <span>{timePassed(recipe.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="font-semibold mt-3">No results</div>
      )}
    </div>
  );
};

export default GetRecipes;
