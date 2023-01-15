import { useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { SIGN_UP } from "../GraphQL/Mutations";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signUp, { error }] = useMutation(SIGN_UP, {
    onCompleted: () => {
      if (!error) {
        navigate("/signin");
      }
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (signUpInput: any) => {
    await signUp({ variables: { signUpInput: signUpInput } });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Link to="/" className="absolute left-5 top-5 text-gray-900">
        Go to main page
      </Link>
      <div className="w-full max-w-xs">
        <form
          className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-2xl font-bold text-center mb-6">Sign Up</p>
          {error ? (
            <div
              id="errors"
              className="p-3 bg-red-500 text-white text-center mb-2 shadow-xl rounded"
            >
              {error.message === "Username is taken" ||
              error.message === "Email is already in use"
                ? error.message
                : "Something went wrong! Try again later"}
            </div>
          ) : null}
          <div className="mb-4">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline"
              {...register("username", { required: true })}
            />
            {errors.username ? (
              <p className="text-red-500 text-sm text-center mt-2">
                This field is required
              </p>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-4"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline"
              {...register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
            />
            {errors.email ? (
              errors.email.type === "required" ? (
                <p className="text-red-500 text-sm text-center mt-2">
                  This field is required
                </p>
              ) : (
                <p className="text-red-500 text-sm text-center mt-2">
                  Enter correct email
                </p>
              )
            ) : null}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-4"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:border-gray-500 focus:outline-none focus:shadow-outline"
              {...register("password", { required: true })}
            />
            {errors.password ? (
              <p className="text-red-500 text-sm text-center mt-2">
                This field is required
              </p>
            ) : null}
          </div>

          <Link to="/signin" className="text-sm text-gray-700">
            Already have an account?
          </Link>
          <button
            id="submit"
            type="submit"
            className="mt-3 text-lg font-semibold 
                bg-gray-800 w-full text-white rounded-lg
                px-6 py-3 block shadow-xl hover:text-white hover:bg-black"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
