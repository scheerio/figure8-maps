export interface Pin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  hikeLength?: string;
  reservationRequired?: string;
  mealType?: string;
  notes?: string;
}

export interface MapData {
  id: string;
  name: string;
  pins: Pin[];
}
