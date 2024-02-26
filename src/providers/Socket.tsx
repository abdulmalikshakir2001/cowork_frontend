
// Import necessary modules from react, socket.io-client, and react's context API
import React, { useMemo, createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { DOCOTEAM_API } from "../config";

// Define an interface for the context
interface ISocketContext {
  socket: Socket;
}

// Create a context with the above interface
const SocketContext = createContext<ISocketContext | null>(null);

// A custom hook to use the SocketContext
export const useSocket = (): ISocketContext | null => {
  return useContext(SocketContext);
};

// Define an interface for the SocketProvider props
interface SocketProviderProps {
  children: React.ReactNode;
}

// The SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // Use useMemo to ensure that the socket instance is created only once
  const socket = useMemo(() => io(DOCOTEAM_API as any), []);

  // Return the context provider with the socket instance and children
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
