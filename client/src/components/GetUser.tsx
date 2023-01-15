import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../GraphQL/Queries";
import { Box, Card } from "@mui/material";

type Recipe = {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
};

const GetUser = () => {
  const { username } = useParams();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      username,
    },
  });
  const navigate = useNavigate();

  return data ? (
    <>
      <h1>{data.user.username}</h1>
      {data.user.recipes.map((recipe: Recipe) => {
        return (
          <Card
            key={recipe._id}
            sx={{ display: "flex" }}
            onClick={() => navigate(`/dashboard/recipe/${recipe._id}`)}
          >
            <Box>
              <img
                src={`http://localhost:3000/public/${recipe.thumbnail}`}
                width={100}
                height={100}
              />
            </Box>
            <Box>
              <h3>{recipe.name}</h3>
              <h6>{recipe.description}</h6>
            </Box>
          </Card>
        );
      })}
    </>
  ) : null;
};

export default GetUser;
