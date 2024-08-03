// MapViewOnly.js
import React from 'react';
import { useParams } from 'react-router-dom';
import MapComponent from './MapComponent';

const MapViewOnly = () => {
  const { id } = useParams();

  return (
    <div className="map-view-only">
      {/* <MapComponent mapId={id} editable={false} /> */}
      hello
    </div>
  );
};

export default MapViewOnly;