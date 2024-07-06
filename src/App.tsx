import React, { useState, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import AddPinForm from "./components/AddPinForm";
import MapList from "./components/MapList";
import { Pin } from "./types/types";
import { FaUserCircle, FaMapMarkedAlt } from "react-icons/fa"; // Import user profile icon
import "./index.css";

interface MapData {
  id: string;
  name: string;
  pins: Pin[];
}

const hashStringToNumber = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const generateLightColor = (hash: number): string => {
  const hue = hash % 360; // Use the hash to determine the hue
  const saturation = 80; // Saturation of 80%
  const lightness = 90; // Lightness of 90% for a very light color
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const App: React.FC = () => {
  const initialMapData: MapData[] = [
    {
      id: "1",
      name: "Example Map",
      pins: [
        {
          id: '1',
          name: "Central Park",
          lat: 40.785091,
          lng: -73.968285,
          notes: "Iconic park in NYC",
          category:"sightseeing",
        },
        {
          id: '2',
          name: "Times Square",
          lat: 40.758,
          lng: -73.9855,
          notes: "Famous intersection in NYC",
          category:"sightseeing",
        },
        {
          id: '3',
          name: "Empire State Building",
          lat: 40.748817,
          lng: -73.985428,
          notes: "Iconic skyscraper",
          category:"sightseeing",
        },
        {
          id: '4',
          name: "Statue of Liberty",
          lat: 40.6892,
          lng: -74.0445,
          notes: "Symbol of freedom",
          category:"sightseeing",
        },
        {
          id: '5',
          name: "Brooklyn Bridge",
          lat: 40.7061,
          lng: -73.9969,
          notes: "Historic bridge",
          category:"sightseeing",
        },
        {
          id: '6',
          name: "Broadway",
          lat: 40.759,
          lng: -73.9845,
          notes: "Famous theater district",
          category:"sightseeing",
        },
      ],
    },
  ];

  const [maps, setMaps] = useState<MapData[]>(initialMapData);
  const [selectedMapId, setSelectedMapId] = useState<string | null>("1");

  const addMap = (name: string) => {
    const newMap: MapData = {
      id: `${Date.now()}`,
      name,
      pins: [],
    };
    setMaps([...maps, newMap]);
    setSelectedMapId(newMap.id);
  };

  const addPin = (pin: Pin) => {
    setMaps(
      maps.map((map) =>
        map.id === selectedMapId ? { ...map, pins: [...map.pins, pin] } : map
      )
    );
  };

  const deletePin = (pinId: string) => {
    setMaps(
      maps.map((map) =>
        map.id === selectedMapId
          ? { ...map, pins: map.pins.filter((pin) => pin.id !== pinId) }
          : map
      )
    );
  };

  const deleteMap = (mapId: string) => {
    const updatedMaps = maps.filter((map) => map.id !== mapId);
    setMaps(updatedMaps);
    setSelectedMapId(null); // Reset selectedMapId if the deleted map was selected
  };

  const selectMap = (id: string) => {
    setSelectedMapId(id);
  };

  useEffect(() => {
    if (!maps.find((map) => map.name === "Example Map")) {
      addMap("Example Map");
    }
  }, []); // Run only on initial mount

  const selectedMap = maps.find((map) => map.id === selectedMapId);
  const backgroundColor = selectedMap ? generateLightColor(hashStringToNumber(selectedMap.id)) : 'white';

  return (
    <div className="App flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaMapMarkedAlt className="text-white-500 text-2xl mr-2" />
          <div className="text-2xl font-semibold">Figure8 Maps</div>
        </div>
        <div className="flex items-center">
          {/* User Profile Icon */}
          <FaUserCircle className="text-2xl mr-2 cursor-pointer" />
          {/* You can add login/logout functionality here */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <div className="w-1/5 p-4" style={{ backgroundColor }}>
          <MapList
            maps={maps}
            addMap={addMap}
            selectMap={selectMap}
            selectedMapId={selectedMapId}
            setSelectedMapId={setSelectedMapId}
            deleteMap={deleteMap}
          />
        </div>
        <div className="w-4/5 flex">
          {selectedMap && (
            <>
              <div className="w-2/3">
                <MapComponent pins={selectedMap.pins} deletePin={deletePin} />
              </div>
              <div className="w-1/3 p-4" style={{ backgroundColor }}>
                <AddPinForm addPin={addPin} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
