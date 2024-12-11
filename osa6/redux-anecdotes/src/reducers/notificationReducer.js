import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

export const { showNotification, clearNotification } = notificationSlice.actions;

// Thunk, joka näyttää notifikaation tietyksi ajaksi
export const setNotification = (message, duration) => {
  return (dispatch) => {
    dispatch(showNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000); // Muutetaan sekunnit millisekunneiksi
  };
};

export default notificationSlice.reducer;
