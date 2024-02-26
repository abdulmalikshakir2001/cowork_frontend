import React from 'react';
import Routing from './Routing';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { SocketProvider, useSocket } from './providers/Socket';

function App() {
  const socketContext = useSocket();
  const socket = socketContext ? socketContext.socket : null;
  
  

  return (
    <SocketProvider>
      <Routing/>
    </SocketProvider>
  );
}

export default App;
