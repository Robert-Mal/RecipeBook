import Router from "./routes/Router";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { getAccessToken } from "./services/token.service";

function App() {
  const httpLink = createUploadLink({
    uri: import.meta.env.VITE_SERVER_URL + "/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const accessToken = getAccessToken();
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            me: {
              merge: true,
            },
          },
        },
      },
    }),
  });

  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  );
}

export default App;
