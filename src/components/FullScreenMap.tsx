"use client";

import Map, { NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";
import { FeatureCollection, GeoJsonProperties, Geometry, Feature } from 'geojson';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function FullScreenMap() {
  const [trackGeojson, setTrackGeojson] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [shapeGeojson, setShapeGeojson] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);

  // Helper to fetch all batches sequentially
  async function fetchAllBatches(endpoint: string, batchSize: number): Promise<FeatureCollection<Geometry, GeoJsonProperties>> {
    let allFeatures: Feature<Geometry, GeoJsonProperties>[] = [];
    let page = 0;
    let hasMore = true;
    while (hasMore) {
      try {
        const res = await fetch(`${endpoint}?skip=${page * batchSize}&take=${batchSize}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${endpoint} batch ${page}: ${res.statusText}`);
        }
        const data = await res.json();
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error(`Malformed response from ${endpoint} batch ${page}`);
        }
        const validFeatures = (data.features as Feature<Geometry, GeoJsonProperties>[])?.filter(f => f && f.type === 'Feature');
        allFeatures = allFeatures.concat(validFeatures);
        const rawCount = typeof data.rawCount === 'number' ? data.rawCount : 0;
        console.log(`[${endpoint}] Batch ${page}: fetched ${validFeatures.length} valid features (rawCount: ${rawCount}, total so far: ${allFeatures.length})`);
        hasMore = rawCount === batchSize;
        if (!hasMore) {
          console.log(`[${endpoint}] Stopping: last batch had rawCount ${rawCount}, which is less than batch size (${batchSize}). Total valid features fetched: ${allFeatures.length}`);
        }
        page++;
      } catch (err) {
        console.error(`Error fetching ${endpoint} batch ${page}:`, err);
        throw err;
      }
    }
    console.log(`[${endpoint}] Finished fetching. Total valid features: ${allFeatures.length}`);
    return {
      type: "FeatureCollection" as const,
      features: allFeatures,
    };
  }

  useEffect(() => {
    fetchAllBatches("/api/activity-tracks", 10)
      .then(setTrackGeojson)
      .catch(err => {
        setTrackGeojson(null);
        console.error("Failed to fetch all activity tracks:", err);
      });
    fetchAllBatches("/api/activity-shapes", 10)
      .then(setShapeGeojson)
      .catch(err => {
        setShapeGeojson(null);
        console.error("Failed to fetch all activity shapes:", err);
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
        {/* Red lines for all tracks */}
        {trackGeojson && (
          <Source id="activity-tracks" type="geojson" data={trackGeojson}>
            <Layer
              id="activity-red-lines"
              type="line"
              paint={{
                "line-color": "#e00",
                "line-width": 2,
              }}
            />
          </Source>
        )}
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