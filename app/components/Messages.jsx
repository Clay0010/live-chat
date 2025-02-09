"use client";
import { useState, useEffect, useRef } from "react";
import { db, ref, push, onValue } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { Filter } from "bad-words";

const Messages = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    if (!roomId) return;
    const messagesRef = ref(db, `messages/${roomId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // convert the messages object into an array
        const loadedMessages = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setMessages(loadedMessages);
      }
    });
  }, [roomId]);

  useEffect(() => {
    // Scroll to the last message when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const filter = new Filter();
      const cleanMessage = filter.clean(message);
      push(ref(db, `messages/${roomId}`), {
        text: cleanMessage,
        senderId: user.uid,
        senderName: user.displayName,
        senderImage: user.photoURL, 
        createdAt: Date.now(),
      });
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh on form submit
    sendMessage();
  };

  return (
    <div className="flex flex-col w-full h-[90vh] max-w-4xl mx-auto mt-8 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center p-2">
        {roomName}
      </h2>
      <div className="flex-grow overflow-auto mb-4 space-y-4 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 p-4 rounded-lg w-full ${
              msg.senderId === user.uid
                ? "bg-blue-600 text-left"
                : "bg-gray-700 text-left"
            }`}
          >
            <Image
              src={msg.senderImage || "/default-profile.jpg"}
              alt="User's Profile"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col max-w-[80%] md:max-w-[70%] lg:max-w-[70%]">
              <strong className="text-sm font-semibold text-white">
                {msg.senderName}
              </strong>
              <p className="break-words whitespace-pre-wrap overflow-hidden p-2">
                {msg.text}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
        <input
          type="text"
          className="flex-grow p-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;
