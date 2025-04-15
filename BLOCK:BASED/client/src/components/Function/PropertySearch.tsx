import { PropertyAttrs } from "@/app/api/search-property/route";
import PropertyGrid from "./PropertyGrid";
import PropertyFilters from "./PropertyFilters";
import { Suspense } from "react";

async function getProperties(searchParams: any) {
  const resolvedSearchParams = await searchParams;

  const queryParams = new URLSearchParams();
  if (resolvedSearchParams?.page)
    queryParams.set("page", resolvedSearchParams.page);
  if (resolvedSearchParams?.parking)
    queryParams.set("parking", resolvedSearchParams.parking);
  if (resolvedSearchParams?.pets)
    queryParams.set("pets", resolvedSearchParams.pets);
  if (resolvedSearchParams?.min_price)
    queryParams.set("min_price", resolvedSearchParams.min_price);
  if (resolvedSearchParams?.max_price)
    queryParams.set("max_price", resolvedSearchParams.max_price);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL_DEV;
  const res = await fetch(
    `${baseUrl}/api/search-property?${queryParams.toString()}`,
    { next: { revalidate: 0 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }
  return await res.json();
}

async function PropertySearchContent({ params }: { params: any }) {
  const result = await getProperties(params);
  const responseData: PropertyAttrs = result.data;

  return <PropertyGrid data={responseData} />;
}

async function PropertySearch({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  return (
    <>
      <PropertyFilters />
      <Suspense
        fallback={<p>Loading properties....</p>}
        key={JSON.stringify(params)}
      >
        <PropertySearchContent params={params} />
      </Suspense>
    </>
  );
}

export default PropertySearch;
