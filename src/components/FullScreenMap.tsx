"use client";
import Map, { NavigationControl, GeolocateControl } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function FullScreenMap() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
      <Map
        initialViewState={{
          longitude: 10.75, // Example: Oslo
          latitude: 59.91,
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100vw", height: "100vh" }}
      >
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />
      </Map>
    </div>
  );
}