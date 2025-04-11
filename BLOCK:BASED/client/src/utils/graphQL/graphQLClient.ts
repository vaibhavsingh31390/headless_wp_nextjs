import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const createApolloClient = () => {
  const isDev = process.env.APP_ENV === "dev";
  return new ApolloClient({
    uri: process.env.WP_GRAPHQ_URL || "http://courseheadless.local/graphql",
    cache: new InMemoryCache({
      resultCaching: false,
    }),
  });
};

const client = createApolloClient();

const requestGraphQl = async <T>(
  query: string,
  options: {
    variables?: Record<string, any>;
    [key: string]: any;
  } = {}
): Promise<T> => {
  try {
    const { data } = await client.query({
      query: gql`
        ${query}
      `,
      ...options,
    });

    return data as T;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw new Error("Failed to fetch data");
  }
};

export default requestGraphQl;

// cache: isDev
// ? new InMemoryCache({
//     resultCaching: false,
//   })
// : new InMemoryCache(),
// defaultOptions: {
// watchQuery: {
//   fetchPolicy: isDev ? "no-cache" : "cache-first",
// },
// query: {
//   fetchPolicy: isDev ? "no-cache" : "cache-first",
// },
