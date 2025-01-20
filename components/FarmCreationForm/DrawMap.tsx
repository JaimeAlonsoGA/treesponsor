"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface FarmMapComponentProps {
  bounds: L.LatLngExpression[] | null;
  setBounds: (bounds: L.LatLngExpression[]) => void;
}

export function FarmMapComponent({ bounds, setBounds }: FarmMapComponentProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (featureGroupRef.current && bounds) {
      featureGroupRef.current.clearLayers();
      L.polygon(bounds).addTo(featureGroupRef.current);
    }
  }, [bounds]);

  const handleCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer;
    if (layer instanceof L.Polygon) {
      setBounds(layer.getLatLngs()[0] as L.LatLngExpression[]);
    }
  };

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
