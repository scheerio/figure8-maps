export interface Pin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  hikeLength?: string | null;
  reservationRequired?: string | null;
  mealType?: string | null;
  notes?: string;
}

export interface MapData {
  id: string;
  name: string;
  pins: Pin[];
}
