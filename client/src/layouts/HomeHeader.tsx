import React from "react";
import { Link } from "react-router-dom";

const HomeHeader = () => {
  return (
    <div id="header" className="flex justify-between px-16 py-5">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-9 h-9 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>

        <p className="text-4xl font-bold">Recipebook</p>
      </div>
      <div className="flex items-center">
        <Link id="search" to="/dashboard/search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Link>
        <Link
          id="sign-up"
          to="/signup"
          className="block text-gray-800 font-semibold mr-7"
        >
          Sign Up
        </Link>
        <Link
          id="sign-in"
          to="/signin"
          className="font-semibold bg-gray-800 text-white rounded-3xl px-7 py-2 block shadow-xl hover:text-white hover:bg-black"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
