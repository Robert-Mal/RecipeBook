import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Sidebar from "../layouts/Sidebar";
import Search from "../pages/Search";
import Recipe from "../pages/Recipe";
import EatingPlan from "../pages/EatingPlan";
import User from "../pages/User";
import RequireAuth from "./RequireAuth";
import Dashboard from "../pages/Dashboard";
import Recipes from "../pages/Recipes";
import EatingPlans from "../pages/EatingPlans";
import MyAccount from "../pages/MyAccount";
import NewRecipe from "../pages/NewRecipe";
import EditRecipe from "../pages/EditRecipe";
import PrivateRecipe from "../pages/PrivateRecipe";
import PrivateEditRecipe from "../pages/PrivateEditRecipe";
import NewEatingPlan from "../pages/NewEatingPlan";
import PrivateEatingPlan from "../pages/PrivateEatingPlan";
import ShoppingLists from "../pages/ShoppingLists";
import NewShoppingList from "../pages/NewShoppingList";
import ShoppingList from "../pages/ShoppingList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Router = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="dashboard" element={<Sidebar />}>
          <Route path="search" element={<Search />} />
          <Route path="recipe/:id" element={<Recipe />} />
          <Route path="eatingPlan/:id" element={<EatingPlan />} />
          <Route path="user/:username" element={<User />} />
          <Route element={<RequireAuth />}>
            <Route index element={<Dashboard />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="eatingPlans" element={<EatingPlans />} />
            <Route path="myAccount" element={<MyAccount />} />
            <Route path="recipe">
              <Route path="new" element={<NewRecipe />} />
              <Route path="edit/:id" element={<EditRecipe />} />
              <Route path="private">
                <Route path=":id" element={<PrivateRecipe />} />
                <Route path="edit/:id" element={<PrivateEditRecipe />} />
              </Route>
            </Route>
          </Route>
          <Route path="eatingPlan">
            <Route path="new" element={<NewEatingPlan />} />
            <Route path="private">
              <Route path=":id" element={<PrivateEatingPlan />} />
            </Route>
          </Route>
          <Route path="shoppingLists" element={<ShoppingLists />} />
          <Route path="shoppingList">
            <Route path="new" element={<NewShoppingList />} />
            <Route path=":id" element={<ShoppingList />} />
          </Route>
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <ToastContainer theme="colored" />
    </>
  );
};

export default Router;
