import { PropertyAttrs } from "@/app/api/search-property/route";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import { FaBath, FaBed, FaDog, FaParking } from "react-icons/fa";

export default function PropertyCard({
  property,
}: {
  property: PropertyAttrs["properties"][0];
}) {
  const formattedPrice = numeral(property.propertyFeatures?.price).format(
    "$0,0"
  );

  return (
    <Link href={property.uri}>
      <div className="property-card relative group">
        <div className="property-card-image">
          <Image
            src={property.featuredImage?.node?.sourceUrl}
            alt={property.featuredImage?.node?.altText}
            fill
            className=""
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="property-card-title">{property.title}</div>
        <div className="property-card-price">{formattedPrice}</div>
        <div className="property-card-meta">
          {property.propertyFeatures.bathRooms && (
            <div className="property-card-meta-bathroom" title="Bathroom">
              <FaBath /> {property.propertyFeatures.bathRooms} bathrooms
            </div>
          )}
          {property.propertyFeatures.bedRooms && (
            <div className="property-card-meta-bedroom" title="Bedroom">
              <FaBed /> {property.propertyFeatures.bedRooms} bedrooms
            </div>
          )}
          <div className="property-card-meta-parking" title="Parking">
            <FaParking />
            {!!property.propertyFeatures.hasParking
              ? "Available"
              : "Not Available"}
          </div>
          <div className="property-card-meta-pet" title="Pet Friendly">
            <FaDog />
            {!!property.propertyFeatures.petFriendly
              ? "Allowed"
              : "Not Allowed"}
          </div>
        </div>
      </div>
    </Link>
  );
}
