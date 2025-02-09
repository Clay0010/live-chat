"use client";
import { useAuth } from "./context/AuthContext";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import ChatRooms from "./components/ChatRooms";
import Messages from "./components/Messages";
import { useState } from "react";

export default function Home() {
  const { user, loading, login, logout } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="w-screen h-full flex justify-center flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-white">Welcome to Live-Chat</h1>

      {loading ? (
        <p className="mt-5 text-gray-500">Loading...</p>
      ) : !user ? (
        <div className="flex flex-col items-center mt-10 gap-5" onClick={login}>
          <h1 className="text-md">Please Sign in</h1>
          <span className="flex items-center gap-3 p-2 bg-gray-500 rounded shadow-lg hover:cursor-pointer hover:bg-blue-600">
            <FaGoogle size={20} />
            <p>Sign In Using Google</p>
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-5 items-center mt-5 w-full">
          <div className="flex items-center gap-5">
            <Image
              src={user.photoURL || "/default-profile.png"}
              width={40}
              height={40}
              alt="User Profile"
              className="rounded-full"
            />
            <h1 className="text-white">{user.displayName}</h1>
            <button
              onClick={logout}
              className="ml-3 p-2 bg-red-500 text-white rounded"
            >
              Log Out
            </button>
          </div>

          {selectedRoom && (
            <button
              onClick={() => setSelectedRoom(null)}
              className="mt-5 p-2 bg-gray-500 text-white rounded"
            >
              Back to Chat Rooms
            </button>
          )}

          {!selectedRoom ? (
            <ChatRooms onSelectRoom={setSelectedRoom} />
          ) : (
            <Messages
              roomId={selectedRoom.roomId}
              roomName={selectedRoom.roomName}
            />
          )}
        </div>
      )}
    </div>
  );
}
