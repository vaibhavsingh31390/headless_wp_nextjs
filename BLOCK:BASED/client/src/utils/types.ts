export type attrs = {
  url?: string;
  id?: number | string;
  dimRatio?: number;
  customOverlayColor?: string;
  isUserOverlayColor?: boolean;
  layout?: [Object];
  width?: number;
  height?: number;
  textAlign?: "center" | "left" | "right";
  level?: number;
  fontSize?: string;
  content?: string;
  style?: {
    color: {
      text: string;
    };
    elements: any;
  };
  data?: {
    label?: string;
    destination?: string;
    alignment?: string;
  };
  textColor?: string;
  isStackedOnMobile?: boolean;
  sizeSlug: "full";
  linkDestination: string;
};

export type Block = {
  name: string;
  innerBlocks: Block[];
  attributes: attrs;
  id?: string;
};

export type NodeByUri = {
  title: string;
  blocks: Block;
  acfOptionsMainMenu: {
    main_menu: {
      menuItems: any;
    };
  };
  container: {
    container: boolean;
  };
};

export type MainMenu = {
  main_menu: {
    menuItems: {
      id: string;
      menuItem?: {
        label: string;
        destination: {
          link: string;
        };
      };
      items?: {
        label: string;
        destination: {
          link: string;
        };
      }[];
    }[];
    callToActionButton: {
      label: string;
      destination: {
        link: string;
      };
    };
  };
};

export type FormatMenu = {
  id: string;
  label: string;
  destination: string;
  subMenuItems: {
    id: string;
    label: string;
    destination: string;
  }[];
}[];
