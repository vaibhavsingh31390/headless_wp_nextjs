"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const PropertyFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    hasParking: searchParams.get("parking") === "1",
    hasPets: searchParams.get("pets") === "1",
    minPrice: searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : null,
    maxPrice: searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : null,
  });

  // Sync state with URL params when they change
  useEffect(() => {
    setFilters({
      hasParking: searchParams.get("parking") === "1",
      hasPets: searchParams.get("pets") === "1",
      minPrice: searchParams.get("min_price")
        ? Number(searchParams.get("min_price"))
        : null,
      maxPrice: searchParams.get("max_price")
        ? Number(searchParams.get("max_price"))
        : null,
    });
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]:
        type === "checkbox"
          ? checked
          : value === ""
          ? null
          : Number(value) || value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    // Update params based on filters
    params.set("parking", filters.hasParking ? "1" : "0");
    params.set("pets", filters.hasPets ? "1" : "0");

    if (filters.minPrice) {
      params.set("min_price", filters.minPrice.toString());
    } else {
      params.delete("min_price");
    }

    if (filters.maxPrice) {
      params.set("max_price", filters.maxPrice.toString());
    } else {
      params.delete("max_price");
    }

    // Reset pagination to first page when filters change
    params.set("page", "1");

    // Force full page reload to refresh data
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="property-filter-form">
        <div className="property-filter-input">
          <label htmlFor="hasParking">Has Parking</label>
          <input
            type="checkbox"
            name="hasParking"
            checked={filters.hasParking}
            onChange={handleInputChange}
          />
        </div>
        <div className="property-filter-input">
          <label htmlFor="hasPets">Pets Friendly</label>
          <input
            type="checkbox"
            name="hasPets"
            checked={filters.hasPets}
            onChange={handleInputChange}
          />
        </div>
        <div className="property-filter-input-text">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="property-filter-input-text">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ""}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="property-filter-btn">
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default PropertyFilters;
