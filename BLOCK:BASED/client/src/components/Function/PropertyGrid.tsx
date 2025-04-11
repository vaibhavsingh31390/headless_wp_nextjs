import { PropertyAttrs } from "@/app/api/search-property/route";
import Container from "./Container";
import PropertyCard from "./PropertyCard";
import PaginationControls from "./PaginationControls";
import PropertyFilters from "./PropertyFilters";

export default function PropertyGrid({ data }: { data: PropertyAttrs }) {
  return (
    <>
      {data.properties && data.properties.length > 0 ? (
        <div className="properties-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {data.properties.map((property) => (
              <PropertyCard key={property.databaseId} property={property} />
            ))}
          </div>
          <PaginationControls pagination={data.pagination} />
        </div>
      ) : (
        <h1 className="text-2xl text-center font-bold text-[var(--theme-text)]">
          No properties found!
        </h1>
      )}
    </>
  );
}
