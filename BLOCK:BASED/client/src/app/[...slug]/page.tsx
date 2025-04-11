import BlockRenderer from "@/components/Function/BlockRenderer";
import requestGraphQl from "@/utils/graphQL/graphQLClient";
import { allPagesSlug, pageQuery, processJsonForBlocks } from "@/utils/helpers";
import { NodeByUri } from "@/utils/types";
import { notFound } from "next/navigation";

// export const dynamic = "force-dynamic";
export const revalidate = 60;
export const dynamicParams = false;
export async function generateStaticParams() {
  const data = await requestGraphQl<{
    pages: {
      nodes: Array<{
        slug: string;
        uri: string;
      }>;
    };
    properties: {
      nodes: Array<{
        slug: string;
        uri: string;
      }>;
    };
  }>(allPagesSlug());

  return [...data.pages.nodes, ...data.properties.nodes]
    .filter((page) => page.uri !== "/")
    .map((page) => {
      const slugSegments = page.uri
        .substring(1, page.uri.length - 1)
        .split("/");
      return { slug: slugSegments };
    });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = await params;
  const path = slug?.join("/") || "home";
  const data = await requestGraphQl<{
    nodeByUri: NodeByUri;
  }>(pageQuery(), { variables: { url: path } });
  if (!data.nodeByUri) return notFound();

  return (
    <BlockRenderer
      container={data.nodeByUri?.container?.container || false}
      blocks={processJsonForBlocks(data.nodeByUri.blocks)}
      searchParams={searchParams}
    />
  );
}
