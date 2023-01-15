import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import {
  GET_EATING_PLAN,
  GET_MY_EATING_PLANS,
} from "../GraphQL/EatingPlans/Queries";
import timePassed from "../shared/utils/timePassed";
import Meal from "../shared/types/meal.type";
import Recipe from "../shared/types/recipe.type";
import EatingPlanType from "../shared/types/eating-plan.type";
import { GET_PROFILE_INFO, GET_SAVED_EATING_PLANS } from "../GraphQL/Queries";
import {
  REMOVE_EATING_PLAN,
  SAVE_EATING_PLAN,
  UNSAVE_EATING_PLAN,
} from "../GraphQL/EatingPlans/Mutations";
import { toast } from "react-toastify";

type Day = {
  title: string;
  meals: {
    name: string;
    time: string;
    recipes: Recipe[];
  }[];
};

const EatingPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: profileInfo, loading: profileInfoLoading } =
    useQuery(GET_PROFILE_INFO);
  const { data: eatingPlan, loading: eatingPlanLoading } = useQuery(
    GET_EATING_PLAN,
    {
      variables: { id },
      onCompleted: (data) => {
        const meals = data.eatingPlan.meals;
        const numberOfDays = Math.max(...meals.map((meal: Meal) => meal.day));
        const newDays: Day[] = [];
        for (let i = 1; i <= numberOfDays; i++) {
          const day: Day = {
            title: `Day ${i}`,
            meals: [],
          };
          newDays.push(day);
        }
        for (const meal of meals) {
          newDays[meal.day - 1].meals.push({
            name: meal.name,
            time: meal.time,
            recipes: meal.recipes,
          });
        }
        setDays(newDays);
      },
    }
  );
  const [removeEatingPlan] = useMutation(REMOVE_EATING_PLAN, {
    variables: { id },
    refetchQueries: [{ query: GET_MY_EATING_PLANS }],
    onCompleted: () => {
      toast.success("Eating plan deleted");
      navigate("/dashboard/eatingPlans", { replace: true });
    },
  });
  const { loading: savedEatingPlansLoading } = useQuery(
    GET_SAVED_EATING_PLANS,
    {
      onCompleted: (data) => {
        const found = data.me.savedEatingPlans.some(
          (eatingPlan: EatingPlanType) => {
            return eatingPlan._id === id;
          }
        );
        setIsSaved(found);
      },
    }
  );
  const [saveEatingPlan] = useMutation(SAVE_EATING_PLAN, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_SAVED_EATING_PLANS }],
  });
  const [unsaveEatingPlan] = useMutation(UNSAVE_EATING_PLAN, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_SAVED_EATING_PLANS }],
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [days, setDays] = useState<Day[]>([]);

  if (profileInfoLoading || eatingPlanLoading || savedEatingPlansLoading) {
    return <Loader />;
  }

  if (!eatingPlan || !days) {
    return (
      <div className="flex w-full h-full items-center justify-center font-semibold text-2xl">
        Eating plan does not exist
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-10 pr-20">
      <div className="flex justify-between items-center w-full">
        <p className="text-5xl font-semibold mb-3">
          {eatingPlan.eatingPlan.name}
        </p>
        <div className="flex">
          {profileInfo ? (
            <>
              {eatingPlan.eatingPlan.username !== profileInfo.me.username ? (
                !isSaved ? (
                  <button
                    onClick={() => saveEatingPlan()}
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
                    onClick={() => unsaveEatingPlan()}
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
                      <ul className="text-left w-48 border rounded mt-1">
                        <li
                          className="flex items-center w-full py-2 px-3 hover:bg-gray-100 border-b"
                          onClick={() => {
                            removeEatingPlan();
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
                          Delete eating plan
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
        <Link
          to={`/dashboard/user/${eatingPlan.eatingPlan.username}`}
          className="mr-5"
        >
          Made by:{" "}
          <b>
            <u>{eatingPlan.eatingPlan.username}</u>
          </b>
        </Link>
        <span>Created: {timePassed(eatingPlan.eatingPlan.createdAt)}</span>
      </div>
      {eatingPlan.eatingPlan.description ? (
        <ReactMarkdown
          children={eatingPlan.eatingPlan.description}
          className="prose mb-10"
        />
      ) : null}
      <div className="flex flex-wrap gap-10 p-5 overflow-y-auto">
        {days.map((day: Day) => (
          <div key={day.title} className="w-96 rounded shadow-lg">
            <span
              key={day.title}
              className="flex justify-center text-2xl font-semibold py-2 border-b"
            >
              {day.title}
            </span>
            <div className="flex flex-col px-2 pt-3 pb-4 gap-y-2">
              {day.meals.length ? (
                day.meals.map((meal, index: number) => (
                  <div key={index}>
                    <div className="text-lg font-semibold mb-3">
                      {meal.name} {meal.time ? ` • ${meal.time}` : null}
                    </div>
                    <div>
                      {meal.recipes.map((recipe) => (
                        <Link
                          key={recipe._id}
                          to={`/dashboard/recipe/${recipe._id}`}
                          className="flex mx-2 mt-2 shadow cursor-pointer transition hover:scale-105"
                        >
                          {recipe.thumbnail ? (
                            <img
                              src={
                                import.meta.env.VITE_SERVER_URL +
                                "/public/" +
                                recipe.thumbnail
                              }
                              className="w-12 h-12"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-10 h-10 m-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                          )}
                          <div className="flex w-full items-center px-4 truncate">
                            <span className="truncate">{recipe.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-24"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EatingPlan;
