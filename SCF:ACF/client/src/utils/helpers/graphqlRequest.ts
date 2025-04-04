import { GraphQLClient } from "graphql-request";
import { setQuerySlug } from "../graphql/query";

const WP_GRAPHQL_ENDPOINT = process.env.WP_GRAPHQL_ENDPOINT as string;

export const fetchPageData = async (
  slug: string
): Promise<{
  page: {
    acfPage: {
      pageComponents: any;
    };
  };
}> => {
  if (!WP_GRAPHQL_ENDPOINT) {
    throw new Error(
      "WP_GRAPHQL_ENDPOINT is not set in the environment variables."
    );
  }

  const client = new GraphQLClient(WP_GRAPHQL_ENDPOINT);
  const query = setQuerySlug(slug);

  try {
    const data = await client.request<{ page: { acfPage: object } }>(query);
    return data as any;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
};
