import React, { useState } from "react";
import { MapData } from "../types/types";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import { handleGoogleSignIn } from "../util/handleGoogleSignIn";

interface MapListProps {
  maps: MapData[];
  addMap: (name: string) => void;
  selectMap: (id: string) => void;
  selectedMapId: string | null;
  setSelectedMapId: (id: string | null) => void;
  deleteMap: (id: string) => void;
  user: any;
}

const MapList: React.FC<MapListProps> = ({
  maps,
  addMap,
  selectMap,
  selectedMapId,
  setSelectedMapId,
  deleteMap,
  user,
}) => {
  const [newMapName, setNewMapName] = useState("");
  const [editMode, setEditMode] = useState(false); // State for edit mode

  const handleAddMap = () => {
    if (user) {
      if (newMapName.trim() === "") return; // Prevent adding maps with empty names

      // Check if the map name is unique
      const isDuplicate = maps.some((map) => map.name === newMapName);
      if (isDuplicate) {
        alert("Map name must be unique.");
        return;
      }

      addMap(newMapName);
      setNewMapName("");
    } else {
      handleGoogleSignIn();
    }
  };

  const handleDeleteMap = (id: string) => {
    if (user) {
      // Confirm deletion (optional step)
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this map?"
      );
      if (confirmDelete) {
        deleteMap(id);

        // Select the first map if there are remaining maps
        if (maps.length > 1) {
          const remainingMaps = maps.filter((map) => map.id !== id);
          selectMap(remainingMaps[0].id);
        } else if (maps.length === 1) {
          // If there is only one map left, select it
          selectMap(maps[0].id);
        } else {
          // No maps left
          setSelectedMapId(null);
        }
      }
    } else {
      handleGoogleSignIn();
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  return (
    <div className="w-full p-4 overflow-y-auto">
      {maps.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Maps</h2>
            <button
              onClick={toggleEditMode}
              className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <FaEdit className="mr-1" />
              Edit
            </button>
          </div>
          <ul className="space-y-2">
            {maps.map((map) => (
              <li key={map.id} className="flex items-center justify-between">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    selectedMapId === map.id ? "bg-blue-200" : ""
                  }`}
                  onClick={() => selectMap(map.id)}
                  style={{ transition: "background-color 0.3s" }}
                  onMouseOver={(e) => {
                    e.currentTarget.classList.add("hover:bg-gray-200");
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.classList.remove("hover:bg-gray-200");
                  }}
                >
                  {map.name}
                </button>
                {editMode && ( // Render delete button only in edit mode
                  <button
                    className="text-red-500 ml-2 hover:text-red-700 focus:outline-none"
                    onClick={() => handleDeleteMap(map.id)}
                  >
                    <FaTrash className="text-red-400 hover:text-red-500" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <hr className="my-4 border-gray-600" />
        </>
      )}

      <div className="mt-4">
        <input
          type="text"
          placeholder="New map name"
          value={newMapName}
          onChange={(e) => setNewMapName(e.target.value)}
          className="p-2 w-full border border-gray-300 rounded"
        />
        <button
          onClick={handleAddMap}
          className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Map
        </button>
      </div>
    </div>
  );
};

export default MapList;
