import { NotificationDto, NotificationsDto } from "@/api/notification/dto/notification.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationsState {
    notifications: NotificationDto[];
    unreadCount: number;
    isShowNotification?: boolean;
    isInNotificationPage?: boolean;
    page: number;
    pageSize: number;
    isFull: boolean;
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    isShowNotification: false,
    isInNotificationPage: false,
    page: 1,
    pageSize: 5,
    isFull: false,
}

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationsDto>) => {
            state.notifications = action.payload.notifications;
            state.unreadCount = action.payload.unreadCount;
        },
        loadMoreNotifications: (state, action: PayloadAction<NotificationDto[]>) => {
            state.notifications = [...state.notifications, ...action.payload];
            if (action.payload.length < state.pageSize) {
                state.isFull = true;
            }
        },
        addNewNotification: (state, action: PayloadAction<NotificationDto>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.unreadCount += 1;
        },
        deleteNotification: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const noti = state.notifications.find(n => n.id === id);
            state.notifications = state.notifications.filter(n => n.id !== id);

            if (noti && !noti.isRead) {
                state.unreadCount = Math.max(state.unreadCount - 1, 0);
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const notification = state.notifications.find(n => n.id === id);
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
        increasementPage: (state) => {
            state.page += 1;
        }
    }
})

export const { 
    setNotifications, 
    addNewNotification, 
    loadMoreNotifications, 
    deleteNotification,
    markAsRead, 
    setShowNotification, 
    setInNotificationPage, 
    increasementPage } = notificationsSlice.actions;
export default notificationsSlice.reducer;