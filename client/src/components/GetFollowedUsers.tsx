import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FOLLOWED_USERS } from "../GraphQL/Queries";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { UNFOLLOW_USER } from "../GraphQL/Mutations";

type FollowedUser = {
  username: string;
  avatar: string;
};

const GetFollowedUsers = () => {
  const { data, loading } = useQuery(GET_FOLLOWED_USERS);
  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [{ query: GET_FOLLOWED_USERS }],
  });

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <div className="flex h-full w-full">There is no follwed users</div>;
  }

  return (
    <div className="flex flex-col pl-5 gap-2 overflow-y-auto">
      <p className="text-lg font-semibold">Followed users: </p>
      {data.me.followedUsers.map((user: FollowedUser) => (
        <div
          key={user.username}
          className="flex justify-between items-center w-128 pl-5 py-3 border-b"
        >
          <Link
            to={`/dashboard/user/${user.username}`}
            className="flex items-center"
          >
            {user.avatar ? (
              <img
                src={import.meta.env.VITE_SERVER_URL + "/public/" + user.avatar}
                className="w-10 h-10 rounded-full mr-5"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 mr-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            <span className="font-semibold text-lg">{user.username}</span>
          </Link>
          <button
            onClick={() =>
              unfollowUser({ variables: { username: user.username } })
            }
            className="flex rounded shadow-md py-2 px-3 mr-2 hover:bg-gray-100"
          >
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
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            Unfollow
          </button>
        </div>
      ))}
    </div>
  );
};

export default GetFollowedUsers;
