import React, { useState, useRef, useEffect } from "react";
import useGoogleMaps from "../hooks/useGoogleMaps";
import { Pin } from "../types/types";

interface AddPinFormProps {
  addPin: (pin: Pin) => void;
}

const AddPinForm: React.FC<AddPinFormProps> = ({ addPin }) => {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [category, setCategory] = useState("other"); // Changed 'type' to 'category'
  const [hikeLength, setHikeLength] = useState("NA");
  const [reservationRequired, setReservationRequired] = useState("NA");
  const [mealType, setMealType] = useState("NA"); // Default meal type
  const [notes, setNotes] = useState(""); // State for notes
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  // Replace 'YOUR_API_KEY' with your actual Google Maps API key
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  useGoogleMaps(apiKey);

  useEffect(() => {
    const handlePlaceSelect = () => {
      if (!autocompleteInputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        { types: ["geocode"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const location = place.geometry.location;
          setLat(location.lat().toString());
          setLng(location.lng().toString());
        }
      });
    };

    if (autocompleteInputRef.current) {
      handlePlaceSelect();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateUniqueId(); // Function to generate unique ID
    addPin({
      id,
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      category,
      hikeLength: category === "hiking" ? hikeLength : undefined,
      reservationRequired: category === "hiking" ? reservationRequired : undefined,
      mealType: category === "food" ? mealType : undefined,
      notes,
    });
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setLat("");
    setLng("");
    setCategory("other");
    setHikeLength("NA");
    setReservationRequired("NA");
    setMealType("NA");
    setNotes(""); // Clear notes field
    if (autocompleteInputRef.current) {
      autocompleteInputRef.current.value = "";
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    // Reset optional fields when changing category
    if (selectedCategory !== "hiking") {
      setHikeLength("NA");
      setReservationRequired("NA");
    }
    if (selectedCategory !== "food") {
      setMealType("NA");
    }
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9); // Generate random ID
  };

  return (
    <div className="flex flex-col w-full overflow-y-auto">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Drop a Pin</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="location" className="block mb-1">
              Location
            </label>
            <input
              id="location"
              ref={autocompleteInputRef}
              placeholder="Search for a location"
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="lat" className="block mb-1">
              Latitude
            </label>
            <input
              id="lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              required
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="lng" className="block mb-1">
              Longitude
            </label>
            <input
              id="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Longitude"
              required
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="category" className="block mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="p-2 w-full border border-gray-300 rounded"
            >
              <option value="other">Other</option>
              <option value="sightseeing">Sightseeing</option>
              <option value="hiking">Hiking</option>
              <option value="accommodation">Accommodation</option>
              <option value="food">Food</option>
              <option value="store">Store</option>
            </select>
          </div>
          {category === "hiking" && (
            <div className="col-span-2">
              <label htmlFor="hikeLength" className="block mb-1">
                Hike Length
              </label>
              <select
                id="hikeLength"
                value={hikeLength}
                onChange={(e) => setHikeLength(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded"
              >
                <option value="NA">NA</option>
                <option value="short">Short Hike</option>
                <option value="medium">Medium Hike</option>
                <option value="long">Long Hike</option>
              </select>
            </div>
          )}
          {category === "hiking" && (
            <div className="col-span-2">
              <label htmlFor="reservationRequired" className="block mb-1">
                Reservation Required?
              </label>
              <select
                id="reservationRequired"
                value={reservationRequired}
                onChange={(e) => setReservationRequired(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded"
              >
                <option value="NA">NA</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}
          {category === "food" && (
            <div className="col-span-2">
              <label htmlFor="mealType" className="block mb-1">
                Meal Type
              </label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded"
              >
                <option value="NA">NA</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          )}
          <div className="col-span-2">
            <label htmlFor="notes" className="block mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes here..."
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded mt-4 w-full"
            >
              Add Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPinForm;
