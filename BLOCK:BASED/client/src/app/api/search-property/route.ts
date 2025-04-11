import requestGraphQl from "@/utils/graphQL/graphQLClient";
import { propertySearchQuery } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export type PropertyAttrs = {
  properties: {
    databaseId: number;
    title: string;
    uri: string;
    propertyFeatures: {
      __typename: string;
      bathRooms: number;
      bedRooms: number;
      fieldGroupName: string;
      hasParking: boolean;
      petFriendly: boolean;
      price: number;
    };
    featuredImage: {
      node: {
        __typename: string;
        altText: string;
        uri: string;
        sourceUrl: string;
      };
    };
  }[];
  pagination: {
    total: number;
    hasMore: boolean;
    hasPrevious: boolean;
    currentPage: number;
    limit: number;
  };
};

export type PropertyResponseData = {
  status: boolean;
  message: string;
  data?: PropertyAttrs;
  error?: any;
};

const DEFAULT_SIZE = 3;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req?.nextUrl?.searchParams;
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const offset = (pageParam - 1) * DEFAULT_SIZE;

    const data = await requestGraphQl<{
      properties: {
        nodes: PropertyAttrs["properties"];
        pageInfo: {
          offsetPagination: {
            total: number;
            hasMore: boolean;
            hasPrevious: boolean;
          };
        };
      };
    }>(propertySearchQuery(offset, DEFAULT_SIZE));
    const currentPage = Math.floor(offset / DEFAULT_SIZE) + 1;
    const totalPages = Math.ceil(
      data.properties.pageInfo.offsetPagination.total / DEFAULT_SIZE
    );

    const pagination = {
      total: data.properties.pageInfo.offsetPagination.total,
      hasMore: currentPage < totalPages,
      hasPrevious: currentPage > 1,
      currentPage,
      limit: DEFAULT_SIZE,
    };

    return NextResponse.json({
      status: true,
      message: "Data fetched!",
      data: {
        properties: data.properties.nodes,
        pagination,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Data can't be fetched!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
