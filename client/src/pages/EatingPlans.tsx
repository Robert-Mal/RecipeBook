import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { GET_MY_EATING_PLANS } from "../GraphQL/EatingPlans/Queries";
import EatingPlan from "../shared/types/eating-plan.type";
import timePassed from "../shared/utils/timePassed";

const EatingPlans = () => {
  const { data: myEatingPlans, loading: myEatingPlansLoading } = useQuery(
    GET_MY_EATING_PLANS,
    {
      onCompleted: (data) => {
        const publicEatingPlans = data.me.eatingPlans;
        const privateEatingPlans = data.me.privateEatingPlans;
        let eatingPlans = publicEatingPlans.concat(privateEatingPlans);
        eatingPlans.sort((eatingPlan1: EatingPlan, eatingPlan2: EatingPlan) => {
          if (eatingPlan1.createdAt > eatingPlan2.createdAt) {
            return -1;
          }
          if (eatingPlan1.createdAt < eatingPlan2.createdAt) {
            return 1;
          }
          return 0;
        });
        setOwnEatingPlans(eatingPlans);
      },
    }
  );
  const [tab, setTab] = useState<string>("own");
  const [ownEatingPlans, setOwnEatingPlans] = useState<EatingPlan[]>([]);
  const navigate = useNavigate();

  if (myEatingPlansLoading) {
    return <Loader />;
  }

  if (!ownEatingPlans) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="flex justify-between mb-10">
        <span className="text-5xl font-semibold">Eating Plans</span>
        <Link
          to="/dashboard/eatingPlan/new"
          className="flex items-center bg-gray-900 text-white font-semibold py-2 px-3 h-min rounded transition hover:scale-105"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Eating Plan
        </Link>
      </div>
      <div className="flex">
        <div
          onClick={() => setTab("own")}
          className={
            "flex items-center justify-center w-64 py-2 px-3 border-b-2 transition-colors duration-200 cursor-pointer" +
            (tab === "own" ? " border-black" : " border-white text-gray-500")
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
          Own
        </div>
        <div
          onClick={() => setTab("saved")}
          className={
            "flex items-center justify-center w-64 py-2 px-3 border-b-2 transition-colors duration-200 cursor-pointer" +
            (tab === "saved" ? " border-black" : " border-white text-gray-500")
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          Saved
        </div>
      </div>
      {tab === "own" ? (
        ownEatingPlans.length ? (
          <div className="flex flex-wrap gap-x-10 gap-y-5 mt-5 overflow-x-auto">
            {ownEatingPlans.map((eatingPlan) => (
              <Link
                to={
                  eatingPlan.isPublic
                    ? `/dashboard/eatingPlan/${eatingPlan._id}`
                    : `/dashboard/eatingPlan/private/${eatingPlan._id}`
                }
                key={eatingPlan._id}
                className="flex w-64 shadow-md rounded m-2 transition hover:scale-110 cursor-pointer"
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

                <div className="flex w-full flex-col justify-between px-3 py-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">
                      {eatingPlan.name}
                    </span>
                    {!eatingPlan.isPublic ? (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>

                  <span className="text-xs">
                    Created: {timePassed(eatingPlan.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-xl font-semibold">
              There is no eating plans for now
            </p>
          </div>
        )
      ) : myEatingPlans.me.savedEatingPlans.length ? (
        <div className="flex flex-wrap gap-x-10 gap-y-5 mt-5 overflow-x-auto">
          {myEatingPlans.me.savedEatingPlans.map((eatingPlan: EatingPlan) => (
            <Link
              to={`/dashboard/eatingPlan/${eatingPlan._id}`}
              key={eatingPlan._id}
              className="flex w-64 h-min shadow-md rounded m-2 transition hover:scale-110 cursor-pointer"
            >
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

              <div className="flex flex-col justify-between px-3 py-1 truncate">
                <span className="font-semibold truncate">
                  {eatingPlan.name}
                </span>

                <span className="text-xs">
                  Created: {timePassed(eatingPlan.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-xl font-semibold">
            There is no saved eating plans for now
          </p>
        </div>
      )}
    </div>
  );
};

export default EatingPlans;
