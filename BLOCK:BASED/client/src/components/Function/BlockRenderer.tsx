import { Block } from "@/utils/types";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import Cover from "./Cover";
import CtaButton from "./CtaButton";
import Columns from "./Columns";
import Column from "./Column";
import ImageRender from "./Image";
import Container from "./Container";
import PropertySearch from "./PropertySearch";
import React from "react";

const PARENT_LEVEL_EXCEPTIONS = ["core/cover"];

const ColumnWrapper = ({
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
              className="pt-10 pb-10"
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
      <Container key={block.id}>{blockComponent}</Container>
    ) : (
      blockComponent
    );
  });
}

export default BlockRenderer;
