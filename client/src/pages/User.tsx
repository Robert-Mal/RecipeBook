import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import {
  GET_FOLLOWED_USERS,
  GET_PROFILE_INFO,
  GET_USER,
} from "../GraphQL/Queries";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Recipe from "../shared/types/recipe.type";
import { FOLLOW_USER, UNFOLLOW_USER } from "../GraphQL/Mutations";
import { toast } from "react-toastify";
import EatingPlan from "../shared/types/eating-plan.type";
import timePassed from "../shared/utils/timePassed";

type FollowedUser = {
  username: string;
};

const User = () => {
  const { username } = useParams();
  const { loading, data } = useQuery(GET_USER, {
    variables: {
      username,
    },
    onCompleted: (data) => {
      const allRecipes = [...data.user.recipes];
      const sortedRecipes = allRecipes.sort(
        (recipe1: Recipe, recipe2: Recipe) => {
          if (+recipe1.createdAt < +recipe2.createdAt) {
            return 1;
          }
          if (+recipe1.createdAt > +recipe2.createdAt) {
            return -1;
          }
          return 0;
        }
      );
      setRecipes(sortedRecipes);
      const allEatingPlans = [...data.user.eatingPlans].reverse();
      setEatingPlans(allEatingPlans);
    },
  });
  const { data: profileInfo, loading: profileInfoLoading } =
    useQuery(GET_PROFILE_INFO);
  const [tab, setTab] = useState<string>("recipes");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [eatingPlans, setEatingPlans] = useState<EatingPlan[]>([]);
  const { loading: followedUsersLoading } = useQuery(GET_FOLLOWED_USERS, {
    onCompleted: (data) => {
      const isFound = data.me.followedUsers.find((user: FollowedUser) => {
        return user.username === username;
      });
      setIsUserFollowed(isFound);
    },
  });
  const [followUser] = useMutation(FOLLOW_USER, {
    variables: { username },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    onCompleted: () => {
      localStorage.removeItem("homeScrollPosition");
    },
    refetchQueries: [{ query: GET_FOLLOWED_USERS }],
  });
  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: { username },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    onCompleted: () => {
      localStorage.removeItem("homeScrollPosition");
    },
    refetchQueries: [{ query: GET_FOLLOWED_USERS }],
  });
  const [isUserFollowed, setIsUserFollowed] = useState<boolean>(false);
  const navigate = useNavigate();

  if (loading || profileInfoLoading || followedUsersLoading) {
    <Loader />;
  }

  if (!data) {
    return (
      <div className="flex w-full h-full items-center justify-center font-semibold text-2xl">
        User does not exist
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full px-10 py-10 overflow-x-auto">
      <div className="flex h-min justify-between">
        <div className="flex h-min items-center">
          {data.user.avatar ? (
            <img
              src={
                import.meta.env.VITE_SERVER_URL + "/public/" + data.user.avatar
              }
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-24 h-24 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          <p className="text-3xl font-semibold ml-10">{data.user.username}</p>
        </div>
        {profileInfo ? (
          !(data.user.username === profileInfo.me.username) ? (
            <>
              {isUserFollowed ? (
                <button
                  onClick={() => unfollowUser()}
                  className="flex items-center py-2 px-3 h-min rounded shadow transition hover:scale-110"
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
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => followUser()}
                  className="flex items-center bg-gray-900 text-white font-semibold py-2 px-3 h-min rounded transition hover:scale-110"
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Follow
                </button>
              )}
            </>
          ) : null
        ) : null}
      </div>
      {data.user.bio ? (
        <ReactMarkdown children={data.user.bio} className="prose mt-5 mb-20" />
      ) : null}
      <div className="flex">
        <div
          onClick={() => setTab("recipes")}
          className={
            "flex items-center justify-center w-64 py-2 px-3 border-b-2 transition-colors duration-200 cursor-pointer" +
            (tab === "recipes"
              ? " border-black"
              : " border-white text-gray-500")
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
          Recipes
        </div>
        <div
          onClick={() => setTab("eatingPlans")}
          className={
            "flex items-center justify-center w-64 py-2 px-3 border-b-2 transition-colors duration-200 cursor-pointer" +
            (tab === "eatingPlans"
              ? " border-black"
              : " border-white text-gray-500")
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            />
          </svg>
          Eating Plans
        </div>
      </div>
      <div className="flex flex-wrap h-min pt-2">
        {tab === "recipes" ? (
          recipes.length ? (
            recipes.map((recipe: Recipe) => (
              <Link key={recipe._id} to={"/dashboard/recipe/" + recipe._id}>
                <div className="flex w-40 h-40 relative shadow-md rounded m-2 transition hover:scale-110">
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
                    <div className="flex h-full w-full items-center justify-center">
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
                    <span className="text-white truncate">{recipe.name}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex w-full h-128 items-center justify-center">
              <p className="text-xl font-semibold">
                There is no recipes for now
              </p>
            </div>
          )
        ) : eatingPlans.length ? (
          eatingPlans.map((eatingPlan: EatingPlan) => (
            <div
              key={eatingPlan._id}
              className="flex w-64 shadow-md rounded m-2 transition hover:scale-110 cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/eatingPlan/${eatingPlan._id}`)
              }
            >
              <div className="w-min">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-14 h-14"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </div>

              <div className="flex flex-col justify-between px-3 py-1 truncate">
                <span className="font-semibold truncate">
                  {eatingPlan.name}
                </span>

                <span className="text-xs">
                  Created: {timePassed(eatingPlan.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex w-full h-128 items-center justify-center">
            <p className="text-xl font-semibold">
              There is no eating plans for now
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
