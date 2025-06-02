"use client";

import Map, { NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function FullScreenMap() {
  const [shapeGeojson, setShapeGeojson] = useState<FeatureCollection | null>(null);
  const [privateMode, setPrivateMode] = useState(false);

  // Filtered geojson for private mode
  const filteredGeojson = privateMode && shapeGeojson
    ? {
        ...shapeGeojson,
        features: shapeGeojson.features.filter(
          (f: Feature) => f.properties?.user === "Henrik"
        ),
      }
    : shapeGeojson;

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
        {/* Filled shapes and colored outlines for closed-loop polygons */}
        {filteredGeojson && (
          <Source id="activity-shapes" type="geojson" data={filteredGeojson}>
            <Layer
              id="activity-fill"
              type="fill"
              paint={{
                "fill-color": ["get", "color"],
                "fill-opacity": 0.4,
              }}
            />
            <Layer
              id="activity-outline"
              type="line"
              paint={{
                "line-color": ["get", "color"],
                "line-width": 2,
              }}
            />
          </Source>
        )}
      </Map>
      {/* Floating Action Button for Private/Public toggle */}
      <button
        onClick={() => setPrivateMode((v) => !v)}
        className="fixed bottom-6 right-24 z-50 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
        aria-label={privateMode ? "Show all activities (public mode)" : "Show only my activities (private mode)"}
        style={{ transition: 'background 0.2s' }}
      >
        {/* Eye icon for public, eye-slash for private, with fade transition */}
        <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 28 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-gray-700"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: privateMode ? 0 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            {/* Eye icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-gray-700"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: privateMode ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          >
            {/* Eye-slash icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.133 1.016-.366 1.445m-1.11 1.11A3 3 0 019 12c0-.523.133-1.016.366-1.445m1.11-1.11A8.959 8.959 0 004.5 12c1.25 4.5 5.25 7.5 9.75 7.5 1.61 0 3.14-.31 4.5-.87"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}