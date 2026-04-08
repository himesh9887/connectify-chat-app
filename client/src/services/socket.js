import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Backend socket URL

let socket = null;

export const initSocket = (userId, onUsers, onOnlineUsers, onMessage, onTyping) => {
  if (socket) socket.disconnect();
  
  socket = io(SOCKET_URL);
  
  socket.emit('join', userId);
  
  socket.on('users', onUsers);
  socket.on('online_users', onOnlineUsers);
  socket.on('receive_message', onMessage);
  socket.on('typing', onTyping);
  
  return socket;
};

export const getSocket = () => socket;

export const sendMessage = (message) => {
  if (socket) socket.emit('send_message', message);
};

export const startTyping = (to) => {
  if (socket) socket.emit('typing', { to, typing: true });
};

export const stopTyping = (to) => {
  if (socket) socket.emit('typing', { to, typing: false });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

