import React, { useEffect, useState } from "react";
import GetRecipes from "../components/GetRecipes";
import GetUsers from "../components/GetUsers";
import { useSearchParams } from "react-router-dom";
import GetEatingPlans from "../components/GetEatingPlans";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("recipes");

  useEffect(() => {
    const newSearch = searchParams.get("search");
    if (newSearch) {
      setSearch(newSearch);
    }
    const newType = searchParams.get("type");
    if (newType) {
      setType(newType);
    }
  }, []);

  useEffect(() => {
    setSearchParams({ search, type });
  }, [search, type]);

  return (
    <div className="flex w-full h-full flex-col overflow-x-auto">
      <div className="flex items-center h-auto mx-auto mb-2">
        <input
          type="text"
          value={search}
          placeholder="Search"
          data-cy="search-box"
          onChange={(e) => setSearch(e.target.value)}
          className="shadow appearance-none border rounded my-5 mx-5 py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-64 h-10"
        />
        <button>
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      <div className="flex mx-auto mb-5">
        <button
          className={
            "text-sm font-semibold rounded-2xl px-6 py-3 mr-5 block shadow transition-transform hover:scale-110" +
            (type === "recipes"
              ? " bg-black text-white"
              : " bg-white text-black")
          }
          onClick={() => setType("recipes")}
        >
          Recipes
        </button>
        <button
          className={
            "text-sm font-semibold rounded-2xl px-6 py-3 mr-5 block shadow transition-transform hover:scale-110" +
            (type === "eatingPlans"
              ? " bg-black text-white"
              : " bg-white text-black")
          }
          onClick={() => setType("eatingPlans")}
        >
          Eating Plans
        </button>
        <button
          className={
            "text-sm font-semibold rounded-2xl px-6 py-3 block shadow transition-transform hover:scale-110" +
            (type === "users" ? " bg-black text-white" : " bg-white text-black")
          }
          onClick={() => setType("users")}
        >
          Users
        </button>
      </div>

      <div className="mx-auto">
        {type && search ? (
          type === "recipes" ? (
            <GetRecipes like={search} />
          ) : type === "eatingPlans" ? (
            <GetEatingPlans like={search} />
          ) : (
            <GetUsers like={search} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Search;
