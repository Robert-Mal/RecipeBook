import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { GET_ME, GET_SAVED_RECIPES } from "../GraphQL/Queries";
import { toast } from "react-toastify";
import Recipe from "../shared/types/recipe.type";

const Recipes = () => {
  const { loading } = useQuery(GET_ME, {
    onError: () => {
      toast.error("Something went wrong. Try again later");
    },
    onCompleted: (data) => {
      const publicRecipes = data.me.recipes;
      const privateRecipes = data.me.privateRecipes;
      let recipes = publicRecipes.concat(privateRecipes);
      recipes = recipes.sort((recipe1: Recipe, recipe2: Recipe) => {
        if (+recipe1.createdAt < +recipe2.createdAt) {
          return 1;
        }
        if (+recipe1.createdAt > +recipe2.createdAt) {
          return -1;
        }
        return 0;
      });
      setRecipes(recipes);
    },
  });
  const { loading: savedRecipesLoading, data: savedRecipes } =
    useQuery(GET_SAVED_RECIPES);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tab, setTab] = useState<string>("own");
  const navigate = useNavigate();

  if (loading || savedRecipesLoading) {
    <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="flex justify-between mb-10">
        <span className="text-5xl font-semibold">Recipes</span>
        <Link id="link-create-recipe" to="/dashboard/recipe/new">
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
            Create Recipe
          </button>
        </Link>
      </div>
      <div className="flex">
        <div
          onClick={() => setTab("own")}
          className={
            "flex items-center justify-center w-64 py-2 px-3 border-b-2 transition-colors duration-200 cursor-pointer" +
            (tab === "own" ? " border-black" : " border-white text-gray-500")
          }
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
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          Own
        </div>
        <div
          onClick={() => setTab("saved")}
          className={
            "flex items-center justify-center w-64 py-2 px-3 border-b-2 transition-colors duration-200 cursor-pointer" +
            (tab === "saved" ? " border-black" : " border-white text-gray-500")
          }
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          Saved
        </div>
      </div>
      {tab === "own" ? (
        recipes.length ? (
          <div className="flex flex-wrap h-min pt-2 overflow-auto">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="flex w-40 h-40 relative shadow-md rounded m-2 transition hover:scale-110 cursor-pointer"
                onClick={() =>
                  recipe.isPublic
                    ? navigate(`/dashboard/recipe/${recipe._id}`)
                    : navigate(`/dashboard/recipe/private/${recipe._id}`)
                }
              >
                {recipe.thumbnail ? (
                  <img
                    src={
                      import.meta.env.VITE_SERVER_URL +
                      "/public/" +
                      recipe.thumbnail
                    }
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex w-40 h-40 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-20 h-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                )}
                {!recipe.isPublic ? (
                  <div className="absolute top-1 right-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  </div>
                ) : null}
                <div className="absolute bottom-0 flex items-end h-1/2 pl-2 pt-2 pb-1 bg-gradient-to-t text-white from-gray-400 w-full">
                  <span className="text-white truncate">{recipe.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-xl font-semibold">There is no recipes for now</p>
          </div>
        )
      ) : savedRecipes.me.savedRecipes.length ? (
        <div className="flex flex-wrap h-min pt-2 overflow-auto">
          {savedRecipes.me.savedRecipes.map((recipe: Recipe) => (
            <Link
              to={`/dashboard/recipe/${recipe._id}`}
              key={recipe._id}
              className="flex w-40 h-40 relative shadow-md rounded m-2 transition hover:scale-110"
            >
              {recipe.thumbnail ? (
                <img
                  src={
                    import.meta.env.VITE_SERVER_URL +
                    "/public/" +
                    recipe.thumbnail
                  }
                  className="w-full h-full"
                />
              ) : (
                <div className="flex w-40 h-40 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-20 h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-0 flex items-end h-1/2 pl-2 pt-2 pb-1 bg-gradient-to-t text-white from-gray-400 w-full overflow-hidden">
                <span className="text-white">{recipe.name}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-xl font-semibold">
            There is no saved recipes for now
          </p>
        </div>
      )}
    </div>
  );
};

export default Recipes;
