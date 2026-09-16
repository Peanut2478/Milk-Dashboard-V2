export interface RoomDepartment {
  dep_id: string;
  name: string;
}
export interface Room {
  room_id: string;
  room_number: string;
  dep_id: string | null;
  room_type: string | null;
  status: string;
  department: RoomDepartment | null;
}
export interface NewRoom {
  room_number: string;
  dep_id: string | null;
  room_type: string | null;
  status: string;
}
