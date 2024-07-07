import React, { useState, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import AddPinForm from "./components/AddPinForm";
import MapList from "./components/MapList";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { Pin } from "./types/types";
import { FaUserCircle, FaMapMarkedAlt } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app, db } from "./firebase";
import { handleGoogleSignIn } from "./util/handleGoogleSignIn";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import { exampleData } from "./util/exampleData";

interface MapData {
  id: string;
  name: string;
  pins: Pin[];
  userId: string;
}

const hashStringToNumber = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const generateLightColor = (hash: number): string => {
  const hue = hash % 360;
  const saturation = 80;
  const lightness = 90;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const App: React.FC = () => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Replace 'any' with your user type if defined

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      loadMaps(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  const loadMaps = async (userId: string | null) => {
    try {
      if (!userId) {
        // User is not logged in, load example map
        const exampleMap: MapData = {
          id: "exampleMap",
          name: "Example Map",
          pins: exampleData,
          userId: "",
        };
        setMaps([exampleMap]);
        setSelectedMapId("exampleMap");
        return;
      }

      const q = query(collection(db, "maps"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const loadedMaps: MapData[] = [];
      querySnapshot.forEach((doc) => {
        loadedMaps.push({ id: doc.id, ...doc.data() } as MapData);
      });

      // Sort loaded maps by some criteria (e.g., creation time)
      loadedMaps.sort((a, b) => {
        // Assuming 'createdAt' or some timestamp field exists
        // Replace with your actual timestamp field
        return Number(b.id) - Number(a.id); // Adjust as per your data structure
      });

      if (loadedMaps.length === 0) {
        // If no maps exist, create Example Map
        const exampleMap: MapData = {
          id: `${new Date("2024-01-01")}`,
          name: "Example Map",
          pins: exampleData,
          userId: userId,
        };
        const exampleMapRef = doc(db, "maps", exampleMap.id);
        await setDoc(exampleMapRef, exampleMap);
        loadedMaps.push(exampleMap);
      }

      setMaps(loadedMaps);
      if (loadedMaps.length > 0 && !selectedMapId) {
        setSelectedMapId(loadedMaps[0].id);
      }
    } catch (error) {
      console.error("Error loading maps:", error);
    }
  };

  const addMap = async (name: string) => {
    if (!user) {
      alert("You must be logged in to add a new map.");
      return;
    }

    const newMap: MapData = {
      id: `${Date.now()}`,
      name,
      pins: [],
      userId: user.uid,
    };

    try {
      const mapRef = doc(db, "maps", newMap.id);
      await setDoc(mapRef, newMap);
      setMaps([newMap, ...maps]); // Prepend new map to the beginning
      setSelectedMapId(newMap.id);
    } catch (error) {
      console.error("Error adding map:", error);
    }
  };

  const addPin = async (pin: Pin) => {
    try {
      if (!selectedMapId) {
        console.error("No map selected to add pin.");
        return;
      }

      const mapRef = doc(db, "maps", selectedMapId);
      await updateDoc(mapRef, {
        pins: arrayUnion(pin),
      });

      const updatedMaps = maps.map((map) =>
        map.id === selectedMapId ? { ...map, pins: [...map.pins, pin] } : map
      );
      setMaps(updatedMaps);
    } catch (error) {
      console.error("Error adding pin:", error);
    }
  };

  const deletePin = async (pinId: string) => {
    try {
      if (user && selectedMapId) {
        const updatedMaps = maps.map((map) =>
          map.id === selectedMapId
            ? { ...map, pins: map.pins.filter((pin) => pin.id !== pinId) }
            : map
        );

        setMaps(updatedMaps);

        const mapRef = doc(db, "maps", selectedMapId);
        await updateDoc(mapRef, {
          pins: updatedMaps.find((map) => map.id === selectedMapId)?.pins || [],
        });
      } else {
        handleGoogleSignIn();
      }
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  };

  const deleteMap = async (mapId: string) => {
    try {
      const updatedMaps = maps.filter((map) => map.id !== mapId);

      setMaps(updatedMaps);
      setSelectedMapId(null);

      const mapRef = doc(db, "maps", mapId);
      await deleteDoc(mapRef);
    } catch (error) {
      console.error("Error deleting map:", error);
    }
  };

  const selectMap = (id: string) => {
    setSelectedMapId(id);
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth(app));
      setUser(null);
      setMaps([]); // Clear maps when the user signs out
      setSelectedMapId(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const selectedMap = maps.find((map) => map.id === selectedMapId);
  const backgroundColor = selectedMap
    ? generateLightColor(hashStringToNumber(selectedMap.id))
    : "white";

  return (
    <div className="App flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaMapMarkedAlt className="text-white-500 text-2xl mr-2" />
          <div className="text-2xl font-semibold">Figure8 Maps</div>
        </div>
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center">
              <FaUserCircle className="text-2xl mr-2 cursor-pointer" />
              <Logout signOut={handleSignOut} />
            </div>
          ) : (
            <div className="flex items-center">
              <FaUserCircle className="text-2xl mr-2 cursor-pointer" />
              <Login />
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-1/5 p-4" style={{ backgroundColor }}>
          <MapList
            maps={maps}
            addMap={addMap}
            selectMap={selectMap}
            selectedMapId={selectedMapId}
            setSelectedMapId={setSelectedMapId}
            deleteMap={deleteMap}
            user={user}
          />
        </div>
        <div className="w-4/5 flex">
          {selectedMap && (
            <>
              <div className="w-2/3">
                <MapComponent pins={selectedMap.pins} deletePin={deletePin} />
              </div>
              <div className="w-1/3 p-4" style={{ backgroundColor }}>
                <AddPinForm addPin={addPin} user={user} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
