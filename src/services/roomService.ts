import { supabase } from "../lib/supabase";
import type { Room, NewRoom } from "../types/rooms";
export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
            *,
            department:departments!rooms_dep_id_fkey(
            dep_id,
            name)
            `,
    )
    .order("room_number", {
      ascending: true,
    });
  if (error) {
    console.error("Supabase get room s error", error);
    throw new Error(error.message);
  }
  return data;
}
export async function createRoom(room: NewRoom): Promise<NewRoom> {
  const { data, error } = await supabase
    .from("rooms")
    .insert(room)
    .select()
    .single();
  if (error) {
    console.error("Supabase craete room error", error);
    throw new Error(error.message);
  }
  return data;
}
export async function updateRoom(id: string, updates: NewRoom): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("room_id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabse update room error", error);
    throw new Error(error.message);
  }
  return data;
}
export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("room_id", id);

  if (error) {
    console.error("Supabase delete room error", error);
    throw new Error(error.message);
  }
}
