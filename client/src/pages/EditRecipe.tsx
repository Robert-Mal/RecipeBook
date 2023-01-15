import React, { ChangeEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ME, GET_PRIVATE_RECIPES, GET_RECIPE } from "../GraphQL/Queries";
import Loader from "../components/Loader";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ModalInstructions from "../components/ModalInstructions";
import ReactMarkdown from "react-markdown";
import { UPDATE_RECIPE } from "../GraphQL/Mutations";
import Ingredient from "../shared/types/ingredient.type";

const EditRecipe = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_RECIPE, {
    variables: { id },
    onError: () => {
      toast.error("Something went wrong. Try again later");
    },
    onCompleted: (data) => {
      data.recipe.estimatedTime && setEstimatedTime(data.recipe.estimatedTime);
      setToggle(data.recipe.isPublic);
      data.recipe.ingredients.forEach((ingredient: Ingredient) => {
        append(ingredient);
      });
    },
  });
  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    onError: () => {
      toast.error("Something went wrong. Try again later");
    },
    refetchQueries: [
      { query: GET_ME },
      { query: GET_RECIPE, variables: { id } },
      { query: GET_PRIVATE_RECIPES },
    ],
    onCompleted: () => {
      toast.success("Recipe has been updated");
      navigate("/dashboard/recipe/" + (toggle ? "" : "private/") + id, {
        replace: true,
      });
    },
  });
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });
  const watchInstructions = watch("instructions");
  const watchDescription = watch("description");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDescriptionPreview, setShowDescriptionPreview] =
    useState<boolean>(false);
  const [showInstructionsPreview, setShowInstructionsPreview] =
    useState<boolean>(false);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const navigate = useNavigate();

  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      setThumbnail(file);
    }
  };

  const onSubmit = (recipe: any) => {
    recipe.estimatedTime = estimatedTime;
    recipe.isPublic = toggle;
    recipe.thumbnail = thumbnail;
    if (recipe.difficulty === "null") {
      recipe.difficulty = null;
    }
    for (const ingredient of recipe.ingredients) {
      delete ingredient.__typename;
    }
    updateRecipe({ variables: { updateRecipeInput: { _id: id, ...recipe } } });
  };

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex h-full w-full justify-center py-5 overflow-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        {showModal ? <ModalInstructions setShowModal={setShowModal} /> : null}
        <p className="text-4xl font-bold mb-4">Edit Recipe</p>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-4">
            Name
          </label>
          <input
            id="name"
            placeholder="Name"
            defaultValue={data.recipe.name}
            className="shadow appearance-none border rounded mt-5 mx-5 mb-2 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-10"
            {...register("name", { required: true })}
          />
          {errors.name ? (
            <p className="text-red-500 text-sm ml-7">This field is required</p>
          ) : null}
        </div>
        <div className="mb-1">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-4"
          >
            <div className="flex items-center">
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
            </div>
          </label>
          <textarea
            id="description"
            placeholder="Description..."
            spellCheck="false"
            defaultValue={data.recipe.description}
            className="shadow appearance-none border rounded m-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-28"
            {...register("description")}
          />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault;
            setShowDescriptionPreview(!showDescriptionPreview);
          }}
          className="flex mb-4 items-center cursor-pointer"
        >
          <p className="block text-gray-700 font-bold">Show preview</p>
        </div>
        {showDescriptionPreview ? (
          <div className="mb-4">
            <ReactMarkdown
              children={watchDescription}
              className="prose shadow appearance-none border rounded m-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-auto"
            />
          </div>
        ) : null}
        <div
          onClick={(e) => {
            e.preventDefault();
            append({});
          }}
          className="flex mb-4 items-center cursor-pointer"
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
        {fields.map((field, index: number) => (
          <li key={field.id} className="flex items-start">
            <div className="w-1/3 m-5">
              <input
                type="text"
                placeholder="Name"
                className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-full h-10"
                {...register(`ingredients.${index}.name`, { required: true })}
              />
              {errors.ingredients?.[index]?.name ? (
                <p className="text-red-500 text-sm ml-3 mt-2">
                  This field is required
                </p>
              ) : null}
            </div>
            <div className="w-1/3 m-5">
              <input
                type="number"
                step={0.1}
                placeholder="Quantity"
                className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-full h-10"
                {...register(`ingredients.${index}.quantity`, {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              {errors.ingredients?.[index]?.quantity ? (
                <p className="text-red-500 text-sm ml-3 mt-2">
                  This field is required
                </p>
              ) : null}
            </div>
            <div className="w-1/3 m-5">
              <input
                type="text"
                placeholder="Unit (optional)"
                className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-full h-10"
                {...register(`ingredients.${index}.unit`)}
              />
            </div>
            <div className="py-2 mt-5 ml-2">
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
        <div>
          <div className="mb-4">
            <label
              htmlFor="instructions"
              className="block text-gray-700 font-bold mb-4"
            >
              <div className="flex items-center">
                Instructions
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
              </div>
            </label>
            <textarea
              id="instructions"
              placeholder="Instructions..."
              spellCheck="false"
              defaultValue={data.recipe.instructions}
              className="shadow appearance-none border rounded mt-5 mx-5 mb-2 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-28"
              {...register("instructions", { required: true })}
            />
            {errors.instructions ? (
              <p className="text-red-500 text-sm ml-7">
                This field is required
              </p>
            ) : null}
          </div>
        </div>

        <div
          onClick={(e) => {
            e.preventDefault;
            setShowInstructionsPreview(!showInstructionsPreview);
          }}
          className="flex mb-4 items-center cursor-pointer"
        >
          <p className="block text-gray-700 font-bold">Show preview</p>
        </div>

        {showInstructionsPreview ? (
          <div className="mb-4">
            <ReactMarkdown
              children={watchInstructions}
              className="prose shadow appearance-none border rounded m-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-auto"
            />
          </div>
        ) : null}

        <div className="mb-4">
          <label
            htmlFor="estimatedTime"
            className="block text-gray-700 font-bold mb-4"
          >
            Estimated Time (optional)
          </label>
          <div className="w-128 m-5">
            <input
              id="estimatedTime"
              type="time"
              value={estimatedTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target) {
                  setEstimatedTime(e.target.value);
                }
              }}
              className="shadow appearance-none border rounded m-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-2/3 h-10"
            />
            <span className="font-semibold">
              {estimatedTime
                ? estimatedTime.split(":")[0] +
                  " h " +
                  estimatedTime.split(":")[1] +
                  " min"
                : null}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="block text-gray-700 font-bold mb-4"
          >
            Difficulty (optional)
          </label>
          <select
            defaultValue={data.recipe.difficulty}
            {...register("difficulty")}
            className="shadow border rounded m-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-10 cursor-pointer"
          >
            <option value="null"></option>
            <option value="Very Hard">Very Hard</option>
            <option value="Hard">Hard</option>
            <option value="Medium">Medium</option>
            <option value="Easy">Easy</option>
          </select>
        </div>

        <div className="mb-4">
          <span className="block text-gray-700 font-bold mb-10">
            Thumbnail (optional)
          </span>
          {data.recipe.thumbnail ? (
            <div className="flex flex-col w-128 m-5 mt-8 items-center">
              <img
                src={
                  import.meta.env.VITE_SERVER_URL +
                  "/public/" +
                  data.recipe.thumbnail
                }
                className="w-64 h-64 shadow"
              />
              <p>Saved thumbnail</p>
            </div>
          ) : null}
          <label className="cursor-pointer">
            <div className="block w-128 m-5">
              <span className="rounded bg-gray-900 text-white py-2 px-3 font-semibold">
                Change thumbnail...
              </span>
              <span className="px-3">
                {!thumbnail ? "File not chosen." : thumbnail.name}
              </span>
            </div>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={imageChange}
              className="hidden"
            />
          </label>
          {thumbnail ? (
            <>
              <div className="flex w-128 m-5 mt-8 justify-center">
                <img
                  src={URL.createObjectURL(thumbnail)}
                  className="w-64 h-64 shadow"
                />
              </div>
              <div className="flex w-128 justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setThumbnail(null);
                  }}
                  className="rounded bg-gray-900 text-white py-2 px-3 font-semibold"
                >
                  Remove image
                </button>
              </div>
            </>
          ) : null}
        </div>

        <div className="mb-5">
          <label
            htmlFor="isPublic"
            className="block text-gray-700 font-bold mb-4"
          >
            Public
          </label>
          <div className="w-128 inline-flex justify-center items-center m-5">
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

        <button className="mb-5 text-lg font-semibold bg-gray-800 w-96 text-white rounded-lg px-6 py-3 block shadow-xl hover:text-white hover:bg-black">
          Edit Recipe
        </button>
        <div className="p-2"></div>
      </form>
    </div>
  );
};

export default EditRecipe;
