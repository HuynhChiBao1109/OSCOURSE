import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

let token = localStorage.getItem("user") && localStorage.getItem("user").token;
const headers = {
  Authorization: token,
};

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Middleware to handle errors
const errorMiddleware = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${extensions.code}`
      );

      // Handle specific error codes
      if (extensions.code === "UNAUTHENTICATED") {
        // Handle 401 Unauthorized (user is not authenticated)
        // Redirect to login page or display a message
        console.log("401-error");
        window.location.href = "/course";
      }
      if (extensions.code === "FORBIDDEN") {
        // Handle 403 Forbidden (user is authenticated but doesn't have permission)
        // Display an error message or redirect to an error page
        console.log("403-error");
        window.location.href = "/permission-denied";
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // Handle network errors (e.g., server is down)
  }
});

export const graphQLClient = new ApolloClient({
  link: errorMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
  headers: headers,
});
