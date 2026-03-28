import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useNavigate, Link as Link$1, useResolvedPath, useMatch, Outlet, useParams, useLocation, useSearchParams, Route, Routes, StaticRouter } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import axios from "axios";
import React, { useState, useCallback, createContext, useContext, useReducer, useEffect, useMemo, forwardRef, useRef, useLayoutEffect, memo } from "react";
import { useQueryClient, useInfiniteQuery, useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { create } from "zustand";
import clsx, { clsx as clsx$1 } from "clsx";
import { useNavigate as useNavigate$1 } from "react-router";
import * as signalR from "@microsoft/signalr";
import { ArrowLeft } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
const login$1 = { "title": "Login", "username": "Username", "password": "Password", "rememberMe": "Remember me", "forgotPassword": "Forgot password?", "loginButton": "Login", "dontHaveAccount": "Don't have an account?", "registerButton": "Register", "errors": { "usernameOrEmail": { "required": "Username or email is required", "invalidFormat": "Invalid username format", "tooLong": "Username is too long (maximum 20 characters)", "tooShort": "Username is too short (minimum 3 characters)", "notFound": "Username or email not found" }, "password": { "required": "Password is required", "invalidFormat": "Invalid password format", "tooLong": "Password is too long (maximum 50 characters)", "tooShort": "Password is too short (minimum 8 characters)", "incorrect": "Incorrect password" }, "account": { "locked": "Account is locked", "disabled": "Account is disabled" }, "unknownError": "An unknown error occurred", "internalServerError": "Internal server error" } };
const register$2 = { "title": "Register", "username": "Username", "password": "Password", "confirmPassword": "Confirm password", "email": "Email", "phoneNumber": "Phone number", "registerButton": "Register", "backToLogin": "Back to login", "agree": "I agree to the", "termsOfService": "Terms of Service", "and": " and ", "privacyPolicy": "Privacy Policy", "loginButton": "Login", "errors": { "username": { "required": "Username is required", "alreadyExists": "Username already exists", "invalidFormat": "Invalid username format", "tooLong": "Username is too long (maximum 20 characters)", "tooShort": "Username is too short (minimum 3 characters)" }, "email": { "required": "Email is required", "alreadyExists": "Email already exists", "invalidFormat": "Invalid email format" }, "phoneNumber": { "alreadyExists": "Phone number already exists", "invalidFormat": "Invalid phone number format" }, "password": { "required": "Password is required", "invalidFormat": "Invalid password format", "tooLong": "Password is too long (maximum 50 characters)", "tooShort": "Password is too short (minimum 8 characters)" }, "confirmPassword": { "required": "Please confirm your password", "doNotMatch": "Passwords do not match" }, "unknownError": "An unknown error occurred", "internalServerError": "Internal server error" } };
const auth$1 = {
  login: login$1,
  register: register$2
};
const language$3 = { "en": "EN English", "vi": "VN Vietnamese" };
const navbar$5 = { "profileMenu": { "settings": "Settings", "logout": "Logout" } };
const notFound$1 = { "title": "Page Not Found", "description": "Oops! The page you're looking for doesn't exist or has been moved.", "backButton": "Back to Home" };
const themes$1 = { "light": "Light", "dark": "Dark", "universe": "Universe", "neon": "Neon", "darkSea": "Dark Sea", "darkYellow": "Dark Yellow", "lightYellowPink": "Light Yellow Pink" };
const conversations$1 = { "title": "Conversations", "search": "Search conversations...", "you": "You", "no-conversations": "No conversations", "sent": "Sent", "systemMessage": { "createGroup": "{{creatorName}} created the group" } };
const common$1 = {
  language: language$3,
  navbar: navbar$5,
  notFound: notFound$1,
  themes: themes$1,
  conversations: conversations$1
};
const title$5 = "Home";
const description$3 = "Welcome to the home page! This is where you can find the latest updates and news.";
const home$1 = {
  title: title$5,
  description: description$3
};
const title$4 = "Settings";
const navbar$4 = { "title": "Settings", "privacy": { "title": "Privacy Settings", "account": "Account", "privacy": "Privacy" }, "general": { "title": "General Settings", "notifications": "Notifications", "about": "About", "language": "Language", "theme": "Themes" } };
const editableField$1 = { "saveButton": "Save", "cancelButton": "Cancel" };
const account$1 = { "personalInfo": { "title": "Personal Informations", "yourName": "Your Name", "urlName": "URL Name", "nickname": "Nickname", "changeButton": "Change", "noUrlName": "No URL Name", "noNickname": "No Nickname", "urlNamePlaceholder": "Enter your URL name", "nicknamePlaceholder": "Enter your nickname", "changeNameForm": { "title": "Name", "firstName": "First name", "middleName": "Middle name", "lastName": "Last name", "note": "Note", "noteText1": "You can only change your name every", "day": "days", "noteText2": "Your name must have more than 3 characters and less than 36 characters.", "noteText3": "Your name must not contains special characters such as", "acceptButton": "Accept", "submitting": "Submitting..." }, "errorMessages": { "changeUrlName": { "userNotFound": "User not found", "urlNameAlreadyExist": "URL name already exists", "urlNameTooShort": "URL name must be at least 3 characters long", "urlNameTooLong": "URL name must be less than 36 characters", "urlNameEmpty": "URL name cannot be empty", "urlNameContainsSpace": "URL name cannot contain spaces", "unknownError": "Unknown error occurred", "internalServerError": "Internal server error" }, "changeName": { "firstNameNotCorrectFormat": "First name is not in the correct format", "lastNameNotCorrectFormat": "Last name is not in the correct format", "unknownError": "Unknown error occurred", "internalServerError": "Internal server error" }, "changeNickname": { "nicknameTooLong": "Nickname is too long", "unknownError": "Unknown error occurred" } } } };
const language$2 = { "title": "Language Settings", "yourLanguage": "Your language" };
const theme$1 = { "title": "Theme Settings", "selectTheme": "Select theme" };
const settings$1 = {
  title: title$4,
  navbar: navbar$4,
  editableField: editableField$1,
  account: account$1,
  language: language$2,
  theme: theme$1
};
const profileHeader$1 = { "editButton": "Edit", "moreButton": "More", "addButton": "Add", "changeButton": "Change", "messageButton": "Message", "addFriendButton": "Add friend", "acceptButton": "Accept", "cancelRequestButton": "Cancel request", "respondRequestButton": "Respond", "friendButton": "Friend", "declineButton": "Decline", "unfriendButton": "Unfriend", "friendsCount": "friends", "noFriendsCount": "No friends", "oversizeErrorTitle": "File too large", "oversizeErrorMessage": "File size exceeds the limit of 2MB", "oversizeErrorButton": "OK" };
const profileMenu$1 = { "posts": "Posts", "about": "About", "friends": "Friends", "photos": "Photos", "videos": "Videos", "settings": "Settings" };
const profilePosts$1 = { "overview": "Overview", "description": "Description", "bioBtn": "Update your bio", "descriptionBtn": "Update your description", "bioPlaceholder": "Enter your bio", "descriptionPlaceholder": "Enter your description" };
const profileFriends$1 = { "friends": "Friends", "searchFriends": "Search friends", "noFriends": "No friends to show" };
const profileAbout$1 = { "title": "About", "overview": "Overview", "workAndEducation": "Work and Education", "placesLived": "Places Lived" };
const user$1 = {
  profileHeader: profileHeader$1,
  profileMenu: profileMenu$1,
  profilePosts: profilePosts$1,
  profileFriends: profileFriends$1,
  profileAbout: profileAbout$1
};
const title$3 = "Friends";
const description$2 = "Welcome to the home page! This is where you can find the latest updates and news.";
const navbar$3 = { "title": "Friends", "suggestedFriends": "Suggested Friends", "invite": "Friend Requests" };
const friendRequest$1 = { "noRequests": "No friend requests" };
const friends$1 = {
  title: title$3,
  description: description$2,
  navbar: navbar$3,
  friendRequest: friendRequest$1
};
const time$1 = { "second": { "one": "{{count}} second", "other": "{{count}} seconds" }, "minute": { "one": "{{count}} minute", "other": "{{count}} minutes" }, "hour": { "one": "{{count}} hour", "other": "{{count}} hours" }, "day": { "one": "{{count}} day", "other": "{{count}} days" }, "week": { "one": "{{count}} week", "other": "{{count}} weeks" }, "month": { "one": "{{count}} month", "other": "{{count}} months" }, "year": { "one": "{{count}} year", "other": "{{count}} years" } };
const ago$1 = "ago";
const just_now$1 = "Just now";
const yesterday$1 = "Yesterday";
const tomorrow$1 = "Tomorrow";
const weekday$1 = { "1": "Sunday", "2": "Monday", "3": "Tuesday", "4": "Wednesday", "5": "Thursday", "6": "Friday", "7": "Saturday" };
const times$1 = {
  time: time$1,
  ago: ago$1,
  just_now: just_now$1,
  yesterday: yesterday$1,
  tomorrow: tomorrow$1,
  weekday: weekday$1
};
const notifications$2 = { "title": "Notifications", "no-notifications": "No notifications available.", "has-a-friend-request": "has sent you a friend request.", "accepted-friend-request": "has accepted your friend request.", "canceled-friend-request": "has canceled the friend request.", "system-notification": "System notification.", "default-notification": "sent you a notification.", "accepted": "Accepted friend request.", "declined": "Declined friend request.", "showMore": "Show more", "mark-all-read": "Mark all as read", "delete-all": "Delete all", "open-notifications": "Open notifications" };
const notifications$3 = {
  notifications: notifications$2
};
const en = {
  auth: auth$1,
  common: common$1,
  home: home$1,
  settings: settings$1,
  user: user$1,
  friends: friends$1,
  times: times$1,
  notifications: notifications$3
};
const login = { "title": "Đăng nhập", "username": "Tên đăng nhập", "password": "Mật khẩu", "rememberMe": "Ghi nhớ đăng nhập", "forgotPassword": "Quên mật khẩu?", "loginButton": "Đăng nhập", "dontHaveAccount": "Bạn chưa có tài khoản?", "registerButton": "Đăng ký", "errors": { "usernameOrEmail": { "required": "Tên đăng nhập hoặc email là bắt buộc", "invalidFormat": "Định dạng tên đăng nhập không hợp lệ", "tooLong": "Tên đăng nhập quá dài (tối đa 20 ký tự)", "tooShort": "Tên đăng nhập quá ngắn (tối thiểu 3 ký tự)", "notFound": "Không tìm thấy tên đăng nhập hoặc email" }, "password": { "required": "Mật khẩu là bắt buộc", "invalidFormat": "Định dạng mật khẩu không hợp lệ", "tooLong": "Mật khẩu quá dài (tối đa 50 ký tự)", "tooShort": "Mật khẩu quá ngắn (tối thiểu 8 ký tự)", "incorrectPassword": "Mật khẩu không chính xác" }, "account": { "locked": "Tài khoản đã bị khóa", "disabled": "Tài khoản bị vô hiệu hóa" }, "unknownError": "Đã xảy ra lỗi không xác định", "internalServerError": "Lỗi máy chủ nội bộ" } };
const register$1 = { "title": "Đăng ký", "username": "Tên đăng nhập", "password": "Mật khẩu", "confirmPassword": "Xác nhận mật khẩu", "email": "Email", "phoneNumber": "Số điện thoại", "registerButton": "Đăng ký", "backToLogin": "Quay lại đăng nhập", "agree": "Tôi đồng ý với", "termsOfService": "Điều khoản dịch vụ", "and": " và ", "privacyPolicy": "Chính sách bảo mật", "loginButton": "Đăng nhập", "errors": { "username": { "alreadyExists": "Tên đăng nhập đã tồn tại", "invalidFormat": "Định dạng tên đăng nhập không hợp lệ", "tooLong": "Tên đăng nhập quá dài (tối đa 20 ký tự)", "tooShort": "Tên đăng nhập quá ngắn (tối thiểu 3 ký tự)" }, "email": { "alreadyExists": "Email đã tồn tại", "invalidFormat": "Định dạng email không hợp lệ" }, "phoneNumber": { "alreadyExists": "Số điện thoại đã tồn tại", "invalidFormat": "Định dạng số điện thoại không hợp lệ" }, "password": { "invalidFormat": "Định dạng mật khẩu không hợp lệ", "tooLong": "Mật khẩu quá dài (tối đa 50 ký tự)", "tooShort": "Mật khẩu quá ngắn (tối thiểu 8 ký tự)" }, "confirmPassword": { "doNotMatch": "Mật khẩu không khớp" }, "unknownError": "Đã xảy ra lỗi không xác định", "internalServerError": "Lỗi máy chủ nội bộ" } };
const auth = {
  login,
  register: register$1
};
const language$1 = { "en": "EN Tiếng Anh", "vi": "VN Tiếng Việt" };
const navbar$2 = { "profileMenu": { "settings": "Cài đặt", "logout": "Đăng xuất" } };
const notFound = { "title": "Không tìm thấy", "description": "Xin lỗi, trang bạn đang tìm kiếm không tồn tại.", "backButton": "Quay lại trang chủ" };
const themes = { "light": "Sáng", "dark": "Tối", "universe": "Vũ trụ", "neon": "Neon", "darkSea": "Biển đêm", "darkYellow": "Vàng tối", "lightYellowPink": "Vàng hồng" };
const conversations = { "title": "Cuộc trò chuyện", "search": "Tìm kiếm cuộc trò chuyện...", "you": "Bạn", "no-conversations": "Không có cuộc trò chuyện", "sent": "Đã gửi", "systemMessage": { "createGroup": "{{creatorName}} đã tạo nhóm" } };
const common = {
  language: language$1,
  navbar: navbar$2,
  notFound,
  themes,
  conversations
};
const title$2 = "Trang chủ";
const description$1 = "Welcome to the home page! This is where you can find the latest updates and news.";
const home = {
  title: title$2,
  description: description$1
};
const title$1 = "Cài đặt";
const navbar$1 = { "title": "Cài đặt", "privacy": { "title": "Thông tin riêng tư", "account": "Tài khoản", "privacy": "Quyền riêng tư" }, "general": { "title": "Cài đặt chung", "notifications": "Thông báo", "about": "Giới thiệu", "language": "Ngôn ngữ", "theme": "Chủ đề" } };
const editableField = { "saveButton": "Lưu", "cancelButton": "Hủy" };
const account = { "personalInfo": { "title": "Thông tin cá nhân", "yourName": "Tên của bạn", "urlName": "Tên URL", "nickname": "Biệt danh", "changeButton": "Thay đổi", "noUrlName": "Không có tên URL", "noNickname": "Không có biệt danh", "urlNamePlaceholder": "Nhập tên URL của bạn", "nicknamePlaceholder": "Nhập biệt danh của bạn", "changeNameForm": { "title": "Tên", "firstName": "Họ", "middleName": "Tên đệm", "lastName": "Tên", "note": "Lưu ý", "noteText1": "Chỉ có thể thay đổi tên của bạn sau mỗi", "day": "ngày", "noteText2": "Tên của bạn phải nhiều hơn 3 ký tự và ít hơn 36 ký tự", "noteText3": "Tên của bạn không được chứa các ký tự đặc biệt như", "acceptButton": "Xác nhận", "submitting": "Đang xử lý..." }, "errorMessages": { "changeUrlName": { "userNotFound": "Người dùng không tồn tại", "urlNameAlreadyExist": "Tên URL đã tồn tại", "urlNameTooShort": "Tên URL phải có ít nhất 3 ký tự", "urlNameTooLong": "Tên URL phải ít hơn 36 ký tự", "urlNameEmpty": "Tên URL không được để trống", "urlNameContainsSpace": "Tên URL không được chứa khoảng trắng", "unknownError": "Đã xảy ra lỗi không xác định", "internalServerError": "Lỗi máy chủ nội bộ" }, "changeName": { "firstNameNotCorrectFormat": "Họ không đúng định dạng", "lastNameNotCorrectFormat": "Tên không đúng định dạng", "unknownError": "Đã xảy ra lỗi không xác định", "internalServerError": "Lỗi máy chủ nội bộ" }, "changeNickname": { "nicknameTooLong": "Biệt danh quá dài", "unknownError": "Đã xảy ra lỗi không xác định" } } } };
const language = { "title": "Ngôn ngữ", "yourLanguage": "Ngôn ngữ của bạn" };
const theme = { "title": "Chủ đề", "selectTheme": "Chọn chủ đề" };
const settings = {
  title: title$1,
  navbar: navbar$1,
  editableField,
  account,
  language,
  theme
};
const register = { "title": "Đăng ký", "slogan": "Chào mừng đến với Fatagram", "firstName": "Họ", "lastName": "Tên", "username": "Tên đăng nhập", "password": "Mật khẩu", "confirmPassword": "Xác nhận mật khẩu", "email": "Email", "phone": "Số điện thoại", "agree": "Tôi đồng ý với", "termsOfService": "Điều khoản dịch vụ", "and": "và", "privacyPolicy": "Chính sách bảo mật", "registerButton": "Đăng ký", "loginButton": "Đăng nhập", "nextButton": "Bước kế", "gobackButton": "Quay lại bước trước", "errorMessages": { "usernameNotCorrectFormat": "Tên đăng nhập không đúng định dạng", "passwordNotCorrectFormat": "Mật khẩu phải có ít nhất 8 ký tự", "emailNotCorrectFormat": "Địa chỉ email không hợp lệ", "firstnameNotCorrectFormat": "Họ không đúng định dạng", "lastnameNotCorrectFormat": "Tên không đúng định dạng", "phoneNotCorrectFormat": "Số điện thoại không hợp lệ", "unknownError": "Đã xảy ra lỗi không xác định", "usernameExisted": "Tên người dùng đã tồn tại", "registerFailed": "Đăng ký thất bại, vui lòng thử lại", "emailExisted": "Email đã được sử dụng", "internalServerError": "Lỗi máy chủ nội bộ" } };
const profileHeader = { "editButton": "Sửa", "moreButton": "Xem thêm", "addButton": "Thêm", "changeButton": "Thay đổi", "messageButton": "Nhắn tin", "addFriendButton": "Thêm bạn bè", "acceptButton": "Chấp nhận", "cancelRequestButton": "Hủy lời mời", "friendButton": "Bạn bè", "respondRequestButton": "Phản hồi", "declineButton": "Từ chối", "unfriendButton": "Hủy kết bạn", "friendsCount": "người bạn", "noFriendsCount": "Không có bạn bè", "oversizeErrorTitle": "Tệp quá lớn", "oversizeErrorMessage": "Kích thước tệp vượt quá giới hạn 2MB", "oversizeErrorButton": "OK" };
const profileMenu = { "posts": "Bài viết", "about": "Giới thiệu", "friends": "Bạn bè", "photos": "Ảnh", "videos": "Video", "settings": "Cài đặt" };
const profilePosts = { "overview": "Giới thiệu", "description": "Mô tả", "bioBtn": "Cập nhật tiểu sử", "descriptionBtn": "Cập nhật mô tả", "bioPlaceholder": "Nhập tiểu sử", "descriptionPlaceholder": "Nhập mô tả" };
const profileFriends = { "friends": "Bạn bè", "searchFriends": "Tìm kiếm bạn bè", "noFriends": "Không có bạn bè để hiển thị" };
const profileAbout = { "title": "Giới thiệu", "overview": "Tổng quan", "workAndEducation": "Công việc và học vấn", "placesLived": "Nơi đã sống" };
const user = {
  register,
  profileHeader,
  profileMenu,
  profilePosts,
  profileFriends,
  profileAbout
};
const title = "Bạn bè";
const description = "Welcome to the home page! This is where you can find the latest updates and news.";
const navbar = { "title": "Bạn bè", "suggestedFriends": "Bạn bè được gợi ý", "invite": "Lời mời kết bạn" };
const friendRequest = { "noRequests": "Không có lời mời kết bạn" };
const friends = {
  title,
  description,
  navbar,
  friendRequest
};
const time = { "second": { "one": "{{count}} giây", "other": "{{count}} giây" }, "minute": { "one": "{{count}} phút", "other": "{{count}} phút" }, "hour": { "one": "{{count}} giờ", "other": "{{count}} giờ" }, "day": { "one": "{{count}} ngày", "other": "{{count}} ngày" }, "week": { "one": "{{count}} tuần", "other": "{{count}} tuần" }, "month": { "one": "{{count}} tháng", "other": "{{count}} tháng" }, "year": { "one": "{{count}} năm", "other": "{{count}} năm" } };
const ago = "trước";
const just_now = "Vừa xong";
const yesterday = "Hôm qua";
const tomorrow = "Ngày mai";
const weekday = { "1": "Chủ nhật", "2": "Thứ hai", "3": "Thứ ba", "4": "Thứ tư", "5": "Thứ năm", "6": "Thứ sáu", "7": "Thứ bảy" };
const times = {
  time,
  ago,
  just_now,
  yesterday,
  tomorrow,
  weekday
};
const notifications = { "title": "Thông báo", "no-notifications": "Không có thông báo nào.", "has-a-friend-request": "đã gửi cho bạn lời mời kết bạn.", "accepted-friend-request": "đã chấp nhận lời mời kết bạn.", "canceled-friend-request": "đã hủy lời mời kết bạn.", "system-notification": "Thông báo hệ thống.", "default-notification": "đã gửi cho bạn một thông báo.", "accepted": "Đã chấp nhận lời mời kết bạn.", "declined": "Đã từ chối lời mời kết bạn.", "showMore": "Hiển thị thêm", "mark-all-read": "Đánh dấu tất cả đã đọc", "delete-all": "Xóa tất cả", "open-notifications": "Mở thông báo" };
const notifications$1 = {
  notifications
};
const vi = {
  auth,
  common,
  home,
  settings,
  user,
  friends,
  times,
  notifications: notifications$1
};
const namespaces = [
  "auth",
  "common",
  "home",
  "settings",
  "user",
  "friends",
  "times",
  "notifications"
];
const defaultNS = "common";
const resources = {
  en,
  vi
};
i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  ns: namespaces,
  defaultNS
});
const appConfig = {
  apiUrl: "http://localhost:5002",
  googleClientId: "981986901169-54kebahp4jeu71vra4s377i0uda22guc.apps.googleusercontent.com",
  googleRedirectUri: "http://localhost:3000/auth/google/callback"
};
class AuthEventEmitter {
  listeners = /* @__PURE__ */ new Map();
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    this.listeners.get(event).add(callback);
  }
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }
  emit(event, ...args) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(...args));
    }
  }
}
const authEvents = new AuthEventEmitter();
const apiClient = axios.create({
  baseURL: appConfig.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
const apiClientFormData = axios.create({
  baseURL: appConfig.apiUrl,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true
});
apiClient.interceptors.request.use((config) => {
  return config;
});
apiClientFormData.interceptors.request.use((config) => {
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResult = await axios.post(
          `${appConfig.apiUrl}/api/v1/auth/refreshToken`,
          {},
          {
            withCredentials: true
          }
        );
        if (refreshResult.status === 200) {
          return await apiClient.request(error.config);
        }
      } catch (error2) {
      }
    } else if (error.response?.status === 403 && error.response?.data?.error?.code === "ONBOARDING_NOT_COMPLETED") {
      authEvents.emit("redirectToOnboarding");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
apiClientFormData.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResult = await axios.post(
          `${appConfig.apiUrl}/api/v1/auth/refreshToken`,
          {},
          {
            withCredentials: true
          }
        );
        if (refreshResult.status === 200) {
          return await apiClient.request(error.config);
        }
      } catch (error2) {
      }
    } else if (error.response?.status === 413) {
      const err = new Error("File size is too large. Please upload a smaller file.");
      err.name = "LARGE_FILE_ERROR";
      return Promise.reject(err);
    }
    return Promise.reject(error);
  }
);
const handleApiError = (error) => {
  if (error.name === "LARGE_FILE_ERROR") {
    return {
      success: false,
      error: {
        code: "LARGE_FILE_ERROR",
        detail: "File size is too large. Please upload a smaller file."
      }
    };
  }
  if (error.response) {
    const err = error.response.data;
    return {
      success: false,
      error: {
        code: err.error?.code || "UNKNOWN_ERROR",
        detail: err.error?.message
      }
    };
  } else {
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        detail: "Internal server error."
      }
    };
  }
};
const API_VERSION = "v1";
const buildApiPath = (prefix) => {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  const withoutApi = cleanPrefix.replace(/^api\/?/, "");
  return `/api/${API_VERSION}/${withoutApi}`;
};
const apiGet = async (url, params) => {
  try {
    const res = await apiClient.get(url, { params });
    return { success: true, data: res.data.data };
  } catch (error) {
    return handleApiError(error);
  }
};
const apiPost = async (url, data, params) => {
  try {
    const res = await apiClient.post(url, data, { params });
    return { success: true, data: res.data.data };
  } catch (error) {
    return handleApiError(error);
  }
};
const apiPut = async (url, data, params) => {
  try {
    const res = await apiClient.put(url, data, { params });
    return { success: true, data: res.data.data };
  } catch (error) {
    return handleApiError(error);
  }
};
const apiPatch = async (url, data, params) => {
  try {
    const res = await apiClient.patch(url, data, { params });
    return { success: true, data: res.data.data };
  } catch (error) {
    return handleApiError(error);
  }
};
const apiDelete = async (url, params) => {
  try {
    const res = await apiClient.delete(url, { params });
    return { success: true, data: res.data.data };
  } catch (error) {
    return handleApiError(error);
  }
};
const apiPatchFormData = async (url, formData, params) => {
  try {
    const res = await apiClientFormData.patch(url, formData, {
      params
    });
    return { success: true, data: res.data.data };
  } catch (error) {
    return handleApiError(error);
  }
};
const PREFIX$7 = buildApiPath("/auth");
class AuthService {
  // login method
  async login(dto) {
    return apiPost(`${PREFIX$7}/login`, {
      usernameOrEmail: dto.usernameOrEmail,
      password: dto.password,
      isRememberMe: dto.isRememberMe
    });
  }
  async loginWithGoogle(code) {
    return apiPost(`${PREFIX$7}/oauth/google/callback`, { code });
  }
  // logout method
  async logout() {
    return apiPost(`${PREFIX$7}/logout`);
  }
  async register(dto) {
    return apiPost(`${PREFIX$7}/register`, {
      username: dto.username,
      password: dto.password,
      email: dto.email,
      phone: dto.phoneNumber
    });
  }
  // Ping method
  // This method is responsible for sending a ping request to the server.
  // The method returns a promise of void.
  async ping() {
    return apiGet(`${PREFIX$7}/ping`);
  }
}
const authService = new AuthService();
const PREFIX$6 = buildApiPath("/userprofile");
class UserProfileService {
  // Check if user exists by id or urlName
  async checkUserExist(key) {
    return await apiGet(`${PREFIX$6}/exist?key=${key}`);
  }
  async getProfile(target, fields) {
    return await apiGet(`${PREFIX$6}/${target}`, { fields });
  }
  async getUserId(target) {
    return await apiGet(`${PREFIX$6}/${target}`, { fields: "id" });
  }
  // Get current user profile
  async getMe() {
    return await apiGet(`${PREFIX$6}/me`);
  }
  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await apiPatchFormData(`${PREFIX$6}/avatar`, formData);
  }
  // Upload background image
  async uploadBackground(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await apiPatchFormData(`${PREFIX$6}/background`, formData);
  }
  // Update simple profile fields such as bio, description, etc.
  async updateProfile(data) {
    return apiPut(`${PREFIX$6}`, data);
  }
  // Update user's URL name
  async updateUrlName(changeUrlNameDto) {
    return apiPatch(`${PREFIX$6}/urlName`, changeUrlNameDto);
  }
  // Complete onboarding
  async completeOnboarding(onboardingDto) {
    return apiPost(`${PREFIX$6}/onboarding`, onboardingDto);
  }
  // Update user's name
  async updateName(changeNameDto) {
    return apiPatch(`${PREFIX$6}/name`, changeNameDto);
  }
  async updateNickname(changeNicknameDto) {
    return apiPatch(`${PREFIX$6}/nickname`, changeNicknameDto);
  }
  // Get onboarding default data
  async getOnboardingDefaults() {
    return apiGet(`${PREFIX$6}/onboarding/defaults`);
  }
}
const userProfileService = new UserProfileService();
const useChatStore = create((set) => ({
  activeIds: [],
  minimizedIds: [],
  registry: {},
  openChat: (id, meta) => set((state) => {
    if (state.activeIds.includes(id)) return state;
    let newActiveIds = [id, ...state.activeIds];
    let newMinimizedIds = state.minimizedIds.filter((mid) => mid !== id);
    if (newActiveIds.length > 3) {
      const lastId = newActiveIds.pop();
      if (lastId && !newMinimizedIds.includes(lastId)) {
        newMinimizedIds = [lastId, ...newMinimizedIds];
      }
    }
    const newRegistry = { ...state.registry };
    if (meta) {
      newRegistry[id] = meta;
    }
    return {
      activeIds: newActiveIds,
      minimizedIds: newMinimizedIds,
      registry: newRegistry
    };
  }),
  closeChat: (id) => set((state) => ({
    activeIds: state.activeIds.filter((activeId) => activeId !== id),
    minimizedIds: state.minimizedIds.filter((minimizedId) => minimizedId !== id)
  })),
  toggleMinimize: (id) => set((state) => {
    if (state.activeIds.includes(id)) {
      return {
        activeIds: state.activeIds.filter((activeId) => activeId !== id),
        minimizedIds: [...state.minimizedIds, id]
      };
    }
    return {
      activeIds: [...state.activeIds, id],
      minimizedIds: state.minimizedIds.filter((minimizedId) => minimizedId !== id)
    };
  }),
  replaceChat: (oldId, newId) => {
    set((state) => {
      const { [oldId]: _, ...restRegistry } = state.registry;
      return {
        activeIds: state.activeIds.map((id) => id === oldId ? newId : id),
        minimizedIds: state.minimizedIds.map((id) => id === oldId ? newId : id),
        registry: {
          ...restRegistry,
          [newId]: { type: "conversation", conversationId: newId }
        }
      };
    });
  },
  reset: () => set(() => ({
    activeIds: [],
    minimizedIds: [],
    registry: {}
  }))
}));
const initialAuthStatus = {
  isAuthenticated: false,
  lang: "en",
  isOnBoarding: false
};
function useResultFetcher(fn, options) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [errors, setErrors] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const fetch = useCallback(
    async (...args) => {
      let params;
      let opts;
      if (fn.length === 0) {
        params = void 0;
        if (args.length >= 1) {
          opts = args[0];
        }
      } else {
        if (args.length === 0) {
          params = void 0;
        } else if (args.length === 1) {
          params = args[0];
        } else {
          params = args[0];
          opts = args[1];
        }
      }
      setIsFetching(true);
      setError(void 0);
      setErrors(void 0);
      try {
        const result = await fn(params);
        if (result.success) {
          setData(result.data);
          opts?.onSuccess?.(result.data);
          options?.onSuccess?.(result.data);
        } else {
          setError(result.error);
          setErrors(result.errors);
          opts?.onError?.(result.error, result.errors);
          options?.onError?.(result.error, result.errors);
        }
      } catch (error2) {
        throw error2;
      } finally {
        setIsFetching(false);
      }
    },
    [fn]
  );
  return {
    data,
    error,
    errors,
    isFetching,
    fetch
  };
}
function useGoogleLogin() {
  const redirectToGoogle = useCallback(async () => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + appConfig.googleClientId + "&redirect_uri=" + appConfig.googleRedirectUri + "&response_type=code&scope=openid%20profile%20email";
    window.location.href = url;
  }, []);
  const fetcher = useResultFetcher(authService.loginWithGoogle);
  return {
    redirectToGoogle,
    fetcher
  };
}
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload.userId,
        urlName: action.payload.urlName,
        lang: action.payload.lang
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        userId: "",
        urlName: void 0
      };
    case "UPDATE_URL_NAME":
      return {
        ...state,
        urlName: action.payload
      };
    default:
      return state;
  }
};
const AuthContext = createContext({
  isAuthenticated: null,
  logIn: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  redirectToGoogle: () => {
  },
  logOut: () => Promise.resolve(),
  setUrlName: () => {
  },
  userId: void 0,
  urlName: void 0,
  isOnBoarding: false
});
const AuthProvider = ({
  children,
  initialIsAuthenticated,
  userData
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialAuthStatus,
    isAuthenticated: initialIsAuthenticated ?? null,
    userId: userData?.id,
    urlName: userData?.urlName,
    lang: userData?.languageCode,
    isOnBoarding: userData?.isOnBoarding
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { fetch: me } = useResultFetcher(userProfileService.getMe);
  const { fetch: login2 } = useResultFetcher(authService.login, {
    onSuccess: async () => {
      await me({
        onSuccess: (data) => {
          dispatch({
            type: "LOGIN",
            payload: {
              userId: data?.infos.id,
              urlName: data?.infos.urlName,
              lang: data?.infos.languageCode || "en"
            }
          });
        }
      });
    }
  });
  const { fetch: logout } = useResultFetcher(authService.logout, {
    onSuccess: () => {
      dispatch({ type: "LOGOUT" });
      clearUserData();
    }
  });
  const { redirectToGoogle, fetcher: loginWithGoogle } = useGoogleLogin();
  const handleLoginWithGoogle = async (code) => {
    await loginWithGoogle.fetch(code, {
      onSuccess: async () => {
        await me({
          onSuccess: async (data) => {
            dispatch({
              type: "LOGIN",
              payload: {
                userId: data?.infos.id,
                urlName: data?.infos.urlName,
                lang: data?.infos.languageCode || "en"
              }
            });
          }
        });
      }
    });
  };
  const clearUserData = useCallback(() => {
    queryClient.clear();
    useChatStore.getState().reset?.();
  }, [queryClient]);
  const setUrlName = useCallback((urlName) => {
    dispatch({
      type: "UPDATE_URL_NAME",
      payload: urlName
    });
  }, []);
  useEffect(() => {
    const handleRedirectToOnboarding = () => {
      navigate("/onboarding");
    };
    authEvents.on("redirectToOnboarding", handleRedirectToOnboarding);
    return () => {
      authEvents.off("redirectToOnboarding", handleRedirectToOnboarding);
    };
  }, [navigate]);
  useEffect(() => {
    if (state.isAuthenticated && !state.userId) {
      me({
        onSuccess: (data) => {
          dispatch({
            type: "LOGIN",
            payload: {
              userId: data?.infos.id,
              urlName: data?.infos.urlName,
              lang: data?.infos.languageCode || "en"
            }
          });
        }
      });
    }
  }, [state.isAuthenticated, state.userId]);
  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      userId: state.userId,
      urlName: state.urlName,
      logIn: login2,
      loginWithGoogle: handleLoginWithGoogle,
      redirectToGoogle,
      logOut: logout,
      setUrlName,
      isOnBoarding: state.isOnBoarding
    }),
    [
      state.isAuthenticated,
      state.userId,
      state.urlName,
      login2,
      handleLoginWithGoogle,
      redirectToGoogle,
      logout,
      setUrlName,
      state.isOnBoarding
    ]
  );
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: contextValue, children });
};
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
const buttonSizes$1 = {
  "xs-1": "px-2 py-1 text-xs",
  "xs-2": "px-2 py-1 text-xs",
  "xs-3": "px-2 py-1 text-xs",
  "sm-1": "px-4 py-2 text-sm ",
  "sm-2": "px-5 py-2 text-sm ",
  "sm-3": "px-6 py-2 text-sm ",
  "md-1": "px-6 py-3 text-base ",
  "md-2": "px-8 py-3 text-base ",
  "md-3": "px-10 py-3 text-base ",
  "lg-1": "px-8 py-4 text-base ",
  "lg-2": "px-10 py-4 text-base ",
  "lg-3": "px-12 py-4 text-base ",
  "xl-1": "px-10 py-5 text-xl ",
  "xl-2": "px-12 py-6 text-2xl ",
  "xl-3": "px-14 py-7 text-3xl "
};
const buttonVariants$1 = {
  primary: "bg-gradient-main text-white hover:bg-gradient-main-move",
  secondary: "bg-bg-second transition-all duration-200 ease text-text-main hover:bg-bg-second/70",
  third: "bg-bg-third transition-all duration-200 ease text-text-main hover:bg-bg-third/70",
  fourth: "bg-bg-fourth transition-all duration-200 ease text-text-main hover:bg-bg-fourth/70"
};
const Button = forwardRef(
  ({ onClick, variant = "primary", sz = "lg-1", className, children, disabled = false, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        disabled,
        onClick,
        className: clsx(
          buttonSizes$1[sz],
          "font-normal rounded-xl select-none",
          {
            "bg-bg-disabled text-text-fourth": disabled,
            [buttonVariants$1[variant]]: !disabled,
            "active:scale-[0.98] active:opacity-80": !disabled
          },
          className
        ),
        ref,
        ...props,
        children
      }
    );
  }
);
Button.displayName = "Button";
const buttonSizes = {
  "xs-1": "w-[24px] h-[24px] px-2 py-1 text-xs",
  "xs-2": "w-[28px] h-[28px] px-2 py-2 text-xs",
  "xs-3": "w-[32px] h-[32px] px-2 py-2 text-sm",
  "sm-1": "w-[36px] h-[36px] px-4 py-4 text-sm ",
  "sm-2": "w-[40px] h-[40px] px-5 py-5 text-sm ",
  "sm-3": "w-[44px] h-[44px] px-6 py-6 text-sm ",
  "md-1": "w-[48px] h-[48px] px-6 py-6 text-base ",
  "md-2": "w-[56px] h-[56px] px-8 py-8 text-base ",
  "md-3": "w-[64px] h-[64px] px-10 py-10 text-base ",
  "lg-1": "w-[56px] h-[56px] px-8 py-8 text-base ",
  "lg-2": "w-[64px] h-[64px] px-10 py-10 text-base ",
  "lg-3": "w-[72px] h-[72px] px-12 py-12 text-base ",
  "xl-1": "w-[64px] h-[64px] px-10 py-10 text-xl ",
  "xl-2": "w-[72px] h-[72px] px-12 py-12 text-2xl ",
  "xl-3": "w-[80px] h-[80px] px-14 py-14 text-3xl "
};
const buttonVariants = {
  primary: "text-text-main hover:bg-bg-fourth",
  secondary: "bg-bg-second transition-all duration-200 ease text-text-main hover:bg-bg-second/70"
};
const MiniButton = forwardRef(
  ({ onClick, variant = "primary", sz = "lg-1", className, children, disabled = false, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        disabled,
        onClick,
        className: clsx(
          buttonSizes[sz],
          "font-normal rounded-full select-none flex items-center justify-center transition-all duration-300 ease-out",
          {
            "bg-bg-disabled text-text-fourth": disabled,
            [buttonVariants[variant]]: !disabled,
            "active:scale-[0.98] active:opacity-80": !disabled
          },
          className
        ),
        ref,
        ...props,
        children
      }
    );
  }
);
MiniButton.displayName = "MiniButton";
const emptyAvatar = "/images/empty_avatar.png";
const sizeClasses$4 = {
  // Mini sizes
  "xs-1": "w-[24px]",
  "xs-2": "w-[32px]",
  "xs-3": "w-[40px]",
  // Small sizes
  "sm-1": "w-[48px]",
  "sm-2": "w-[56px]",
  "sm-3": "w-[64px]",
  // Medium sizes
  "md-1": "w-[96px]",
  "md-2": "w-[112px] ",
  "md-3": "w-[128px]",
  // Large sizes
  "lg-1": "w-[160px]",
  "lg-2": "w-[192px]",
  "lg-3": "w-[224px]",
  // Extra Large
  "xl-1": "w-[256px]",
  "xl-2": "w-[288px]",
  "xl-3": "w-[320px]"
};
const shapeClasses = {
  square: "rounded-none",
  rounded: "rounded-2xl",
  circle: "rounded-full"
};
const Avatar = ({
  src,
  alt,
  sz = "md-1",
  shape = "circle",
  className,
  children
}) => {
  const sizeClass = sizeClasses$4[sz];
  const shapeClass = shapeClasses[shape];
  const [imgSrc, setImgSrc] = React.useState(src || emptyAvatar);
  useEffect(() => {
    setImgSrc(src || emptyAvatar);
  }, [src]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "relative aspect-square object-contain select-none flex-shrink-0",
        "overflow-hidden",
        sizeClass,
        shapeClass,
        className
      ),
      children: /* @__PURE__ */ jsxs("div", { className: clsx("absolute inset-0 bg-bg-main overflow-hidden"), children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imgSrc || emptyAvatar,
            alt,
            className: clsx("relative z-0 w-full h-full object-cover"),
            onError: () => setImgSrc(emptyAvatar)
          }
        ),
        children
      ] })
    }
  );
};
function Badge({
  count = 0,
  className = "",
  ref = null,
  onClick = () => {
  },
  children
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: clsx(
        "relative flex items-center justify-center rounded-full bg-bg-second",
        "w-[48px] aspect-square text-text-main text-xl",
        "cursor-pointer hover:bg-bg-fourth transition-all duration-200 ease-in-out",
        "active:scale-95",
        className
      ),
      onClick,
      children: [
        children,
        count > 0 && /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "absolute -top-0 bg-red-500 text-text-main text-[10px] min-w-[16px]",
              "h-[16px] px-[4px] rounded-full border-[2px] border-bg-main",
              "flex items-center justify-center",
              count > 99 ? "-right-2" : "-right-1"
            ),
            children: count > 99 ? "99+" : count
          }
        )
      ]
    }
  );
}
const checkmark = "_checkmark_1oahj_3";
const styles$3 = {
  checkmark
};
const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
  isWrong,
  className,
  ...props
}) => {
  const checkmarkClass = styles$3["checkmark"];
  return /* @__PURE__ */ jsxs("label", { className: clsx("relative inline-flex items-start gap-1 select-none", className), children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ...props,
        disabled,
        type: "checkbox",
        checked,
        onChange,
        className: clsx("relative invisible mr-[5px] w-[18px] h-[18px] peer", {
          "cursor-not-allowed": disabled,
          "text-red-500": isWrong
        })
      }
    ),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: clsx(
          "absolute z-[2] rounded-md m-[3px] w-[18px] h-[18px] bg-gradient-main",
          checkmarkClass,
          isWrong && "border border-danger",
          'after:absolute after:invisible after:content-["✓"] after:text-[0.8rem] after:w-[18px] after:h-[18px] after:top-1/2 after:left-1/2',
          "after:-translate-x-1/2 after:-translate-y-1/2 after:m-0 after:text-text-main after:rounded-md",
          "after:text-center after:leading-[18px] after:z-[3] after:opacity-[0.3] after:transition-opacity after:duration-[0.1s]",
          'before:absolute before:content-[""] before:w-3 before:h-3 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2',
          "before:m-0 before:rounded-sm before:bg-bg-second before:z-[2]",
          "peer-checked:after:visible peer-checked:after:opacity-100"
        )
      }
    ),
    /* @__PURE__ */ jsx("span", { className: clsx("text-text-main text-sm", className), children: label })
  ] });
};
const style = {
  "user-bg-image": "_user-bg-image_1szjy_1"
};
function BackgroundImage({ src, alt, className, children }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--bg-image", `url(${src})`);
  }, [src]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "rounded-2xl",
        style["user-bg-image"],
        src ? "" : "h-[200px] bg-bg-fourth",
        className
      ),
      "aria-label": alt,
      children
    }
  );
}
const Link = ({ to, children, onClick, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    Link$1,
    {
      to,
      className: clsx(
        "text-primary-600",
        "hover:text-primary-500 hover:cursor-pointer",
        "transition-all duration-100 active:scale-95 select-none",
        className
      ),
      onClick,
      ...props,
      children
    }
  );
};
const ListItem = ({ key, className, children, ...props }) => {
  return /* @__PURE__ */ jsx("li", { className, ...props, children }, key);
};
const List = ({
  listItems,
  children,
  className,
  itemClassName
}) => {
  return /* @__PURE__ */ jsxs("ul", { className, children: [
    listItems?.map((item, index) => /* @__PURE__ */ jsx(ListItem, { className: `${itemClassName} ${item.className}`, children: item.children }, item.key ?? index)),
    children
  ] });
};
List.Item = ListItem;
const sizeClasses$3 = {
  "xs-1": {
    logo: "lg:text-[16px] sm:text-[15px] text-[10px]",
    slogan: "lg:text-[12px] sm:text-[10px] text-[8px]"
  },
  "xs-2": {
    logo: "lg:text-[20px] sm:text-[20px] text-[15px]",
    slogan: "lg:text-[14px] sm:text-[12px] text-[10px]"
  },
  "xs-3": {
    logo: "lg:text-[20px] sm:text-[20px] text-[10px]",
    slogan: "lg:text-[14px] sm:text-[12px] text-[8px]"
  },
  "sm-1": {
    logo: "lg:text-[28px] sm:text-[25px] text-[15px]",
    slogan: "lg:text-[18px] sm:text-[15px] text-[12px]"
  },
  "sm-2": {
    logo: "lg:text-[32px] sm:text-[30px] text-[20px]",
    slogan: "lg:text-[20px] sm:text-[18px] text-[15px]"
  },
  "sm-3": {
    logo: "lg:text-[32px] sm:text-[30px] text-[20px]",
    slogan: "lg:text-[20px] sm:text-[18px] text-[15px]"
  },
  "md-1": {
    logo: "lg:text-[38px] sm:text-[35px] text-[30px]",
    slogan: "lg:text-[22px] sm:text-[18px] text-[16px]"
  },
  "md-2": {
    logo: "lg:text-[44px] sm:text-[40px] text-[35px]",
    slogan: "lg:text-[26px] sm:text-[22px] text-[20px]"
  },
  "md-3": {
    logo: "lg:text-[44px] sm:text-[40px] text-[35px]",
    slogan: "lg:text-[26px] sm:text-[22px] text-[20px]"
  },
  "lg-1": {
    logo: "lg:text-[50px] sm:text-[45px] text-[40px]",
    slogan: "lg:text-[30px] sm:text-[22px] text-[20px]"
  },
  "lg-2": {
    logo: "lg:text-[50px] sm:text-[45px] text-[40px]",
    slogan: "lg:text-[30px] sm:text-[22px] text-[20px]"
  },
  "lg-3": {
    logo: "lg:text-[56px] sm:text-[50px] text-[45px]",
    slogan: "lg:text-[34px] sm:text-[28px] text-[25px]"
  },
  "xl-1": {
    logo: "lg:text-[56px] sm:text-[50px] text-[45px]",
    slogan: "lg:text-[34px] sm:text-[28px] text-[25px]"
  },
  "xl-2": {
    logo: "lg:text-[62px] sm:text-[55px] text-[50px]",
    slogan: "lg:text-[36px] sm:text-[30px] text-[28px]"
  },
  "xl-3": {
    logo: "lg:text-[68px] sm:text-[60px] text-[55px]",
    slogan: "lg:text-[40px] sm:text-[34px] text-[30px]"
  }
};
const Logo = ({
  hasSlogan = true,
  sz = "md-1",
  className = "",
  ...props
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsx(
      "h1",
      {
        ...props,
        className: clsx(
          "font-bagel_fat_one",
          sizeClasses$3[sz].logo,
          "text-gradient-main select-none",
          className
        ),
        children: "Fatagram"
      }
    ),
    hasSlogan && /* @__PURE__ */ jsx(
      "h2",
      {
        className: clsx(
          sizeClasses$3[sz].slogan,
          "text-gradient-second font-light font-bagel_fat_one select-none whitespace-nowrap"
        ),
        children: "Share your fun moments with the world!"
      }
    )
  ] });
};
const useClickOutside = (refTarget, refException, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refTarget.current && !refTarget.current.contains(event.target)) {
        if (refException.current && refException.current.contains(event.target))
          return;
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refTarget, refException, callback]);
};
const AnimationLib = {
  Fade: {
    in: "animate-fade-in",
    out: "animate-fade-out",
    duration: 100
  },
  SlideRightToLeft: {
    in: "animate-right-to-left-in",
    out: "animate-right-to-left-out",
    duration: 300
  },
  DropdownSlide: {
    in: "animate-dropdown-slide-in",
    out: "animate-dropdown-slide-out",
    duration: 200
  },
  SlideUp: {
    in: "animate-slide-up-in",
    out: "animate-slide-up-out",
    duration: 200
  },
  Opacity: {
    in: "animate-opacity-in",
    out: "animate-opacity-out",
    duration: 300
  },
  None: {
    in: "",
    out: "",
    duration: 0
  }
};
function Transition({
  animation = AnimationLib.None,
  show,
  children,
  className = "",
  duration,
  style: style2
}) {
  const [render2, setRender] = useState(show);
  const timeoutRef = useRef(null);
  const animDuration = duration ?? animation.duration;
  useEffect(() => {
    if (show) {
      setRender(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setRender(false);
    }, animDuration);
  }, [show]);
  const onAnimationEnd = () => {
    if (!show) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setRender(false);
    }
  };
  if (!render2) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(className, show ? animation.in : animation.out),
      onAnimationEnd,
      style: { animationDuration: animDuration + "ms", ...style2 },
      children
    }
  );
}
const SelectBox = ({
  title: title2,
  isRequired = false,
  options,
  selectedOption,
  onSelect,
  optionClassName,
  optionActiveClassName,
  dropdownClassName,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(selectedOption);
  const selectBoxRef = React.useRef(null);
  const btnRef = React.useRef(null);
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);
  useClickOutside(
    selectBoxRef,
    btnRef,
    () => {
      if (isOpen) setIsOpen(false);
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative"), children: [
    title2 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-1 ml-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-text-secondary font-medium", children: title2 }),
      isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
    ] }),
    /* @__PURE__ */ jsx("button", { ref: btnRef, className: clsx("w-full", className), children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "flex items-center justify-between cursor-pointer",
          "bg-bg-fourth px-4 py-2 text-[13px] rounded-xl shadow-md gap-5",
          "hover:bg-bg-hover transition-colors"
        ),
        onClick: () => setIsOpen(!isOpen),
        children: [
          /* @__PURE__ */ jsx(Text, { sz: "md-2", children: options.find((opt) => opt.key === selected)?.value }),
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-caret-down" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      Transition,
      {
        animation: AnimationLib.DropdownSlide,
        show: isOpen,
        duration: 100,
        className: "hidden sm:block",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "absolute w-full ",
              "bg-bg-card rounded-lg shadow-md mt-1 z-50 border border-border-main",
              dropdownClassName
            ),
            ref: selectBoxRef,
            children: /* @__PURE__ */ jsx("ul", { className: "p-1", children: options.map((item, index) => /* @__PURE__ */ jsx(
              "li",
              {
                className: clsx(
                  "px-4 py-2 hover:bg-bg-hover",
                  "cursor-pointer rounded-lg transition-colors",
                  optionClassName,
                  selected === item.key && optionActiveClassName
                ),
                onClick: () => {
                  setSelected(item.key);
                  onSelect(item.key);
                  setIsOpen(false);
                },
                children: item.value
              },
              index
            )) })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(Transition, { animation: AnimationLib.Fade, show: isOpen, duration: 100, className: "sm:hidden", children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-bg-fourth/60 z-[9998]", onClick: () => setIsOpen(false) }) }),
    isOpen && /* @__PURE__ */ jsx("div", { className: "sm:hidden fixed inset-0 z-[9998] bg-black/50" }),
    /* @__PURE__ */ jsx(
      Transition,
      {
        animation: AnimationLib.SlideUp,
        show: isOpen,
        duration: 200,
        className: "sm:hidden fixed left-0 right-0 bottom-0 z-[9999]",
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: selectBoxRef,
            onClick: (e) => e.stopPropagation(),
            className: clsx(
              "bg-bg-card rounded-t-2xl shadow-md border border-border-main",
              "max-h-[72vh] overflow-auto",
              dropdownClassName
            ),
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-1.5 bg-border-main/30 rounded-full mx-auto mt-3 mb-2" }),
              /* @__PURE__ */ jsx("div", { className: "px-6 pb-2 pt-1", children: /* @__PURE__ */ jsx("div", { className: "text-center text-base font-medium text-text-primary", children: title2 ? `${title2}` : "Select" }) }),
              /* @__PURE__ */ jsx("ul", { className: "py-2", children: options.map((item, index) => /* @__PURE__ */ jsx(
                "li",
                {
                  className: clsx(
                    "px-6 py-4 hover:bg-bg-hover/60",
                    "cursor-pointer transition-colors",
                    optionClassName,
                    selected === item.key && (optionActiveClassName ?? "bg-bg-hover/80 text-text-primary")
                  ),
                  onClick: () => {
                    setSelected(item.key);
                    onSelect(item.key);
                    setIsOpen(false);
                  },
                  children: /* @__PURE__ */ jsx("div", { className: "text-base", children: item.value })
                },
                index
              )) }),
              /* @__PURE__ */ jsx("div", { className: "h-6" })
            ]
          }
        )
      }
    )
  ] });
};
const sizeClasses$2 = {
  "xs-1": "h-1",
  "xs-2": "h-1.5",
  "xs-3": "h-2",
  "sm-1": "h-4",
  "sm-2": "h-6",
  "sm-3": "h-8",
  "md-1": "h-10",
  "md-2": "h-12",
  "md-3": "h-16",
  "lg-1": "h-20",
  "lg-2": "h-24",
  "lg-3": "h-32",
  "xl-1": "h-40",
  "xl-2": "h-56",
  "xl-3": "h-72"
};
const Skeleton = ({ className = "", sz = "md-1", variant = "text" }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        `animate-pulse rounded-xl bg-bg-third`,
        { "aspect-square !rounded-full": variant === "circle" },
        sizeClasses$2[sz],
        className
      )
    }
  );
};
const styles$2 = {
  "primary-textbox": "_primary-textbox_3nvi8_1",
  "primary-textbox-wrong": "_primary-textbox-wrong_3nvi8_28"
};
const sizeClasses$1 = {
  "xs-1": { mainText: "px-2 py-1 text-xs", titleText: "text-xs" },
  "xs-2": { mainText: "px-2 py-1 text-xs", titleText: "text-xs" },
  "xs-3": { mainText: "px-2 py-1 text-sm", titleText: "text-sm" },
  "sm-1": { mainText: "px-3 py-1 text-[13px] ", titleText: "text-sm" },
  "sm-2": { mainText: "px-4 py-2 text-[13px] ", titleText: "text-sm" },
  "sm-3": { mainText: "px-5 py-2 text-[13px] ", titleText: "text-sm" },
  "md-1": { mainText: "px-6 py-3 text-base ", titleText: "text-base" },
  "md-2": { mainText: "px-7 py-3 text-base ", titleText: "text-base" },
  "md-3": { mainText: "px-8 py-4 text-base ", titleText: "text-base" },
  "lg-1": { mainText: "px-8 py-4 text-base ", titleText: "text-base" },
  "lg-2": { mainText: "px-9 py-4 text-base ", titleText: "text-base" },
  "lg-3": { mainText: "px-10 py-5 text-base ", titleText: "text-base" },
  "xl-1": { mainText: "px-10 py-5 text-xl ", titleText: "text-xl" },
  "xl-2": { mainText: "px-12 py-6 text-2xl ", titleText: "text-2xl" },
  "xl-3": { mainText: "px-14 py-7 text-3xl ", titleText: "text-3xl" }
};
const Textbox = React.forwardRef(
  ({
    disabled = false,
    isWrong = false,
    wrongMessage,
    title: title2,
    isRequired = false,
    className,
    sz = "sm-1",
    type = "text",
    wrapperClassName,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const typeOfText = type === "text" ? "text" : type === "password" ? showPassword ? "text" : "password" : type === "search" ? "search" : type;
    return /* @__PURE__ */ jsxs("div", { className: clsx(wrapperClassName), children: [
      /* @__PURE__ */ jsxs("div", { className: clsx("relative"), children: [
        title2 && /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "flex items-center gap-1 ml-1 mb-1 font-medium",
              sizeClasses$1[sz].titleText
            ),
            children: [
              /* @__PURE__ */ jsx("label", { htmlFor: title2, children: title2 }),
              isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: typeOfText,
            ref,
            className: clsx(
              "border-[2px] text-text-main",
              "font-normal rounded-xl outline-none text-lg caret-primary-500 selection:!bg-primary-600",
              "transition-all duration-300 ease-out",
              {
                "pl-10": type === "search",
                "bg-bg-main opacity-60 cursor-not-allowed": disabled,
                "focus:bg-gradient-main-move": !disabled,
                [styles$2["primary-textbox-wrong"]]: isWrong && !disabled,
                [styles$2["primary-textbox"]]: !isWrong && !disabled
              },
              sizeClasses$1[sz].mainText,
              className
            ),
            disabled,
            ...props
          }
        ),
        type === "password" && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: clsx("absolute right-0 top-1/2 -translate-y-1/2 mr-5"),
            onClick: () => setShowPassword(!showPassword),
            children: showPassword ? /* @__PURE__ */ jsx("i", { className: clsx("fa-solid fa-eye text-secondary-500") }) : /* @__PURE__ */ jsx("i", { className: clsx("fa-solid fa-eye-slash text-text-main") })
          }
        ),
        type === "search" && /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-text-main" })
      ] }),
      isWrong && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: wrongMessage })
    ] });
  }
);
Textbox.displayName = "Textbox";
const styles$1 = {
  "my-textarea": "_my-textarea_jp58s_1",
  "my-textarea-wrong": "_my-textarea-wrong_jp58s_30"
};
const sizeClasses = {
  "xs-1": "px-2 py-1 text-xs min-h-16",
  "xs-2": "px-2 py-1 text-xs min-h-16",
  "xs-3": "px-2 py-1 text-xs min-h-16",
  "sm-1": "px-3 py-1 text-[16px] min-h-24",
  "sm-2": "px-4 py-2 text-[13px] min-h-24",
  "sm-3": "px-5 py-2 text-[13px] min-h-24",
  "md-1": "px-6 py-3 text-base min-h-28",
  "md-2": "px-7 py-3 text-base min-h-28",
  "md-3": "px-8 py-4 text-base min-h-32",
  "lg-1": "px-8 py-4 text-base min-h-32",
  "lg-2": "px-9 py-4 text-base min-h-32",
  "lg-3": "px-10 py-5 text-base min-h-32",
  "xl-1": "px-10 py-5 text-xl min-h-32",
  "xl-2": "px-12 py-6 text-2xl min-h-32",
  "xl-3": "px-14 py-7 text-3xl min-h-32"
};
const TextArea = forwardRef(
  ({
    placeholder,
    onChange,
    value,
    disabled = false,
    isWrong = false,
    className,
    sz = "sm-1",
    autoComplete = "off",
    name = "",
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        name,
        value,
        ref,
        placeholder,
        autoComplete,
        onChange,
        disabled,
        className: clsx(
          "border-2 text-text-main resize-none",
          "font-normal rounded-[15px] outline-none text-lg caret-primary-500 selection:!bg-primary-600",
          "transition-all duration-300 ease-out",
          disabled ? "bg-bg-second opacity-60 cursor-not-allowed" : "focus:bg-gradient-main-move",
          sizeClasses[sz],
          isWrong ? styles$1["my-textarea-wrong"] : styles$1["my-textarea"],
          className
        ),
        ...props
      }
    );
  }
);
TextArea.displayName = "TextArea";
const textSizes = {
  "xs-1": "text-xs",
  "xs-2": "text-xs",
  "xs-3": "text-xs",
  "sm-1": "text-sm",
  "sm-2": "text-sm",
  "sm-3": "text-[15px]",
  "md-1": "text-md",
  "md-2": "text-lg",
  "md-3": "text-md",
  "lg-1": "text-xl",
  "lg-2": "text-2xl",
  "lg-3": "text-3xl",
  "xl-1": "text-4xl",
  "xl-2": "text-5xl",
  "xl-3": "text-6xl"
};
const weightClasses = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
  extrabold: "font-extrabold"
};
const colorClasses = {
  primary: "text-text-main",
  secondary: "text-primary-600",
  danger: "text-red-400",
  success: "text-green-600",
  warning: "text-yellow-600"
};
const Text = forwardRef(
  ({
    as: Component = "span",
    sz = "md-1",
    weight = "regular",
    color = "primary",
    wrap = "whitespace-nowrap",
    className = "",
    children,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx(
      Component,
      {
        className: clsx(textSizes[sz], weightClasses[weight], colorClasses[color], wrap, className),
        ref,
        ...props,
        children
      }
    );
  }
);
const Footer = ({ className }) => {
  return /* @__PURE__ */ jsxs("footer", { className: clsx("text-center text-text-third text-sm py-4", className), children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " Fatagram. All rights reserved."
  ] });
};
const SelectDay = ({
  title: title2,
  isRequired = false,
  isWrong = false,
  wrongMessage,
  className,
  value,
  onChange,
  ...props
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    title2 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 ml-1", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-text-secondary font-medium", children: title2 }),
      isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "date",
        value,
        onChange,
        className: clsx(
          "border-[2px] text-text-main font-normal rounded-xl outline-none",
          "text-lg caret-primary-500 selection:!bg-primary-600",
          "transition-all duration-300 ease-out",
          "px-3 py-1 text-[13px] shadow-sm",
          "bg-bg-fourth border-border-main",
          "focus:ring-2 focus:ring-primary-500",
          isWrong && "border-error",
          className
        ),
        max: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        ...props
      }
    ),
    isWrong && wrongMessage && /* @__PURE__ */ jsx("span", { className: "text-xs text-error ml-1", children: wrongMessage })
  ] });
};
const SelectFile = ({
  onChange,
  accept = "*",
  multiple = false,
  className,
  children
}) => {
  const handleChange = (e) => {
    if (e.target.files) {
      onChange(e.target.files[0]);
      e.target.value = "";
    }
  };
  const inputRef = React.useRef(null);
  const handleClick = () => {
    inputRef.current?.click();
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "bg-bg-fourth transition-all duration-200 ease hover:bg-bg-fourth/40",
        "rounded-lg px-4 py-2 cursor-pointer text-[13px]",
        className
      ),
      onClick: handleClick,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept,
            multiple,
            className: "hidden",
            onChange: handleChange,
            title: "Select a file"
          }
        ),
        children
      ]
    }
  );
};
const Dropdown = ({
  items,
  isShow,
  onSelect,
  showPolygon = true,
  className,
  ref
}) => {
  if (!isShow) return null;
  return /* @__PURE__ */ jsxs("div", { className: clsx("rounded-2xl p-2 bg-bg-seventh", className), ref, children: [
    showPolygon && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx(
          "absolute hidden sm:flex sm:-top-2 sm:left-[10%] -translate-x-1/2 w-0 h-0",
          "border-l-8 border-l-transparent",
          "border-r-8 border-r-transparent",
          "border-b-8 border-b-bg-seventh rounded-sm"
        )
      }
    ),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1 w-full", children: items.map((item, index) => /* @__PURE__ */ jsx(
      "li",
      {
        onClick: () => {
          item.onClick?.();
          onSelect?.(item);
        },
        className: clsx(
          "w-full text-left px-3 py-2 !rounded-md text-sm",
          "hover:bg-bg-fourth cursor-pointer select-none"
        ),
        children: item.content
      },
      index
    )) })
  ] });
};
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["NewFriendRequest"] = "NewFriendRequest";
  NotificationType2["FriendRequestAccepted"] = "FriendRequestAccepted";
  NotificationType2["FriendRequestCanceled"] = "FriendRequestCanceled";
  NotificationType2["System"] = "System";
  NotificationType2["CancelNotification"] = "CancelNotification";
  return NotificationType2;
})(NotificationType || {});
const NotificationDefault = {
  id: "",
  userId: "",
  type: "Unknown",
  data: {},
  actorId: "",
  actorName: "Unknown",
  actorImageUrl: "",
  link: "/",
  content: "You have a new notification",
  isRead: true,
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
};
const PREFIX$5 = buildApiPath("/friendship");
class FriendshipService {
  async GetFriendshipStatus(targetId) {
    return apiGet(`${PREFIX$5}/status/${targetId}`);
  }
  async SendAddFriendRequest(receiverId) {
    return apiPost(`${PREFIX$5}/add/${receiverId}`);
  }
  async CancelAddFriendRequest(senderId) {
    return apiDelete(`${PREFIX$5}/cancel/${senderId}`);
  }
  async AcceptAddFriendRequest(senderId) {
    return apiPost(`${PREFIX$5}/accept/${senderId}`);
  }
  async DeclineAddFriendRequest(requesterId) {
    return apiDelete(`${PREFIX$5}/decline/${requesterId}`);
  }
  async Unfriend(friendId) {
    return apiDelete(`${PREFIX$5}/unfriend/${friendId}`);
  }
  async GetNumberOfFriends(targetId) {
    return apiGet(`${PREFIX$5}/count/${targetId}`);
  }
  async GetFriendRequests(query) {
    return await apiGet(`${PREFIX$5}/requests`, query);
  }
  async GetFriends(userId, query) {
    return await apiGet(`${PREFIX$5}/friends/${userId}`, query);
  }
}
const friendshipService = new FriendshipService();
function renderContent(template, values) {
  const regex = /\{(\w+)\}/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push(template.slice(lastIndex, match.index));
    }
    parts.push(values[match[1]]);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex));
  }
  return /* @__PURE__ */ jsx(Fragment, { children: parts.map((part) => part) });
}
const typeToI18nKey = {
  [NotificationType.NewFriendRequest]: "notifications:notifications.has-a-friend-request",
  [NotificationType.FriendRequestAccepted]: "notifications:notifications.accepted-friend-request",
  [NotificationType.FriendRequestCanceled]: "notifications:notifications.canceled-friend-request",
  [NotificationType.System]: "notifications:notifications.system-notification"
};
function getNotificationContent(type, fallbackContent, t) {
  const i18nKey = typeToI18nKey[type];
  if (i18nKey && t) {
    return `{actorName} ${t(i18nKey)}`;
  }
  if (fallbackContent) {
    return fallbackContent;
  }
  return t ? `{actorName} ${t("notifications:notifications.default-notification")}` : "{actorName}";
}
function timeDistance(date, now = /* @__PURE__ */ new Date()) {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
  if (seconds < 10) {
    return { text: "times:just_now" };
  }
  const intervals = [
    [60, "times:time.second"],
    // < 60s  → second
    [3600, "times:time.minute"],
    // < 1h   → minute
    [86400, "times:time.hour"],
    // < 24h  → hour
    [604800, "times:time.day"],
    // < 7d   → day
    [2592e3, "times:time.week"],
    // < 30d  → week
    [31536e3, "times:time.month"],
    // < 365d → month
    [Number.MAX_SAFE_INTEGER, "times:time.year"]
  ];
  for (let i = 0; i < intervals.length; i++) {
    if (seconds < intervals[i][0]) {
      const prev = i === 0 ? 1 : intervals[i - 1][0];
      const count = Math.floor(seconds / prev);
      return {
        count,
        unit: intervals[i][1] + (count > 1 ? ":other" : ":one"),
        text: "times:ago"
      };
    }
  }
  return { text: date.toLocaleDateString() };
}
const useFormatTime = () => {
  const { t } = useTranslation();
  const formatTime = (rawTime) => {
    const _rawTime = new Date(rawTime);
    const time2 = timeDistance(_rawTime);
    if (time2.count) {
      return t(`${time2.unit}`, { count: time2.count }) + " " + t(time2.text);
    }
    return t("times:just_now");
  };
  const formatSmartTimestamp = (date) => {
    const _date = new Date(date);
    const now = /* @__PURE__ */ new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffInDays = Math.floor(
      (startOfToday.getTime() - new Date(_date.getFullYear(), _date.getMonth(), _date.getDate()).getTime()) / (1e3 * 60 * 60 * 24)
    );
    if (diffInDays === 0) {
      return _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
    if (diffInDays === 1) {
      const time2 = _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      return `${t("times:yesterday")} ${time2}`;
    }
    if (diffInDays < 7) {
      const time2 = _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      return `${t(`times:weekday:${_date.getDay()}`)} ${time2}`;
    }
    return _date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };
  const getDiffBetween = (startDate, endDate, unit = "minute") => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffMs = Math.abs(end - start);
    const factors = {
      second: 1e3,
      minute: 1e3 * 60,
      hour: 1e3 * 60 * 60,
      day: 1e3 * 60 * 60 * 24
    };
    return Math.floor(diffMs / factors[unit]);
  };
  return { formatTime, formatSmartTimestamp, getDiffBetween };
};
const BaseNotification = ({
  notificationDto,
  children,
  onClick
}) => {
  const { t } = useTranslation();
  const content = getNotificationContent(notificationDto.type, notificationDto.content, t);
  const { formatTime } = useFormatTime();
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2 select-none", onClick, children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-start", children: /* @__PURE__ */ jsx(Avatar, { border: 0, src: notificationDto.actorImageUrl, alt: "Avatar", sz: "sm-1" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
      /* @__PURE__ */ jsx(
        Text,
        {
          sz: "sm-2",
          className: clsx({ "opacity-60": notificationDto.isRead }),
          wrap: "whitespace-normal",
          children: renderContent(content, {
            actorName: /* @__PURE__ */ jsx(Text, { sz: "sm-2", weight: "bold", children: notificationDto.actorName }, notificationDto.actorId)
          })
        }
      ),
      /* @__PURE__ */ jsx(
        Text,
        {
          sz: "sm-1",
          color: notificationDto.isRead ? "primary" : "secondary",
          className: clsx({ "opacity-70": notificationDto.isRead }),
          children: formatTime(notificationDto.createdAt)
        }
      ),
      children
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center", children: !notificationDto.isRead && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full" }) })
  ] });
};
const messageMap = {};
const NewFriendRequest = ({
  notificationDto,
  onClick = () => {
  }
}) => {
  const [message, setMessage] = React.useState(
    messageMap[notificationDto.id] || null
  );
  const { t } = useTranslation();
  const navigate = useNavigate$1();
  const handleClick = useCallback(() => {
    onClick();
    navigate("/" + notificationDto.actorId);
  }, [onClick, navigate, notificationDto.actorId]);
  const handleAccept = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const acceptFriendRequest = async () => {
      const response = await friendshipService.AcceptAddFriendRequest(notificationDto.actorId);
      if (response.success) {
        setMessage(t("notifications:notifications.accepted"));
        messageMap[notificationDto.id] = t("notifications:notifications.accepted");
      }
    };
    acceptFriendRequest();
  };
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const deleteFriendRequest = async () => {
      const response = await friendshipService.DeclineAddFriendRequest(notificationDto.actorId);
      if (response.success) {
        setMessage(t("notifications:notifications.declined"));
        messageMap[notificationDto.id] = t("notifications:notifications.declined");
      }
    };
    deleteFriendRequest();
  };
  return /* @__PURE__ */ jsx(BaseNotification, { notificationDto, onClick: handleClick, children: !message ? /* @__PURE__ */ jsxs("div", { className: clsx("flex", "gap-1", "mt-1", "justify-start"), children: [
    /* @__PURE__ */ jsx(Button, { sz: "sm-1", variant: "primary", onClick: handleAccept, children: t("user:profileHeader.acceptButton") }),
    /* @__PURE__ */ jsx(Button, { sz: "sm-1", variant: "secondary", onClick: handleDelete, children: t("user:profileHeader.declineButton") })
  ] }) : /* @__PURE__ */ jsx(Text, { sz: "sm-2", className: clsx("opacity-70"), children: message }) });
};
const CanceledFriendRequest = ({
  notificationDto,
  onClick = () => {
  }
}) => {
  return /* @__PURE__ */ jsx(BaseNotification, { notificationDto, onClick });
};
const FriendRequestAccepted = ({
  notificationDto,
  onClick
}) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    onClick?.();
    navigate("/" + notificationDto.actorId);
  }, [navigate, onClick, notificationDto.actorId]);
  return /* @__PURE__ */ jsx(BaseNotification, { notificationDto, onClick: handleClick });
};
const NotificationSkeleton = () => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center"), children: [
    /* @__PURE__ */ jsx(Skeleton, { sz: "md-2", variant: "circle" }),
    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col w-full flex-1 gap-2 ml-2"), children: [
      /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-full"), sz: "sm-2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-[50%]"), sz: "sm-2" })
    ] })
  ] });
};
const NotificationFactory = ({
  notificationDto,
  onClick = () => {
  }
}) => {
  switch (notificationDto.type) {
    case NotificationType.NewFriendRequest:
      return /* @__PURE__ */ jsx(NewFriendRequest, { notificationDto, onClick });
    case NotificationType.FriendRequestAccepted:
      return /* @__PURE__ */ jsx(FriendRequestAccepted, { notificationDto, onClick });
    case NotificationType.FriendRequestCanceled:
      return /* @__PURE__ */ jsx(CanceledFriendRequest, { notificationDto, onClick });
    case NotificationType.System:
      return /* @__PURE__ */ jsx(BaseNotification, { notificationDto, onClick });
    default:
      return /* @__PURE__ */ jsx(BaseNotification, { notificationDto: NotificationDefault, onClick });
  }
};
const ToastContext = React.createContext({
  pushToast: () => {
  }
});
const ToastManager = React.memo(function ToastManager2({
  className,
  children
}) {
  const [toast, setToast] = React.useState(null);
  const [_timer, setTimer] = React.useState(null);
  const navigate = useNavigate();
  const pushToast = React.useCallback((item) => {
    setTimer((prevTimer) => {
      if (prevTimer) {
        clearTimeout(prevTimer);
      }
      return null;
    });
    setToast(item);
    const newTimer = setTimeout(() => {
      setToast(null);
    }, item.duration || 3e3);
    setTimer(newTimer);
  }, []);
  const value = React.useMemo(() => ({ pushToast }), [pushToast]);
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value, children: [
    children,
    toast && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `animate-left-to-right fixed bottom-8 left-8 rounded-2xl shadow-2xl
                    bg-bg-second max-w-full z-50
                     ${className}`,
        children: [
          toast.type === "notification" ? /* @__PURE__ */ jsxs("div", { className: "px-4 py-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsx(Text, { weight: "bold", children: "New notification" }),
            /* @__PURE__ */ jsx(
              NotificationFactory,
              {
                notificationDto: toast.payload.notificationDto,
                onClick: () => navigate(toast.payload.notificationDto.link)
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { children: "More" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              sz: "sm-1",
              variant: "third",
              className: "absolute top-2 right-2",
              onClick: () => setToast(null),
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
            }
          )
        ]
      }
    )
  ] });
});
const ToastProvider = React.memo(function ToastProvider2({
  children
}) {
  return /* @__PURE__ */ jsx(ToastManager, { children });
});
function useToast() {
  const context = React.useContext(ToastContext);
  if (context === void 0) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
const DialogContext = createContext({
  isOpen: false,
  dialogProps: null,
  openDialog: () => {
  },
  closeDialog: () => {
  }
});
const DialogProvider = React.memo(function DialogProvider2({
  children
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogProps, setDialogProps] = React.useState(null);
  const openDialog = React.useCallback((props) => {
    setDialogProps(props);
    setIsOpen(true);
  }, []);
  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    setDialogProps(null);
  }, []);
  const value = React.useMemo(
    () => ({
      isOpen,
      dialogProps,
      openDialog,
      closeDialog
    }),
    [isOpen, dialogProps, openDialog, closeDialog]
  );
  return /* @__PURE__ */ jsx(DialogContext.Provider, { value, children });
});
function useDialog() {
  const context = React.useContext(DialogContext);
  if (context === void 0) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
const LoadingPage = () => {
  return /* @__PURE__ */ jsx("div", { className: clsx("fixed inset-0 z-[9999] flex justify-center items-center bg-bg-main"), children: /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col items-center"), children: /* @__PURE__ */ jsx(Logo, { sz: "lg-1", hasSlogan: false }) }) });
};
const LoadingContext = React.createContext({
  count: 0,
  increment: () => {
  },
  decrement: () => {
  }
});
const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => Math.max(0, prev - 1)), []);
  const value = useMemo(() => ({ count, increment, decrement }), [count, increment, decrement]);
  return /* @__PURE__ */ jsxs(LoadingContext.Provider, { value, children: [
    count > 0 && /* @__PURE__ */ jsx(LoadingPage, {}),
    children
  ] });
};
const ThemeList = [
  "light",
  "dark",
  "universe",
  "neon",
  "dark-sea",
  "dark-yellow",
  "light-yellow-pink"
];
const ThemeContext = createContext({
  availableThemes: [],
  theme: "light",
  setTheme: () => {
  }
});
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored && ThemeList.some((t) => t === stored)) {
    return stored;
  }
  const domTheme = document.documentElement.getAttribute("data-theme");
  if (domTheme && ThemeList.some((t) => t === domTheme)) {
    return domTheme;
  }
  return "light";
}
function ThemeProvider({ children }) {
  const [theme2, setTheme] = useState(getInitialTheme);
  const t = useTranslation().t;
  const availableThemes = [
    { key: "light", label: t("common:themes:light") },
    { key: "dark", label: t("common:themes:dark") },
    { key: "universe", label: t("common:themes:universe") },
    { key: "neon", label: t("common:themes:neon") },
    { key: "dark-sea", label: t("common:themes:darkSea") },
    { key: "dark-yellow", label: t("common:themes:darkYellow") },
    { key: "light-yellow-pink", label: t("common:themes:lightYellowPink") }
  ];
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme2);
    localStorage.setItem("theme", theme2);
  }, [theme2]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { availableThemes, theme: theme2, setTheme }, children });
}
function useTheme() {
  return useContext(ThemeContext);
}
const SnackbarContext = createContext({
  showSnackbar: () => {
  }
});
const SnackbarProvider = React.memo(function SnackbarProvider2({
  children
}) {
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [timer, setTimer] = useState(null);
  const [displaySnackbar, setDisplaySnackbar] = useState(null);
  const durationAnim = 300;
  const showSnackbar = useCallback(
    (message, type = "info", duration = 3e3) => {
      if (timer) {
        clearTimeout(timer);
      }
      const id = Date.now().toString();
      const newSnackbar = { id, message, type, duration };
      setVisibleSnackbar(true);
      setDisplaySnackbar(newSnackbar);
      const newTimer = setTimeout(() => {
        setVisibleSnackbar(false);
        setTimeout(() => setDisplaySnackbar(null), durationAnim);
      }, duration);
      setTimer(newTimer);
    },
    [timer]
  );
  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check text-green-500" });
      case "error":
        return /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-xmark text-red-500" });
      case "warning":
        return /* @__PURE__ */ jsx("i", { className: "fa-solid fa-triangle-exclamation text-yellow-500" });
      case "info":
      default:
        return /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info text-blue-500" });
    }
  };
  return /* @__PURE__ */ jsxs(SnackbarContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx(
      Transition,
      {
        className: "fixed bottom-6 right-6 z-50",
        animation: AnimationLib.SlideRightToLeft,
        show: visibleSnackbar,
        duration: durationAnim,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `px-4 py-3 rounded-lg shadow-lg
                     bg-bg-fourth 
                     flex items-center gap-3
                     min-w-[300px] max-w-[500px]`,
            children: [
              getIcon(displaySnackbar?.type ?? "info"),
              /* @__PURE__ */ jsx("span", { className: "text-text-main flex-1", children: displaySnackbar?.message }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setVisibleSnackbar(false),
                  className: "text-text-third hover:text-text-main transition-colors",
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
                }
              )
            ]
          }
        )
      }
    )
  ] });
});
function useSnackbar() {
  const context = React.useContext(SnackbarContext);
  if (context === void 0) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
function ContextTree({ children, authContext }) {
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(
    AuthProvider,
    {
      initialIsAuthenticated: authContext?.isAuthenticated,
      userData: authContext?.userData,
      children: /* @__PURE__ */ jsx(LoadingProvider, { children: /* @__PURE__ */ jsx(DialogProvider, { children: /* @__PURE__ */ jsx(SnackbarProvider, { children: /* @__PURE__ */ jsx(ToastProvider, { children }) }) }) })
    }
  ) });
}
const Dialog = ({
  title: title2,
  content,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  onClose,
  className
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex flex-col gap-4 bg-[var(--second-bg-color)]",
        "rounded-lg shadow-lg",
        className
      ),
      children: [
        title2 && /* @__PURE__ */ jsx(Text, { weight: "bold", sz: "lg-2", children: title2 }),
        content && /* @__PURE__ */ jsx("div", { children: content }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
          tertiaryButton && /* @__PURE__ */ jsx(Button, { onClick: tertiaryButton.onClick, variant: "secondary", sz: "sm-1", children: tertiaryButton.text }),
          secondaryButton && /* @__PURE__ */ jsx(Button, { onClick: secondaryButton.onClick, variant: "secondary", sz: "sm-1", children: secondaryButton.text }),
          primaryButton && /* @__PURE__ */ jsx(Button, { onClick: primaryButton.onClick, variant: "primary", sz: "sm-1", children: primaryButton.text })
        ] }),
        /* @__PURE__ */ jsx(
          Text,
          {
            className: clsx(
              "absolute top-3 right-5 text-[20px]",
              "text-gradient-main hover:text-single-main",
              "cursor-pointer"
            ),
            onClick: onClose,
            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
          }
        )
      ]
    }
  );
};
const GlobalDialog = () => {
  const { isOpen, dialogProps, closeDialog } = useDialog();
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("fixed z-[9998] inset-0 flex items-center justify-center", "bg-bg-overlay"),
      children: /* @__PURE__ */ jsx(Dialog, { ...dialogProps, onClose: closeDialog })
    }
  );
};
function createSafeQueryOptions(params) {
  return {
    queryKey: params.queryKey,
    queryFn: async () => {
      const result = await params.fn();
      if (!result.success) throw result;
      return result.data;
    }
  };
}
function useSafeQueryResult(params) {
  const { fn, options, ...queryOptions } = params;
  const callbacksCalledRef = useRef(false);
  const safeOptions = createSafeQueryOptions({ queryKey: queryOptions.queryKey, fn });
  const query = useQuery({
    ...queryOptions,
    ...safeOptions,
    retry: 0
  });
  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (!callbacksCalledRef.current) {
        options?.onSuccess?.(query.data);
        callbacksCalledRef.current = true;
      }
    } else if (query.isError) {
      if (!callbacksCalledRef.current) {
        const errorResult = query.error;
        options?.onError?.(errorResult.error, errorResult.errors);
        callbacksCalledRef.current = true;
      }
    } else if (query.isPending) {
      callbacksCalledRef.current = false;
    }
  }, [query.status]);
  return query;
}
function useSafeInfiniteQueryResult(params) {
  const { fn, options, ...queryOptions } = params;
  const query = useInfiniteQuery({
    ...queryOptions,
    queryFn: async ({ pageParam }) => {
      const result = await fn(pageParam);
      if (!result.success) {
        throw result;
      }
      return result.data;
    },
    initialPageParam: void 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : void 0;
    }
  });
  useEffect(() => {
    if (query.isSuccess && query.data) {
      const pages = query.data.pages;
      const lastPage = pages[pages.length - 1];
      if (lastPage) {
        options?.onSuccess?.(lastPage);
      }
    }
    if (query.isError && query.error) {
      const errRes = query.error;
      options?.onError?.(errRes.error, errRes.errors);
    }
  }, [query.status]);
  return query;
}
const PREFIX$4 = buildApiPath("/notification");
class NotificationService {
  async getNotifications(query) {
    return await apiGet(`${PREFIX$4}`, query);
  }
  async markAsRead(notificationId) {
    return await apiPost(`${PREFIX$4}/${notificationId}/read`);
  }
  async markAllAsRead() {
    return await apiPost(`${PREFIX$4}/read-all`);
  }
  async getUnreadCount() {
    return await apiGet(`${PREFIX$4}/unread-count`);
  }
  async delete(notificationId) {
    return await apiDelete(`${PREFIX$4}/${notificationId}`);
  }
  async deleteAll() {
    return await apiDelete(`${PREFIX$4}`);
  }
}
const notificationService = new NotificationService();
const notificationKeys = {
  list: (userId, params) => ["notifications", userId, params],
  unreadCount: (userId) => ["notifications-unread-count", userId],
  uiState: () => ["notifications-ui-state"]
};
const DEFAULT_UI_STATE = {
  isShowNotification: false,
  isInNotificationPage: false
};
function useNotificationUiState() {
  const queryClient = useQueryClient();
  const { data: uiState = DEFAULT_UI_STATE } = useQuery({
    queryKey: notificationKeys.uiState(),
    queryFn: () => DEFAULT_UI_STATE,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const setShowNotification = useCallback(
    (value) => {
      queryClient.setQueryData(notificationKeys.uiState(), (old) => ({
        ...old ?? DEFAULT_UI_STATE,
        isShowNotification: value
      }));
    },
    [queryClient]
  );
  const setInNotificationPage = useCallback(
    (value) => {
      queryClient.setQueryData(notificationKeys.uiState(), (old) => ({
        ...old ?? DEFAULT_UI_STATE,
        isInNotificationPage: value
      }));
    },
    [queryClient]
  );
  return {
    isShowNotification: uiState.isShowNotification,
    isInNotificationPage: uiState.isInNotificationPage,
    setShowNotification,
    setInNotificationPage
  };
}
function useUnreadCount() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: unreadCount = 0 } = useSafeQueryResult({
    queryKey: notificationKeys.unreadCount(userId),
    fn: async () => await notificationService.getUnreadCount(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!userId
  });
  const setUnreadCount = useCallback(
    (value) => {
      queryClient.setQueryData(
        notificationKeys.unreadCount(userId),
        (old = 0) => typeof value === "function" ? value(old) : value
      );
    },
    [queryClient, userId]
  );
  const incrementUnread = useCallback(
    (by = 1) => setUnreadCount((prev) => prev + by),
    [setUnreadCount]
  );
  const decrementUnread = useCallback(
    (by = 1) => setUnreadCount((prev) => Math.max(prev - by, 0)),
    [setUnreadCount]
  );
  return { unreadCount, setUnreadCount, incrementUnread, decrementUnread };
}
function useNotificationCacheMutations() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const addNotificationToCache = useCallback(
    (notification) => {
      queryClient.setQueriesData(
        { queryKey: ["notifications", userId] },
        (oldData) => {
          if (!oldData?.pages?.length) {
            return {
              pages: [{ items: [notification], nextCursor: void 0, hasNext: false }],
              pageParams: [void 0]
            };
          }
          const firstPage = oldData.pages[0];
          if (firstPage.items.some((n) => n.id === notification.id)) return oldData;
          return {
            ...oldData,
            pages: [
              { ...firstPage, items: [notification, ...firstPage.items] },
              ...oldData.pages.slice(1)
            ]
          };
        }
      );
    },
    [queryClient, userId]
  );
  const removeNotificationFromCache = useCallback(
    (notificationId) => {
      queryClient.setQueriesData(
        { queryKey: ["notifications", userId] },
        (oldData) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => n.id !== notificationId)
            }))
          };
        }
      );
    },
    [queryClient, userId]
  );
  const markAsReadInCache = useCallback(
    (notificationId) => {
      queryClient.setQueriesData(
        { queryKey: ["notifications", userId] },
        (oldData) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => n.id === notificationId ? { ...n, isRead: true } : n)
            }))
          };
        }
      );
    },
    [queryClient, userId]
  );
  const markAllAsReadInCache = useCallback(() => {
    queryClient.setQueriesData(
      { queryKey: ["notifications", userId] },
      (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((n) => ({ ...n, isRead: true }))
          }))
        };
      }
    );
  }, [queryClient, userId]);
  const clearAllFromCache = useCallback(() => {
    queryClient.setQueriesData(
      { queryKey: ["notifications", userId] },
      (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: []
          }))
        };
      }
    );
  }, [queryClient, userId]);
  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
  }, [queryClient, userId]);
  return {
    addNotificationToCache,
    removeNotificationFromCache,
    markAsReadInCache,
    markAllAsReadInCache,
    clearAllFromCache,
    invalidateNotifications
  };
}
let connection = null;
const createSignalRConnection = () => {
  try {
    connection = new signalR.HubConnectionBuilder().withUrl(`${appConfig.apiUrl}/hubs/app`, {
      withCredentials: true
    }).withAutomaticReconnect().configureLogging(signalR.LogLevel.Error).build();
    return connection;
  } catch (error) {
    console.error("Error creating SignalR connection: ", error);
    throw error;
  }
};
function useAppHub(onReceiveMessage) {
  const connectionRef = useRef(null);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const startConnection = async () => {
      const conn = createSignalRConnection();
      connectionRef.current = conn;
      const tryConnect = async (retry = 0) => {
        try {
          await conn.start();
          conn.on("ReceiveMessage", (message) => {
            if (isMounted) {
              onReceiveMessage(message);
            }
          });
        } catch (err) {
          if (err?.message?.includes("ONBOARDING_NOT_COMPLETED")) {
            authEvents.emit("redirectToOnboarding");
            return;
          }
          console.error("SignalR connection error: ", err);
          if (retry < 5) {
            setTimeout(() => tryConnect(retry + 1), 500);
          }
        }
      };
      tryConnect();
    };
    startConnection();
    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [isAuthenticated]);
}
function NotificationListener() {
  const { pushToast } = useToast();
  const { incrementUnread, decrementUnread } = useUnreadCount();
  const { addNotificationToCache, removeNotificationFromCache } = useNotificationCacheMutations();
  const handleNewNotification = useCallback(
    (message) => {
      if (message.event !== "NewNotification") return;
      const data = message.payload;
      if (data.type === NotificationType.CancelNotification) {
        const notificationIdToCancel = data.data.notificationId;
        removeNotificationFromCache(notificationIdToCancel);
        decrementUnread();
        return;
      }
      addNotificationToCache(data);
      incrementUnread();
      pushToast({
        id: data.id,
        type: "notification",
        payload: {
          notificationDto: data
        },
        duration: 5e3
      });
    },
    [
      pushToast,
      addNotificationToCache,
      removeNotificationFromCache,
      incrementUnread,
      decrementUnread
    ]
  );
  useAppHub(handleNewNotification);
  return null;
}
const notificationQueryKey = (userId, queryParams) => ["notifications", userId, queryParams];
const useNotifications = (queryParams) => {
  const { userId } = useAuth();
  return useSafeInfiniteQueryResult({
    queryKey: notificationQueryKey(userId, queryParams),
    fn: async (cursor) => await notificationService.getNotifications({ ...queryParams, cursor }),
    enabled: !!userId
  });
};
const useMarkNotificationAsRead = () => {
  return useResultFetcher(
    (notificationId) => notificationService.markAsRead(notificationId)
  );
};
const useDeleteAllNotifications = () => {
  const qc = useQueryClient();
  return useResultFetcher(notificationService.deleteAll, {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
};
function InfiniteScrollGrid({
  itemMinWidth,
  items,
  loadingSkeleton,
  numberOfSkeletons = 4,
  className,
  hasMore = true,
  isLoading = false,
  itemTemplate,
  onLoadMore,
  isShowLastSeen = false,
  itemKey,
  emptyComponent
}) {
  const sentinelRef = useRef(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          await onLoadMore();
        }
      },
      {
        rootMargin: "100px"
        // Load sớm trước khi chạm hẳn đáy 100px
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${itemMinWidth}, 1fr))`,
        gap: "0.5rem",
        position: "relative"
      },
      children: [
        items.map((item, index) => /* @__PURE__ */ jsx("div", { className: "w-full", children: itemTemplate ? itemTemplate(item, index) : item }, itemKey ? itemKey(item, index) : index)),
        isLoading && /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: numberOfSkeletons }).map((_, index) => /* @__PURE__ */ jsx("div", { children: loadingSkeleton ?? "Loading..." }, `skeleton-${index}`)) }),
        hasMore && /* @__PURE__ */ jsx("div", { ref: sentinelRef, style: { gridColumn: "1 / -1", height: "10px" } }),
        !hasMore && items.length > 0 && isShowLastSeen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "1rem 0",
              color: "var(--text-third-color)"
            },
            children: "Đã xem hết kết quả."
          }
        ),
        items.length === 0 && !isLoading && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "1rem 0",
              color: "var(--text-third-color)"
            },
            children: emptyComponent ?? "Không có dữ liệu nào."
          }
        )
      ]
    }
  );
}
const NotificationMenu = ({ className, ref }) => {
  const { t } = useTranslation();
  const navigate = useNavigate$1();
  const { data, fetchNextPage, hasNextPage, isFetching } = useNotifications({
    limit: 20
  });
  const { fetch: deleteAll } = useDeleteAllNotifications();
  const { isInNotificationPage } = useNotificationUiState();
  const { unreadCount, setUnreadCount } = useUnreadCount();
  const { markAsReadInCache, markAllAsReadInCache, clearAllFromCache, invalidateNotifications } = useNotificationCacheMutations();
  const { fetch: markAsRead } = useMarkNotificationAsRead();
  const notifications2 = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);
  const handleMarkAllAsRead = async () => {
    markAllAsReadInCache();
    setUnreadCount(0);
    await notificationService.markAllAsRead();
    invalidateNotifications();
  };
  const handleDeleteAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteAll({
      onSuccess: () => {
        clearAllFromCache();
        setUnreadCount(0);
        invalidateNotifications();
      },
      onError: () => {
        console.error("Failed to delete all notifications");
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide",
        className
      ),
      ref,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 pt-2", children: [
          /* @__PURE__ */ jsx(Text, { sz: "lg-1", weight: "bold", children: t("notifications:notifications.title") }),
          notifications2.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            unreadCount > 0 && /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer",
                onClick: handleMarkAllAsRead,
                title: t("notifications:notifications.mark-all-read"),
                children: /* @__PURE__ */ jsx(Text, { sz: "md-1", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check-double" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer",
                onClick: handleDeleteAll,
                title: t("notifications:notifications.delete-all"),
                children: /* @__PURE__ */ jsx(Text, { sz: "md-1", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can" }) })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative py-1 max-h-[500px] overflow-y-auto scrollbar-hide", children: /* @__PURE__ */ jsx(
          InfiniteScrollGrid,
          {
            itemMinWidth: "300px",
            items: notifications2,
            onLoadMore: fetchNextPage,
            className: "gap-0 scrollbar-hide w-full",
            itemTemplate: (item) => {
              const notification = item;
              return /* @__PURE__ */ jsx(
                "div",
                {
                  className: clsx(
                    "px-2 py-3 hover:bg-bg-fourth rounded-lg cursor-pointer",
                    "transition-all duration-200 hover:scale-[1.01]",
                    "active:scale-[0.99]"
                  ),
                  children: /* @__PURE__ */ jsx(
                    NotificationFactory,
                    {
                      notificationDto: notification,
                      onClick: async () => {
                        markAsRead(notification.id, {
                          onSuccess: () => {
                            markAsReadInCache(notification.id);
                            setUnreadCount((prev) => Math.max(prev - 1, 0));
                          }
                        });
                      }
                    }
                  )
                }
              );
            },
            itemKey: (item, index) => item.id + "-" + index,
            hasMore: !!hasNextPage,
            isLoading: isFetching,
            loadingSkeleton: /* @__PURE__ */ jsx(NotificationSkeleton, {}),
            numberOfSkeletons: 2,
            emptyComponent: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-40", children: t("notifications:notifications.no-notifications") })
          }
        ) }),
        !isInNotificationPage && /* @__PURE__ */ jsx("div", { className: "flex justify-center border-t border-text-main/10 pt-2 pb-1 px-2", children: /* @__PURE__ */ jsxs(
          "button",
          {
            className: "p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center gap-2",
            onClick: () => navigate("/notifications"),
            title: t("notifications:notifications.open-notifications"),
            children: [
              /* @__PURE__ */ jsx(Text, { sz: "sm-1", color: "secondary", children: t("notifications:notifications.open-notifications") }),
              /* @__PURE__ */ jsx(Text, { sz: "sm-1", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-up-right-from-square" }) })
            ]
          }
        ) })
      ]
    }
  );
};
const NotificationBadge = ({}) => {
  const navigate = useNavigate();
  const { unreadCount } = useUnreadCount();
  const { isShowNotification, isInNotificationPage, setShowNotification } = useNotificationUiState();
  const menuRef = React.useRef(null);
  const btnRef = React.useRef(null);
  useClickOutside(menuRef, btnRef, () => {
    if (isShowNotification) setShowNotification(false);
  });
  const handleToggleNotifications = () => {
    if (window.innerWidth < 640 && !isShowNotification) {
      navigate("/notifications");
      return;
    }
    setShowNotification(!isShowNotification);
  };
  const isActive = isShowNotification || isInNotificationPage;
  return /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
    /* @__PURE__ */ jsx(
      Badge,
      {
        count: unreadCount,
        onClick: handleToggleNotifications,
        ref: btnRef,
        className: clsx({
          "!bg-primary-500/30": isActive
        }),
        children: /* @__PURE__ */ jsx(
          Text,
          {
            className: clsx({
              "!text-primary-500": isActive
            }),
            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bell" })
          }
        )
      }
    ),
    isShowNotification && !isInNotificationPage && /* @__PURE__ */ jsx("div", { onClick: () => setShowNotification(false), children: /* @__PURE__ */ jsx(
      NotificationMenu,
      {
        className: clsx(
          "!absolute max-h-[600px] z-10 min-w-[350px] min-h-[100px]",
          "sm:top-[120%] sm:right-0 sm:w-auto sm:h-auto sm:p-2",
          "top-[108%] -right-[70px] w-screen h-screen p-6"
        ),
        onClick: () => setShowNotification(!isShowNotification),
        ref: menuRef
      }
    ) })
  ] });
};
function useMessageCacheMutations() {
  const queryClient = useQueryClient();
  const addMessageToCache = useCallback(
    (conversationId, message, isDescending = true) => {
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old?.pages?.length) {
            return {
              pages: [
                {
                  items: [message],
                  nextCursor: void 0,
                  hasNext: false
                }
              ],
              pageParams: [void 0]
            };
          }
          const targetPageIndex = isDescending ? 0 : old.pages.length - 1;
          const targetPage = old.pages[targetPageIndex];
          for (const item of targetPage.items) {
            if (item.id === message.id) return old;
            if (item.clientTempId && item.clientTempId === message.clientTempId) {
              const newPages2 = {
                ...targetPage,
                items: targetPage.items.map(
                  (m) => m.clientTempId === message.clientTempId ? message : m
                )
              };
              return {
                ...old,
                pages: [newPages2, ...old.pages.slice(1)]
              };
            }
          }
          const newPages = [...old.pages];
          newPages[targetPageIndex] = {
            ...targetPage,
            items: isDescending ? [message, ...targetPage.items] : [...targetPage.items, message]
          };
          return {
            ...old,
            pages: newPages
          };
        }
      );
    },
    [queryClient]
  );
  const updateMessageInCache = useCallback(
    (conversationId, messageId, updater) => {
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((m) => m.id === messageId ? updater(m) : m)
            }))
          };
        }
      );
    },
    [queryClient]
  );
  const removeMessageFromCache = useCallback(
    (conversationId, messageId) => {
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((m) => m.id !== messageId)
            }))
          };
        }
      );
    },
    [queryClient]
  );
  return { addMessageToCache, updateMessageInCache, removeMessageFromCache };
}
const PREFIX$3 = buildApiPath("/conversation");
class ConversationService {
  async getConversations(query) {
    return await apiGet(`${PREFIX$3}`, query);
  }
  async getConversation(conversationId) {
    return await apiGet(`${PREFIX$3}/${conversationId}`);
  }
  async getConversationWith(targetUserId) {
    return await apiGet(`${PREFIX$3}/with/${targetUserId}`);
  }
  async getMessages(conversationId, query) {
    return await apiGet(`${PREFIX$3}/${conversationId}/messages`, query);
  }
  async createGroupConversation(participantIds, name) {
    return await apiPost(`${PREFIX$3}`, { participantIds, name });
  }
}
const conversationService = new ConversationService();
const conversationKeys = {
  list: (queryParams) => ["conversations", queryParams],
  detail: (conversationId) => ["conversation", conversationId],
  withUser: (targetId) => ["conversation", "with", targetId]
};
const conversationDetailQueryOptions = (conversationId) => createSafeQueryOptions({
  queryKey: conversationKeys.detail(conversationId),
  fn: async () => await conversationService.getConversation(conversationId)
});
const useGetConversationWith = (targetId, config, enabled = true) => {
  return useSafeQueryResult({
    queryKey: conversationKeys.withUser(targetId),
    fn: async () => await conversationService.getConversationWith(targetId),
    enabled,
    options: config
  });
};
const useGetConversation = (conversationId, config, enabled) => {
  return useSafeQueryResult({
    queryKey: conversationKeys.detail(conversationId),
    fn: async () => await conversationService.getConversation(conversationId),
    enabled: enabled ?? false,
    options: config
  });
};
const useCreateGroupConversation = () => {
  const { showSnackbar } = useSnackbar();
  return useResultFetcher(
    async ({ participantIds, name }) => {
      return await conversationService.createGroupConversation(participantIds, name);
    },
    {
      onError: (error) => {
        console.log("Failed to create group conversation:", error);
        showSnackbar(error?.code ?? "Tạo cuộc trò chuyện nhóm thất bại", "error");
      }
    }
  );
};
const useConversations = (queryParams) => {
  const { userId } = useAuth();
  return useSafeInfiniteQueryResult({
    queryKey: conversationKeys.list(queryParams),
    fn: async (cursor) => await conversationService.getConversations({ ...queryParams, cursor }),
    enabled: !!userId
  });
};
const useConversationCacheMutations = () => {
  const queryClient = useQueryClient();
  const pushConversationToTop = async (conversationId, lastMessage) => {
    const listKey = conversationKeys.list();
    const currentData = queryClient.getQueryData(listKey);
    let existedConv = null;
    if (currentData) {
      for (const page of currentData.pages) {
        const found = page.items.find((item) => item.id === conversationId);
        if (found) {
          existedConv = { ...found, lastMessage: lastMessage || found.lastMessage };
          break;
        }
      }
    }
    if (!existedConv) {
      const fetched = await queryClient.fetchQuery(conversationDetailQueryOptions(conversationId));
      if (!fetched) return;
      existedConv = { ...fetched, lastMessage: lastMessage || fetched.lastMessage };
    }
    queryClient.setQueryData(listKey, (oldData) => {
      if (!oldData || !oldData.pages.length) return oldData;
      const newPages = oldData.pages.map((page) => ({
        ...page,
        items: page.items.filter((item) => item.id !== conversationId)
      }));
      newPages[0] = {
        ...newPages[0],
        items: [existedConv, ...newPages[0].items]
      };
      return {
        ...oldData,
        pages: newPages
      };
    });
  };
  return { pushConversationToTop };
};
function MessageListener() {
  const { addMessageToCache } = useMessageCacheMutations();
  const { pushConversationToTop } = useConversationCacheMutations();
  useAppHub((message) => {
    if (message.event !== "NewMessage") return;
    const data = message.payload;
    const conversationId = data.conversationId;
    console.log("Received new message via hub:", data);
    console.log("Conversation ID:", conversationId);
    if (data.correlationId && useChatStore.getState().registry[data.correlationId]) {
      useChatStore.getState().replaceChat(data.correlationId, conversationId);
    } else {
      useChatStore.getState().openChat(conversationId, { type: "conversation", conversationId });
    }
    addMessageToCache(conversationId, data, true);
    pushConversationToTop(conversationId, data);
  });
  return null;
}
function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Page Not Found";
    return () => {
      document.title = "Fatagram";
    };
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col items-center sm:justify-center h-full w-full gap-[20px] pt-10"
      ),
      children: [
        /* @__PURE__ */ jsx(Logo, { hasSlogan: false, sz: "md-2" }),
        /* @__PURE__ */ jsx(
          Text,
          {
            sz: "xl-3",
            className: clsx(
              "font-jua bg-primary-500/70 text-primary-600 w-[200px] h-[200px] flex justify-center items-center rounded-full"
            ),
            children: "404"
          }
        ),
        /* @__PURE__ */ jsx(Text, { weight: "extrabold", sz: "lg-3", className: clsx("uppercase text-primary-600"), children: t("notFound.title") }),
        /* @__PURE__ */ jsx(Text, { sz: "lg-1", className: clsx("flex justify-center text-center"), wrap: "whitespace-normal", children: t("notFound.description") }),
        /* @__PURE__ */ jsx("div", { className: clsx("flex gap-[10px]"), children: /* @__PURE__ */ jsxs(
          Button,
          {
            className: clsx("flex items-center"),
            onClick: () => {
              navigate("/");
            },
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: clsx("w-5 h-5 mr-2") }),
              t("notFound.backButton")
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Footer, { className: clsx("text-text-third") })
      ]
    }
  );
}
const HomePage = () => {
  const navigate = useNavigate();
  const handleRedirectToAdminProfile = () => {
    navigate("/zzz");
  };
  return /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(Button, { onClick: handleRedirectToAdminProfile, children: "Go to Fat Profile" }) });
};
const registerInitialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  isRememberMe: true
};
const registerValidationSchema = Yup.object().shape({
  username: Yup.string().required("auth:register.errors.username.required").min(3, "auth:register.errors.username.tooShort").max(30, "auth:register.errors.username.tooLong").matches(/^[a-zA-Z0-9_]+$/, "auth:register.errors.username.notCorrectFormat"),
  email: Yup.string().required("auth:register.errors.email.required").email("auth:register.errors.email.notCorrectFormat"),
  password: Yup.string().required("auth:register.errors.password.required").min(8, "auth:register.errors.password.tooShort").max(100, "auth:register.errors.password.tooLong"),
  confirmPassword: Yup.string().required("auth:register.errors.confirmPassword.required").oneOf([Yup.ref("password")], "auth:register.errors.passwords.doNotMatch")
});
const registerErrorCodeMap = {
  USERNAME_EXISTED: {
    message: "auth:register.errors.username.alreadyExists",
    type: "username"
  },
  EMAIL_EXISTED: { message: "auth:register.errors.email.alreadyExists", type: "email" },
  PHONE_NUMBER_EXISTED: {
    message: "auth:register.errors.phoneNumber.alreadyExists",
    type: "phoneNumber"
  },
  PASSWORD_TOO_WEAK: { message: "auth:register.errors.password.tooWeak", type: "password" },
  UNKNOWN_ERROR: { message: "auth:register.errors.unknown", type: "username" }
};
const SocialButton = ({ icon, name, onClick, disabled }) => {
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "fourth",
      className: "flex gap-2 flex-1 items-center justify-center",
      onClick,
      sz: "sm-1",
      disabled,
      children: [
        /* @__PURE__ */ jsx("img", { src: icon, alt: name, className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: name })
      ]
    }
  );
};
const SocialButtons = ({ disabled }) => {
  const { redirectToGoogle } = useAuth();
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full", children: [
    /* @__PURE__ */ jsx(
      SocialButton,
      {
        name: "Google",
        icon: "/svgs/google-icon.svg",
        onClick: redirectToGoogle,
        disabled
      }
    ),
    /* @__PURE__ */ jsx(SocialButton, { name: "Facebook", icon: "/svgs/facebook-icon.svg", disabled: true })
  ] });
};
const RegisterForm = ({
  className,
  showLogo = true,
  showClose = false,
  onClose
}) => {
  const { t } = useTranslation();
  const [isShowClose] = useState(showClose);
  const [isShowLogo] = useState(showLogo);
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { fetch: register2 } = useResultFetcher(authService.register, {
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err, _errs) => {
      const errMap = registerErrorCodeMap[err?.code] ?? registerErrorCodeMap["UNKNOWN_ERROR"];
      if (errMap) {
        switch (errMap.type) {
          case "username":
            setUsernameError(errMap.message);
            break;
          case "email":
            setEmailError(errMap.message);
            break;
          case "phoneNumber":
            setPhoneNumberError(errMap.message);
            break;
          case "password":
            setPasswordError(errMap.message);
            break;
          case "confirmPassword":
            setConfirmPasswordError(errMap.message);
            break;
        }
      }
    }
  });
  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setUsernameError("");
      setEmailError("");
      setPhoneNumberError("");
      setPasswordError("");
      setConfirmPasswordError("");
      await register2({
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.email,
        phoneNumber: values.phoneNumber
      });
    }
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex flex-col items-center justify-center gap-3",
        "rounded-2xl",
        "animate-fade-in ",
        className
      ),
      onSubmit: formik.submitForm,
      children: [
        isShowLogo && /* @__PURE__ */ jsx(Logo, { sz: "sm-1", hasSlogan: false }),
        /* @__PURE__ */ jsx(
          Text,
          {
            sz: "xl-1",
            weight: "extrabold",
            className: "uppercase !text-primary-500 select-none text-center",
            children: t("auth:register.title")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ jsx(
            Textbox,
            {
              value: formik.values.username,
              autoComplete: "username",
              sz: "sm-1",
              className: "w-full",
              placeholder: t("auth:register.username"),
              onChange: (e) => formik.setFieldValue("username", e.target.value),
              isWrong: formik.touched.username && Boolean(formik.errors.username) || Boolean(usernameError),
              wrongMessage: t(usernameError || formik.errors.username || ""),
              disabled: formik.isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              value: formik.values.email,
              autoComplete: "email",
              sz: "sm-1",
              className: "w-full",
              placeholder: t("auth:register.email"),
              onChange: (e) => formik.setFieldValue("email", e.target.value),
              isWrong: formik.touched.email && Boolean(formik.errors.email) || Boolean(emailError),
              wrongMessage: t(emailError || formik.errors.email || ""),
              disabled: formik.isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              value: formik.values.phoneNumber,
              autoComplete: "tel",
              sz: "sm-1",
              className: "w-full",
              placeholder: t("auth:register.phoneNumber"),
              onChange: (e) => formik.setFieldValue("phoneNumber", e.target.value),
              isWrong: formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber) || Boolean(phoneNumberError),
              wrongMessage: t(phoneNumberError || formik.errors.phoneNumber || ""),
              disabled: formik.isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              type: "password",
              value: formik.values.password,
              sz: "sm-1",
              className: "w-full",
              placeholder: t("auth:register.password"),
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              isWrong: formik.touched.password && Boolean(formik.errors.password) || Boolean(passwordError),
              wrongMessage: t(passwordError || formik.errors.password || ""),
              disabled: formik.isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              type: "password",
              value: formik.values.confirmPassword,
              sz: "sm-1",
              className: "w-full",
              placeholder: t("auth:register.confirmPassword"),
              onChange: (e) => formik.setFieldValue("confirmPassword", e.target.value),
              isWrong: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword) || Boolean(confirmPasswordError),
              wrongMessage: t(confirmPasswordError || formik.errors.confirmPassword || ""),
              disabled: formik.isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            className: "text-[15px] text-single-third gap-[8px] w-full",
            label: /* @__PURE__ */ jsxs(Text, { className: "flex items-center flex-wrap", children: [
              t("auth:register.agree"),
              " ",
              /* @__PURE__ */ jsx(Link, { className: "sm:text-[15px]", to: "/terms", children: t("auth:register.termsOfService") }),
              " ",
              t("auth:register.and"),
              " ",
              /* @__PURE__ */ jsx(Link, { className: "sm:text-[15px]", to: "/policy", children: t("auth:register.privacyPolicy") }),
              "."
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            sz: "sm-3",
            className: "flex justify-center w-full",
            onClick: formik.submitForm,
            disabled: formik.isSubmitting,
            children: [
              formik.isSubmitting && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) }),
              /* @__PURE__ */ jsx(Text, { children: t("auth:register.registerButton") })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" }),
            /* @__PURE__ */ jsx(Text, { sz: "sm-2", className: "text-text-third", children: "OR" }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" })
          ] }),
          /* @__PURE__ */ jsx(SocialButtons, { disabled: formik.isSubmitting })
        ] }),
        /* @__PURE__ */ jsx(Link, { className: "font-bold", to: "/login", children: t("auth:register.loginButton") }),
        isShowClose && /* @__PURE__ */ jsx(
          Text,
          {
            sz: "lg-1",
            className: clsx(
              "absolute z-50 top-3 right-5 text-gradient-main hover:text-single-main cursor-pointer"
            ),
            onClick: onClose,
            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
          }
        )
      ]
    }
  );
};
function RegisterPage() {
  useEffect(() => {
    document.title = "Register - Fatagram";
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex flex-col bg-bg-second flex-1 h-full lg:p-4",
        "justify-center items-center"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute hidden sm:block inset-0 filter blur-lg opacity-80 background-image" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "relative flex bg-bg-second w-full ",
              "flex-1 lg:w-[80%] lg:max-h-[800px]",
              "lg:rounded-3xl rounded-none overflow-hidden"
            ),
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: clsx(
                    "sm:absolute inset-0 lg:relative hidden sm:flex",
                    "flex-1 login-bg justify-center items-center z-0"
                  ),
                  children: /* @__PURE__ */ jsx(Text, { sz: "xl-3", className: "select-none hidden lg:block", children: "Feeling" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "bg-bg-second px-[3rem] py-[1rem] flex-1 m-auto max-w-[500px] z-10 rounded-3xl lg:rounded-none", children: /* @__PURE__ */ jsx(RegisterForm, { className: "m-auto" }) })
            ]
          }
        )
      ]
    }
  );
}
const loginInitialValues = {
  usernameOrEmail: "",
  password: "",
  isRememberMe: true
};
const loginValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required("auth:login.errors.usernameOrEmail.required").test(
    "IS_VALID_USERNAME_OR_EMAIL",
    "auth:login.errors.usernameOrEmail.invalidFormat",
    function(value) {
      if (!value) return false;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      return emailRegex.test(value) || usernameRegex.test(value);
    }
  ),
  password: Yup.string().required("auth:login.errors.password.required").min(6, "auth:login.errors.password.tooShort")
});
const errorCodeMap = {
  PASSWORD_INCORRECT: { message: "auth:login.errors.password.incorrect", type: "password" },
  ACCOUNT_NOT_FOUND: {
    message: "auth:login.errors.usernameOrEmail.notFound",
    type: "username"
  }
};
const LoginForm = ({
  switchForgotPassword,
  showLogo = true,
  showClose = false,
  onClose,
  className
}) => {
  const { t } = useTranslation();
  const [passwordError, setPasswordError] = useState("");
  const [usernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [isShowClose] = React.useState(showClose);
  const [isShowLogo] = React.useState(showLogo);
  const { logIn } = useAuth();
  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setUsernameOrEmailError("");
      setPasswordError("");
      await logIn(
        {
          usernameOrEmail: values.usernameOrEmail,
          password: values.password
        },
        {
          onError: (err, _errs) => {
            const errMap = errorCodeMap[err.code] ?? errorCodeMap["UNKNOWN_ERROR"];
            if (errMap) {
              errMap.type === "username" ? setUsernameOrEmailError(errMap.message) : errMap.type == "password" ? setPasswordError(errMap.message) : null;
            }
          }
        }
      );
    }
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex flex-col items-center justify-center gap-5",
        "animate-fade-in",
        className
      ),
      children: [
        isShowLogo && /* @__PURE__ */ jsx(Logo, { sz: "sm-3" }),
        /* @__PURE__ */ jsx(
          Text,
          {
            sz: "xl-1",
            weight: "extrabold",
            className: clsx("uppercase !text-primary-500", "font-bold font-inter select-none"),
            children: t("auth:login.title")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ jsx(
            Textbox,
            {
              sz: "sm-1",
              className: "w-full",
              autoComplete: "username",
              placeholder: t("auth:login.username"),
              onChange: (e) => formik.setFieldValue("usernameOrEmail", e.target.value),
              isWrong: formik.touched.usernameOrEmail && Boolean(formik.errors.usernameOrEmail) || Boolean(usernameOrEmailError),
              wrongMessage: t(usernameOrEmailError || formik.errors.usernameOrEmail || ""),
              disabled: formik.isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              type: "password",
              sz: "sm-1",
              className: "w-full",
              placeholder: t("auth:login.password"),
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              isWrong: formik.touched.password && Boolean(formik.errors.password) || Boolean(passwordError),
              wrongMessage: t(passwordError || formik.errors.password || ""),
              autoComplete: "current-password",
              disabled: formik.isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full items-center gap-[50px]", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              label: t("auth:login.rememberMe"),
              onChange: (e) => {
                formik.setFieldValue("rememberMe", e.target.checked);
              },
              className: "items-center",
              disabled: formik.isSubmitting
            }
          ),
          switchForgotPassword && /* @__PURE__ */ jsx(
            Text,
            {
              sz: "sm-3",
              className: clsx(
                "!text-primary-500 hover:!text-primary-600",
                "hover:cursor-pointer transition-all duration-100 active:scale-95 select-none"
              ),
              onClick: switchForgotPassword,
              children: t("auth:login.forgotPassword")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            onClick: formik.submitForm,
            sz: "sm-3",
            className: "w-full flex items-center justify-center",
            disabled: formik.isSubmitting,
            children: [
              formik.isSubmitting && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) }),
              t("auth:login.loginButton")
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" }),
            /* @__PURE__ */ jsx(Text, { sz: "sm-2", className: "text-text-third", children: "OR" }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" })
          ] }),
          /* @__PURE__ */ jsx(SocialButtons, { disabled: formik.isSubmitting })
        ] }),
        /* @__PURE__ */ jsxs(Text, { children: [
          t("auth:login.dontHaveAccount"),
          " ",
          /* @__PURE__ */ jsx(Link, { className: "font-bold", to: "/register", children: t("auth:login.registerButton") })
        ] }),
        isShowClose && /* @__PURE__ */ jsx(
          Text,
          {
            className: clsx(
              "absolute top-3 right-5 text-[20px] text-gradient-main hover:text-single-main cursor-pointer"
            ),
            onClick: onClose,
            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
          }
        )
      ]
    }
  );
};
function LoginPage() {
  const [forgotPassword, _setForgotPassword] = useState(false);
  useEffect(() => {
    document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
  }, [forgotPassword]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex flex-col bg-bg-second flex-1 h-full lg:p-4",
        "justify-center items-center"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute hidden sm:block inset-0 filter blur-lg opacity-80 background-image" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "relative flex bg-bg-second w-full ",
              "flex-1 lg:w-[80%] lg:max-h-[800px]",
              "lg:rounded-3xl rounded-none overflow-hidden"
            ),
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: clsx(
                    "sm:absolute inset-0 lg:relative hidden sm:flex",
                    "flex-1 login-bg justify-center items-center z-0"
                  ),
                  children: /* @__PURE__ */ jsx(Text, { sz: "xl-3", className: "select-none hidden lg:block", children: "Feeling" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "bg-bg-second px-[3rem] py-[1rem] flex-1 m-auto max-w-[500px] z-10 rounded-3xl lg:rounded-none", children: /* @__PURE__ */ jsx(LoginForm, { className: "m-auto" }) })
            ]
          }
        )
      ]
    }
  );
}
const useActiveRoute = (to, end = false) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end });
  return !!match;
};
const PageNavbarItem = ({
  icon,
  title: title2,
  description: description2,
  path,
  className = "",
  onClick
}) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => {
        navigate(path);
        onClick?.();
      },
      className: clsx(
        "w-full text-left px-3 py-3 rounded-xl",
        "transition-all duration-300 ease-out",
        "relative overflow-hidden group",
        {
          "bg-bg-fourth border-l-4 border-l-primary-500 shadow-sm": isFocused,
          "hover:bg-bg-third hover:shadow-sm hover:translate-x-1": !isFocused
        },
        className
      ),
      children: [
        isFocused && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: clsx("grid grid-cols-10 relative z-10"), children: [
          /* @__PURE__ */ jsx(
            Text,
            {
              sz: "md-3",
              className: clsx(
                "flex justify-center items-center h-full col-span-2",
                "transition-all duration-300",
                isFocused ? "text-primary-500 scale-110" : "text-text-second group-hover:text-primary-500 group-hover:scale-105"
              ),
              children: icon
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "col-span-8 flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx(
              Text,
              {
                sz: "md-1",
                className: clsx(
                  "transition-colors duration-300",
                  isFocused ? "text-primary-600 font-semibold" : "text-text-main group-hover:text-primary-600"
                ),
                children: title2
              }
            ),
            description2 && /* @__PURE__ */ jsx(Text, { sz: "sm-2", weight: "light", className: "text-text-second mt-0.5", children: description2 })
          ] })
        ] })
      ]
    }
  );
};
function HeightTransition({
  show,
  children,
  duration = 150,
  fade = true
}) {
  const mainRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(show ? "none" : "0px");
  const [isVisible, setIsVisible] = useState(show);
  useEffect(() => {
    if (!mainRef.current) {
      return;
    }
    const element = mainRef.current;
    const measuredHeight = element.scrollHeight;
    if (show) {
      setIsVisible(true);
      setMaxHeight(measuredHeight + "px");
    } else {
      setIsVisible(false);
      setMaxHeight("0px");
    }
  }, [show]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: mainRef,
      style: {
        overflow: "hidden",
        maxHeight,
        transitionDuration: duration + "ms",
        opacity: fade ? show ? 1 : 0.5 : 1,
        transform: fade ? show ? "translateY(0)" : "translateY(-10px)" : "none",
        transitionProperty: fade ? `max-height, opacity, transform` : `max-height`
      },
      "aria-hidden": !isVisible,
      children
    }
  );
}
const PageNavbarSection = ({
  title: title2,
  className,
  titleClassName,
  children
}) => {
  const [showChildren, setShowChildren] = useState(true);
  return /* @__PURE__ */ jsxs("div", { className: clsx("w-full", className), children: [
    title2 && /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "group flex items-center justify-between",
          "p-2 pl-5 pr-3 cursor-pointer select-none",
          "hover:bg-bg-third/50 rounded-lg",
          "transition-all duration-200"
        ),
        onClick: () => setShowChildren(!showChildren),
        children: [
          /* @__PURE__ */ jsx(
            Text,
            {
              sz: "lg-1",
              weight: "bold",
              className: clsx(
                "text-text-third group-hover:text-text-main transition-colors duration-200",
                titleClassName
              ),
              children: title2
            }
          ),
          /* @__PURE__ */ jsx(
            "i",
            {
              className: clsx(
                "fas fa-chevron-down text-text-third text-sm",
                "transition-transform duration-300",
                "group-hover:text-primary-500",
                showChildren ? "rotate-180" : "rotate-0"
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(HeightTransition, { show: showChildren, children: /* @__PURE__ */ jsx("div", { className: clsx("w-full mt-1 space-y-1"), children }) })
  ] });
};
const PageNavbar = ({ title: title2, header, headerClassName, className, children }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col gap-3",
        "bg-bg-main shadow-md border-r-0 sm:border-r-2 border-bg-eighth",
        "overflow-y-auto",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col relative bg-bg-second mt-4 mb-2", headerClassName), children: [
          title2 && /* @__PURE__ */ jsx(Text, { sz: "xl-1", weight: "bold", className: "relative px-6 text-gradient-main", children: title2 }),
          header
        ] }),
        children
      ]
    }
  );
};
PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;
const FriendsNavbar = ({ className, onSelect }) => {
  const { t } = useTranslation();
  const friendPageItems = [
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-plus" }),
      name: t("friends:navbar.suggestedFriends"),
      path: "/friends"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-check" }),
      name: t("friends:navbar.invite"),
      path: "requests"
    }
  ];
  return /* @__PURE__ */ jsx(PageNavbar, { title: t("friends:navbar.title"), className: clsx("bg-bg-second", className), children: /* @__PURE__ */ jsx(PageNavbar.Section, { className: "px-2 pb-3 space-y-1", children: friendPageItems.map((item, index) => /* @__PURE__ */ jsx(
    PageNavbar.Item,
    {
      path: item.path,
      icon: item.icon,
      title: item.name,
      onClick: onSelect
    },
    index
  )) }) });
};
const Card = ({
  className,
  children,
  title: title2,
  titleClassName,
  childrenClassName
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col items-start bg-bg-second p-7 rounded-2xl shadow-lg",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(Text, { sz: "lg-2", weight: "bold", className: clsx(titleClassName), children: title2 }),
        /* @__PURE__ */ jsx("div", { className: clsx("w-full", childrenClassName), children })
      ]
    }
  );
};
const SidebarLayout = ({
  className,
  navbar: navbar2,
  sidebarClassName,
  childrenWrapperCalssName,
  title: title2,
  showMenuButton = true,
  showSidebar = false,
  setShowSidebar,
  showOverlay = true,
  children
}) => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-1 items-stretch", className), children: [
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: clsx(
          "z-30 max-w-[300px] shrink-0 overflow-y-auto ",
          "fixed lg:sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))] transition-transform duration-300",
          showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarClassName
        ),
        children: navbar2
      }
    ),
    showOverlay && /* @__PURE__ */ jsx(
      Transition,
      {
        animation: AnimationLib.Opacity,
        show: showSidebar,
        className: "fixed inset-0 z-20 lg:hidden",
        duration: 300,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-black opacity-50",
            onClick: () => setShowSidebar?.(false)
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: clsx("flex-1 flex flex-col min-w-0 h-full", childrenWrapperCalssName), children: [
      showMenuButton && /* @__PURE__ */ jsxs(
        "button",
        {
          className: "self-start m-3 text-2xl font-bold lg:hidden",
          onClick: () => setShowSidebar?.(!showSidebar),
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bars mr-2" }),
            /* @__PURE__ */ jsx("span", { children: title2 })
          ]
        }
      ),
      children
    ] })
  ] });
};
const SidebarPageLayout = ({
  title: title2,
  navbar: navbar2,
  className,
  showSidebar,
  setShowSidebar,
  children
}) => {
  return /* @__PURE__ */ jsx(
    SidebarLayout,
    {
      title: title2,
      className: clsx("bg-bg-second sm:bg-bg-fourth", className),
      navbar: navbar2,
      showSidebar,
      setShowSidebar,
      children: /* @__PURE__ */ jsx("div", { className: clsx("flex items-center justify-center flex-1  mt-1"), children: /* @__PURE__ */ jsx("div", { className: "w-full sm:max-w-[750px] px-3", children }) })
    }
  );
};
const SidebarPage = ({ children }) => {
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full", children });
};
const SidebarPageCard = ({ title: title2, children, className }) => {
  return /* @__PURE__ */ jsx(
    Card,
    {
      title: title2,
      className: clsx("w-full !p-0 sm:!p-8 shadow-none sm:shadow-lg", className),
      titleClassName: "mb-5",
      childrenClassName: "flex flex-col gap-7",
      children
    }
  );
};
const FriendPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("friends:title");
  }, [t]);
  return /* @__PURE__ */ jsx(
    SidebarPageLayout,
    {
      title: t("friends:title"),
      showSidebar,
      setShowSidebar,
      navbar: /* @__PURE__ */ jsx(FriendsNavbar, { className: "h-full", onSelect: () => setShowSidebar(false) }),
      children: /* @__PURE__ */ jsx(Outlet, {})
    }
  );
};
const FriendRequestItem = ({
  avatar,
  name,
  time: time2,
  onAccept,
  onCancel,
  path = ""
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const timeDist = time2 ? timeDistance(time2) : { text: "" };
  const handleNavigate = () => {
    navigate(path);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col items-start bg-bg-main",
        "h-auto",
        "rounded-2xl shadow-lg p-4 gap-1"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full cursor-pointer", onClick: handleNavigate, children: /* @__PURE__ */ jsx(Avatar, { src: avatar, alt: "avatar", shape: "rounded", className: "w-full" }) }),
        /* @__PURE__ */ jsx(
          Text,
          {
            sz: "md-2",
            weight: "bold",
            onClick: handleNavigate,
            className: clsx("truncate overflow-hidden w-full"),
            children: name
          }
        ),
        /* @__PURE__ */ jsxs(Text, { sz: "sm-1", weight: "light", children: [
          timeDist.count && t(timeDist.unit || "", { count: timeDist.count }),
          " ",
          t(timeDist.text)
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "primary", sz: "sm-1", className: clsx("w-full mt-2 mb-1"), onClick: onAccept, children: t("user:profileHeader:acceptButton") }),
        /* @__PURE__ */ jsx(Button, { variant: "fourth", sz: "sm-1", className: clsx("w-full mt-2r"), onClick: onCancel, children: t("user:profileHeader:declineButton") })
      ]
    }
  );
};
const useAcceptFriendRequest = () => {
  return useResultFetcher(friendshipService.AcceptAddFriendRequest);
};
const useDeclineFriendRequest = () => {
  return useResultFetcher(friendshipService.DeclineAddFriendRequest);
};
const useListFriendRequests = (queryParams) => {
  return useSafeInfiniteQueryResult({
    queryKey: ["friendship", "friend-requests", queryParams],
    fn: (cursor) => friendshipService.GetFriendRequests({ ...queryParams, cursor }),
    enabled: true
  });
};
const useGetNumberOfFriends = (userId) => {
  return useSafeQueryResult({
    queryKey: ["friendship", "number-of-friends", userId],
    fn: () => friendshipService.GetNumberOfFriends(userId),
    enabled: !!userId
  });
};
const useGetFriends = (userId, queryParams) => {
  return useSafeInfiniteQueryResult({
    queryKey: ["friendship", "friends", userId, queryParams],
    fn: (cursor) => friendshipService.GetFriends(userId, { ...queryParams, cursor }),
    enabled: !!userId
  });
};
const FriendRequests = () => {
  const [_total, _setTotal] = React.useState(0);
  const { data, fetchNextPage, hasNextPage, isFetching } = useListFriendRequests({
    limit: 20
  });
  const requestsData = React.useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);
  const { fetch: acceptFriendRequest } = useAcceptFriendRequest();
  const { fetch: rejectFriendRequest } = useDeclineFriendRequest();
  return /* @__PURE__ */ jsx(SidebarPageCard, { title: "Lời mời kết bạn", children: /* @__PURE__ */ jsx(
    InfiniteScrollGrid,
    {
      itemMinWidth: "200px",
      items: requestsData,
      onLoadMore: fetchNextPage,
      className: clsx("gap-2 h-full w-full"),
      itemTemplate: (item) => /* @__PURE__ */ jsx(
        FriendRequestItem,
        {
          name: item.senderName,
          avatar: item.senderAvatar,
          path: `/${item.senderUrlName || item.senderId}`,
          time: new Date(item.createdAt),
          onAccept: () => acceptFriendRequest(item.senderId),
          onCancel: () => rejectFriendRequest(item.senderId)
        }
      ),
      hasMore: !!hasNextPage,
      isLoading: isFetching,
      itemKey: (item) => item.senderId
    }
  ) });
};
const FriendRequests$1 = React.memo(FriendRequests);
const RequestsPage = () => {
  return /* @__PURE__ */ jsx(SidebarPage, { children: /* @__PURE__ */ jsx(FriendRequests$1, {}) });
};
const RequestsPage$1 = React.memo(RequestsPage);
const friendsRoutes = {
  path: "/friends",
  element: /* @__PURE__ */ jsx(FriendPage, {}),
  type: "private",
  children: [
    {
      path: "requests",
      element: /* @__PURE__ */ jsx(RequestsPage$1, {}),
      keepAlive: true
    }
  ]
};
const NotificationsPage = () => {
  const { setInNotificationPage, setShowNotification } = useNotificationUiState();
  useLayoutEffect(() => {
    setInNotificationPage(true);
    return () => {
      setInNotificationPage(false);
      setShowNotification(false);
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { className: clsx("relative flex items-start justify-center w-full mt-1"), children: /* @__PURE__ */ jsx(NotificationMenu, { className: clsx("max-w-[600px] w-full px-2 py-2 mx-4") }) });
};
const useUserId = (userParam) => {
  return useSafeQueryResult({
    queryKey: ["user-profile-id", userParam],
    fn: async () => await userProfileService.getUserId(userParam),
    staleTime: 1e3 * 60 * 5,
    gcTime: 1e3 * 60 * 10,
    enabled: !!userParam,
    retry: 1
  });
};
const ProfilePageContext = createContext({
  isOwner: false,
  targetId: "",
  userParam: void 0
});
function ProfilePageProvider({ children }) {
  const { userId } = useAuth();
  const userParam = useParams();
  const { data, isLoading, isFetching } = useUserId(userParam.userParam || "");
  const cachedTargetIdRef = useRef(void 0);
  if (data?.infos.id) {
    cachedTargetIdRef.current = data.infos.id;
  }
  const validTargetId = data?.infos.id || cachedTargetIdRef.current || "";
  const contextValue = useMemo(
    () => ({
      isOwner: userId === validTargetId,
      targetId: validTargetId,
      userParam: userParam.userParam
    }),
    [userId, validTargetId, userParam.userParam]
  );
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsx(LoadingPage, {});
  }
  if (!data) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  }
  return /* @__PURE__ */ jsx(ProfilePageContext.Provider, { value: contextValue, children });
}
function useProfilePage() {
  const context = useContext(ProfilePageContext);
  if (!context) {
    throw new Error("useProfilePage must be used within a ProfilePageProvider");
  }
  return context;
}
const profileQueryKey = (userId) => ["user", "profile", userId];
const avatarQueryKey = (userId) => ["user", "avatar", userId];
const backgroundQueryKey = (userId) => ["user", "background", userId];
const profileDetailsQueryKey = (userId) => ["user", "profile", "details", userId];
const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useResultFetcher(userProfileService.completeOnboarding, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile"]
      });
    }
  });
};
const useGetUserProfile = (userId) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId ?? ""),
    fn: async () => await userProfileService.getProfile(
      userId,
      "id,firstName,lastName,middleName,fullName,nickname,avatar,background,urlName"
    ),
    enabled: !!userId
  });
};
const useGetUserAvatar = (userId) => {
  return useSafeQueryResult({
    queryKey: avatarQueryKey(userId),
    fn: async () => await userProfileService.getProfile(userId, "avatar"),
    enabled: !!userId
  });
};
const useGetUserBackground = (userId) => {
  return useSafeQueryResult({
    queryKey: backgroundQueryKey(userId),
    fn: async () => await userProfileService.getProfile(userId, "background"),
    enabled: !!userId
  });
};
const useGetUserProfileDetails = (userId) => {
  return useSafeQueryResult({
    queryKey: profileDetailsQueryKey(userId),
    fn: async () => await userProfileService.getProfile(userId, "bio,description"),
    enabled: !!userId
  });
};
const useUpdateName = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(
    ({
      firstName,
      middleName,
      lastName
    }) => userProfileService.updateName({
      firstName,
      middleName,
      lastName
    }),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: profileQueryKey(userId)
        });
      }
    }
  );
};
const useUpdateUrlName = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(
    ({ urlName }) => userProfileService.updateUrlName({
      urlName
    }),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: profileQueryKey(userId)
        });
      }
    }
  );
};
const useUpdateNickname = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(
    ({ nickname }) => userProfileService.updateNickname({
      nickname
    }),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: profileQueryKey(userId)
        });
      }
    }
  );
};
const useUpdateProfile = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher((data) => userProfileService.updateProfile(data), {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: profileQueryKey(userId)
      });
      qc.invalidateQueries({
        queryKey: profileDetailsQueryKey(userId)
      });
    }
  });
};
const useSelectBackground = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(userProfileService.uploadBackground, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: backgroundQueryKey(userId)
      });
    }
  });
};
const useSelectAvatar = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(userProfileService.uploadAvatar, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: avatarQueryKey(userId)
      });
    }
  });
};
const ProfileBackground = ({}) => {
  const { t } = useTranslation();
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserBackground(targetId);
  const { fetch, isFetching: isUpdating } = useSelectBackground(targetId);
  const { showSnackbar } = useSnackbar();
  const handleSelectBackground = async (file) => {
    await fetch(file, {
      onSuccess: () => {
        showSnackbar("Background updated successfully", "success");
      }
    });
  };
  return /* @__PURE__ */ jsx("div", { className: clsx("relative aspect-[16/6] w-full"), children: isLoading || isFetching || isUpdating ? /* @__PURE__ */ jsx(Skeleton, { className: "h-full" }) : /* @__PURE__ */ jsx(
    BackgroundImage,
    {
      src: data?.infos.background,
      alt: "Background Image",
      className: clsx("relative h-full w-full"),
      children: isOwner && /* @__PURE__ */ jsxs(
        SelectFile,
        {
          onChange: handleSelectBackground,
          accept: "image/*",
          multiple: false,
          className: clsx(
            "absolute flex items-center right-2 bottom-2 z-10",
            "opacity-40 hover:opacity-70 gap-2"
          ),
          children: [
            /* @__PURE__ */ jsx("i", { className: clsx("fa-solid fa-camera") }),
            /* @__PURE__ */ jsx(Text, { className: clsx("sm:flex hidden"), sz: "md-1", children: data?.infos.background ? t("user:profileHeader.changeButton") : t("user:profileHeader.addButton") })
          ]
        }
      )
    }
  ) });
};
const ProfileAvatar = ({ className }) => {
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserAvatar(targetId);
  const { fetch, isFetching: isUpdating } = useSelectAvatar(targetId);
  const { showSnackbar } = useSnackbar();
  const handleSelectAvatar = async (file) => {
    await fetch(file, {
      onSuccess: () => {
        showSnackbar("Avatar updated successfully", "success");
      }
    });
  };
  return /* @__PURE__ */ jsx("div", { className: clsx$1("relative", className), children: isLoading || isFetching || isUpdating ? /* @__PURE__ */ jsx("div", { className: "bg-bg-main rounded-full", children: /* @__PURE__ */ jsx(Skeleton, { className: "border-4 border-bg-main h-[192px]", variant: "circle" }) }) : /* @__PURE__ */ jsx(
    Avatar,
    {
      src: data?.infos.avatar,
      alt: "Avatar",
      sz: "lg-2",
      className: "border-4 border-bg-main flex-shrink-0",
      children: isOwner && /* @__PURE__ */ jsx(
        SelectFile,
        {
          onChange: handleSelectAvatar,
          accept: "image/*",
          className: "absolute z-10 inset-0 cursor-pointer bg-black bg-opacity-50\n                flex justify-center items-center opacity-0 hover:opacity-90 hover:bg-black hover:bg-opacity-50 active:opacity-100\n                translate-all duration-150 ease",
          children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-camera text-white text-2xl" })
        }
      )
    }
  ) });
};
const useFriendshipStatus = (targetId) => {
  return useSafeQueryResult({
    queryKey: ["friendshipStatus", targetId],
    fn: async () => await friendshipService.GetFriendshipStatus(targetId),
    enabled: !!targetId,
    retry: 1
  });
};
const FriendButton = ({ uid, sz = "md-1" }) => {
  const { t } = useTranslation();
  if (!useAuth().isAuthenticated) return null;
  const [isShowFriendOptions, setIsShowFriendOptions] = useState(false);
  const [isShowRequestOptions, setIsShowRequestOptions] = useState(false);
  const { data: friendshipStatus, isLoading, isFetching } = useFriendshipStatus(uid ? uid : "");
  const [currentFriendshipStatus, setFriendshipStatus] = useState("None");
  useEffect(() => {
    if (friendshipStatus) {
      setFriendshipStatus(friendshipStatus.status);
    }
  }, [friendshipStatus]);
  const btnFriendRef = useRef(null);
  const btnRequestRef = useRef(null);
  const friendOptionsRef = useRef(null);
  const requestOptionsRef = useRef(null);
  useClickOutside(
    friendOptionsRef,
    btnFriendRef,
    () => {
      if (isShowFriendOptions) setIsShowFriendOptions(false);
    }
  );
  useClickOutside(
    requestOptionsRef,
    btnRequestRef,
    () => {
      if (isShowRequestOptions) setIsShowRequestOptions(false);
    }
  );
  const handleSentAddFriendRequest = useCallback(async () => {
    const response = await friendshipService.SendAddFriendRequest(uid ? uid : "");
    if (response.success) {
      setFriendshipStatus("SentByMe");
    }
  }, [uid, friendshipService]);
  const handleCancelAddFriendRequest = useCallback(async () => {
    const response = await friendshipService.CancelAddFriendRequest(uid ? uid : "");
    if (response.success) {
      setFriendshipStatus("None");
    }
  }, [uid, friendshipService]);
  const handleAcceptAddFriendRequest = useCallback(
    async (id) => {
      const response = await friendshipService.AcceptAddFriendRequest(id ? id : "");
      if (response.success) {
        setFriendshipStatus("Friend");
      }
    },
    [friendshipService]
  );
  const handleDeclineAddFriendRequest = useCallback(
    async (id) => {
      const response = await friendshipService.DeclineAddFriendRequest(id ? id : "");
      if (response.success) {
        setFriendshipStatus("None");
      }
    },
    [friendshipService]
  );
  const handleUnfriend = useCallback(
    async (id) => {
      const response = await friendshipService.Unfriend(id ? id : "");
      if (response.success) {
        setFriendshipStatus("None");
      }
    },
    [friendshipService]
  );
  const friendOptions = useMemo(
    () => [
      {
        id: "unfriend",
        content: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-user-xmark", "mr-2") }),
          " ",
          t("user:profileHeader.unfriendButton")
        ] }),
        onClick: async () => {
          await handleUnfriend?.(uid);
        }
      }
    ],
    [uid, handleUnfriend, t]
  );
  const requestOptions = useMemo(
    () => [
      {
        id: "acceptRequest",
        content: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-check", "mr-2") }),
          " ",
          t("user:profileHeader.acceptButton")
        ] }),
        onClick: async () => await handleAcceptAddFriendRequest?.(uid)
      },
      {
        id: "cancelRequest",
        content: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-xmark", "mr-2") }),
          " ",
          t("user:profileHeader.declineButton")
        ] }),
        onClick: async () => await handleDeclineAddFriendRequest?.(uid)
      }
    ],
    [uid, handleAcceptAddFriendRequest, handleDeclineAddFriendRequest, t]
  );
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsx(Button, { sz, disabled: true, children: /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-spinner", "fa-spin") }) });
  }
  return /* @__PURE__ */ jsx("div", { children: currentFriendshipStatus === "None" ? /* @__PURE__ */ jsxs(Button, { sz, onClick: handleSentAddFriendRequest, children: [
    /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-plus") }),
    " ",
    t("user:profileHeader.addFriendButton")
  ] }) : currentFriendshipStatus === "SentByMe" ? /* @__PURE__ */ jsxs(Button, { sz, onClick: handleCancelAddFriendRequest, children: [
    /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-xmark") }),
    " ",
    t("user:profileHeader.cancelRequestButton")
  ] }) : currentFriendshipStatus === "SentByThem" ? /* @__PURE__ */ jsxs("div", { className: clsx("sm:relative", "z-50"), children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        sz,
        ref: btnRequestRef,
        onClick: () => {
          setIsShowRequestOptions(!isShowRequestOptions);
        },
        children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-reply") }),
          " ",
          t("user:profileHeader.respondRequestButton")
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        ref: requestOptionsRef,
        isShow: isShowRequestOptions,
        className: clsx(
          "absolute",
          "flex",
          "sm:top-[130%]",
          "top-[110%]",
          "left-[1%]",
          "bg-[var(--main-bg-color)]",
          "shadow-md",
          "z-[10]",
          "sm:min-w-[200px]",
          "w-[calc(100%-2%)]"
        ),
        items: requestOptions
      }
    )
  ] }) : /* @__PURE__ */ jsxs("div", { className: clsx("sm:relative", "z-50"), children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        sz,
        ref: btnFriendRef,
        onClick: () => {
          setIsShowFriendOptions(!isShowFriendOptions);
        },
        children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-user-check") }),
          " ",
          t("user:profileHeader.friendButton")
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        ref: friendOptionsRef,
        isShow: isShowFriendOptions,
        className: clsx(
          "absolute",
          "sm:top-[130%]",
          "top-[110%]",
          "left-[1%]",
          "bg-[var(--main-bg-color)]",
          "p-2",
          "rounded-lg",
          "shadow-md",
          "z-[10]",
          "sm:min-w-[200px]",
          "w-[calc(100%-2%)]"
        ),
        items: friendOptions
      }
    )
  ] }) });
};
function useLanguage$1() {
  const { t } = useTranslation();
  return t;
}
const ProfileHeader = ({ className }) => {
  const t = useLanguage$1();
  const navigate = useNavigate();
  const { targetId, isOwner } = useProfilePage();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isFetching } = useGetUserProfile(targetId);
  const userProfile = data?.infos;
  const { openChat } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const { data: numberOfFriends, isFetching: numberOfFriendsFetching } = useGetNumberOfFriends(targetId);
  const {
    data: conversationData,
    refetch: refetchConversation,
    isFetching: isCheckingConversation
  } = useGetConversationWith(targetId);
  const handleMessageClick = useCallback(async () => {
    if (!targetId) return;
    if (conversationData) {
      openChat(conversationData.id, { type: "conversation", conversationId: conversationData.id });
      if (isMobile) navigate(`/fatalk/${conversationData.id}`);
      return;
    }
    const result = await refetchConversation();
    if (result.data) {
      openChat(result.data.id, { type: "conversation", conversationId: result.data.id });
      if (isMobile) navigate(`/fatalk/${result.data.id}`);
    } else {
      const randomUuid = crypto.randomUUID();
      openChat(randomUuid, { type: "temp", targetId });
      if (isMobile)
        navigate(`/fatalk/temp?tempId=${targetId}`, { state: { correlationId: randomUuid } });
    }
  }, [isMobile, targetId, refetchConversation, openChat]);
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative w-full flex flex-col items-center", className), children: [
    /* @__PURE__ */ jsx("div", { className: "relative w-full mt-2", children: /* @__PURE__ */ jsx(ProfileBackground, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "-mt-[80px] flex w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end mb-5 lg:gap-0 gap-3", children: [
      /* @__PURE__ */ jsx(ProfileAvatar, {}),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 items-start flex-1 lg:mb-3 lg:ml-4", children: [
        isLoading || isFetching ? /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", className: "w-56" }) : /* @__PURE__ */ jsxs(Text, { sz: "xl-1", weight: "bold", className: "text-center break-words w-full lg:w-auto", children: [
          userProfile?.fullName,
          userProfile?.nickname && /* @__PURE__ */ jsxs(Text, { sz: "lg-3", weight: "light", className: "lg:text-left text-center lg:ml-2", children: [
            "(",
            userProfile?.nickname,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full lg:flex-row", children: [
          !numberOfFriendsFetching ? /* @__PURE__ */ jsx(Text, { sz: "md-2", weight: "semibold", className: "text-[var(--text-color)] opacity-70", children: numberOfFriends && numberOfFriends > 0 ? numberOfFriends + " " + t("user:profileHeader.friendsCount") : t("user:profileHeader.noFriendsCount") }) : /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", className: "w-36" }),
          !isLoading || !isFetching ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap flex-row gap-2 mt-2 lg:ml-auto lg:mt-0", children: [
            isAuthenticated && /* @__PURE__ */ jsx(Fragment, { children: isOwner ? /* @__PURE__ */ jsxs(
              Button,
              {
                sz: "sm-1",
                onClick: () => {
                  navigate(`/settings`);
                },
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-pen" }),
                  " ",
                  t("user:profileHeader.editButton")
                ]
              }
            ) : /* @__PURE__ */ jsx(FriendButton, { sz: "sm-1", uid: targetId }) }),
            !isOwner && isAuthenticated && /* @__PURE__ */ jsxs(
              Button,
              {
                sz: "sm-1",
                variant: "secondary",
                onClick: handleMessageClick,
                disabled: isCheckingConversation,
                children: [
                  /* @__PURE__ */ jsx(
                    "i",
                    {
                      className: isCheckingConversation ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-comment"
                    }
                  ),
                  " ",
                  t("user:profileHeader.messageButton")
                ]
              }
            ),
            /* @__PURE__ */ jsx(Button, { sz: "sm-1", variant: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info" }) })
          ] }) : /* @__PURE__ */ jsx(Skeleton, { sz: "md-1", className: "w-[250px] lg:ml-auto mb-1" })
        ] })
      ] })
    ] })
  ] });
};
const NavbarItem = ({
  children,
  path,
  activeRoute = true,
  className = "",
  onClick
}) => {
  const isFocused = useActiveRoute(path, activeRoute);
  return /* @__PURE__ */ jsxs(
    Link,
    {
      className: clsx(
        className,
        "relative flex items-center justify-center !text-[15px] whitespace-nowrap",
        isFocused ? "!text-primary-500" : "!text-text-main",
        "cursor-pointer",
        "p-4 px-6 rounded-lg overflow-hidden",
        {
          "hover:bg-bg-third": !isFocused,
          "active:bg-bg-third active:scale-95 transition-all duration-200 ease-in-out": !isFocused
        }
      ),
      to: path,
      onClick,
      children: [
        children,
        isFocused && /* @__PURE__ */ jsx("div", { className: "absolute bg-primary-500 h-[2px] rounded-full w-full bottom-0 left-0" })
      ]
    }
  );
};
const Navbar = ({
  className,
  optionClassName,
  isAuthenticated,
  options,
  items,
  logo,
  style: style2
}) => {
  const navItems = items || [];
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      className: clsx(
        "flex items-center",
        "bg-bg-main p-[2px] shadow-md sm:px-8 justify-between",
        className
      ),
      style: style2,
      children: [
        logo,
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-3 flex-1", children: [
          isAuthenticated && /* @__PURE__ */ jsx("div", { className: clsx("flex w-full sm:justify-center flex-row"), children: navItems.map((item, index) => /* @__PURE__ */ jsx(
            NavbarItem,
            {
              path: item.path,
              className: clsx(
                "flex-1 sm:flex-none sm:px-10",
                item.showOnDesktop ? "block" : "sm:hidden"
              ),
              activeRoute: item.isIndex,
              children: item.icon
            },
            index
          )) }),
          /* @__PURE__ */ jsx("div", { className: clsx("flex flex-row gap-2 justify-center flex-1", optionClassName), children: options })
        ] })
      ]
    }
  );
};
function useSize() {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState({
    width: 0,
    height: 0
  });
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const resizeObserver = new ResizeObserver(() => {
      setSize({
        width: el.offsetWidth,
        height: el.offsetHeight
      });
    });
    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return [ref, size];
}
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
const ProfileNavbar = ({ className = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userParam, isOwner } = useProfilePage();
  const [containerRef, containerSize] = useSize();
  const showMoreRef = useRef(null);
  const showMoreMeasureRef = useRef(null);
  const itemRefs = useRef([]);
  const allItemsWidth = useRef(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [isChooseHiddenItem, setIsChooseHiddenItem] = useState(false);
  const navbarItems = useMemo(
    () => [
      {
        name: t("user:profileMenu.posts"),
        href: `/${userParam}`,
        isOwnerOnly: false,
        isIndex: true
      },
      {
        name: t("user:profileMenu.friends"),
        href: `/${userParam}/friends`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t("user:profileMenu.photos"),
        href: `/${userParam}/photos`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t("user:profileMenu.videos"),
        href: `/${userParam}/videos`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t("user:profileMenu.about"),
        href: `/${userParam}/about`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t("user:profileMenu.settings"),
        href: `/${userParam}/settings`,
        isOwnerOnly: true,
        isIndex: false
      }
    ],
    [userParam, t]
  );
  useEffect(() => {
    const handleResize = () => {
      if (containerSize.width === 0) return;
      if (allItemsWidth.current === 0) {
        allItemsWidth.current = navbarItems.reduce((total2, item, index) => {
          if (item.isOwnerOnly && !isOwner) return total2;
          const itemWidth = itemRefs.current[index]?.offsetWidth;
          return total2 + itemWidth;
        }, 0);
      }
      let total = 0;
      const newVisibleItems = [];
      const newHiddenItems = [];
      if (allItemsWidth.current > containerSize.width) {
        total += showMoreMeasureRef.current?.offsetWidth ?? 0;
      }
      navbarItems.forEach((item, index) => {
        if (item.isOwnerOnly && !isOwner) return;
        const itemWidth = itemRefs.current[index]?.offsetWidth ?? 0;
        if (total + itemWidth < containerSize.width) {
          newVisibleItems.push(item);
          total += itemWidth;
        } else {
          newHiddenItems.push(item);
        }
      });
      setVisibleItems(newVisibleItems);
      setHiddenItems(newHiddenItems);
    };
    const debouncedHandle = debounce(handleResize, 20);
    debouncedHandle();
  }, [containerSize.width, isOwner, navbarItems]);
  useEffect(() => {
    const currentPath = location.pathname;
    const foundInHidden = hiddenItems.some((item) => item.href === currentPath);
    setIsChooseHiddenItem(foundInHidden);
  }, [location.pathname, hiddenItems]);
  const ShowMoreButton = ({ ref }) => {
    return /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "secondary",
        className: clsx("relative bg-transparent hover:bg-[var(--main-bg-color)]"),
        onClick: () => setShowDropdown(!showDropdown),
        ref,
        children: [
          /* @__PURE__ */ jsxs(
            Text,
            {
              className: clsx(
                "whitespace-nowrap",
                isChooseHiddenItem ? "!text-single-main" : "text-[var(--text-color)]"
              ),
              children: [
                "More ",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-caret-down ml-1" })
              ]
            }
          ),
          isChooseHiddenItem && /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "absolute bg-primary-500 h-[2px] rounded-full",
                "w-full bottom-0 left-0"
              )
            }
          )
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative flex py-2", className), ref: containerRef, children: [
    /* @__PURE__ */ jsxs("div", { className: "fixed invisible flex", children: [
      navbarItems.map((item, index) => {
        if (item.isOwnerOnly && !isOwner) return null;
        return /* @__PURE__ */ jsx(
          "div",
          {
            ref: (el) => {
              if (el) itemRefs.current[index] = el;
            },
            children: /* @__PURE__ */ jsx(
              NavbarItem,
              {
                path: item.href ?? "",
                children: item.name,
                onClick: () => setShowDropdown(false),
                activeRoute: item.isIndex ?? true
              }
            )
          },
          index
        );
      }),
      /* @__PURE__ */ jsx(ShowMoreButton, { ref: showMoreMeasureRef })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex", children: visibleItems.map((item) => /* @__PURE__ */ jsx(
      NavbarItem,
      {
        path: item.href ?? "",
        children: item.name,
        onClick: () => setShowDropdown(false),
        activeRoute: item.isIndex ?? true
      },
      item.name
    )) }),
    hiddenItems.length > 0 && /* @__PURE__ */ jsx(ShowMoreButton, { ref: showMoreRef }),
    showDropdown && /* @__PURE__ */ jsx(
      Dropdown,
      {
        className: clsx(
          "absolute z-[9999] top-[100%] m-0 bg-bg-second",
          "shadow-lg rounded-md w-[95%] -translate-x-1/2 left-1/2 p-2"
        ),
        showPolygon: false,
        isShow: showDropdown,
        items: hiddenItems.map((item) => ({
          id: item.name,
          content: /* @__PURE__ */ jsxs(
            "div",
            {
              className: clsx(
                "flex justify-between items-center",
                location.pathname === item.href ? "text-single-main" : "text-[var(--text-color)]"
              ),
              children: [
                item.name,
                location.pathname === item.href && /* @__PURE__ */ jsx("i", { className: "fas fa-check" })
              ]
            }
          ),
          onClick: () => {
            navigate(item.href ?? "/");
            setShowDropdown(false);
          }
        }))
      }
    )
  ] });
};
const ProfileBody = ({ className }) => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("w-full flex flex-col", className), children: [
    /* @__PURE__ */ jsx(ProfileNavbar, { className: "bg-bg-main justify-start sm:rounded-2xl shadow-md sm:mt-2 p-2 w-full" }),
    /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
};
const ProfilePage = () => {
  return /* @__PURE__ */ jsx(ProfilePageProvider, { children: /* @__PURE__ */ jsxs("div", { className: clsx("relative", "justify-start", "items-center", "flex", "flex-col"), children: [
    /* @__PURE__ */ jsx("div", { className: clsx("flex", "justify-center", "w-full", "bg-bg-main", "z-10"), children: /* @__PURE__ */ jsx(ProfileHeader, { className: "layout-1000" }) }),
    /* @__PURE__ */ jsx("div", { className: clsx("layout-1000", "w-full"), children: /* @__PURE__ */ jsx(ProfileBody, { className: "w-full" }) })
  ] }) });
};
const EditableTextArea = ({
  editableMode = "none",
  title: title2,
  value,
  placeholder,
  valueClassName,
  btnChildren,
  isEdit,
  isError = false,
  errorMessage,
  noDataValue,
  canEdit = true,
  isLoading = false,
  onChangeClick,
  onSaveClick,
  onCancelClick
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const { t } = useTranslation();
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
    title2 && /* @__PURE__ */ jsx(Text, { sz: "lg-1", className: "font-light", children: title2 }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 flex-col w-full", children: [
      editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-1 w-full", children: [
        /* @__PURE__ */ jsx(
          TextArea,
          {
            className: clsx("animate-fade-in px-2 py-1 w-full h-[50px]", isError && "mt-[5px]"),
            placeholder,
            value: inputValue,
            isWrong: isError,
            onChange: (e) => setInputValue(e.target.value)
          }
        ),
        isError && /* @__PURE__ */ jsx(Text, { sz: "sm-1", className: "text-red-500 ml-2 h-[5px]", children: errorMessage })
      ] }) : /* @__PURE__ */ jsx(
        Text,
        {
          sz: "lg-1",
          className: clsx(valueClassName, "select-auto"),
          wrap: "whitespace-pre-wrap",
          children: value ?? noDataValue
        }
      ),
      canEdit && /* @__PURE__ */ jsx(Fragment, { children: editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "animate-fade-in gap-1 flex w-full", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            disabled: value === inputValue || isLoading,
            sz: "sm-1",
            variant: "primary",
            onClick: () => {
              onSaveClick?.(inputValue);
            },
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-floppy-disk mr-2" }),
              t("settings:editableField.saveButton")
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            sz: "sm-1",
            variant: "fourth",
            onClick: () => {
              onCancelClick?.();
            },
            className: "flex-1",
            children: t("settings:editableField.cancelButton")
          }
        )
      ] }) : /* @__PURE__ */ jsx(
        Button,
        {
          sz: "sm-1",
          variant: "fourth",
          onClick: () => {
            onChangeClick?.();
          },
          className: "w-full",
          children: btnChildren
        }
      ) })
    ] })
  ] });
};
const ProfileIntroduction = () => {
  const [isEditBio, setIsEditBio] = React.useState(false);
  const [isEditDescription, setIsEditDescription] = React.useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, userId } = useAuth();
  const { isOwner, targetId } = useProfilePage();
  const updateProfileMutation = useUpdateProfile(userId);
  const canEdit = useMemo(() => isAuthenticated && isOwner, [isAuthenticated, isOwner]);
  const { data } = useGetUserProfileDetails(targetId ?? "");
  const userProfile = data?.infos;
  const handleSaveBio = (value) => {
    updateProfileMutation.fetch(
      { bio: value },
      {
        onSuccess: () => {
          setIsEditBio(false);
        },
        onError: () => {
          console.error("Failed to update bio");
        }
      }
    );
  };
  const handleSaveDescription = (value) => {
    updateProfileMutation.fetch(
      { description: value },
      {
        onSuccess: () => {
          setIsEditDescription(false);
        },
        onError: () => {
          console.error("Failed to update description");
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      title: t("user:profilePosts.overview"),
      titleClassName: "text-2xl font-bold !mb-0",
      childrenClassName: "flex flex-col gap-4",
      children: [
        (userProfile?.bio || canEdit) && /* @__PURE__ */ jsx(
          EditableTextArea,
          {
            editableMode: "inline",
            isEdit: isEditBio,
            placeholder: t("user:profilePosts.bioPlaceholder"),
            value: userProfile?.bio,
            onChangeClick: () => setIsEditBio(true),
            onSaveClick: (value) => handleSaveBio(value),
            valueClassName: "text-[1.2rem] font-semibold",
            canEdit: canEdit || false,
            isLoading: updateProfileMutation.isFetching,
            onCancelClick: () => setIsEditBio(false),
            btnChildren: /* @__PURE__ */ jsxs(Text, { sz: "sm-2", children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-pencil-alt" }),
              "   ",
              t("user:profilePosts.bioBtn")
            ] })
          }
        ),
        userProfile?.description && /* @__PURE__ */ jsx(Text, { sz: "lg-1", weight: "bold", children: t("user:profilePosts.description") }),
        (userProfile?.description || canEdit) && /* @__PURE__ */ jsx(
          EditableTextArea,
          {
            editableMode: "inline",
            isEdit: isEditDescription,
            placeholder: t("user:profilePosts.descriptionPlaceholder"),
            value: userProfile?.description,
            canEdit: canEdit || false,
            valueClassName: "text-[1.1rem]",
            isLoading: updateProfileMutation.isFetching,
            onChangeClick: () => setIsEditDescription(true),
            onSaveClick: (value) => handleSaveDescription(value),
            onCancelClick: () => setIsEditDescription(false),
            btnChildren: /* @__PURE__ */ jsxs(Text, { sz: "sm-2", children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-pencil-alt" }),
              "   ",
              t("user:profilePosts.descriptionBtn")
            ] })
          }
        ),
        (userProfile?.bio || userProfile?.description) && /* @__PURE__ */ jsx("hr", { className: "border-[var(--border-color)] w-full opacity-10" })
      ]
    }
  );
};
const PostsPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("sm:grid sm:grid-cols-golden flex flex-col sm:gap-2 w-full"), children: [
    /* @__PURE__ */ jsx(
      ProfileIntroduction,
      {
        className: clsx("bg-bg-main sm:rounded-md sm:rounded-l-2xl rounded-none sm:mt-2")
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: clsx("bg-bg-main sm:rounded-md sm:rounded-r-2xl rounded-none sm:mt-2") })
  ] });
};
const FriendItem = ({ className = "", friendDto }) => {
  const [isShowDrowdown, setIsShowDropdown] = React.useState(false);
  const [isFriend, setIsFriend] = React.useState(friendDto.isFriend);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dropdownRef = React.useRef(null);
  const btnRef = React.useRef(null);
  useClickOutside(
    dropdownRef,
    btnRef,
    () => {
      if (isShowDrowdown) setIsShowDropdown(false);
    }
  );
  const handleUnfriend = React.useCallback(
    async (id) => {
      const response = await friendshipService.Unfriend(id ? id : "");
      if (response.success) {
        setIsFriend(false);
      }
    },
    [friendshipService]
  );
  const requestOptions = React.useMemo(
    () => [
      {
        id: "unfriend",
        content: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-xmark mr-2" }),
          " ",
          t("user:profileHeader.unfriendButton")
        ] }),
        onClick: async () => await handleUnfriend?.(friendDto.id)
      }
    ],
    [friendDto.id, handleUnfriend, t]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex items-center justify-between rounded-xl",
        "hover:bg-bg-fourth cursor-pointer transition-colors",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative flex p-3 gap-4 items-center",
            onClick: () => navigate(`/${friendDto.id}`),
            children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Avatar, { alt: "Avatar", src: friendDto.avatar ?? void 0, sz: "sm-1" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full justify-center flex-1", children: /* @__PURE__ */ jsx(Text, { sz: "md-2", weight: "bold", children: friendDto.name }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative pr-2", children: isFriend ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              "aria-label": "More options",
              ref: btnRef,
              className: "w-10 h-10 rounded-full hover:bg-bg-third",
              onClick: (e) => {
                e.stopPropagation();
                setIsShowDropdown(!isShowDrowdown);
              },
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-ellipsis-v" })
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              isShow: isShowDrowdown,
              className: clsx(
                "absolute flex sm:top-[130%] top-[110%] left-[1%] p-2",
                "rounded-lg shadow-md z-10 min-w-[200px] w-[calc(100%-2%)]"
              ),
              ref: dropdownRef,
              items: requestOptions
            }
          )
        ] }) : /* @__PURE__ */ jsx(FriendButton, { sz: "sm-1", uid: friendDto.id }) })
      ]
    }
  );
};
const ProfileFriends = ({ className = "" }) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = React.useState("");
  const { targetId } = useProfilePage();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetFriends(
    targetId,
    { keyword, limit: 12 }
  );
  const friends2 = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const handleOnChange = (e) => {
    setKeyword(e.target.value);
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-1 justify-end flex-col w-full", className), children: [
    /* @__PURE__ */ jsx(
      Textbox,
      {
        type: "search",
        placeholder: t("user:profileFriends.searchFriends"),
        className: "p-1 w-full sm:max-w-xs",
        onChange: handleOnChange
      }
    ),
    /* @__PURE__ */ jsx(
      InfiniteScrollGrid,
      {
        itemMinWidth: "300px",
        items: friends2,
        isLoading: isLoading || isFetchingNextPage,
        hasMore: hasNextPage,
        onLoadMore: fetchNextPage,
        className: "relative flex flex-wrap gap-2 w-full mt-2",
        loadingSkeleton: /* @__PURE__ */ jsx("div", { className: "fa-solid fa-spinner animate-spin text-2xl text-single-main" }),
        numberOfSkeletons: 1,
        itemTemplate: (item) => /* @__PURE__ */ jsx(FriendItem, { className: "w-full", friendDto: item }),
        itemKey: (item) => item.id,
        emptyComponent: /* @__PURE__ */ jsx("div", { className: "flex w-full justify-center mb-10 mt-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-[var(--text-color)] opacity-30", children: [
          /* @__PURE__ */ jsx(Text, { sz: "xl-3", weight: "bold", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-xmark" }) }),
          /* @__PURE__ */ jsx(Text, { sz: "md-2", className: "mt-2", children: t("user:profileFriends.noFriends") })
        ] }) })
      }
    )
  ] });
};
const ProfileFriendsPage = () => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(
    Card,
    {
      title: t("user:profileFriends.friends"),
      className: clsx("sm:rounded-2xl rounded-none sm:mt-2"),
      children: /* @__PURE__ */ jsx(ProfileFriends, {})
    }
  );
};
const LayoutHeader = forwardRef(
  ({ children, className }, ref) => {
    return /* @__PURE__ */ jsx("header", { ref, className: clsx("z-40 w-full", className), style: {}, children });
  }
);
LayoutHeader.displayName = "Layout.Header";
const LayoutMain = ({ children, className, style: style2 }) => {
  return /* @__PURE__ */ jsx("main", { className: clsx("relative", className), style: style2, children });
};
const LayoutFooter = ({ children, className }) => {
  return /* @__PURE__ */ jsx("footer", { className: clsx(className), children });
};
const Layout = ({ children, className }) => {
  return /* @__PURE__ */ jsx("div", { className: clsx("relative flex flex-col bg-bg-eighth min-h-dvh", className), children });
};
Layout.Header = LayoutHeader;
Layout.Main = LayoutMain;
Layout.Footer = LayoutFooter;
const SubNavbarSection = ({
  title: title2,
  className,
  children
}) => {
  const [showChildren, setShowChildren] = useState(true);
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col gap-2", className), children: [
    title2 && /* @__PURE__ */ jsx(
      Text,
      {
        sz: "lg-1",
        weight: "bold",
        className: clsx("p-2 pl-5 text-gradient-main"),
        onClick: () => setShowChildren(!showChildren),
        children: title2
      }
    ),
    showChildren && /* @__PURE__ */ jsx("div", { className: "animate-dropdown-slide", children })
  ] });
};
const SubNavbarItem = ({ title: title2, path, onClick }) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => {
        navigate(path);
        onClick?.();
      },
      className: clsx(
        "w-full text-left py-2 px-3 rounded-lg",
        { "bg-primary-500/15": isFocused },
        "hover:bg-primary-500/15 cursor-pointer"
      ),
      children: /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col gap-1"), children: /* @__PURE__ */ jsx(
        Text,
        {
          sz: "sm-3",
          className: clsx({
            "!text-primary-500 !font-bold": isFocused
          }),
          children: title2
        }
      ) })
    }
  );
};
const SubNavbar = ({ className, children }) => {
  return /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col gap-1", className), children });
};
SubNavbar.Item = SubNavbarItem;
SubNavbar.Section = SubNavbarSection;
const styles = {
  "overlay-loading-bg-color": "_overlay-loading-bg-color_snybu_4"
};
const OverlayLoading = () => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "absolute inset-0 flex items-center justify-center z-50",
        styles["overlay-loading-bg-color"]
      ),
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "absolute top-1/2 w-12 h-12 border-4 border-transparent",
            "border-t-primary-700 border-r-primary-700",
            "rounded-full animate-spin"
          )
        }
      )
    }
  );
};
const ProfileAboutNavbar = ({ className }) => {
  const { t } = useTranslation();
  const aboutNavbarItems = [
    { title: t("user:profileAbout.overview"), path: "" },
    {
      title: t("user:profileAbout.workAndEducation"),
      path: "work-and-education"
    },
    { title: t("user:profileAbout.placesLived"), path: "places-lived" }
  ];
  return /* @__PURE__ */ jsx(Card, { title: t("user:profileAbout.title"), className: clsx(className), children: /* @__PURE__ */ jsx(SubNavbar, { className: "w-full", children: aboutNavbarItems.map((item, index) => /* @__PURE__ */ jsx(SubNavbar.Item, { title: item.title, path: item.path }, index)) }) });
};
const ProfileAboutPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("grid grid-cols-golden gap-2 lg:flex-row flex-col"), children: [
    /* @__PURE__ */ jsx(ProfileAboutNavbar, { className: clsx("rounded-r-lg mt-2") }),
    /* @__PURE__ */ jsx(Card, { className: clsx("rounded-l-lg mt-2 pt-0"), children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
};
const ProfileAboutSection = ({
  title: title2,
  className,
  children
}) => {
  return /* @__PURE__ */ jsxs("div", { className: clsx(className), children: [
    title2 && /* @__PURE__ */ jsx(Text, { sz: "lg-1", weight: "bold", children: title2 }),
    children
  ] });
};
const ProfileOverview = ({}) => {
  const { targetId, isOwner } = useProfilePage();
  const { data: userProfile } = useGetUserProfileDetails(targetId ?? "");
  const emails = [];
  const phoneNumbers = [];
  return /* @__PURE__ */ jsxs(ProfileAboutSection, { title: "Liên hệ", className: clsx("mb-4", "w-full"), children: [
    emails.length > 0 && /* @__PURE__ */ jsxs("div", { className: clsx("flex", "items-start", "w-full", "gap-4", "mb-6", "mt-4"), children: [
      /* @__PURE__ */ jsx(Text, { sz: "lg-3", className: clsx("opacity-50"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-envelope" }) }),
      /* @__PURE__ */ jsx("div", { children: emails.map((email, index) => /* @__PURE__ */ jsxs("div", { className: clsx("flex", "flex-col"), children: [
        /* @__PURE__ */ jsx(Text, { weight: "bold", children: email }),
        /* @__PURE__ */ jsx(Text, { sz: "sm-3", className: clsx("opacity-50"), children: "Email" })
      ] }, index)) }),
      isOwner && /* @__PURE__ */ jsx("div", { className: clsx("ml-auto"), children: /* @__PURE__ */ jsx(Button, { variant: "secondary", className: clsx("!rounded-full", "!p-0", "w-10", "h-10"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pencil-alt" }) }) })
    ] }),
    phoneNumbers.length > 0 && /* @__PURE__ */ jsxs("div", { className: clsx("flex", "items-start", "gap-4"), children: [
      /* @__PURE__ */ jsx(Text, { sz: "lg-3", className: clsx("opacity-50"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-phone" }) }),
      /* @__PURE__ */ jsx("div", { children: phoneNumbers.map((phone, index) => /* @__PURE__ */ jsxs("div", { className: clsx("flex", "flex-col"), children: [
        /* @__PURE__ */ jsx(Text, { weight: "bold", children: phone }),
        /* @__PURE__ */ jsx(Text, { sz: "sm-3", className: clsx("opacity-50"), children: "Di động" })
      ] }, index)) }),
      isOwner && /* @__PURE__ */ jsx("div", { className: clsx("ml-auto"), children: /* @__PURE__ */ jsx(Button, { variant: "secondary", className: clsx("!rounded-full", "!p-0", "w-10", "h-10"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pencil-alt" }) }) })
    ] })
  ] });
};
const ProfileAboutOverview = () => {
  return /* @__PURE__ */ jsx("div", { className: clsx("w-full"), children: /* @__PURE__ */ jsx(ProfileOverview, {}) });
};
const userRoute = {
  path: "/:userParam",
  element: /* @__PURE__ */ jsx(ProfilePage, {}),
  type: "public",
  children: [
    {
      path: "",
      element: /* @__PURE__ */ jsx(PostsPage, {}),
      type: "public",
      index: true
    },
    {
      path: "friends",
      element: /* @__PURE__ */ jsx(ProfileFriendsPage, {}),
      type: "public"
    },
    {
      path: "about",
      element: /* @__PURE__ */ jsx(ProfileAboutPage, {}),
      type: "public",
      children: [
        {
          path: "overview",
          element: /* @__PURE__ */ jsx(ProfileAboutOverview, {}),
          type: "public",
          index: true
        },
        {
          path: "work-and-education",
          element: /* @__PURE__ */ jsx("div", { children: "Work and Education" }),
          type: "public"
        },
        {
          path: "contact-info",
          element: /* @__PURE__ */ jsx("div", { children: "Contact Information" }),
          type: "public"
        },
        {
          path: "places-lived",
          element: /* @__PURE__ */ jsx("div", { children: "Places Lived" }),
          type: "public"
        }
      ]
    },
    {
      path: "photos",
      element: /* @__PURE__ */ jsx("div", { children: "Photos" }),
      type: "public"
    },
    {
      path: "videos",
      element: /* @__PURE__ */ jsx("div", { children: "Videos" }),
      type: "public"
    },
    {
      path: "settings",
      element: /* @__PURE__ */ jsx("div", { children: "Settings" }),
      type: "public"
    }
  ]
};
const UserMenu = ({ menuClassName, menuStyle }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { userId, urlName, logOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfile(userId);
  const { data: avatarProfile } = useGetUserAvatar(userId);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const handleClickOutside = () => {
    if (isOpenMenu) setIsOpenMenu(false);
  };
  useClickOutside(
    menuRef,
    btnRef,
    handleClickOutside
  );
  const handlePersonalPage = useCallback(() => {
    const user2 = urlName || userId;
    navigate(`/${user2}`);
    setIsOpenMenu(false);
  }, [navigate, urlName, userId]);
  const handleSettings = useCallback(() => {
    navigate("/settings");
    setIsOpenMenu(false);
  }, [navigate]);
  const handleLogout = useCallback(async () => {
    await logOut?.();
    navigate("/login", { replace: true });
  }, [logOut, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center justify-center relative"), ref: btnRef, children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        className: clsx("!rounded-full !p-0"),
        onClick: () => {
          setIsOpenMenu(!isOpenMenu);
        },
        children: /* @__PURE__ */ jsx(
          Avatar,
          {
            src: avatarProfile?.infos.avatar ?? "",
            alt: "Profile",
            sz: "sm-1",
            className: "border-4 border-bg-third"
          }
        )
      }
    ),
    isOpenMenu && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx(
          "absolute top-[120%] right-0 bg-bg-second shadow-xl rounded-xl",
          "p-2 z-10 flex flex-col gap-2 min-w-[300px] min-h-[100px]",
          menuClassName
        ),
        style: menuStyle,
        ref: menuRef,
        children: /* @__PURE__ */ jsxs(List, { className: clsx("flex flex-col gap-2 w-full"), children: [
          /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsxs(
            Button,
            {
              sz: "md-1",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start gap-3 w-full !pl-3 py-3",
                "hover:!bg-bg-fourth transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handlePersonalPage,
              children: [
                /* @__PURE__ */ jsx(Avatar, { src: avatarProfile?.infos.avatar ?? "", alt: "avatar", sz: "sm-1" }),
                /* @__PURE__ */ jsx(Text, { sz: "lg-1", weight: "bold", children: userProfile?.infos.fullName ?? "" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(
            List.Item,
            {
              className: clsx("items-center mx-auto w-[95%] h-[1px] bg-text-main/10 rounded-full")
            }
          ),
          /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
            Button,
            {
              sz: "md-1",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start w-full gap-3",
                "hover:!bg-bg-fourth transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handleSettings,
              children: /* @__PURE__ */ jsxs(Text, { className: clsx("flex items-center gap-3"), sz: "md-1", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-gear" }),
                t("navbar.profileMenu.settings")
              ] })
            }
          ) }),
          /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
            Button,
            {
              sz: "md-1",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start w-full gap-3 text-red-400",
                "hover:!bg-bg-fourth transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handleLogout,
              children: /* @__PURE__ */ jsxs(Text, { sz: "md-1", className: clsx("flex items-center gap-3"), color: "danger", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-right-from-bracket" }),
                t("navbar.profileMenu.logout")
              ] })
            }
          ) })
        ] })
      }
    )
  ] });
};
function InfiniteScrollFlex({
  items,
  loadingSkeleton,
  numberOfSkeletons = 4,
  className,
  hasMore = true,
  isLoading = false,
  itemTemplate,
  onLoadMore,
  isShowLastSeen = false,
  gap,
  desc = false,
  parentRef,
  itemKey,
  emptyComponent
}) {
  const isInitialLoad = useRef(true);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const lastItemRef = useRef(null);
  const isAtBottomRef = useRef(true);
  useEffect(() => {
    const target = lastItemRef.current;
    if (!target || !desc) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting;
      },
      {
        root: parentRef?.current || containerRef.current,
        threshold: 0.1
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [items[0], desc]);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && hasMore) {
        await onLoadMore();
      }
    });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, hasMore]);
  useEffect(() => {
    if (isAtBottomRef.current && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({
        behavior: isInitialLoad.current ? "auto" : "smooth"
      });
      isInitialLoad.current = false;
    }
  }, [items.length]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative overflow-y-auto",
        desc ? "flex flex-col-reverse" : "flex flex-col",
        className
      ),
      style: {
        gap: gap ?? "0.5rem"
      },
      ref: containerRef,
      children: [
        items.map((item, index) => /* @__PURE__ */ jsx("div", { children: itemTemplate ? itemTemplate(
          item,
          index,
          index === (desc ? 0 : items.length - 1) ? lastItemRef : null
        ) : item }, itemKey(item, index))),
        hasMore && /* @__PURE__ */ jsx(
          "div",
          {
            ref: sentinelRef,
            className: clsx(
              "absolute bg-red-500 h-[20px] w-[20px]",
              desc ? "top-[50px]" : "bottom-0"
            )
          }
        ),
        isLoading && /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: numberOfSkeletons }).map((_, index) => /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              textAlign: "center",
              padding: "1rem 0"
            },
            children: loadingSkeleton ?? "Loading..."
          },
          index
        )) }),
        items.length > 0 && !hasMore && !isLoading && isShowLastSeen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "1rem 0",
              color: "var(--text-third-color)"
            },
            children: "Đã xem hết kết quả."
          }
        ),
        items.length === 0 && !isLoading && emptyComponent
      ]
    }
  );
}
const PREFIX$2 = buildApiPath("/message");
class MessageService {
  async sendMessage(request) {
    return await apiPost(`${PREFIX$2}`, request);
  }
}
const messageService = new MessageService();
var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2["Text"] = "Text";
  MessageType2["Image"] = "Image";
  MessageType2["File"] = "File";
  MessageType2["System"] = "System";
  MessageType2["LeaveGroup"] = "LeaveGroup";
  MessageType2["JoinGroup"] = "JoinGroup";
  MessageType2["CreateGroup"] = "CreateGroup";
  MessageType2["DeleteGroup"] = "DeleteGroup";
  MessageType2["RenameGroup"] = "RenameGroup";
  MessageType2["ChangeGroupAvatar"] = "ChangeGroupAvatar";
  MessageType2["RemoveParticipant"] = "RemoveParticipant";
  MessageType2["AddParticipant"] = "AddParticipant";
  return MessageType2;
})(MessageType || {});
const messagesQueryKey = (conversationId, queryParams) => ["messages", conversationId, queryParams];
const useMessages = (conversationId, queryParams) => {
  return useSafeInfiniteQueryResult({
    queryKey: messagesQueryKey(conversationId, queryParams),
    fn: async (cursor) => {
      return await conversationService.getMessages(conversationId, { ...queryParams, cursor });
    },
    enabled: !!conversationId
  });
};
const useSendMessage = () => {
  const { addMessageToCache } = useMessageCacheMutations();
  const { userId } = useAuth();
  return useResultFetcher(async (data) => {
    const randomId = crypto.randomUUID();
    addMessageToCache(
      data.conversationId,
      {
        id: randomId,
        conversationId: data.conversationId,
        clientTempId: randomId,
        senderId: userId,
        content: data.content,
        createdAt: /* @__PURE__ */ new Date(),
        status: "pending",
        isGroup: false,
        type: MessageType.Text
      },
      true
    );
    data.clientTempId = randomId;
    return await messageService.sendMessage(data);
  });
};
const useRenderConversationContent = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const renderSystemMessage = (message) => {
    if (message.type === MessageType.CreateGroup) {
      const { creatorName, creatorId } = message.metadata || {};
      return t("common:conversations.systemMessage.createGroup", {
        creatorName: userId === creatorId ? t("common:conversations.you") : creatorName || "Unknown"
      });
    }
  };
  const renderConversationName = (conversation) => {
    if (conversation.isGroup && !conversation.name) {
      const topName = conversation.topParticipantNames;
      const total = conversation.participantCount;
      return topName.join(", ") + (total > topName.length ? ` và ${total - topName.length} người khác` : "");
    }
    return conversation.name || "Unknown";
  };
  return {
    renderSystemMessage,
    renderConversationName
  };
};
function isSystemMessage(messageType) {
  return [
    MessageType.System,
    MessageType.LeaveGroup,
    MessageType.JoinGroup,
    MessageType.CreateGroup,
    MessageType.DeleteGroup,
    MessageType.RenameGroup,
    MessageType.ChangeGroupAvatar,
    MessageType.RemoveParticipant,
    MessageType.AddParticipant
  ].includes(messageType);
}
const MessageRowComponent = ({
  message,
  index,
  userId,
  messages,
  isGroup,
  className,
  ref
}) => {
  const { t } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { data: userInfo } = useGetUserProfile(message.senderId);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const { renderSystemMessage } = useRenderConversationContent();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isSystem = isSystemMessage(message.type);
  const isShowTime = index === messages.length - 1 || getDiffBetween(message.createdAt, messages[index + 1].createdAt, "minute") > 30;
  const isPrevMessageShowTime = index === 0 || getDiffBetween(message.createdAt, messages[index - 1].createdAt, "minute") > 30;
  const isLastMessageInGroup = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId || isShowTime;
  const isFirstMessageInGroup = index === 0 || messages[index - 1]?.senderId !== message.senderId || isPrevMessageShowTime;
  const isOnlyMessageInGroup = isFirstMessageInGroup && isLastMessageInGroup;
  const isMyMessage = message.senderId === userId;
  const isShowName = isLastMessageInGroup && !isMyMessage && isGroup;
  const hasAvatar = isFirstMessageInGroup;
  const isFooterVisible = index === 0 && isMyMessage;
  useEffect(() => {
    if (isPending) {
      setTimeout(() => {
        setHasDelayed(true);
      }, 2e3);
    }
  }, [isPending]);
  if (isSystem) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full my-2", children: /* @__PURE__ */ jsx(Text, { sz: "sm-1", className: "opacity-80", children: renderSystemMessage(message) }) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col",
        isLastMessageInGroup ? "mt-[0.5rem]" : "mt-0",
        index === 0 ? "mb-[0.5rem]" : "mb-0",
        className
      ),
      ref,
      children: [
        isShowTime && /* @__PURE__ */ jsx(Text, { sz: "xs-1", className: "text-center my-2", children: formatSmartTimestamp(message.createdAt) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "flex gap-2 w-full",
              isMyMessage ? "flex-row-reverse" : "flex-row",
              hasDelayed && "opacity-50"
            ),
            children: [
              !isMyMessage && /* @__PURE__ */ jsx(
                Avatar,
                {
                  className: clsx(
                    "flex-shrink-0 self-end",
                    isMyMessage && "order-2",
                    !hasAvatar && "invisible"
                  ),
                  src: userInfo?.infos.avatar,
                  alt: "Avatar",
                  sz: "xs-2"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col", "max-w-[75%]"), children: [
                isShowName && /* @__PURE__ */ jsx(
                  Text,
                  {
                    sz: "xs-1",
                    className: clsx("mb-1", isMyMessage ? "text-right mr-1" : "text-left ml-1"),
                    children: userInfo?.infos.fullName
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: clsx(
                      "px-3 py-1 break-all rounded-xl shadow-sm relative",
                      isMyMessage ? isFailed ? "bg-primary-800" : "bg-primary-600" : "bg-bg-fourth",
                      isFailed && "border-red-500 border-2 opacity-50",
                      isMyMessage ? "rounded-l-2xl self-end" : "rounded-r-2xl self-start",
                      isOnlyMessageInGroup && "!rounded-2xl",
                      isLastMessageInGroup && (isMyMessage ? "rounded-br-none" : "rounded-bl-none"),
                      isFirstMessageInGroup && (isMyMessage ? "rounded-tr-none" : "rounded-tl-none"),
                      !isFirstMessageInGroup && !isLastMessageInGroup && (isMyMessage ? "rounded-tr-none rounded-br-none" : "rounded-tl-none rounded-bl-none")
                    ),
                    children: [
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          sz: "sm-1",
                          wrap: "whitespace-normal",
                          className: clsx(isMyMessage ? "text-text-message" : "text-text-main"),
                          children: message.content
                        }
                      ),
                      hasDelayed && /* @__PURE__ */ jsx("div", { className: "absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: clsx(
                      "flex items-center justify-end mr-2 overflow-hidden transition-all duration-200",
                      isFooterVisible ? "h-[15px] mt-1" : "h-0 mt-0"
                    ),
                    children: isFooterVisible && !isFailed && !isPending && /* @__PURE__ */ jsxs(Text, { sz: "xs-1", children: [
                      t("conversations.sent"),
                      " ",
                      getDiffBetween(message.createdAt, /* @__PURE__ */ new Date(), "second") > 60 && /* @__PURE__ */ jsx(Text, { sz: "xs-1", children: formatTime(message.createdAt) })
                    ] })
                  }
                )
              ] }),
              isFailed && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-exclamation text-red-500" }) })
            ]
          }
        )
      ]
    }
  );
};
const MessageRow = memo(MessageRowComponent);
const MessageList = ({
  isGroup,
  className,
  conversationId,
  parentRef
}) => {
  const { userId } = useAuth();
  const containerRef = useRef(null);
  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });
  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);
  const messageSkeleton = /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full animate-pulse", children: [
    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-700 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-700 rounded w-3/4" }) })
  ] });
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("flex flex-col gap-[0.1rem] overflow-y-auto", className),
      ref: containerRef,
      children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
        InfiniteScrollFlex,
        {
          items: messages,
          onLoadMore: fetchNextPage,
          className: "flex flex-col gap-[0.1rem]",
          itemTemplate: (item, index, ref) => /* @__PURE__ */ jsx(
            MessageRow,
            {
              ref,
              message: item,
              messages,
              userId,
              index,
              isGroup
            }
          ),
          hasMore: !!hasNextPage,
          isLoading: isFetchingNextPage,
          loadingSkeleton: messageSkeleton,
          numberOfSkeletons: 2,
          gap: 2,
          desc: true,
          parentRef: parentRef ?? containerRef,
          itemKey: (item) => item.id
        }
      ) })
    }
  );
};
const ChatInput = ({
  conversationId,
  correlationId,
  receiverId,
  className
}) => {
  const [hasInput, setHasInput] = useState(false);
  const textboxRef = useRef(null);
  const { fetch: send } = useSendMessage();
  const handleInputChange = (e) => {
    const isNotEmpty = e.target.value.trim() !== "";
    if (isNotEmpty !== hasInput) {
      setHasInput(isNotEmpty);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = () => {
    send({
      conversationId,
      correlationId,
      content: textboxRef.current?.value.trim() || "",
      receiverId
    });
    if (textboxRef.current) {
      textboxRef.current.value = "";
    }
    setHasInput(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("px-2 h-[15%] self-end bg-bg-third w-full flex items-center", className), children: [
    /* @__PURE__ */ jsx(
      Textbox,
      {
        sz: "xs-3",
        className: "!rounded-full w-full",
        wrapperClassName: "flex-1",
        placeholder: "Tin nhắn của bạn",
        onKeyDown: handleKeyDown,
        ref: textboxRef,
        onChange: handleInputChange
      }
    ),
    /* @__PURE__ */ jsx(MiniButton, { sz: "xs-3", className: "ml-2", onClick: handleSendMessage, disabled: !hasInput, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paper-plane text-primary-500" }) })
  ] });
};
const ChatWindow = ({ className, conversationId }) => {
  const [chatTitle, setChatTitle] = useState("");
  const [chatAvatar, setChatAvatar] = useState("");
  const { toggleMinimize, closeChat, registry } = useChatStore();
  const { renderConversationName } = useRenderConversationContent();
  const chat = registry[conversationId];
  const tempTargetId = chat?.type === "temp" ? chat.targetId : void 0;
  const {
    data: tempUser,
    isLoading: isLoadingTempUser,
    isFetching: isFetchingTempUser
  } = useGetUserProfile(tempTargetId);
  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation
  } = useGetConversation(conversationId, void 0, !tempTargetId);
  const isLoadingHeader = isLoadingConversation || isFetchingConversation || isLoadingTempUser || isFetchingTempUser;
  useEffect(() => {
    if (tempUser) {
      setChatTitle(tempUser.infos.fullName);
      setChatAvatar(tempUser.infos.avatar);
    } else if (conversationData) {
      setChatTitle(renderConversationName(conversationData));
      setChatAvatar(conversationData.avatarUrl || "");
    }
  }, [tempUser, conversationData, renderConversationName]);
  const handleOnClose = useCallback(() => {
    closeChat(conversationId);
  }, [conversationId]);
  const handleOnMinimum = useCallback(() => {
    toggleMinimize(conversationId);
  }, [conversationId]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "w-[330px] h-[450px] bg-bg-main rounded-xl shadow-lg overflow-hidden flex flex-col",
        "border border-gray-700 shadow-xl",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center px-4 h-[13%] bg-bg-third", children: [
          isLoadingHeader ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", variant: "circle", className: "w-8" }),
            /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", className: "ml-2 flex-1" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Avatar, { src: chatAvatar, alt: "Avatar", sz: "xs-3" }),
            /* @__PURE__ */ jsx(
              Text,
              {
                sz: "sm-1",
                weight: "bold",
                className: clsx(
                  "ml-2 text-text-main flex-1 rounded-md px-2 py-3",
                  "hover:bg-bg-fourth cursor-pointer transition-all duration-200",
                  "active:scale-[0.98] active:opacity-80 truncate"
                ),
                children: chatTitle
              }
            )
          ] }),
          /* @__PURE__ */ jsx(MiniButton, { sz: "xs-3", onClick: handleOnMinimum, children: /* @__PURE__ */ jsx("i", { className: "fas fa-minus" }) }),
          /* @__PURE__ */ jsx(MiniButton, { sz: "xs-3", onClick: handleOnClose, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col px-2 flex-1 overflow-y-auto bg-bg-seventh", children: [
          tempTargetId ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center h-full text-center px-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative mb-3", children: [
              /* @__PURE__ */ jsx(Avatar, { src: chatAvatar, alt: "Avatar", sz: "sm-2" }),
              /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" })
            ] }),
            /* @__PURE__ */ jsx(Text, { sz: "sm-1", weight: "bold", className: "text-white", children: chatTitle }),
            /* @__PURE__ */ jsx(Text, { sz: "xs-1", className: "text-gray-400 mt-1", children: "Hai bạn chưa có tin nhắn nào" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 px-3 py-2 bg-gray-700/30 rounded-full", children: /* @__PURE__ */ jsx(Text, { sz: "xs-1", className: "text-gray-300", children: "Gửi lời chào đầu tiên 👋" }) })
          ] }) : null,
          /* @__PURE__ */ jsx(MessageList, { conversationId, isGroup: conversationData?.isGroup })
        ] }),
        /* @__PURE__ */ jsx(
          ChatInput,
          {
            conversationId: !tempTargetId ? conversationId : void 0,
            correlationId: tempTargetId ? conversationId : void 0,
            receiverId: tempTargetId
          }
        )
      ]
    }
  );
};
const GroupChatWindow = ({ className }) => {
  const { activeIds } = useChatStore();
  return /* @__PURE__ */ jsx("div", { className: clsx("flex gap-3", className), children: activeIds.map((id) => {
    return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ChatWindow, { className: "rounded-b-none", conversationId: id }) }, id);
  }) });
};
const BubbleChat = ({ className, conversationId }) => {
  const { toggleMinimize, closeChat, registry } = useChatStore();
  const chat = registry[conversationId];
  const tempTargetId = chat?.type === "temp" ? chat.targetId : void 0;
  const { data: tempUser } = useGetUserProfile(tempTargetId);
  const { data: conversationData } = useGetConversation(conversationId);
  const chatAvatar = tempUser ? tempUser.infos.avatar : conversationData?.avatarUrl || "";
  const handleOnClick = () => {
    toggleMinimize(conversationId);
  };
  const handleOnClose = (e) => {
    e.stopPropagation();
    closeChat(conversationId);
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative flex gap-4 group", className), onClick: handleOnClick, children: [
    /* @__PURE__ */ jsx(
      Avatar,
      {
        sz: "sm-2",
        alt: "Avatar",
        src: chatAvatar,
        className: clsx(
          "shadow-lg shadow-bg-second hover:shadow-bg-fourth",
          "hover:scale-105 cursor-pointer hover:brightness-95 transition-all duration-200",
          "border-2 border-bg-ninth",
          "active:scale-95"
        )
      }
    ),
    /* @__PURE__ */ jsx(
      MiniButton,
      {
        sz: "xs-2",
        className: "absolute opacity-0 group-hover:opacity-100 bg-gray-500 !duration-100 top-[-20%] right-[-20%]",
        onClick: handleOnClose,
        children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
      }
    )
  ] });
};
const BubbleChatList = ({ className }) => {
  const { minimizedIds } = useChatStore();
  return /* @__PURE__ */ jsx("div", { className: clsx("flex gap-4 flex-col", className), children: minimizedIds.map((id) => /* @__PURE__ */ jsx(BubbleChat, { conversationId: id }, id)) });
};
const ChatLayer = ({ className }) => {
  const isFatalkPage = useLocation().pathname.startsWith("/fatalk");
  if (isFatalkPage) return null;
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex items-end gap-4", className), children: [
    /* @__PURE__ */ jsx(GroupChatWindow, {}),
    /* @__PURE__ */ jsx(BubbleChatList, { className: "mb-5" })
  ] });
};
const ChatList = ({ className, onConversationClick }) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { formatTime } = useFormatTime();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useConversations();
  const { renderConversationName, renderSystemMessage } = useRenderConversationContent();
  const conversations2 = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);
  const handleConversationClick = useCallback(
    (conversationId) => {
      onConversationClick?.(conversationId);
    },
    [onConversationClick]
  );
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col p-2", className), children: [
    /* @__PURE__ */ jsx(
      Textbox,
      {
        placeholder: t("common:conversations.search"),
        sz: "xs-3",
        className: "border-0 w-full"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto mt-2", children: /* @__PURE__ */ jsx(
      InfiniteScrollFlex,
      {
        items: conversations2,
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        itemTemplate: (item) => {
          const conversation = item;
          const lastMessage = conversation.lastMessage;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: clsx(
                "flex gap-2 px-1 py-2",
                "hover:bg-bg-fourth rounded-lg transition-colors",
                "cursor-pointer"
              ),
              onClick: () => handleConversationClick(conversation.id),
              children: [
                /* @__PURE__ */ jsx(Avatar, { src: conversation.avatarUrl ?? "", alt: "Conversation Avatar", sz: "sm-1" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 min-w-0", children: [
                  /* @__PURE__ */ jsx(
                    Text,
                    {
                      sz: "sm-2",
                      weight: "bold",
                      className: clsx("line-clamp-1 truncate max-w-full"),
                      children: renderConversationName(conversation)
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center opacity-80", children: [
                    /* @__PURE__ */ jsx(Text, { sz: "xs-3", className: "truncate max-w-full", children: lastMessage ? isSystemMessage(lastMessage?.type || MessageType.System) ? renderSystemMessage(lastMessage) : userId === lastMessage?.senderId ? t("common:conversations.you") + ": " + lastMessage?.content : lastMessage?.senderFullName + ": " + lastMessage?.content : "Unknown" }),
                    /* @__PURE__ */ jsx(Text, { sz: "xs-3", className: "mx-2 shrink-0", children: "•" }),
                    /* @__PURE__ */ jsx(Text, { sz: "xs-3", className: "shrink-0", children: formatTime(conversation.lastMessage?.createdAt ?? "") })
                  ] })
                ] })
              ]
            },
            conversation.id
          );
        },
        itemKey: (item) => item.id,
        isLoading: isLoading || isFetching,
        loadingSkeleton: /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center"), children: [
          /* @__PURE__ */ jsx(Skeleton, { sz: "md-2", variant: "circle" }),
          /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col w-full flex-1 gap-2 ml-2"), children: [
            /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-full"), sz: "sm-2" }),
            /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-[50%]"), sz: "sm-2" })
          ] })
        ] }),
        numberOfSkeletons: 2,
        emptyComponent: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 mt-4 min-h-[200px]", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-message text-3xl text-gray-400" }),
          /* @__PURE__ */ jsx(Text, { sz: "md-1", color: "secondary", children: t("common:conversations.no-conversations") })
        ] })
      }
    ) })
  ] });
};
const MultiSelect = ({
  className,
  options,
  defaultSelected: _defaultSelected,
  onLoadMore,
  hasMore,
  onAccept,
  onCancel,
  itemTemplate,
  selectItemTemplate,
  defaultItemTemplate,
  selectClassName,
  optionClassName,
  canRemoveDefaultSelected = false,
  isLoading
}) => {
  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState(
    _defaultSelected || []
  );
  const handleRemoveSelected = (value) => {
    if (canRemoveDefaultSelected) {
      setDefaultSelected(defaultSelected.filter((s) => s.value !== value));
    }
    setSelected(selected.filter((s) => s.value !== value));
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col gap-1",
        isLoading ? "opacity-50 cursor-not-allowed" : "",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: clsx("mb-2 gap-4", selectClassName), children: [...defaultSelected, ...selected].map((item, index) => {
          const isDefault = defaultSelected.some((s) => s.value === item.value);
          return /* @__PURE__ */ jsx("div", { className: "relative", children: isDefault ? defaultItemTemplate(item.item, () => handleRemoveSelected(item.value), index) : selectItemTemplate(item.item, () => handleRemoveSelected(item.value), index) }, item.value);
        }) }),
        /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col gap-1 overflow-y-auto", optionClassName), children: /* @__PURE__ */ jsx(
          InfiniteScrollFlex,
          {
            items: options || [],
            onLoadMore,
            hasMore,
            itemKey: (item) => item.value,
            itemTemplate: (option, index) => {
              const isSelected = selected.some((s) => s.value === option.value) || defaultSelected.some((s) => s.value === option.value);
              return /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => {
                    if (isLoading) return;
                    if (isSelected) {
                      setSelected(selected.filter((s) => s.value !== option.value));
                    } else {
                      setSelected([...selected, option]);
                    }
                  },
                  children: itemTemplate ? itemTemplate(option.item, isSelected, index) : option.item
                }
              );
            }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex gap-1 mt-1", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              sz: "sm-1",
              className: "flex-1 flex items-center justify-center",
              onClick: () => onAccept?.(
                selected.map((s) => s.value),
                defaultSelected.map((s) => s.value)
              ),
              disabled: isLoading,
              children: [
                isLoading && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) }),
                "Accept"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              sz: "sm-1",
              className: "flex-1  flex items-center justify-center",
              variant: "fourth",
              onClick: onCancel,
              disabled: isLoading,
              children: [
                isLoading && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) }),
                "Cancel"
              ]
            }
          )
        ] })
      ]
    }
  );
};
const PREFIX$1 = buildApiPath("/user");
class UserService {
  async getUsers(query) {
    return await apiGet(`${PREFIX$1}`, query);
  }
}
const userService = new UserService();
const userKeys = {
  all: ["users"],
  list: (queryParams) => [...userKeys.all, "list", queryParams]
};
const useGetInfiniteUsers = (queryParams) => {
  return useSafeInfiniteQueryResult({
    queryKey: userKeys.list(queryParams),
    fn: async (cursor) => await userService.getUsers({ ...queryParams, cursor }),
    enabled: true
  });
};
const CreateGroupChat = ({
  className,
  onTurnBack,
  onCreateSuccess
}) => {
  const { userId } = useAuth();
  const { data: me } = useGetUserProfile(userId);
  const { data: users, fetchNextPage, hasNextPage } = useGetInfiniteUsers();
  const { fetch: createGroupChat, isFetching } = useCreateGroupConversation();
  const textboxRef = useRef(null);
  const options = users?.pages.flatMap(
    (page) => page.items.filter((user2) => user2.id !== userId).map((user2) => ({
      item: { name: user2.fullName, avatar: user2.avatar },
      value: user2.id
    }))
  );
  const defaultSelected = me ? [
    {
      item: { name: me.infos.fullName, avatar: me.infos.avatar },
      value: userId
    }
  ] : [];
  const handleCreateGroupChat = useCallback(
    async (selectedValues) => {
      const name = textboxRef.current?.value;
      await createGroupChat(
        { participantIds: selectedValues, name: name || null },
        {
          onSuccess: (data) => {
            if (data) onCreateSuccess?.(data);
          }
        }
      );
    },
    [createGroupChat]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "ml-1", children: /* @__PURE__ */ jsx(Text, { weight: "bold", sz: "md-1", children: "Tạo nhóm chat" }) }),
    /* @__PURE__ */ jsx(
      Textbox,
      {
        sz: "xs-1",
        placeholder: "Nhập tên nhóm chat (Không bắt buộc)",
        className: "w-full !rounded-lg",
        ref: textboxRef,
        disabled: isFetching
      }
    ),
    /* @__PURE__ */ jsx(
      MultiSelect,
      {
        options,
        defaultSelected,
        itemTemplate: (item, isSelected) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
              isSelected ? "bg-bg-third" : "hover:bg-bg-third/60"
            ),
            children: [
              /* @__PURE__ */ jsx("div", { className: "relative flex-shrink-0", children: /* @__PURE__ */ jsx(Avatar, { src: item.avatar, alt: item.name, sz: "xs-2" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: clsx(
                    "text-sm truncate",
                    isSelected ? "font-medium text-text-main" : "text-text-main/80"
                  ),
                  children: item.name
                }
              ) }),
              isSelected && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-primary-500" })
            ]
          }
        ),
        selectItemTemplate: (item, onRemove) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-3 py-2 rounded-md  text-primary-500 bg-primary-500/15 text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate max-w-[100px]", children: item.name }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "flex items-center justify-center w-4 h-4 rounded-sm hover:bg-primary-500/20 transition-colors",
              onClick: onRemove,
              children: "×"
            }
          )
        ] }),
        defaultItemTemplate: (item) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 px-3 py-2 rounded-md bg-gray-500/15 text-xs", children: /* @__PURE__ */ jsx("span", { className: "truncate max-w-[100px]", children: item.name }) }),
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        selectClassName: "flex flex-wrap gap-1 border-2 border-bg-third bg-bg-sixth rounded-lg px-2 py-2",
        optionClassName: "overflow-y-auto pr-1 border-2 rounded-md border-bg-third",
        className: clsx("", className),
        canRemoveDefaultSelected: false,
        onAccept: handleCreateGroupChat,
        onCancel: onTurnBack,
        isLoading: isFetching
      }
    )
  ] });
};
const ChatMenu = ({ className, onConversationClick, ref }) => {
  const [tab, setTab] = useState("list");
  const { data } = useConversations();
  const { openChat } = useChatStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleSelectConversation = (conversationId) => {
    openChat(conversationId, { type: "conversation", conversationId });
    onConversationClick?.(conversationId);
  };
  const handleCreateConversation = async () => {
    setTab("create");
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide !w-[380px]",
        "max-h-[500px]",
        className
      ),
      ref,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 flex mt-3 mr-3 gap-2", children: /* @__PURE__ */ jsx(MiniButton, { sz: "sm-2", className: "bg-bg-fifth", onClick: handleCreateConversation, children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-pen-to-square" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between px-2 pt-2", children: /* @__PURE__ */ jsx(Text, { sz: "lg-1", weight: "bold", children: t("common:conversations.title") }) }),
        tab === "list" && /* @__PURE__ */ jsx(ChatList, { className: "overflow-hidden", onConversationClick: handleSelectConversation }),
        tab === "create" && /* @__PURE__ */ jsx(
          CreateGroupChat,
          {
            className: "overflow-hidden h-full max-h-[90%] w-full",
            onTurnBack: () => setTab("list"),
            onCreateSuccess: () => setTab("list")
          }
        ),
        tab === "list" && /* @__PURE__ */ jsx("div", { className: "flex justify-center border-t border-text-main/10 pt-2 pb-1 px-2 mt-auto", children: /* @__PURE__ */ jsxs(
          "button",
          {
            className: "p-2 w-full rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center justify-center gap-2",
            onClick: () => {
              const firstId = data?.pages[0]?.items[0]?.id || "";
              navigate(`/fatalk/${firstId}`);
            },
            title: "Mở Fatalk",
            children: [
              /* @__PURE__ */ jsx(Text, { sz: "sm-1", color: "secondary", children: "Mở Fatalk" }),
              /* @__PURE__ */ jsx(Text, { sz: "sm-1", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-up-right-from-square" }) })
            ]
          }
        ) })
      ]
    }
  );
};
const ChatBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const count = 5;
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  useClickOutside(menuRef, btnRef, () => {
    if (isOpen) setIsOpen(false);
  });
  const handleConversationClick = () => {
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(Badge, { count, onClick: () => setIsOpen(!isOpen), ref: btnRef, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-comment" }) }),
    isOpen && /* @__PURE__ */ jsx(
      ChatMenu,
      {
        className: clsx(
          "!absolute max-h-[600px] z-10 min-w-[350px] min-h-[100px]",
          "sm:top-[120%] sm:right-0 sm:w-auto sm:h-auto sm:p-2",
          "top-[108%] -right-[70px] w-screen h-screen p-6"
        ),
        ref: menuRef,
        onConversationClick: handleConversationClick
      }
    )
  ] });
};
const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isFatalkPage = pathname.startsWith("/fatalk");
  const headerRef = useRef(null);
  const items = [
    { icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-house" }), path: "/", isIndex: true, showOnDesktop: true },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-group" }),
      path: "/friends",
      isIndex: false,
      showOnDesktop: true
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-message" }),
      path: "/fatalk",
      isIndex: false,
      showOnDesktop: false
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bell" }),
      path: "/notifications",
      isIndex: false,
      showOnDesktop: false
    }
  ];
  const pathHasTopBar = ["/", "/friends"].some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const { conversationId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!headerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }
    });
    resizeObserver.observe(headerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  const openLoginOverlay = useCallback(() => {
    if (isMobile) {
      navigate("/login");
      return;
    }
    openDialog({
      content: /* @__PURE__ */ jsx(LoginForm, { showLogo: false })
    });
  }, [isMobile, openDialog]);
  const openRegisterOverlay = useCallback(() => {
    if (isMobile) {
      navigate("/register");
      return;
    }
    openDialog({
      content: /* @__PURE__ */ jsx(RegisterForm, { showLogo: false })
    });
  }, [isMobile, openDialog]);
  useEffect(() => {
    if (isAuthenticated) {
      closeDialog();
    } else {
      if (isMobile) return;
      openLoginOverlay();
    }
    return () => closeDialog();
  }, [isMobile, isAuthenticated, closeDialog, openLoginOverlay]);
  const handleGoToHome = useCallback(() => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      if (!isMobile) {
        navigate("/login");
        return;
      }
      openLoginOverlay();
    }
  }, [isMobile, isAuthenticated, openLoginOverlay]);
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsxs(
      Layout.Header,
      {
        className: clsx(isMobile && conversationId && "hidden", "sticky top-0 z-40"),
        ref: headerRef,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "flex items-center px-4 h-[25px] bg-bg-main",
                isMobile && (pathHasTopBar || !isAuthenticated) ? "block" : "hidden"
              ),
              children: /* @__PURE__ */ jsx("div", { onClick: handleGoToHome, children: /* @__PURE__ */ jsx(Logo, { sz: "sm-2", hasSlogan: false }) })
            }
          ),
          /* @__PURE__ */ jsx(
            Navbar,
            {
              isAuthenticated,
              items,
              logo: !isMobile && /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: handleGoToHome,
                  className: "sm:block hidden cursor-pointer items-center gap-2",
                  children: /* @__PURE__ */ jsx(Logo, { hasSlogan: false, sz: "sm-3" })
                }
              ),
              optionClassName: "!justify-end",
              options: isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center gap-2"), children: [
                /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex gap-2", children: [
                  !isFatalkPage && /* @__PURE__ */ jsx(ChatBadge, {}),
                  /* @__PURE__ */ jsx(NotificationBadge, {})
                ] }),
                /* @__PURE__ */ jsx(UserMenu, {})
              ] }) : !isMobile && /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center gap-2"), children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    sz: "sm-1",
                    variant: "secondary",
                    className: "whitespace-nowrap inline-flex",
                    onClick: openLoginOverlay,
                    children: "Sign in"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    sz: "sm-1",
                    variant: "primary",
                    className: "whitespace-nowrap inline-flex",
                    onClick: openRegisterOverlay,
                    children: "Sign up"
                  }
                )
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Layout.Main, { className: "flex-1 flex flex-col scrollbar-hide sm:scrollbar-default", children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      !isMobile && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none z-50", children: /* @__PURE__ */ jsx(ChatLayer, { className: "absolute bottom-0 right-4 pointer-events-auto" }) })
    ] }),
    isMobile && !isAuthenticated && /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "flex flex-col fixed bottom-0 left-0 right-0 bg-bg-sixth/80 backdrop-blur-sm py-12 px-6",
          "gap-6 border-t-2 border-primary-500/50 rounded-t-2xl shadow-lg"
        ),
        children: [
          /* @__PURE__ */ jsx(Text, { sz: "sm-2", className: "text-center", wrap: "whitespace-normal", children: "Join Fatagram to connect with your friends and the world around you!" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center h-full", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                sz: "sm-1",
                variant: "primary",
                className: "whitespace-nowrap inline-flex flex-1 justify-center",
                onClick: openLoginOverlay,
                children: "Sign in"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                sz: "sm-1",
                variant: "secondary",
                className: "whitespace-nowrap inline-flex ml-4 flex-1 justify-center",
                onClick: openRegisterOverlay,
                children: "Sign up"
              }
            )
          ] })
        ]
      }
    )
  ] });
};
const SecondLayout = () => {
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx(Layout.Main, { className: "flex-1 flex flex-col", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Layout.Footer, { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "bg-bg-second text-center py-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-text-secondary", children: "© 2026 Fatagram. All rights reserved." }) }) })
  ] });
};
function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      navigate("/login");
      return;
    }
    loginWithGoogle(code);
  }, []);
  return /* @__PURE__ */ jsx(LoadingPage, {});
}
const onboardingValidationSchema = Yup.object({
  firstName: Yup.string().min(2, "onboarding:validation.firstNameTooShort").required("onboarding:validation.firstNameRequired"),
  middleName: Yup.string(),
  lastName: Yup.string().min(2, "onboarding:validation.lastNameTooShort").required("onboarding:validation.lastNameRequired"),
  birthday: Yup.date().max(/* @__PURE__ */ new Date(), "onboarding:validation.birthdayInvalid").required("onboarding:validation.birthdayRequired"),
  gender: Yup.string().required("onboarding:validation.genderRequired")
});
const onboardingInitialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthday: "",
  gender: ""
};
const ErrorCodes$3 = {
  FIRSTNAME_REQUIRED: {
    message: "onboarding:errorMessages.firstNameRequired",
    type: "FirstName"
  },
  FIRSTNAME_TOO_SHORT: {
    message: "onboarding:errorMessages.firstNameTooShort",
    type: "FirstName"
  },
  LASTNAME_REQUIRED: {
    message: "onboarding:errorMessages.lastNameRequired",
    type: "LastName"
  },
  LASTNAME_TOO_SHORT: {
    message: "onboarding:errorMessages.lastNameTooShort",
    type: "LastName"
  },
  BIRTHDAY_REQUIRED: {
    message: "onboarding:errorMessages.birthdayRequired",
    type: "Birthday"
  },
  BIRTHDAY_INVALID: {
    message: "onboarding:errorMessages.birthdayInvalid",
    type: "Birthday"
  },
  GENDER_REQUIRED: {
    message: "onboarding:errorMessages.genderRequired",
    type: "Gender"
  },
  UNKNOWN_ERROR: {
    message: "onboarding:errorMessages.unknownError",
    type: "UnknownError"
  }
};
const genderOptions = [
  { key: "male", value: "Nam" },
  { key: "female", value: "Nữ" },
  { key: "other", value: "Khác" }
];
const OnboardingForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { fetch: completeOnboarding } = useOnboarding();
  const formik = useFormik({
    initialValues: { ...onboardingInitialValues, gender: genderOptions[0].key },
    validationSchema: onboardingValidationSchema,
    onSubmit: async (values) => {
      setErrors({});
      await completeOnboarding(
        {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          birthday: values.birthday,
          gender: values.gender.toString()
        },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: (err) => {
            console.error("Error completing onboarding:", err);
            const errorCode = err?.code;
            if (errorCode && ErrorCodes$3[errorCode]) {
              const errorInfo = ErrorCodes$3[errorCode];
              setErrors({ [errorInfo.type]: errorInfo.message });
            }
          }
        }
      );
    }
  });
  React.useEffect(() => {
    const fetchDefaults = async () => {
      const result = await userProfileService.getOnboardingDefaults();
      if (result.success && result.data) {
        const data = result.data;
        const genderMap = {
          0: "male",
          1: "female",
          2: "other"
        };
        formik.setValues({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          birthday: data.birthDay ? data.birthDay.split("T")[0] : "",
          gender: data.gender !== void 0 ? genderMap[data.gender] || "male" : "male"
        });
      }
    };
    fetchDefaults();
  }, [formik.setValues]);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    formik.isSubmitting && /* @__PURE__ */ jsx(OverlayLoading, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex sm:flex-row flex-col gap-2 w-full", children: [
        /* @__PURE__ */ jsx(
          Textbox,
          {
            title: "Họ",
            className: "w-full",
            isRequired: true,
            placeholder: "Họ",
            value: formik.values.firstName,
            onChange: (e) => formik.setFieldValue("firstName", e.target.value),
            isWrong: formik.touched.firstName && Boolean(formik.errors.firstName) || Boolean(errors.FirstName),
            wrongMessage: t(errors.FirstName || formik.errors.firstName || "")
          }
        ),
        /* @__PURE__ */ jsx(
          Textbox,
          {
            title: "Tên đệm",
            className: "w-full",
            placeholder: "Tên đệm",
            value: formik.values.middleName,
            onChange: (e) => formik.setFieldValue("middleName", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Textbox,
          {
            title: "Tên",
            isRequired: true,
            placeholder: "Tên",
            className: "w-full",
            value: formik.values.lastName,
            onChange: (e) => formik.setFieldValue("lastName", e.target.value),
            isWrong: formik.touched.lastName && Boolean(formik.errors.lastName) || Boolean(errors.LastName),
            wrongMessage: t(errors.LastName || formik.errors.lastName || "")
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        SelectDay,
        {
          title: "Ngày sinh",
          isRequired: true,
          value: formik.values.birthday,
          onChange: (e) => formik.setFieldValue("birthday", e.target.value),
          isWrong: formik.touched.birthday && Boolean(formik.errors.birthday) || Boolean(errors.Birthday),
          wrongMessage: t(errors.Birthday || formik.errors.birthday || "")
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
        /* @__PURE__ */ jsx(
          SelectBox,
          {
            title: "Giới tính",
            isRequired: true,
            options: genderOptions,
            selectedOption: formik.values.gender,
            onSelect: (key) => formik.setFieldValue("gender", key)
          }
        ),
        (formik.touched.gender && formik.errors.gender || errors.Gender) && /* @__PURE__ */ jsx("span", { className: "text-xs text-error ml-1", children: t(errors.Gender || formik.errors.gender || "") })
      ] }) }),
      /* @__PURE__ */ jsx(Button, { type: "button", className: "w-full", onClick: formik.submitForm, sz: "sm-1", children: "Hoàn tất" })
    ] })
  ] });
};
function OnboardingPage() {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "w-full h-full flex items-center justify-center bg-gradient-to-br",
        "from-primary-500/10 via-bg-main to-primary-600/10"
      ),
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: clsx(
            "relative flex flex-col items-center justify-center gap-8 w-full h-full sm:h-auto sm:max-w-[700px]",
            "bg-bg-second/80 sm:rounded-3xl shadow-2xl",
            "sm:p-10 px-4 border border-border-main/50"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -left-20 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 z-10", children: [
              /* @__PURE__ */ jsx(Logo, { sz: "md-1", hasSlogan: false }),
              /* @__PURE__ */ jsx(
                Text,
                {
                  sz: "xl-2",
                  weight: "extrabold",
                  className: "mt-2 !text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 font-inter",
                  children: "Chào bạn!"
                }
              ),
              /* @__PURE__ */ jsx(Text, { sz: "md-2", className: "text-text-secondary text-center max-w-[400px]", children: "Hãy hoàn tất thông tin cần thiết" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-[1px] bg-gradient-to-r from-transparent via-border-main to-transparent" }),
            /* @__PURE__ */ jsx(OnboardingForm, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-text-third", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-shield-halved text-primary-500" }),
              /* @__PURE__ */ jsx(Text, { sz: "sm-2", children: "Thông tin của bạn được bảo mật tuyệt đối" })
            ] })
          ]
        }
      )
    }
  );
}
const SettingsNavbar = ({ className, onSelect }) => {
  const { t } = useTranslation();
  const authSettings = [
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user" }),
      name: t("settings:navbar.privacy.account"),
      path: "/settings"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-shield-halved" }),
      name: t("settings:navbar.privacy.privacy"),
      path: "/settings/privacy"
    }
  ];
  const generalSettings = [
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-language" }),
      name: t("settings:navbar.general.language"),
      path: "/settings/language"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bell" }),
      name: t("settings:navbar.general.notifications"),
      path: "/settings/notifications"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info" }),
      name: t("settings:navbar.general.about"),
      path: "/settings/about"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-palette" }),
      name: t("settings:navbar.general.theme"),
      path: "/settings/theme"
    }
  ];
  return /* @__PURE__ */ jsxs(PageNavbar, { title: t("settings:navbar.title"), className: clsx("bg-bg-second", className), children: [
    /* @__PURE__ */ jsx(PageNavbar.Section, { title: t("settings:navbar.privacy.title"), className: "px-2 space-y-1", children: authSettings.map((item, index) => /* @__PURE__ */ jsx(
      PageNavbar.Item,
      {
        path: item.path,
        icon: item.icon,
        title: item.name,
        onClick: onSelect
      },
      index
    )) }),
    /* @__PURE__ */ jsx(PageNavbar.Section, { title: t("settings:navbar.general.title"), className: "px-2 space-y-1", children: generalSettings.map((item, index) => /* @__PURE__ */ jsx(
      PageNavbar.Item,
      {
        path: item.path,
        icon: item.icon,
        title: item.name,
        onClick: onSelect
      },
      index
    )) })
  ] });
};
const SettingPage = () => {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    document.title = t("settings:title");
  }, [t]);
  return /* @__PURE__ */ jsx(
    SidebarPageLayout,
    {
      title: "Cài đặt",
      showSidebar,
      setShowSidebar,
      navbar: /* @__PURE__ */ jsx(SettingsNavbar, { className: "h-full", onSelect: () => setShowSidebar(false) }),
      children: /* @__PURE__ */ jsx(Outlet, {})
    }
  );
};
const EditableField = ({
  className,
  editableMode = "none",
  title: title2,
  value,
  placeholder,
  valueClassName,
  btnChildren,
  isEdit,
  isError = false,
  errorMessage,
  noDataValue,
  canEdit = true,
  onChangeClick,
  onSaveClick,
  onCancelClick
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const { t } = useTranslation();
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col sm:flex-row sm:justify-between sm:items-center w-full",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(Text, { sz: "lg-1", className: "font-semibold mb-0", children: title2 }),
        /* @__PURE__ */ jsxs("div", { className: "flex sm:items-center items-end gap-4 justify-between", children: [
          editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx(
              Textbox,
              {
                className: clsx("animate-fade-in px-2 py-1", {
                  "mt-[5px]": isError
                }),
                placeholder,
                value: inputValue,
                isWrong: isError,
                onChange: (e) => setInputValue(e.target.value)
              }
            ),
            isError && /* @__PURE__ */ jsx(Text, { sz: "sm-1", className: "text-red-500 ml-2 h-[5px]", children: errorMessage })
          ] }) : /* @__PURE__ */ jsx(Text, { sz: "lg-1", className: clsx(valueClassName), children: value ?? noDataValue }),
          canEdit && /* @__PURE__ */ jsx(Fragment, { children: editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "animate-fade-in gap-1 flex", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                disabled: value === inputValue,
                sz: "sm-1",
                variant: "primary",
                onClick: () => {
                  onSaveClick?.(inputValue);
                },
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-floppy-disk mr-2" }),
                  t("settings:editableField.saveButton")
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                sz: "sm-1",
                variant: "fourth",
                onClick: () => {
                  onCancelClick?.();
                },
                children: t("settings:editableField.cancelButton")
              }
            )
          ] }) : /* @__PURE__ */ jsx(
            Button,
            {
              sz: "sm-1",
              variant: "fourth",
              onClick: () => {
                onChangeClick?.();
              },
              children: btnChildren
            }
          ) })
        ] })
      ]
    }
  );
};
const ErrorCodes$2 = {
  USER_NOT_FOUND: "settings:account.personalInfo.errorMessages.changeUrlName.userNotFound",
  URLNAME_EXIST: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameAlreadyExist",
  URL_NAME_TOO_SHORT: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameTooShort",
  URL_NAME_TOO_LONG: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameTooLong",
  URL_NAME_EMPTY: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameEmpty",
  URL_NAME_CONTAINS_SPACE: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameContainsSpace",
  UNKNOWN_ERROR: "settings:account.personalInfo.errorMessages.changeUrlName.unknownError",
  INTERNAL_SERVER_ERROR: "settings:account.personalInfo.errorMessages.changeUrlName.internalServerError"
};
const ChangeUrlName = ({ userId }) => {
  const t = useLanguage$1();
  const { setUrlName: _setUrlName } = useAuth();
  const [isEditUrlName, setIsEditUrlName] = useState(false);
  const [isEditUrlNameFailed, setIsEditUrlNameFailed] = useState(false);
  const [editUrlFailedMessage, setEditUrlFailedMessage] = useState("");
  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const updateUrlNameMutation = useUpdateUrlName(userId);
  const handleSaveUrlName = (newUrlName) => {
    if (!newUrlName) return;
    updateUrlNameMutation.fetch(
      { urlName: newUrlName },
      {
        onSuccess: () => {
          setIsEditUrlName(false);
          setIsEditUrlNameFailed(false);
          _setUrlName?.(newUrlName);
        },
        onError: (error) => {
          const errorCode = error?.code;
          if (errorCode && ErrorCodes$2[errorCode]) {
            setEditUrlFailedMessage(t(ErrorCodes$2[errorCode]));
          } else {
            setEditUrlFailedMessage(t(ErrorCodes$2["UNKNOWN_ERROR"]));
          }
          setIsEditUrlNameFailed(true);
        }
      }
    );
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Skeleton, { sz: "md-1", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" });
  }
  return /* @__PURE__ */ jsx(
    EditableField,
    {
      title: t("settings:account.personalInfo.urlName"),
      value: userProfile?.infos.urlName,
      noDataValue: t("settings:account.personalInfo.noUrlName"),
      placeholder: t("settings:account.personalInfo.urlNamePlaceholder"),
      valueClassName: clsx(!userProfile?.infos.urlName && "!opacity-50"),
      btnChildren: /* @__PURE__ */ jsxs(Text, { children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen mr-2" }),
        t("settings:account.personalInfo.changeButton")
      ] }),
      editableMode: "inline",
      isEdit: isEditUrlName,
      isError: isEditUrlNameFailed,
      errorMessage: editUrlFailedMessage,
      onChangeClick: () => {
        setIsEditUrlName(true);
      },
      onCancelClick: () => {
        setIsEditUrlName(false);
        setIsEditUrlNameFailed(false);
      },
      onSaveClick: handleSaveUrlName
    }
  );
};
const ErrorCodes$1 = {
  NICKNAME_TOO_LONG: "settings:account.personalInfo.errorMessages.changeNickname.nicknameTooLong"
};
const ChangeNickname = ({ userId }) => {
  const t = useLanguage$1();
  const [isEditNickname, setIsEditNickname] = useState(false);
  const [isEditNicknameFailed, setIsEditNicknameFailed] = useState(false);
  const [editNicknameFailedMessage, setEditNicknameFailedMessage] = useState("");
  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const updateNicknameMutation = useUpdateNickname(userId);
  const handleSaveNickname = (newNickname) => {
    if (!newNickname) return;
    updateNicknameMutation.fetch(
      { nickname: newNickname },
      {
        onSuccess: () => {
          setIsEditNickname(false);
          setIsEditNicknameFailed(false);
        },
        onError: (error) => {
          const errorCode = error?.code;
          if (errorCode && ErrorCodes$1[errorCode]) {
            setEditNicknameFailedMessage(t(ErrorCodes$1[errorCode]));
          } else {
            setEditNicknameFailedMessage(
              t("settings:account.personalInfo.errorMessages.changeNickname.unknownError")
            );
          }
          setIsEditNicknameFailed(true);
        }
      }
    );
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Skeleton, { sz: "md-1", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" });
  }
  return /* @__PURE__ */ jsx(
    EditableField,
    {
      title: t("settings:account.personalInfo.nickname"),
      value: userProfile?.infos.nickname,
      noDataValue: t("settings:account.personalInfo.noNickname"),
      placeholder: t("settings:account.personalInfo.nicknamePlaceholder"),
      valueClassName: clsx(!userProfile?.infos.nickname && "!opacity-50"),
      btnChildren: /* @__PURE__ */ jsxs(Text, { children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen mr-2" }),
        t("settings:account.personalInfo.changeButton")
      ] }),
      editableMode: "inline",
      isEdit: isEditNickname,
      isError: isEditNicknameFailed,
      errorMessage: editNicknameFailedMessage,
      onChangeClick: () => {
        setIsEditNickname(true);
      },
      onCancelClick: () => {
        setIsEditNickname(false);
        setIsEditNicknameFailed(false);
      },
      onSaveClick: handleSaveNickname
    }
  );
};
const AccountSetting = () => {
  const t = useLanguage$1();
  const { userId } = useAuth();
  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const navigate = useNavigate();
  const handleChangeName = () => navigate("name");
  return /* @__PURE__ */ jsxs(SidebarPageCard, { title: t("settings:account.personalInfo.title"), children: [
    isLoading ? /* @__PURE__ */ jsx(Skeleton, { sz: "md-1", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" }) : /* @__PURE__ */ jsx(
      EditableField,
      {
        title: t("settings:account.personalInfo.yourName"),
        value: userProfile?.infos.fullName,
        btnChildren: /* @__PURE__ */ jsxs(Text, { children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen mr-2" }),
          " ",
          t("settings:account.personalInfo.changeButton")
        ] }),
        onChangeClick: handleChangeName
      }
    ),
    /* @__PURE__ */ jsx(ChangeUrlName, { userId }),
    /* @__PURE__ */ jsx(ChangeNickname, { userId })
  ] });
};
const AccountSettingPage = () => {
  return /* @__PURE__ */ jsxs(SidebarPage, { children: [
    /* @__PURE__ */ jsx(AccountSetting, {}),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
};
const SelectBoxSetting = ({
  options = [],
  selectedOption = "",
  onOptionChange = () => {
  },
  title: title2,
  className,
  selectBox
}) => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex justify-between items-center w-full", className), children: [
    /* @__PURE__ */ jsx(Text, { sz: "lg-1", className: "", children: title2 }),
    selectBox ? selectBox : /* @__PURE__ */ jsx(
      SelectBox,
      {
        className: "!min-w-[170px]",
        selectedOption,
        options,
        onSelect: (e) => onOptionChange(e)
      }
    )
  ] });
};
const ThemeSettings = () => {
  const { availableThemes, theme: theme2, setTheme } = useTheme();
  const [themeOptions, setThemeOptions] = useState([]);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const selectTheme = (opt) => {
    setTheme(opt);
    showSnackbar(t("settings:theme.themeChanged"), "info");
  };
  useEffect(() => {
    const options = availableThemes.map((theme22) => ({
      key: theme22.key,
      value: t(theme22.label)
    }));
    setThemeOptions(options);
  }, [availableThemes, t]);
  return /* @__PURE__ */ jsx(SidebarPageCard, { title: t("settings:theme.title"), children: /* @__PURE__ */ jsx(
    SelectBoxSetting,
    {
      title: t("settings:theme.selectTheme"),
      selectedOption: theme2,
      options: themeOptions,
      onOptionChange: selectTheme
    }
  ) });
};
const ThemeSettingPage = () => {
  return /* @__PURE__ */ jsx(SidebarPage, { children: /* @__PURE__ */ jsx(ThemeSettings, {}) });
};
const ErrorCodes = {
  FIRSTNAME_NOT_CORRECT_FORMAT: {
    message: "settings:account.personalInfo.errorMessages.changeName.firstNameNotCorrectFormat",
    type: "FirstName"
  },
  LASTNAME_NOT_CORRECT_FORMAT: {
    message: "settings:account.personalInfo.errorMessages.changeName.lastNameNotCorrectFormat",
    type: "LastName"
  },
  UNKNOWN_ERROR: {
    message: "settings:account.personalInfo.errorMessages.changeName.unknownError",
    type: "UnknownError"
  },
  INTERNAL_SERVER_ERROR: {
    message: "settings:account.personalInfo.errorMessages.changeName.internalServerError",
    type: "InternalServerError"
  }
};
const ChangeNameForm = ({ className }) => {
  const [firstNameFailed, setFirstNameFailed] = React.useState(false);
  const [middleNameFailed, setMiddleNameFailed] = React.useState(false);
  const [lastNameFailed, setLastNameFailed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const updateNameMutation = useUpdateName(userId);
  const [newFirstName, setNewFirstName] = React.useState("");
  const [newMiddleName, setNewMiddleName] = React.useState("");
  const [newLastName, setNewLastName] = React.useState("");
  useEffect(() => {
    setNewFirstName(userProfile?.infos.firstName || "");
    setNewMiddleName(userProfile?.infos.middleName || "");
    setNewLastName(userProfile?.infos.lastName || "");
  }, [userProfile]);
  const handleClose = () => {
    navigate("/settings");
  };
  const handleSubmit = async () => {
    setErrorMessage("");
    setFirstNameFailed(false);
    setMiddleNameFailed(false);
    setLastNameFailed(false);
    setIsSubmitting(true);
    await updateNameMutation.fetch(
      {
        firstName: newFirstName,
        middleName: newMiddleName || null,
        lastName: newLastName
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          navigate("/settings");
        },
        onError: (error) => {
          const errorCode = error?.code;
          if (errorCode && ErrorCodes[errorCode]) {
            setErrorMessage(t(ErrorCodes[errorCode].message));
            setFirstNameFailed(ErrorCodes[errorCode].type === "FirstName");
            setLastNameFailed(ErrorCodes[errorCode].type === "LastName");
          } else {
            setErrorMessage(t(ErrorCodes["UNKNOWN_ERROR"].message));
          }
          setIsSubmitting(false);
        }
      }
    );
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "fixed inset-0 bg-bg-overlay flex items-center justify-center z-50",
        className
      ),
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: clsx(
            "animate-fade-in relative flex flex-col justify-center bg-bg-second rounded-2xl shadow-lg px-10 py-10",
            "w-full h-full sm:h-fit sm:w-fit"
          ),
          children: [
            /* @__PURE__ */ jsx(Text, { sz: "lg-3", className: clsx("sm:mb-4 text-gradient-main !font-bold"), children: t("settings:account.personalInfo.changeNameForm.title") }),
            isLoading ? /* @__PURE__ */ jsx(Skeleton, {}) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: clsx(
                    "animate-fade-in flex flex-col sm:flex-row gap-7 justify-center w-full rounded-2xl sm:bg-bg-main sm:px-5 py-5"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsx(Text, { sz: "md-2", className: clsx("ml-2 mb-1"), children: t("settings:account.personalInfo.changeNameForm.firstName") }),
                      /* @__PURE__ */ jsx(
                        Textbox,
                        {
                          isWrong: firstNameFailed,
                          value: newFirstName,
                          onChange: (e) => setNewFirstName(e.target.value),
                          placeholder: "First name",
                          className: clsx("w-full py-1 px-2 lg:max-w-[200px]")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsx(Text, { sz: "md-2", className: clsx("ml-2 mb-1"), children: t("settings:account.personalInfo.changeNameForm.middleName") }),
                      /* @__PURE__ */ jsx(
                        Textbox,
                        {
                          isWrong: middleNameFailed,
                          value: newMiddleName,
                          onChange: (e) => setNewMiddleName(e.target.value),
                          placeholder: "Middle name",
                          className: clsx("w-full py-1 px-2 lg:max-w-[200px]")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsx(Text, { sz: "md-2", className: clsx("ml-2 mb-1"), children: t("settings:account.personalInfo.changeNameForm.lastName") }),
                      /* @__PURE__ */ jsx(
                        Textbox,
                        {
                          isWrong: lastNameFailed,
                          value: newLastName,
                          onChange: (e) => setNewLastName(e.target.value),
                          placeholder: "Last name",
                          className: clsx("w-full py-1 px-2 lg:max-w-[200px]")
                        }
                      )
                    ] })
                  ]
                }
              ),
              errorMessage && /* @__PURE__ */ jsx(Text, { sz: "md-1", color: "danger", className: clsx("mt-2 mx-4"), children: errorMessage })
            ] }),
            /* @__PURE__ */ jsx("span", { className: clsx("mx-8 mt-4 mb-4 h-[0.5px] bg-primary-500") }),
            /* @__PURE__ */ jsxs(Text, { sz: "sm-2", className: clsx("font-light px-2 mb-4 flex flex-col gap-1"), children: [
              /* @__PURE__ */ jsxs(Text, { weight: "bold", className: clsx("text-single-second"), children: [
                "* ",
                t("settings:account.personalInfo.changeNameForm.note"),
                ":"
              ] }),
              /* @__PURE__ */ jsxs(Text, { className: clsx("opacity-80"), wrap: "whitespace-normal", children: [
                "- ",
                t("settings:account.personalInfo.changeNameForm.noteText1"),
                "  ",
                /* @__PURE__ */ jsxs(Text, { weight: "bold", className: clsx("text-single-main"), children: [
                  "7 ",
                  t("settings:account.personalInfo.changeNameForm.day")
                ] }),
                "."
              ] }),
              /* @__PURE__ */ jsxs(Text, { className: clsx("opacity-80"), wrap: "whitespace-normal", children: [
                "- ",
                t("settings:account.personalInfo.changeNameForm.noteText2")
              ] }),
              /* @__PURE__ */ jsxs(Text, { className: clsx("opacity-80"), wrap: "whitespace-normal", children: [
                "- ",
                t("settings:account.personalInfo.changeNameForm.noteText3"),
                "  ",
                /* @__PURE__ */ jsx(Text, { sz: "md-1", children: "!, #, $, @, ..." }),
                "."
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                disabled: isSubmitting || newFirstName === userProfile?.infos.firstName && newMiddleName === (userProfile?.infos.middleName || "") && newLastName === userProfile?.infos.lastName,
                sz: "md-1",
                className: clsx("mt-2"),
                onClick: handleSubmit,
                children: isSubmitting ? t("settings:account.personalInfo.changeNameForm.submitting") : t("settings:account.personalInfo.changeNameForm.acceptButton")
              }
            ),
            /* @__PURE__ */ jsx(
              Text,
              {
                sz: "lg-2",
                className: clsx("absolute top-5 right-8 hover:text-primary-500 cursor-pointer"),
                onClick: handleClose,
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
              }
            )
          ]
        }
      )
    }
  );
};
const useLanguage = () => {
  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
  };
  const lang = i18next.language;
  const currentLanguage = lang ? lang.split("-")[0] : void 0;
  const availableLanguages = Object.keys(resources);
  return { changeLanguage, availableLanguages, currentLanguage };
};
const PREFIX = buildApiPath("/userconfig");
class UserConfigService {
  async changeLanguage(languageCode) {
    return apiPut(`${PREFIX}/language`, { languageCode });
  }
}
const userConfigService = new UserConfigService();
const useChangeLanguage = () => {
  return useResultFetcher(
    (languageCode) => userConfigService.changeLanguage(languageCode)
  );
};
const SelectLanguage = ({ className }) => {
  const { t } = useTranslation();
  const { changeLanguage, availableLanguages, currentLanguage } = useLanguage();
  const { fetch: changeLanguageFetch } = useChangeLanguage();
  const options = availableLanguages.map((lang) => ({
    key: lang,
    value: t(`common:language.${lang}`)
  }));
  const _changeLanguage = (key) => {
    changeLanguageFetch(key, {
      onSuccess: () => {
        changeLanguage(key);
      }
    });
  };
  return /* @__PURE__ */ jsx(
    SelectBox,
    {
      className: clsx(className),
      options,
      selectedOption: currentLanguage ?? "en",
      onSelect: _changeLanguage
    }
  );
};
const LanguageSettings = () => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(SidebarPageCard, { title: t("settings:language.title"), children: /* @__PURE__ */ jsx(
    SelectBoxSetting,
    {
      title: t("settings:language.yourLanguage"),
      selectBox: /* @__PURE__ */ jsx(SelectLanguage, { className: "!min-w-[180px]" })
    }
  ) });
};
const LanguageSettingPage = () => {
  return /* @__PURE__ */ jsx(SidebarPage, { children: /* @__PURE__ */ jsx(LanguageSettings, {}) });
};
const settingRoutes = {
  path: "/settings",
  element: /* @__PURE__ */ jsx(SettingPage, {}),
  type: "private",
  children: [
    {
      path: "",
      element: /* @__PURE__ */ jsx(AccountSettingPage, {}),
      children: [{ path: "name", element: /* @__PURE__ */ jsx(ChangeNameForm, {}) }]
    },
    { path: "theme", element: /* @__PURE__ */ jsx(ThemeSettingPage, {}) },
    { path: "language", element: /* @__PURE__ */ jsx(LanguageSettingPage, {}) }
  ]
};
const FatalkSidebar = ({ className, onConversationClick }) => {
  const navigate = useNavigate();
  const { fetch: _createConversation } = useCreateGroupConversation();
  const [tab, setTab] = useState("list");
  const handleCreateConversation = useCallback(async () => {
    setTab("create");
  }, []);
  const handleSelectConversation = (conversationId) => {
    navigate(`/fatalk/${conversationId}`);
    onConversationClick?.();
  };
  return /* @__PURE__ */ jsx(
    PageNavbar,
    {
      title: "Fatalk",
      className: clsx(
        "flex flex-col relative !h-[calc(100dvh-var(--header-height))] !overflow-hidden bg-bg-second !rounded-none",
        className
      ),
      header: /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(MiniButton, { sz: "sm-2", className: "bg-bg-fifth", onClick: handleCreateConversation, children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-pen-to-square" }) }) }),
      headerClassName: "justify-between !flex-row pr-3",
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col px-2 h-full overflow-hidden", children: [
        tab === "list" && /* @__PURE__ */ jsx(ChatList, { className: "h-full", onConversationClick: handleSelectConversation }),
        tab === "create" && /* @__PURE__ */ jsx(
          CreateGroupChat,
          {
            className: "h-full max-h-[90%]",
            onCreateSuccess: (conversationId) => {
              navigate(`/fatalk/${conversationId}`);
              setTab("list");
            },
            onTurnBack: () => setTab("list")
          }
        )
      ] })
    }
  );
};
const FatalkPage = () => {
  const { pathname } = useLocation();
  const isExactPath = pathname === "/fatalk" || pathname === "/fatalk/";
  return /* @__PURE__ */ jsx(
    SidebarLayout,
    {
      title: "Fatalk",
      navbar: /* @__PURE__ */ jsx(FatalkSidebar, { className: "h-full" }),
      showMenuButton: false,
      sidebarClassName: clsx("lg:w-[400px] w-full", "max-w-full !transition-none"),
      showSidebar: isExactPath,
      showOverlay: false,
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 w-full h-full", children: [
        /* @__PURE__ */ jsx(Outlet, {}),
        isExactPath && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4 opacity-50", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-bg-fourth flex items-center justify-center", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-message text-4xl text-primary-400" }) }),
          /* @__PURE__ */ jsx(Text, { sz: "xl-1", weight: "bold", children: "Tin nhắn của bạn" }),
          /* @__PURE__ */ jsx(Text, { sz: "md-1", children: "Chọn một cuộc trò chuyện để bắt đầu nhắn tin" })
        ] })
      ] })
    }
  );
};
const FatalkChatPanel = ({
  className,
  conversationId,
  onTurnback
}) => {
  const [chatTitle, setChatTitle] = useState("");
  const [chatAvatar, setChatAvatar] = useState("");
  const { renderConversationName } = useRenderConversationContent();
  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation
  } = useGetConversation(conversationId, void 0, true);
  useEffect(() => {
    if (conversationData) {
      setChatTitle(renderConversationName(conversationData));
      setChatAvatar(conversationData.avatarUrl || "");
    }
  }, [conversationData, renderConversationName]);
  const isLoadingHeader = isLoadingConversation || isFetchingConversation;
  const scrollRef = useRef(null);
  if (!isLoadingConversation && !isFetchingConversation && !conversationData) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "relative flex flex-col items-center justify-center text-center px-6 py-10",
          className
        ),
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 mb-3 rounded-full bg-bg-third flex items-center justify-center", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comments text-text-main/60 text-lg" }) }),
          /* @__PURE__ */ jsx(Text, { sz: "md-1", weight: "bold", className: "text-text-main", children: "Conversation not found" }),
          /* @__PURE__ */ jsx(Text, { sz: "sm-1", className: "text-text-main/60 mt-1", children: "Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative flex flex-col bg-bg-main overflow-hidden", className), children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 px-4 h-[60px] bg-bg-second border-b border-gray-700/50 shrink-0", children: isLoadingHeader ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", variant: "circle", className: "w-10" }),
      /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", className: "flex-1 max-w-[160px]" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      onTurnback && /* @__PURE__ */ jsx(MiniButton, { sz: "xs-3", onClick: onTurnback, className: "block lg:hidden", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left text-primary-400" }) }),
      /* @__PURE__ */ jsx(Avatar, { src: chatAvatar, alt: "Avatar", sz: "xs-2" }),
      /* @__PURE__ */ jsx(Text, { sz: "md-1", weight: "bold", className: "flex-1 text-text-main truncate", children: chatTitle })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-4 py-2 bg-bg-seventh", ref: scrollRef, children: /* @__PURE__ */ jsx(
      MessageList,
      {
        conversationId,
        parentRef: scrollRef,
        isGroup: conversationData?.isGroup
      }
    ) }),
    /* @__PURE__ */ jsx(ChatInput, { className: "h-auto p-4", conversationId })
  ] });
};
const ConversationPage = ({}) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  return /* @__PURE__ */ jsx(
    FatalkChatPanel,
    {
      conversationId,
      className: "h-[calc(100dvh-var(--header-height))]",
      onTurnback: () => navigate("/fatalk")
    }
  );
};
const TempConversation = ({ className }) => {
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tempId = searchParams.get("tempId") || void 0;
  const correlationId = location.state?.correlationId;
  const { data: tempUser, isLoading, isFetching } = useGetUserProfile(tempId);
  const { data: conversationData } = useGetConversationWith(tempId || "", void 0, !!tempId);
  const { fetch: sendMessage } = useSendMessage();
  const handleTurnBack = () => {
    navigate("/fatalk");
  };
  useEffect(() => {
    if (conversationData) {
      navigate(`/fatalk/${conversationData.id}`);
    }
  }, [conversationData, navigate]);
  const handleSendMessage = async () => {
    if (!tempId) return;
    console.log("Sending message to temp user:", { tempId, message, correlationId });
    await sendMessage(
      {
        correlationId,
        content: message,
        receiverId: tempId
      },
      {
        onSuccess: (data) => {
          navigate(`/fatalk/${data?.conversationId}`);
        }
      }
    );
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex flex-col bg-bg-main overflow-hidden",
        "h-[calc(100dvh-var(--header-height))]",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 px-4 h-[60px] bg-bg-second border-b border-gray-700/50 shrink-0", children: isLoading || isFetching ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", variant: "circle", className: "w-10" }),
          /* @__PURE__ */ jsx(Skeleton, { sz: "sm-3", className: "flex-1 max-w-[160px]" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(MiniButton, { sz: "xs-3", onClick: handleTurnBack, className: "block lg:hidden", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left text-primary-400" }) }),
          /* @__PURE__ */ jsx(Avatar, { src: tempUser?.infos.avatar, alt: "Avatar", sz: "xs-2" }),
          /* @__PURE__ */ jsx(Text, { sz: "md-1", weight: "bold", className: "flex-1 text-text-main", children: tempUser?.infos.fullName })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-4 py-2 bg-bg-seventh", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center h-full text-center px-4", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mb-4", children: /* @__PURE__ */ jsx(Avatar, { src: tempUser?.infos.avatar, alt: "Avatar", sz: "md-1" }) }),
          /* @__PURE__ */ jsx(Text, { sz: "md-1", weight: "bold", children: tempUser?.infos.fullName }),
          /* @__PURE__ */ jsx(Text, { sz: "sm-1", className: "text-gray-400 mt-1", children: "Hai bạn chưa có tin nhắn nào" }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 px-4 py-2 bg-gray-700/30 rounded-full", children: /* @__PURE__ */ jsx(Text, { sz: "sm-1", className: "text-gray-300", children: "Gửi lời chào đầu tiên 👋" }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-bg-second border-t border-gray-700/50 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Textbox,
            {
              sz: "xs-3",
              className: "!rounded-full w-full",
              wrapperClassName: "flex-1",
              placeholder: "Aa",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              onKeyDown: handleKeyDown
            }
          ),
          /* @__PURE__ */ jsx(MiniButton, { sz: "xs-3", onClick: handleSendMessage, disabled: !message.trim() || isFetching, children: /* @__PURE__ */ jsx(
            "i",
            {
              className: clsx(
                "fa-solid",
                message.trim() ? "fa-paper-plane text-primary-500" : "fa-thumbs-up text-primary-400"
              )
            }
          ) })
        ] })
      ]
    }
  );
};
const mainRoutes = [
  {
    element: /* @__PURE__ */ jsx(DefaultLayout, {}),
    type: "public",
    children: [
      {
        path: "/",
        element: /* @__PURE__ */ jsx(HomePage, {}),
        type: "private",
        index: true,
        keepAlive: true
      },
      friendsRoutes,
      settingRoutes,
      userRoute,
      {
        path: "/notifications",
        element: /* @__PURE__ */ jsx(NotificationsPage, {}),
        type: "private"
      },
      {
        path: "/fatalk",
        element: /* @__PURE__ */ jsx(FatalkPage, {}),
        type: "private",
        children: [
          {
            path: ":conversationId",
            element: /* @__PURE__ */ jsx(ConversationPage, {}),
            type: "private"
          },
          {
            path: "temp",
            element: /* @__PURE__ */ jsx(TempConversation, {}),
            type: "private"
          }
        ]
      },
      { path: "/loading", type: "public", element: /* @__PURE__ */ jsx(LoadingPage, {}) },
      { path: "*", type: "public", element: /* @__PURE__ */ jsx(NotFoundPage, {}) }
    ]
  },
  {
    element: /* @__PURE__ */ jsx(SecondLayout, {}),
    type: "public",
    children: [
      {
        path: "/login",
        element: /* @__PURE__ */ jsx(LoginPage, {}),
        type: "auth"
      },
      {
        path: "/register",
        element: /* @__PURE__ */ jsx(RegisterPage, {}),
        type: "auth"
      },
      {
        path: "/auth/google/callback",
        element: /* @__PURE__ */ jsx(GoogleCallbackPage, {}),
        type: "auth"
      },
      {
        path: "/onboarding",
        element: /* @__PURE__ */ jsx(OnboardingPage, {}),
        type: "private"
      }
    ]
  }
];
const GuestOnlyRoute = ({ children }) => {
  const auth2 = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (auth2?.isAuthenticated) {
      const returnTo = searchParams.get("returnTo") || "/";
      navigate(returnTo, { replace: true });
    }
  }, [auth2?.isAuthenticated, navigate, searchParams]);
  if (auth2?.isAuthenticated) {
    return null;
  }
  return children;
};
const UserOnlyRoute = ({ children }) => {
  const user2 = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user2?.isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [user2?.isAuthenticated, navigate]);
  if (!user2?.isAuthenticated) {
    return null;
  }
  return children;
};
const RouteWrapper = ({
  type,
  // keepAlive,
  // path,
  element
}) => {
  let wrapped = element;
  if (type === "private") wrapped = /* @__PURE__ */ jsx(UserOnlyRoute, { children: wrapped });
  else if (type === "auth")
    wrapped = /* @__PURE__ */ jsx(GuestOnlyRoute, { children: wrapped });
  return /* @__PURE__ */ jsx(Fragment, { children: wrapped });
};
const AppRoutes = () => {
  const generateRoutes = useCallback((routes) => {
    return routes.map((route, idx) => {
      const key = route.path ?? `route-${idx}`;
      return /* @__PURE__ */ jsx(Route, { path: route.path, element: /* @__PURE__ */ jsx(RouteWrapper, { ...route }), children: route.children && generateRoutes(route.children) }, key);
    });
  }, []);
  return /* @__PURE__ */ jsx(Routes, { children: generateRoutes(mainRoutes) });
};
function Main() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AppRoutes, {}),
    /* @__PURE__ */ jsx(GlobalDialog, {}),
    /* @__PURE__ */ jsx(NotificationListener, {}),
    /* @__PURE__ */ jsx(MessageListener, {})
  ] });
}
function App({ authContext }) {
  const queryClientRef = useRef(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 5 * 60 * 1e3,
          gcTime: 10 * 60 * 1e3
        }
      }
    });
  }
  if (authContext?.userData?.languageCode) {
    i18next.changeLanguage(authContext.userData.languageCode);
  }
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClientRef.current, children: /* @__PURE__ */ jsx(ContextTree, { authContext, children: /* @__PURE__ */ jsx(Main, {}) }) });
}
function render(_url, context) {
  const url = _url.startsWith("/") ? _url : "/" + _url;
  try {
    const html = renderToString(
      /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, { authContext: context }) })
    );
    return html;
  } catch (error) {
    console.error("SSR Error during render:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    return "";
  }
}
export {
  render
};
