import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 4rem)",
  borderRadius: "10px",
  overflow: "hidden",
};

const DashboardMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation({ lat: 30.7329, lng: 76.6883 }); // Default location (Chandigarh)
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentLocation({ lat: 30.7329, lng: 76.6883 });
    }
  }, []);

  console.log("Google Maps API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY); // Debugging

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
      {currentLocation && (
        <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} zoom={14}>
          <Marker position={currentLocation} />
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default DashboardMap;
