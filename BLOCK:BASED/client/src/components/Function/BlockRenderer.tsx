import { Block } from "@/utils/types";
import React from "react";
import {
  Heading,
  Paragraph,
  Cover,
  CtaButton,
  Columns,
  Column,
  ImageRender,
  Container,
  PropertySearch,
} from "./index";
import { ColumnWrapper } from "@/utils/helpers";

const PARENT_LEVEL_EXCEPTIONS = ["core/cover"];
const BLOCK_PADDING_MAP: Record<string, string | undefined> = {
  "core/columns": "container-padding-md",
  "core/group": "container-padding-sm",
  "acf/propertysearch": "container-padding-md",
};

function BlockRenderer({
  blocks,
  isParent = true,
  searchParams = {},
}: {
  blocks: Block[];
  isParent?: boolean;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!blocks?.length) return null;

  return blocks.map((block) => {
    const getBlockComponent = () => {
      switch (block.name) {
        case "core/post-title":
        case "core/heading":
          return <Heading key={block.id} data={block.attributes} />;
        case "core/paragraph":
          return <Paragraph key={block.id} data={block.attributes} />;
        case "core/cover":
          return (
            <Cover key={block.id} data={block.attributes}>
              <BlockRenderer blocks={block.innerBlocks} isParent={false} />
            </Cover>
          );
        case "acf/ctabutton":
          return (
            <CtaButton
              className="mt-5 md:mt-6"
              key={block.id}
              ctaData={block.attributes.data}
            />
          );
        case "core/columns":
          return (
            <Columns
              key={block.id}
              isStackedOnMobile={block.attributes.isStackedOnMobile || false}
            >
              <BlockRenderer blocks={block.innerBlocks} isParent={false} />
            </Columns>
          );
        case "core/column":
          return (
            <Column
              key={block.id}
              width={
                block.attributes?.width ? `${block.attributes.width}%` : "50%"
              }
            >
              <BlockRenderer blocks={block.innerBlocks} isParent={false} />
            </Column>
          );
        case "core/image":
          return (
            <ImageRender
              key={block.id}
              imageData={block.attributes}
              className=""
            />
          );
        case "core/group":
        case "core/block":
          return (
            <ColumnWrapper key={block.id} isParent={isParent}>
              <BlockRenderer blocks={block.innerBlocks} isParent={false} />
            </ColumnWrapper>
          );
        case "acf/propertysearch":
          return (
            <ColumnWrapper key={block.id} isParent={isParent}>
              <PropertySearch searchParams={searchParams} />
            </ColumnWrapper>
          );
        default:
          return null;
      }
    };

    const blockComponent = getBlockComponent();

    return isParent && !PARENT_LEVEL_EXCEPTIONS.includes(block.name) ? (
      <Container
        key={block.id}
        defaultPadding
        className={BLOCK_PADDING_MAP[block.name]}
      >
        {blockComponent}
      </Container>
    ) : (
      blockComponent
    );
  });
}

export default BlockRenderer;
