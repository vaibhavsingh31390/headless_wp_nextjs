import { v4 as uuid } from "uuid";
import { Block, FormatMenu, MainMenu } from "./types";

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
    1: "text-6xl",
    2: "text-5xl",
    3: "text-4xl",
    4: "text-3xl",
    5: "text-2xl",
    6: "text-xl",
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

export const propertySearchQuery = (
  offset: number = 0,
  size: number = 3
): string => {
  return `query filteredProperties {
    properties(where: {offsetPagination: {offset: ${offset}, size: ${size}}}) {
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
