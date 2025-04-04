import WPContainer from "@/components/ui/WPContainer";
import { fetchPageData } from "@/utils/helpers/graphqlRequest";
import { notFound } from "next/navigation";
import React from "react";
import HeadlessRenderer from "../HeadlessRenderer";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchPageData(slug);
  if (!data.page) {
    notFound();
  }
  return <HeadlessRenderer components={data.page.acfPage.pageComponents} />;
}
