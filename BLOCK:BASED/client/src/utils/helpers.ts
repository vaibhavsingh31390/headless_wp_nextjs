import { v4 as uuid } from "uuid";
import { Block, FormatMenu, MainMenu } from "./types";
import { theme } from "@/styles/styles";

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
  const colorValue = theme[color as keyof typeof theme] || "#fff";
  if (!colorValue.startsWith("#") || colorValue.includes(" ")) {
    return "";
  }
  return `text-[${colorValue}]`;
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
