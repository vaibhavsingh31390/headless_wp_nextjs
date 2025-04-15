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

interface FilterParams {
  offset: number;
  parking: boolean;
  pets: boolean;
  min_price: number | null;
  max_price: number | null;
}

const extractFilters = (params: URLSearchParams): FilterParams => {
  const pageParam = parseInt(params.get("page") || "1", 10);
  const offset = (pageParam - 1) * DEFAULT_SIZE;

  const getBooleanParam = (param: string): boolean => {
    const value = params.get(param);
    return value !== null ? Boolean(parseInt(value)) : false;
  };

  const getNumericParam = (param: string): number | null => {
    const value = params.get(param);
    return value !== null ? parseInt(value) : null;
  };

  return {
    offset,
    parking: getBooleanParam("parking"),
    pets: getBooleanParam("pets"),
    min_price: getNumericParam("min_price"),
    max_price: getNumericParam("max_price"),
  };
};
export async function GET(req: NextRequest) {
  try {
    const searchParams = req?.nextUrl?.searchParams;
    const filters = extractFilters(searchParams);
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
    }>(
      propertySearchQuery(
        filters.offset,
        DEFAULT_SIZE,
        filters.parking,
        filters.pets,
        filters.min_price,
        filters.max_price
      )
    );
    const currentPage = Math.floor(filters.offset / DEFAULT_SIZE) + 1;
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
