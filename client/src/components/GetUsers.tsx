import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../GraphQL/Queries";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

type Props = {
  like: string;
};

type User = {
  username: string;
  avatar: string;
};

const GetUsers = ({ like }: Props) => {
  const { loading, data } = useQuery(GET_USERS, {
    fetchPolicy: "no-cache",
    variables: { like },
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
      {data.users.length ? (
        data.users.map((user: User) => (
          <div
            key={user.username}
            onClick={() => navigate(`/dashboard/user/${user.username}`)}
            className="flex items-center w-128 h-16 pl-2 shadow-md rounded mb-2 cursor-pointer transition hover:scale-105"
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
            <p className="text-lg font-semibold">{user.username}</p>
          </div>
        ))
      ) : (
        <div className="font-semibold mt-3">No results</div>
      )}
    </div>
  );
};

export default GetUsers;
