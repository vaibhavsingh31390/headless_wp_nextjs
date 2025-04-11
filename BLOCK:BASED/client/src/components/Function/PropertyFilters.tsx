"use client"; // Add this at the top since we'll be using client-side functionality

import { useRouter, useSearchParams, usePathname } from "next/navigation";

function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleFilterSubmit = async (formData: FormData) => {
    "use server";
    const filters = {
      parking: formData.get("parking") === "on" || false,
      pets: formData.get("pets") === "on" || false,
      minPrice: formData.get("min_price")
        ? Number(formData.get("min_price"))
        : undefined,
      maxPrice: formData.get("max_price")
        ? Number(formData.get("max_price"))
        : undefined,
    };
    console.log(filters);
  };

  const updateURLParams = (formData: FormData) => {
    const params = new URLSearchParams(searchParams.toString());
    if (formData.get("parking") === "on") {
      params.set("parking", "true");
    } else {
      params.delete("parking");
    }
    if (formData.get("pets") === "on") {
      params.set("pets", "true");
    } else {
      params.delete("pets");
    }
    const minPrice = formData.get("min_price");
    if (minPrice) {
      params.set("min_price", minPrice.toString());
    } else {
      params.delete("min_price");
    }

    const maxPrice = formData.get("max_price");
    if (maxPrice) {
      params.set("max_price", maxPrice.toString());
    } else {
      params.delete("max_price");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Update URL first
    updateURLParams(formData);

    // Then submit the form data to the server action
    await handleFilterSubmit(formData);
  };

  // Set initial values from URL params
  const parkingChecked = searchParams.get("parking") === "true";
  const petsChecked = searchParams.get("pets") === "true";
  const minPriceValue = searchParams.get("min_price") || "";
  const maxPriceValue = searchParams.get("max_price") || "";

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="property-filter-form">
        <div className="filter-set-1">
          <div className="property-filter-input">
            <input
              type="checkbox"
              name="parking"
              defaultChecked={parkingChecked}
            />
            <label htmlFor="parking">Has Parking</label>
          </div>
          <div className="property-filter-input">
            <input type="checkbox" name="pets" defaultChecked={petsChecked} />
            <label htmlFor="pets">Pets Friendly</label>
          </div>
        </div>
        <div className="property-filter-input-text">
          <label htmlFor="min_price">Min Price</label>
          <input type="number" name="min_price" defaultValue={minPriceValue} />
        </div>
        <div className="property-filter-input-text">
          <label htmlFor="max_price">Max Price</label>
          <input type="number" name="max_price" defaultValue={maxPriceValue} />
        </div>

        <button type="submit" className="property-filter-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PropertyFilters;
