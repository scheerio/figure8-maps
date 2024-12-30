import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, divIcon } from "leaflet";
import {
  FaHiking,
  FaTicketAlt,
  FaEye,
  FaUtensils,
  FaBed,
  FaShoppingBag,
  FaRegClock,
  FaTrash,
} from "react-icons/fa";
import { Pin } from "../types/types";
import "leaflet/dist/leaflet.css";

const getPinIcon = (category: string) => {
  let color;
  switch (category) {
    case "hiking":
      color = "green";
      break;
    case "sightseeing":
      color = "blue";
      break;
    case "accommodation":
      color = "black";
      break;
    case "food":
      color = "orange";
      break;
    case "store":
      color = "purple";
      break;
    default:
      color = "gray";
      break;
  }

  return divIcon({
    className: "custom-pin",
    html: `<span style="background-color: ${color}; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>`,
  });
};

interface MapComponentProps {
  pins: Pin[];
  deletePin: (id: string) => void;
}

const center: LatLngExpression = [40.785091, -73.968285];

const MapCenter: React.FC<{ pins: Pin[] }> = ({ pins }) => {
  const map = useMap();

  useEffect(() => {
    if (pins.length > 0) {
      const lastPin = pins[pins.length - 1];
      const { lat, lng } = lastPin;
      map.flyTo([lat, lng] as LatLngExpression, 12);
    }
  }, [pins, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ pins, deletePin }) => {
  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapCenter pins={pins} />
      {pins.map((pin, index) => (
        <Marker
          key={index}
          position={[pin.lat, pin.lng] as LatLngExpression}
          icon={getPinIcon(pin.category)}
          eventHandlers={{
            mouseover: (e) => {
              const marker = e.target;
              marker.openPopup();
            },
            mouseout: (e) => {
              const marker = e.target;
              marker.closePopup();
            },
          }}
        >
          <Popup>
            <strong>{pin.name}</strong>
            <br />
            {pin.category === "hiking" && (
              <>
                <div className="flex items-center">
                  <FaHiking className="text-green-600 mr-1" />
                  Hiking
                </div>
                <div className="flex items-center">
                  {pin.hikeLength !== "NA" && (
                    <>
                      <FaRegClock className="text-green-600 mr-1" />
                      <span>
                        {pin.hikeLength === "short" && "Short Hike"}
                        {pin.hikeLength === "medium" && "Medium Hike"}
                        {pin.hikeLength === "long" && "Long Hike"}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
            {pin.category === "sightseeing" && (
              <div className="flex items-center">
                <FaEye className="text-blue-600 mr-1" />
                Sightseeing
              </div>
            )}
            {pin.category === "hiking" && pin.reservationRequired === "yes" && (
              <div className="flex items-center">
                <FaTicketAlt className="text-green-600 mr-1" />
                Need Reservation
              </div>
            )}
            {pin.category === "accommodation" && (
              <div className="flex items-center">
                <FaBed className="text-black-600 mr-1" />
                Accommodation
              </div>
            )}
            {pin.category === "food" && (
              <div className="flex items-center">
                <FaUtensils className="text-orange-600 mr-1" />
                {pin.mealType === "NA" ? (
                  <span>Food</span>
                ) : (
                  <span>{pin.mealType}</span>
                )}
              </div>
            )}
            {pin.category === "store" && (
              <div className="flex items-center">
                <FaShoppingBag className="text-purple-600 mr-1" />
                Store
              </div>
            )}
            {pin.notes && (
              <div>
                <strong>Notes:</strong> {pin.notes}
              </div>
            )}
            <button
              className="mt-2 p-1 bg-red-200 rounded hover:bg-red-400 text-xs"
              style={{ transition: "background-color 0.3s" }}
              onClick={() => deletePin(pin.id)}
            >
              <div className="flex items-center">
                <FaTrash className="mr-1" />
                Delete
              </div>
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
