"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, push, set } from "firebase/database";

export default function ChatRooms({ onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chatRoomsRef = ref(db, "chatRooms");

    // Listen for changes in the "chatRooms" node
    onValue(chatRoomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRooms(roomList);
      }
      setLoading(false);
    });
  }, []);

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const chatRoomsRef = ref(db, "chatRooms");
      const newRoomRef = push(chatRoomsRef); 
      set(newRoomRef, {
        name: newRoomName,
        createdAt: new Date().toISOString(),
      });
      setNewRoomName(""); 
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-md mx-auto p-5">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        Chat Rooms
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search rooms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Add Room Form */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Enter new room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={handleCreateRoom}
          className="w-full p-2 bg-green-500 text-white rounded-md"
        >
          Add Room
        </button>
      </div>

      {/* Chat Room List */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading rooms...</p>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() =>
                onSelectRoom({ roomId: room.id, roomName: room.name })
              }
              className="p-4 flex items-center justify-between bg-white shadow-md rounded-lg border hover:bg-blue-100 cursor-pointer transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-black">{room.name}</h3>
              <span className="text-gray-500 text-sm">
                {room.createdAt
                  ? new Date(room.createdAt).toLocaleDateString()
                  : "No date"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No rooms found.</p>
        )}
      </div>
    </div>
  );
}
