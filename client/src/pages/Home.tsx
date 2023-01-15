import React from "react";
import { Link } from "react-router-dom";
import HomeHeader from "../layouts/HomeHeader";

const Home = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <HomeHeader />
      <div id="content" className="flex flex-col w-full h-full">
        <div className="h-1/2 w-full pt-48 pl-32">
          <p className="text-5xl font-bold mb-4">For cooking enthusiasts</p>
          <p className="text-lg w-1/2 pl-5 mb-4">
            Use this web app to search and share <b>recipes</b> and{" "}
            <b>eating plans</b>, and create <b>shopping list</b> all in one
            place.
          </p>
          <Link
            to="/dashboard/search"
            className="flex items-center font-semibold pl-128 hover:underline"
          >
            Browse now, find something for yourself
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
        </div>
        <div className="flex h-1/2 w-full justify-end items-center">
          <img src="./home-image.svg" className="w-96 h-96 mr-72 mb-32" />
        </div>
      </div>
    </div>
  );
};

export default Home;
