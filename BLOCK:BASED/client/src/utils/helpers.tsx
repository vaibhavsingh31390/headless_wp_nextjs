import { v4 as uuid } from "uuid";
import { Block, FormatMenu, MainMenu } from "./types";
import { Column } from "../components/Function/index";
import React from "react";

export const processJsonForBlocks = (blocksJson: any): Block[] => {
  const blocks = JSON.parse(JSON.stringify(blocksJson));
  const AssignId = (b: any[]) => {
    b.forEach((block) => {
      block.id = uuid();
      if (block.innerBlocks?.length > 0) {
        AssignId(block.innerBlocks);
      }
    });
  };
  AssignId(blocks);
  return blocks;
};

export const processJsonForMenu = (mainMenuJson: MainMenu): FormatMenu => {
  return mainMenuJson.main_menu.menuItems.map((menu) => ({
    id: uuid(),
    label: menu.menuItem?.label || "",
    destination:
      typeof menu.menuItem?.destination === "string"
        ? menu.menuItem.destination
        : menu.menuItem?.destination?.link || "",
    subMenuItems:
      menu.items?.map((subMenu) => ({
        id: uuid(),
        label: subMenu.label || "",
        destination: subMenu.destination?.link || "",
      })) || [],
  }));
};

export const getTextAlignClass = (textAlign?: string): string => {
  const defaultVals = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  } as const;
  return defaultVals[textAlign as keyof typeof defaultVals] || "text-left";
};

export const getTextColorClass = (color: string = "base"): string => {
  const colorValue: Record<string, string> = {
    base: "white",
    contrast: "text-gray-900",
    "accent-1": "text-yellow-300",
    "accent-2": "text-pink-200",
    "accent-3": "text-indigo-700",
    "accent-4": "text-gray-500",
    "accent-5": "text-amber-50",
    "accent-6": "text-opacity-20",
    slate: "text-slate-800",
  };
  return `text-${colorValue[color]}` || "text-white";
};

export const getRelativePath = (url: string = ""): string => {
  return url.split(process.env.NEXT_PUBLIC_WP_URL ?? "").join("");
};

export const getFontSizeClass = (level?: number): string => {
  const defaultVals = {
    1: "text-4xl md:text-5xl lg:text-6xl",
    2: "text-3xl md:text-4xl lg:text-5xl",
    3: "text-2xl md:text-3xl lg:text-4xl",
    4: "text-xl md:text-2xl lg:text-3xl",
    5: "text-lg md:text-xl lg:text-2xl",
    6: "text-base md:text-lg lg:text-xl",
  } as const;
  return defaultVals[level as keyof typeof defaultVals] || "";
};

export const allPagesSlug = (): string => {
  return `query AllPagesSlugAndUqi {
  pages {
    nodes {
      slug
      uri
    }
  }
  properties {
    nodes {
      uri
      title
    }
  }
}`;
};

export const pageQuery = (): string => {
  return `query PageDataQuery($url: String!) {
    nodeByUri(uri: $url) {
      ... on Page {
        title
        blocks(postTemplate: false)
        container {
          container
        }
      }
      ... on Property {
        title
        blocks(postTemplate: false)
        container {
          container
        }
      }
    }
  }`;
};

export const homePageQuery = (): string => {
  return `query HomePageWithMenu {
    nodeByUri(uri: "/") {
      ... on Page {
        id
        blocks(postTemplate: false)
        container {
          container
        }
      }
    }
  }`;
};

export const mainMenuQuery = (): string => {
  return `query MenuMenu {
   acfOptionsMainMenu {
      main_menu {
        menuItems {
          menuItem {
            label
            destination {
              ... on Page {
                link
              }
            }
          }
          items {
            destination {
              ... on Page {
                link
              }
            }
            label
          }
        }
        callToActionButton {
          label
          destination {
            ... on Page {
              link
            }
          }
        }
      }
    }
  }`;
};

type MetaQuery = {
  relation: "AND";
  metaArray: {
    key: string;
    compare: string;
    value: string | number;
    type?: string;
  }[];
};

const metaSearchQueryBuilder = (
  parking?: boolean | number,
  pets?: boolean | number,
  min_price?: number | null,
  max_price?: number | null
): MetaQuery => {
  const metaQuery: MetaQuery = {
    relation: "AND",
    metaArray: [],
  };

  if (parking) {
    metaQuery.metaArray.push({
      key: "has_parking",
      compare: "EQUAL_TO",
      value: "1",
    });
  }

  if (pets) {
    metaQuery.metaArray.push({
      key: "pet_friendly",
      compare: "EQUAL_TO",
      value: "1",
    });
  }

  if (typeof min_price === "number") {
    metaQuery.metaArray.push({
      key: "price",
      compare: "GREATER_THAN_OR_EQUAL_TO",
      value: min_price,
      type: "NUMERIC",
    });
  }

  if (typeof max_price === "number") {
    metaQuery.metaArray.push({
      key: "price",
      compare: "LESS_THAN_OR_EQUAL_TO",
      value: max_price,
      type: "NUMERIC",
    });
  }
  return metaQuery;
};

const formatMetaQuery = (metaQuery: MetaQuery): string => {
  if (metaQuery.metaArray.length === 0) return "";

  const metaConditions = metaQuery.metaArray
    .map((condition) => {
      const typePart = condition.type ? `, type: ${condition.type}` : "";
      return `{
      key: "${condition.key}"
      compare: ${condition.compare}
      value: ${
        typeof condition.value === "string"
          ? `"${condition.value}"`
          : `"${condition.value}"`
      }
      ${typePart}
    }`;
    })
    .join("\n");

  return `metaQuery: {
    relation: ${metaQuery.relation}
    metaArray: [
      ${metaConditions}
    ]
  }`;
};

export const propertySearchQuery = (
  offset: number = 0,
  size: number = 3,
  parking?: boolean | number,
  pets?: boolean | number,
  min_price?: null | number,
  max_price?: null | number
): string => {
  const metaQuery = metaSearchQueryBuilder(parking, pets, min_price, max_price);
  const metaQueryString = formatMetaQuery(metaQuery);
  return `query filteredProperties {
    properties(where: {offsetPagination: {offset: ${offset}, size: ${size}}, ${metaQueryString}}
    ) {
      nodes {
        databaseId
        title
        uri
        propertyFeatures {
          bathRooms
          bedRooms
          fieldGroupName
          hasParking
          petFriendly
          price
        }
        featuredImage {
          node {
            sourceUrl
            altText
            uri
          }
        }
      }
      pageInfo {
        offsetPagination {
          total
          hasMore
          hasPrevious
        }
      }
    }
  }`;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const setCursorClass = (condition: boolean) => {
  return condition ? "cursor-not-allowed" : "cursor-pointer";
};

export const ColumnWrapper = ({
  id,
  isParent,
  children,
}: {
  id?: string;
  isParent?: boolean;
  children?: React.ReactNode;
}) =>
  isParent ? (
    <Column key={id} width="100%">
      {children}
    </Column>
  ) : (
    <React.Fragment key={id}>{children}</React.Fragment>
  );
