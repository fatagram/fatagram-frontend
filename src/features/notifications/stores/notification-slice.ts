import {
  NotificationDto,
  NotificationsDto,
} from "@/api/notification/dto/notification.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationsState {
  notifications: NotificationDto[];
  unreadCount: number;
  isShowNotification?: boolean;
  isInNotificationPage?: boolean;
  cursorId?: string;
  pageSize: number;
  isFull: boolean;
  isShowFull: boolean;
  isInitialized?: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isShowNotification: false,
  isInNotificationPage: false,
  pageSize: 5,
  isFull: false,
  isShowFull: false,
  isInitialized: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    loadNotifications: (state, action: PayloadAction<NotificationsDto>) => {
      state.notifications = [
        ...state.notifications,
        ...action.payload.notifications,
      ];
      state.unreadCount = action.payload.unreadCount;
      state.isInitialized = true;
      if (action.payload.notifications.length > 0) {
        state.cursorId =
          action.payload.notifications[
            action.payload.notifications.length - 1
          ].id;
      } else {
        state.isFull = true;
      }
    },
    addNewNotification: (state, action: PayloadAction<NotificationDto>) => {
      state.notifications = [action.payload, ...state.notifications];
      state.unreadCount += 1;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const noti = state.notifications.find((n) => n.id === id);
      state.notifications = state.notifications.filter((n) => n.id !== id);

      if (noti && !noti.isRead) {
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    setShowNotification: (state, action: PayloadAction<boolean>) => {
      state.isShowNotification = action.payload;
    },
    setInNotificationPage: (state, action: PayloadAction<boolean>) => {
      state.isInNotificationPage = action.payload;
    },
    setShowFull: (state, action: PayloadAction<boolean>) => {
      state.isShowFull = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  loadNotifications,
  addNewNotification,
  deleteNotification,
  markAsRead,
  setShowNotification,
  setInNotificationPage,
  setShowFull,
  resetState,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
