import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { UPDATE_USER } from "../GraphQL/Mutations";
import { GET_ME, GET_PROFILE_INFO, GET_USERS } from "../GraphQL/Queries";
import ModalInstructions from "./ModalInstructions";

type Props = {
  setShowModal: (showModal: boolean) => void;
};

const UpdateProfileModal = ({ setShowModal }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { handleSubmit, register, watch } = useForm();
  const watchBio = watch("bio");
  const [avatar, setAvatar] = useState<any>(null);
  const [updateUser] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
      toast.error("Username is taken");
    },
    refetchQueries: [
      { query: GET_ME },
      { query: GET_USERS },
      { query: GET_PROFILE_INFO },
    ],
    onCompleted: () => {
      setShowModal(false);
    },
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && ref.current === e.target) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      setAvatar(file);
    }
  };

  const onSubmit = (profile: any) => {
    Object.keys(profile).forEach((key) => {
      if (profile[key] === "" || profile[key] == null) {
        delete profile[key];
      }
    });
    if (avatar) {
      profile.avatar = avatar;
    }
    if (profile) {
      updateUser({ variables: { updateUserInput: profile } });
    }
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm z-10"
    >
      {showInstructions ? (
        <ModalInstructions setShowModal={setShowInstructions} />
      ) : null}
      <div className="flex flex-col items-center bg-white shadow-md rounded h-4/5 p-16 pt-10 overflow-x-auto">
        <div className="flex w-full justify-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-4"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            {...register("username")}
            className="shadow appearance-none border rounded w-128 py-2 px-3 mb-5 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline"
          />
          <label
            htmlFor="bio"
            className="flex items-center text-gray-700 font-bold mb-4"
          >
            Bio
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => setShowInstructions(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </label>
          <textarea
            id="bio"
            placeholder="Bio..."
            spellCheck="false"
            {...register("bio")}
            className="shadow appearance-none border rounded w-128 h-36 py-2 px-3 mb-5 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline"
          />
          <p
            onClick={() => {
              setShowPreview(!showPreview);
            }}
            className="block mb-5 text-gray-700 font-bold text-center"
          >
            Show Preview
          </p>
          {showPreview ? (
            <ReactMarkdown
              children={watchBio}
              className="prose shadow appearance-none border rounded py-2 px-3 mb-5 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline w-128 h-auto"
            />
          ) : null}
          <div className="mb-10">
            <span className="block text-gray-700 font-bold mb-10">Avatar</span>
            <label className="cursor-pointer">
              <div className="block w-128 m-5">
                <span className="rounded bg-gray-900 text-white py-2 px-3 font-semibold">
                  Choose File...
                </span>
                <span className="px-3">
                  {!avatar ? "File not chosen." : avatar.name}
                </span>
              </div>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={imageChange}
                className="hidden"
              />
            </label>
            {avatar ? (
              <>
                <div className="flex w-full my-5 mt-8 justify-center">
                  <img
                    src={URL.createObjectURL(avatar)}
                    className="w-64 h-64 shadow"
                  />
                </div>
                <div className="flex w-full justify-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setAvatar(null);
                    }}
                    className="rounded bg-gray-900 text-white py-2 px-3 font-semibold"
                  >
                    Remove image
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <button
            type="submit"
            className="mb-5 text-lg font-semibold bg-gray-800 w-96 text-white rounded-lg px-6 py-3 mx-auto block shadow-xl hover:text-white hover:bg-black"
          >
            Update
          </button>
          {/* <input
            type="submit"
            value="Update"
            className="mb-5 text-lg font-semibold bg-gray-800 w-96 text-white rounded-lg px-6 py-3 mx-auto block shadow-xl hover:text-white hover:bg-black"
          /> */}
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
