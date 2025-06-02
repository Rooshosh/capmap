"use client";

import Map, { NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function FullScreenMap() {
  const [shapeGeojson, setShapeGeojson] = useState<any>(null);

  useEffect(() => {
    fetch("/api/activity-shapes")
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setShapeGeojson)
      .catch((err) => {
        setShapeGeojson(null);
        console.error("Failed to fetch activity shapes:", err);
      });
  }, []);

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
        {/* Filled shapes and black outlines for closed-loop polygons */}
        {shapeGeojson && (
          <Source id="activity-shapes" type="geojson" data={shapeGeojson}>
            <Layer
              id="activity-fill"
              type="fill"
              paint={{
                "fill-color": "#088",
                "fill-opacity": 0.4,
              }}
            />
            <Layer
              id="activity-outline"
              type="line"
              paint={{
                "line-color": "#000",
                "line-width": 2,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}