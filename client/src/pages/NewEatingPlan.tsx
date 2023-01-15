import { useMutation, useQuery } from "@apollo/client";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Board from "../components/EatingPlan/Board";
import Loader from "../components/Loader";
import ModalInstructions from "../components/ModalInstructions";
import { CREATE_EATING_PLAN } from "../GraphQL/EatingPlans/Mutations";
import { GET_MY_EATING_PLANS } from "../GraphQL/EatingPlans/Queries";
import { GET_ME } from "../GraphQL/Queries";
import EatingPlanDay from "../shared/types/eating-plan-day.type";
import Meal from "../shared/types/meal-planning.type";
import Recipe from "../shared/types/recipe.type";

const NewEatingPlan = () => {
  const { data: recipes, loading: recipesLoading } = useQuery(GET_ME);
  const [createEatingPlan] = useMutation(CREATE_EATING_PLAN, {
    onError: () => {
      toast.error("Something went wrong! Try again later");
    },
    refetchQueries: [{ query: GET_MY_EATING_PLANS }],
    onCompleted: () => {
      toast.success("Eating plan created!");
      navigate("/dashboard/eatingPlans", { replace: true });
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [mealName, setMealName] = useState<string>("");
  const [showMealNameError, setShowMealNameError] = useState<boolean>(false);
  const [time, setTime] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [eatingPlan, setEatingPlan] = useState<EatingPlanDay[]>([
    { id: "day-1", title: "Day 1", meals: [] },
  ]);
  const navigate = useNavigate();

  const addRecipeToMeal = (recipe: Recipe) => {
    const isInMeal = selectedRecipes.find(
      (selectedRecipe: Recipe) => selectedRecipe._id === recipe._id
    );
    if (isInMeal) {
      toast.info("Recipe already added to the meal");
      return;
    }
    setSelectedRecipes([...selectedRecipes, recipe]);
  };

  const removeRecipeFromMeal = (index: number) => {
    const meal = [...selectedRecipes];
    meal.splice(index, 1);
    setSelectedRecipes(meal);
  };

  const onChangeMealName = (e: ChangeEvent<HTMLInputElement>) => {
    setShowMealNameError(false);
    setMealName(e.target.value);
  };

  const onChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const addMealToEatingPlan = () => {
    if (!mealName) {
      setShowMealNameError(true);
    }
    if (!selectedRecipes.length) {
      toast.info("Cannot add empty meal");
    }
    if (mealName && selectedRecipes.length) {
      let eatingPlanCopy: EatingPlanDay[] = [...eatingPlan];
      eatingPlanCopy[0].meals.push({
        id: crypto.randomUUID(),
        name: mealName,
        day: 1,
        time,
        recipesId: selectedRecipes.map((recipe: Recipe) => recipe._id),
        recipes: selectedRecipes,
      });
      setSelectedRecipes([]);
      setMealName("");
      setTime("");
    }
  };

  const onSubmit = (data: any) => {
    data.isPublic = toggle;
    data.meals = [];
    for (const day of eatingPlan) {
      for (const meal of day.meals) {
        data.meals.push({ ...meal });
      }
    }
    if (data.meals.length === 0) {
      toast.info("Cannot create empty eating plan");
      return;
    }
    data.meals.forEach((meal: Meal) => {
      delete meal.id;
      delete meal.recipes;
    });
    createEatingPlan({ variables: { createEatingPlanInput: data } });
  };

  if (recipesLoading) {
    return <Loader />;
  }

  if (!recipes) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full p-10 overflow-x-auto">
      {showModal ? <ModalInstructions setShowModal={setShowModal} /> : null}
      <p className="text-4xl font-semibold">Create Eating Plan</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 p-5"
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="eating-plan-name"
              className="block text-gray-700 font-semibold"
            >
              Eating Plan Name
            </label>
            <input
              id="eating-plan-name"
              type="text"
              placeholder="Name"
              className="shadow appearance-none border rounded mt-5 mx-5 mb-1 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-10"
              {...register("name", { required: true })}
            />
            {errors.name ? (
              <p className="text-sm text-red-500 mb-1 ml-7  ">
                This field is required
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold"
            >
              <span className="flex items-center">
                Description (optional)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </span>
            </label>
            <textarea
              id="description"
              spellCheck="false"
              placeholder="Description..."
              className="shadow appearance-none border rounded mt-5 mx-5 mb-2 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-28"
              {...register("description")}
            />
          </div>
        </div>
        <div className="flex flex-col h-96">
          <p className="font-semibold text-xl">Add Recipes</p>
          <p className="pl-2 mb-2 text-sm">
            Click on recipe to add it to a meal
          </p>
          <ul className="flex flex-wrap h-full w-full p-5 overflow-x-auto shadow-inner rounded-lg bg-gray-100">
            {recipes.me.recipes.length ? (
              recipes.me.recipes.map((recipe: Recipe) => (
                <li
                  key={recipe._id}
                  className="relative flex h-min mb-2 mr-2 rounded shadow cursor-pointer group"
                  onClick={() => addRecipeToMeal(recipe)}
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
                  <div className="hidden absolute h-full w-full backdrop-blur-sm group-hover:block">
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
        <div>
          <p className="font-semibold text-xl">Create Meal</p>
          <p className="pl-2 text-sm">Add meal to the eating plan table</p>
          <div className="p-2">
            <div className="flex mb-6">
              <div>
                <label htmlFor="meal-name" className="block font-semibold">
                  Meal Name
                </label>
                <input
                  id="meal-name"
                  type="text"
                  placeholder="Name"
                  value={mealName}
                  onChange={onChangeMealName}
                  className="shadow appearance-none border rounded mt-4 mx-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-10"
                />
                {showMealNameError ? (
                  <p className="text-sm text-red-500 ml-7 mt-1">
                    This field is required
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="time" className="block font-semibold">
                  Time (optional)
                </label>
                <input
                  id="time"
                  type="text"
                  placeholder="e.g. 15.00, 15:00, morning"
                  value={time}
                  onChange={onChangeTime}
                  className="shadow appearance-none border rounded mt-4 mx-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-10"
                />
              </div>
            </div>
            <p className="font-semibold">Selected Recipes</p>
            <ul className="flex flex-col gap-y-2 p-2 mb-4">
              {selectedRecipes.length ? (
                selectedRecipes.map((recipe: Recipe, index: number) => (
                  <li
                    key={recipe._id}
                    className="flex items-center justify-between w-96 pr-3 shadow rounded"
                  >
                    <div className="flex items-center">
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
                          className="w-12 h-12"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                      <p className="pl-2 font-semibold text-sm">
                        {recipe.name}
                      </p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => removeRecipeFromMeal(index)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </li>
                ))
              ) : (
                <li className="pl-2">No recipes selected</li>
              )}
            </ul>
            <button
              type="button"
              onClick={addMealToEatingPlan}
              className="block font-semibold bg-gray-800 text-white rounded-lg px-4 py-2 shadow-xl hover:text-white hover:bg-black"
            >
              Add Meal
            </button>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold mb-5">Eating Plan</p>
          <Board eatingPlan={eatingPlan} setEatingPlan={setEatingPlan} />
        </div>
        <div className="mb-5">
          <p className="text-xl font-semibold">Public</p>
          <div className="inline-flex justify-center items-center m-5">
            <input
              id="isPublic"
              type="checkbox"
              checked={toggle}
              readOnly
              className="sr-only"
            />
            <div
              onClick={() => setToggle(!toggle)}
              className={
                "w-12 h-7 flex rounded-full" +
                (!toggle ? " bg-gray-200" : " bg-gray-800")
              }
            >
              <div
                className={
                  "rounded-full bg-white w-5 h-5 mt-1 transform duration-300 ease-out" +
                  (!toggle ? " ml-1 " : " translate-x-6")
                }
              ></div>
            </div>
            <p className="ml-2">{!toggle ? "Private" : "Public"}</p>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="block w-96 font-semibold bg-gray-800 text-white text-lg rounded-lg px-4 py-2 shadow-xl hover:text-white hover:bg-black"
          >
            Create Eating Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEatingPlan;
