// NotificationContext.js
import React, { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { message: action.message, visible: true };
    case 'HIDE_NOTIFICATION':
      return { message: '', visible: false };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    message: '',
    visible: false,
  });

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const { state, dispatch } = useContext(NotificationContext);

  const showNotification = (message) => {
    dispatch({ type: 'SHOW_NOTIFICATION', message });
    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' });
    }, 5000); // Notifikaatio näkyy 5 sekuntia
  };

  return {
    message: state.message,
    visible: state.visible,
    showNotification,
  };
};
