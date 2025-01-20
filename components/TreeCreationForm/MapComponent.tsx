"use client";

import { useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { customIcon } from "./utils";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

interface MapComponentProps {
  location: { lat: number; lng: number };
  setLocation: (lat: number, lng: number) => void;
}

function SearchField() {
  const map = useMap();
  const provider: OpenStreetMapProvider = new OpenStreetMapProvider();

  useEffect(() => {
    //@ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar",
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: false,
      keepResult: false,
      searchLabel: "Search for location",
      classNames: {
        container: "leaflet-bar leaflet-control leaflet-control-geosearch eco-search",
        button: "leaflet-bar-part leaflet-bar-part-single eco-button",
        resetButton: "reset eco-button",
        msgInfo: "eco-msg-info",
        form: "eco-form",
        input: "eco-input",
      },
    });
    map.addControl(searchControl);

    map.on("geosearch/showlocation", (e) => {
      const zoom = 15;
      map.setView([e.location.y, e.location.x], zoom, {
        animate: false,
      });
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

function CurrentLocationButton({ setLocation }: { setLocation: (lat: number, lng: number) => void }) {
  const map = useMap();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      map.locate().on("locationfound", function (e) {
        const zoom = 15;
        console.log(e);
        setLocation(e.latitude, e.longitude);
        map.setView(e.latlng, zoom, {
          animate: false,
        });
      });
    },
    [map, setLocation]
  );

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar">
        <Button type="button" className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-md transition-colors duration-200" onClick={handleClick}>
          Use Current Location
        </Button>
      </div>
    </div>
  );
}

function MapEvents({ setLocation }: { setLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapComponent({ location, setLocation }: MapComponentProps) {
  useEffect(() => {
    // Apply custom styles to Leaflet controls
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 1px 5px rgba(0,0,0,0.2) !important;
      }
      .leaflet-control-zoom-in,
      .leaflet-control-zoom-out {
        background-color: #4CAF50 !important;
        color: white !important;
        border: none !important;
        width: 30px !important;
        height: 30px !important;
        line-height: 30px !important;
        font-size: 18px !important;
        transition: background-color 0.3s;
      }
      .leaflet-control-zoom-in:hover,
      .leaflet-control-zoom-out:hover {
        background-color: #45a049 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-[400px] w-full">
      <MapContainer center={location} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", borderRadius: "10px" }}>
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <Marker position={location} icon={customIcon} />
        <MapEvents setLocation={setLocation} />
        <SearchField />
        <CurrentLocationButton setLocation={setLocation} />
      </MapContainer>
    </div>
  );
}
