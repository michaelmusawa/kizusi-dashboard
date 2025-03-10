import Image from "next/image";

const MapWithMarkers = ({
  departureLongitude,
  departureLatitude,
  destinationLongitude,
  destinationLatitude,
}: {
  departureLongitude: number;
  departureLatitude: number;
  destinationLongitude: number | null;
  destinationLatitude: number | null;
}) => {
  const hasDestination = destinationLongitude && destinationLatitude;

  // Center calculation
  const centerLon = hasDestination
    ? (departureLongitude + destinationLongitude) / 2
    : departureLongitude;
  const centerLat = hasDestination
    ? (departureLatitude + destinationLatitude) / 2
    : departureLatitude;

  // Base URL
  let mapUrl =
    `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=600` +
    `&center=lonlat:${centerLon},${centerLat}` +
    `&zoom=${hasDestination ? 14 : 16}`;

  // Departure marker (always present)
  mapUrl += `&marker=lonlat:${departureLongitude},${departureLatitude};type:awesome;color:%234c905a;size:x-large;icon:location-pin`;

  // Destination marker and path (only when both exist)
  if (hasDestination) {
    mapUrl += `|lonlat:${destinationLongitude},${destinationLatitude};type:awesome;color:%23bb3f73;size:x-large;icon:location-pin`;

    // Add path between points
    mapUrl += `&path=${departureLatitude}|${departureLongitude}|${destinationLatitude}|${destinationLongitude}`;
  }

  // Finalize URL
  mapUrl += `&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`;

  return (
    <Image
      src={mapUrl}
      alt="Route Map"
      width={600}
      height={400}
      className="w-full h-full object-cover rounded-lg"
    />
  );
};

export default MapWithMarkers;
