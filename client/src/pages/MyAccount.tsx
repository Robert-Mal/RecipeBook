import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { GET_FOLLOWED_USERS, GET_PROFILE_INFO } from "../GraphQL/Queries";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../components/UpdateProfileModal";
import GetFollowedUsers from "../components/GetFollowedUsers";

const MyAccount = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFollowedUsers, setShowFollowedUsers] = useState<boolean>(false);
  const { loading, data, client } = useQuery(GET_PROFILE_INFO);
  const { data: followedUsers, loading: followedUsersLoading } =
    useQuery(GET_FOLLOWED_USERS);
  const navigate = useNavigate();

  const logout = () => {
    client.resetStore();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("homeScrollPosition");
    navigate("/signin");
  };

  if (loading || followedUsersLoading) {
    <Loader />;
  }

  if (!data || !followedUsers) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full p-10 pr-16">
      {showModal ? <UpdateProfileModal setShowModal={setShowModal} /> : null}
      <div className="flex justify-between">
        <div className="flex items-center">
          {data.me.avatar ? (
            <img
              src={
                import.meta.env.VITE_SERVER_URL + "/public/" + data.me.avatar
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
              className="w-24 h-24 rounded-full bg-gray-200 p-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          )}
          <p className="text-3xl font-semibold mx-10">{data.me.username}</p>
          {followedUsers.me.followedUsers.length ? (
            <div
              onClick={() => setShowFollowedUsers(!showFollowedUsers)}
              className="flex flex-col items-center cursor-pointer"
            >
              <p className="text-lg font-semibold">
                {followedUsers.me.followedUsers.length}
              </p>
              <p className="flex items-center">Following</p>
            </div>
          ) : null}
        </div>
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
              <ul className="text-left border rounded mt-1">
                <li
                  className="flex items-center w-36 py-2 px-3 hover:bg-gray-100 border-b"
                  onClick={() => setShowModal(true)}
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit profile
                </li>
                <li
                  className="flex items-center w-36 py-2 px-3 hover:bg-gray-100 border-b"
                  onClick={logout}
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
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Logout
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>

      <ReactMarkdown children={data.me.bio} className="prose mt-5 mb-10" />
      {showFollowedUsers ? <GetFollowedUsers /> : null}
    </div>
  );
};

export default MyAccount;
