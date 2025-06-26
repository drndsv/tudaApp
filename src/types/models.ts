export interface Photo {
  id: number;
  upload_id: string;
  filename: string;
}

export interface Event {
  id: number;
  organizer_id: number;
  city: string;
  date: string;
  title: string;
  description: string;
  participants_number: number;
  volunteers_number: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELED";
  photo?: Photo;
}
