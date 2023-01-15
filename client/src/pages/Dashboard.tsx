import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { GET_FOLLOWED_USERS, GET_PROFILE_INFO } from "../GraphQL/Queries";
import EatingPlan from "../shared/types/eating-plan.type";
import Recipe from "../shared/types/recipe.type";
import timePassed from "../shared/utils/timePassed";

type feedItem = (Recipe | EatingPlan) & { username: string; avatar: string };

const Dashboard = () => {
  const { data: profileInfo, loading: profileInfoLoading } =
    useQuery(GET_PROFILE_INFO);
  const { data: followedUsers, loading: followedUsersLoading } = useQuery(
    GET_FOLLOWED_USERS,
    {
      onCompleted: (data) => {
        let feedItems: feedItem[] = [];
        data.me.followedUsers.map((user: any) => {
          for (const recipe of user.recipes) {
            feedItems.push({
              username: user.username,
              avatar: user.avatar,
              ...recipe,
            });
          }
          for (const eatingPlan of user.eatingPlans) {
            feedItems.push({
              username: user.username,
              avatar: user.avatr,
              ...eatingPlan,
            });
          }
        });
        feedItems.sort((item1: feedItem, item2: feedItem) => {
          if (item1.createdAt > item2.createdAt) {
            return -1;
          }
          if (item1.createdAt < item2.createdAt) {
            return 1;
          }
          return 0;
        });
        setRecipesAndEatingPlans(feedItems);
      },
    }
  );
  const [recipesAndEatingPlans, setRecipesAndEatingPlans] = useState<
    feedItem[]
  >([]);
  const feed = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowToScrollTop] = useState<boolean>(false);

  useEffect(() => {
    scrollToLastPosition();
    if (feed.current) {
      feed.current.addEventListener("scroll", handleScroll, { passive: true });
      feed.current.addEventListener("scroll", hideShowScrollToTop, {
        passive: true,
      });
    }

    return () => {
      if (feed.current) {
        feed.current.removeEventListener("scroll", handleScroll);
        feed.current.removeEventListener("scroll", hideShowScrollToTop);
      }
    };
  }, [recipesAndEatingPlans]);

  const handleScroll = () => {
    if (feed.current) {
      const position = feed.current.scrollTop;
      localStorage.setItem("homeScrollPosition", String(position));
    }
  };

  const scrollToTop = () => {
    if (feed.current) {
      feed.current.scroll({ top: 0, behavior: "smooth" });
    }
  };

  const hideShowScrollToTop = () => {
    if (feed.current) {
      if (feed.current.scrollTop > 500) {
        setShowToScrollTop(true);
      } else {
        setShowToScrollTop(false);
      }
    }
  };

  const scrollToLastPosition = () => {
    const scrollPosition = localStorage.getItem("homeScrollPosition");
    if (feed.current && scrollPosition) {
      feed.current.scroll({ top: Number(scrollPosition) });
    }
  };

  if (profileInfoLoading || followedUsersLoading) {
    return <Loader />;
  }

  if (!profileInfo) {
    return null;
  }

  if (!followedUsers.me.followedUsers.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-2xl mb-2">
          Hi <span className="font-bold">{profileInfo.me.username}</span>,
        </p>
        <p className="text-lg">
          Search for <b>authors</b> and follow them to see their latest{" "}
          <b>recipes</b> and <b>eating plans</b> on this page
        </p>
      </div>
    );
  }

  return (
    <>
      <div id="feed" className="flex w-full h-full overflow-x-auto" ref={feed}>
        <div className="flex flex-col w-full h-full p-10">
          <div className="flex text-xl mb-2">
            Hi,{" "}
            <span className="font-bold pl-2">{profileInfo.me.username}</span>
          </div>
          <div className="flex flex-col h-full w-full items-center gap-5">
            {recipesAndEatingPlans.length ? (
              recipesAndEatingPlans.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col w-128 shadow-md rounded transform ease-out duration-100 hover:scale-105"
                >
                  <div className="flex items-center w-full h-min py-2 px-3">
                    {item.avatar ? (
                      <img
                        src={
                          import.meta.env.VITE_SERVER_URL +
                          "/public/" +
                          item.avatar
                        }
                        className="w-12 h-12 mr-2 rounded-full"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    <div className="flex flex-col justify-center h-full">
                      <Link
                        to={`/dashboard/user/${item.username}`}
                        className="font-semibold text-md hover:underline"
                      >
                        {item.username}
                      </Link>
                      <p className="text-xs text-gray-600">
                        {timePassed(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  {"thumbnail" in item ? (
                    <Link
                      to={`/dashboard/recipe/${item._id}`}
                      className="cursor-pointer"
                    >
                      {item.thumbnail ? (
                        <div>
                          <p className="text-lg font-semibold pt-2 pl-2 pb-1">
                            {item.name}
                          </p>
                          <img
                            src={
                              import.meta.env.VITE_SERVER_URL +
                              "/public/" +
                              item.thumbnail
                            }
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="flex py-3 justify-center w-full">
                          <div className="flex w-4/5 p-1 items-center shadow rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-12 h-12 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                              />
                            </svg>
                            <p className="font-semibold truncate">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </Link>
                  ) : (
                    <Link
                      to={`/dashboard/eatingPlan/${item._id}`}
                      className="flex py-3 justify-center w-full"
                    >
                      <div className="flex w-4/5 p-1 items-center shadow rounded">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>
                        <p className="font-semibold truncate">{item.name}</p>
                      </div>
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full w-full text-xl font-semibold">
                Users you follow have not added anything yet
              </div>
            )}
          </div>
          {showScrollToTop ? (
            <div
              onClick={scrollToTop}
              className="absolute right-10 bottom-10 p-2 shadow-md rounded transition hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
