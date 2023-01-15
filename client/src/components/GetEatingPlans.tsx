import { useQuery } from "@apollo/client";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate } from "react-router-dom";
import { GET_EATING_PLANS } from "../GraphQL/EatingPlans/Queries";
import EatingPlan from "../shared/types/eating-plan.type";
import timePassed from "../shared/utils/timePassed";
import Loader from "./Loader";

type Props = {
  like: string;
};

const GetEatingPlans = ({ like }: Props) => {
  const { data: eatingPlans, loading: eatingPlansLoading } = useQuery(
    GET_EATING_PLANS,
    {
      fetchPolicy: "no-cache",
      variables: { like },
    }
  );
  const navigate = useNavigate();

  if (eatingPlansLoading) {
    return <Loader />;
  }

  if (!eatingPlans) {
    return null;
  }

  return (
    <div>
      {eatingPlans.eatingPlans.length ? (
        eatingPlans.eatingPlans.map((eatingPlan: EatingPlan) => (
          <div
            key={eatingPlan._id}
            onClick={() => navigate(`/dashboard/eatingPlan/${eatingPlan._id}`)}
            className="flex h-28 w-128 shadow-xl rounded mb-5 cursor-pointer transition hover:scale-105"
          >
            <div className="flex w-36 h-28 items-center justify-center">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
            </div>
            <div className="flex w-full h-full flex-col justify-between py-2 px-5">
              <div className="w-full truncate">
                <p className="text-xl font-bold truncate">{eatingPlan.name}</p>
                {eatingPlan.description ? (
                  <ReactMarkdown
                    children={eatingPlan.description}
                    className="prose text-gray-800 text-sm"
                  />
                ) : null}
              </div>
              <div className="flex justify-between text-gray-800 text-xs">
                <span>Made by: {eatingPlan.username}</span>
                <span>{timePassed(eatingPlan.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="font-semibold mt-3">No results</div>
      )}
    </div>
  );
};

export default GetEatingPlans;
