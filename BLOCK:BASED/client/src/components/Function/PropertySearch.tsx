import { PropertyAttrs } from "@/app/api/search-property/route";
import PropertyGrid from "./PropertyGrid";

async function PropertySearch({ searchParams }: { searchParams: any }) {
  const resolvedSearchParams = await searchParams;
  const page = Array.isArray(resolvedSearchParams?.page)
    ? Number(resolvedSearchParams.page[0]) || 1
    : Number(resolvedSearchParams?.page) || 1;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL_DEV}/api/search-property?page=${page}`,
    { next: { revalidate: 0 } }
  );

  const result = await res.json();
  const responseData: PropertyAttrs = result.data;

  return (
    <>
      <PropertyGrid data={responseData} />
    </>
  );
}

export default PropertySearch;
