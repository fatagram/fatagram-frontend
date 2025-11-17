import { jsxDEV, Fragment } from "react/jsx-dev-runtime";
import React, { useState, useCallback, useMemo, useContext, createContext, useReducer, useEffect, forwardRef, useLayoutEffect, useRef, StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { Link as Link$1, useNavigate, useResolvedPath, useMatch, Outlet, useLocation, useParams, useSearchParams, Route, Routes, StaticRouter } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import axios from "axios";
import { useDispatch, useSelector, Provider } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { useQueryClient, useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import clsx, { clsx as clsx$1 } from "clsx";
import { ArrowLeft } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate as useNavigate$1 } from "react-router";
import { AliveScope } from "react-activation";
import * as signalR from "@microsoft/signalr";
const login$1 = { "title": "Login", "username": "Username", "password": "Password", "rememberMe": "Remember me", "forgotPassword": "Forgot password?", "loginButton": "Login", "dontHaveAccount": "Don't have an account?", "registerButton": "Register", "errors": { "usernameOrEmail": { "required": "Username or email is required", "invalidFormat": "Invalid username format", "tooLong": "Username is too long (maximum 20 characters)", "tooShort": "Username is too short (minimum 3 characters)", "notFound": "Username or email not found" }, "password": { "required": "Password is required", "invalidFormat": "Invalid password format", "tooLong": "Password is too long (maximum 50 characters)", "tooShort": "Password is too short (minimum 8 characters)", "incorrectPassword": "Incorrect password" }, "account": { "locked": "Account is locked", "disabled": "Account is disabled" }, "unknownError": "An unknown error occurred", "internalServerError": "Internal server error" } };
const register$2 = { "title": "Register", "username": "Username", "password": "Password", "confirmPassword": "Confirm password", "email": "Email", "phoneNumber": "Phone number", "registerButton": "Register", "backToLogin": "Back to login", "agree": "I agree to the", "termsOfService": "Terms of Service", "and": " and ", "privacyPolicy": "Privacy Policy", "loginButton": "Login", "errors": { "username": { "required": "Username is required", "alreadyExists": "Username already exists", "invalidFormat": "Invalid username format", "tooLong": "Username is too long (maximum 20 characters)", "tooShort": "Username is too short (minimum 3 characters)" }, "email": { "required": "Email is required", "alreadyExists": "Email already exists", "invalidFormat": "Invalid email format" }, "phoneNumber": { "alreadyExists": "Phone number already exists", "invalidFormat": "Invalid phone number format" }, "password": { "required": "Password is required", "invalidFormat": "Invalid password format", "tooLong": "Password is too long (maximum 50 characters)", "tooShort": "Password is too short (minimum 8 characters)" }, "confirmPassword": { "required": "Please confirm your password", "doNotMatch": "Passwords do not match" }, "unknownError": "An unknown error occurred", "internalServerError": "Internal server error" } };
const auth$1 = {
  login: login$1,
  register: register$2
};
const language$3 = { "en": "EN English", "vi": "VN Vietnamese" };
const navbar$5 = { "profileMenu": { "settings": "Settings", "logout": "Logout" } };
const notFound$1 = { "title": "Page Not Found", "description": "Oops! The page you're looking for doesn't exist or has been moved.", "backButton": "Back to Home" };
const common$1 = {
  language: language$3,
  navbar: navbar$5,
  notFound: notFound$1
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
const account$1 = { "personalInfo": { "title": "Personal Informations", "yourName": "Your Name", "urlName": "URL Name", "nickname": "Nickname", "changeButton": "Change", "noUrlName": "No URL Name", "noNickname": "No Nickname", "urlNamePlaceholder": "Enter your URL name", "nicknamePlaceholder": "Enter your nickname", "changeNameForm": { "title": "Name", "firstName": "First name", "lastName": "Last name", "note": "Note", "noteText1": "You can only change your name every", "day": "days", "noteText2": "Your name must have more than 3 characters and less than 36 characters.", "noteText3": "Your name must not contains special characters such as", "acceptButton": "Accept" }, "errorMessages": { "changeUrlName": { "userNotFound": "User not found", "urlNameAlreadyExist": "URL name already exists", "urlNameTooShort": "URL name must be at least 3 characters long", "urlNameTooLong": "URL name must be less than 36 characters", "urlNameEmpty": "URL name cannot be empty", "urlNameContainsSpace": "URL name cannot contain spaces", "unknownError": "Unknown error occurred", "internalServerError": "Internal server error" }, "changeName": { "firstNameNotCorrectFormat": "First name is not in the correct format", "lastNameNotCorrectFormat": "Last name is not in the correct format", "unknownError": "Unknown error occurred", "internalServerError": "Internal server error" } } } };
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
const times$1 = {
  time: time$1,
  ago: ago$1,
  just_now: just_now$1
};
const notifications$2 = { "title": "Notifications", "no-notifications": "No notifications available.", "has-a-friend-request": "has sent you a friend request.", "accepted-friend-request": "has accepted your friend request.", "accepted": "Accepted friend request.", "declined": "Declined friend request.", "showMore": "Show more" };
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
const common = {
  language: language$1,
  navbar: navbar$2,
  notFound
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
const account = { "personalInfo": { "title": "Thông tin cá nhân", "yourName": "Tên của bạn", "urlName": "Tên URL", "nickname": "Biệt danh", "changeButton": "Thay đổi", "noUrlName": "Không có tên URL", "noNickname": "Không có biệt danh", "urlNamePlaceholder": "Nhập tên URL của bạn", "nicknamePlaceholder": "Nhập biệt danh của bạn", "changeNameForm": { "title": "Tên", "firstName": "Họ", "lastName": "Tên", "note": "Lưu ý", "noteText1": "Chỉ có thể thay đổi tên của bạn sau mỗi", "day": "ngày", "noteText2": "Tên của bạn phải nhiều hơn 3 ký tự và ít hơn 36 ký tự", "noteText3": "Tên của bạn không được chứa các ký tự đặc biệt như", "acceptButton": "Xác nhận" }, "errorMessages": { "changeUrlName": { "userNotFound": "Người dùng không tồn tại", "urlNameAlreadyExist": "Tên URL đã tồn tại", "urlNameTooShort": "Tên URL phải có ít nhất 3 ký tự", "urlNameTooLong": "Tên URL phải ít hơn 36 ký tự", "urlNameEmpty": "Tên URL không được để trống", "urlNameContainsSpace": "Tên URL không được chứa khoảng trắng", "unknownError": "Đã xảy ra lỗi không xác định", "internalServerError": "Lỗi máy chủ nội bộ" }, "changeName": { "firstNameNotCorrectFormat": "Họ không đúng định dạng", "lastNameNotCorrectFormat": "Tên không đúng định dạng", "unknownError": "Đã xảy ra lỗi không xác định", "internalServerError": "Lỗi máy chủ nội bộ" } } } };
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
const times = {
  time,
  ago,
  just_now
};
const notifications = { "title": "Thông báo", "no-notifications": "Không có thông báo nào.", "has-a-friend-request": "đã gửi cho bạn lời mời kết bạn.", "accepted-friend-request": "đã chấp nhận lời mời kết bạn.", "accepted": "Đã chấp nhận lời mời kết bạn.", "declined": "Đã từ chối lời mời kết bạn.", "showMore": "Hiển thị thêm" };
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
const getRefreshToken = () => localStorage.getItem("refreshToken");
const getRefreshTokenFromSession = () => sessionStorage.getItem("refreshToken");
const appConfig = {
  apiUrl: "http://localhost:5002"
};
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
apiClientFormData.interceptors.request.use(
  (config) => {
    return config;
  }
);
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = getRefreshToken() || getRefreshTokenFromSession();
        const refreshResult = await axios.post(
          `${appConfig.apiUrl}/api/auth/refreshToken`,
          { refreshToken },
          { withCredentials: true }
        );
        if (refreshResult.status === 200) {
          return await apiClient.request(error.config);
        }
      } catch (error2) {
      }
    }
    return Promise.reject(error);
  }
);
apiClientFormData.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = getRefreshToken() || getRefreshTokenFromSession();
        const refreshResult = await axios.post(
          `${appConfig.apiUrl}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );
        if (refreshResult.status === 200) {
          return await apiClient.request(error.config);
        }
      } catch (error2) {
      }
    } else if (error.response?.status === 413) {
      const err = new Error(
        "File size is too large. Please upload a smaller file."
      );
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
      errorCode: "LARGE_FILE_ERROR"
    };
  }
  if (error.response) {
    const err = error.response.data;
    return {
      success: false,
      errorCode: err.error?.code || "UNKNOWN_ERROR",
      errorCodes: err.error?.codes
    };
  } else {
    return {
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR"
    };
  }
};
const PREFIX$4 = `/api/auth`;
class AuthService {
  // login method
  async login(dto) {
    try {
      const res = await apiClient.post(`${PREFIX$4}/login`, {
        username: dto.usernameOrEmail,
        password: dto.password,
        isRememberMe: dto.isRememberMe
      });
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // logout method
  async logout() {
    try {
      await apiClient.post(`${PREFIX$4}/logout`);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async register(dto) {
    try {
      await apiClient.post(`${PREFIX$4}/register`, {
        username: dto.username,
        password: dto.password,
        email: dto.email,
        phone: dto.phoneNumber
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Ping method
  // This method is responsible for sending a ping request to the server.
  // The method returns a promise of void.
  async ping() {
    try {
      await apiClient.get(`${PREFIX$4}/ping`);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
}
const authService = new AuthService();
const PREFIX$3 = `/api/UserProfile`;
class UserProfileService {
  // Check if user exists by id or urlName
  async CheckUserExistAsync(key) {
    try {
      await apiClient.get(`${PREFIX$3}/exist?key=${key}`);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Get user profile by id or urlName
  async GetProfile(id, fields) {
    try {
      const res = await apiClient.get(`${PREFIX$3}/${id}?fields=${fields}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Get current user profile
  async GetMe() {
    try {
      const res = await apiClient.get(`${PREFIX$3}/me`);
      const response = res.data.data.infos;
      return { success: true, data: response };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Upload avatar
  async UploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClientFormData.patch(`${PREFIX$3}/avatar`, formData);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Upload background image
  async UploadBackground(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClientFormData.patch(`${PREFIX$3}/background`, formData);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Update simple profile fields such as bio, description, etc.
  async UpdateProfile(data) {
    try {
      const res = await apiClient.put(`${PREFIX$3}`, data);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Update user's URL name
  async UpdateUrlName(changeUrlNameDto) {
    try {
      const res = await apiClient.patch(`${PREFIX$3}/urlName`, changeUrlNameDto);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  // Update user's name
  async UpdateName(changeNameDto) {
    try {
      const res = await apiClient.patch(`${PREFIX$3}/name`, changeNameDto);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
}
const userProfileService = new UserProfileService();
const initialState = {
  notifications: [],
  unreadCount: 0,
  isShowNotification: false,
  isInNotificationPage: false,
  pageSize: 5,
  isFull: false,
  isShowFull: false,
  isInitialized: false
};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    loadNotifications: (state, action) => {
      state.notifications = [
        ...state.notifications,
        ...action.payload.notifications
      ];
      state.unreadCount = action.payload.unreadCount;
      state.isInitialized = true;
      if (action.payload.notifications.length > 0) {
        state.cursorId = action.payload.notifications[action.payload.notifications.length - 1].id;
      } else {
        state.isFull = true;
      }
    },
    addNewNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      state.unreadCount += 1;
    },
    deleteNotification: (state, action) => {
      const id = action.payload;
      const noti = state.notifications.find((n) => n.id === id);
      state.notifications = state.notifications.filter((n) => n.id !== id);
      if (noti && !noti.isRead) {
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    setShowNotification: (state, action) => {
      state.isShowNotification = action.payload;
    },
    setInNotificationPage: (state, action) => {
      state.isInNotificationPage = action.payload;
    },
    setShowFull: (state, action) => {
      state.isShowFull = action.payload;
    },
    resetState: () => initialState
  }
});
const {
  loadNotifications,
  addNewNotification,
  deleteNotification,
  markAsRead,
  setShowNotification,
  setInNotificationPage,
  setShowFull,
  resetState
} = notificationsSlice.actions;
const notificationsReducer = notificationsSlice.reducer;
const initialAuthStatus = {
  isAuthenticated: false,
  lang: "en",
  isInitialized: false
};
const LoadingContext = React.createContext({
  increment: () => {
  },
  decrement: () => {
  }
});
const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => Math.max(0, prev - 1)), []);
  const value = useMemo(() => ({ increment, decrement }), [increment, decrement]);
  return /* @__PURE__ */ jsxDEV(LoadingContext.Provider, { value, children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/loading-context.tsx",
    lineNumber: 26,
    columnNumber: 10
  }, void 0);
};
const useLoading = () => {
  return useContext(LoadingContext);
};
const useLanguage$1 = () => {
  const changeLanguage = (lng) => {
    console.log("Changing language to:", lng);
    i18next.changeLanguage(lng);
  };
  const lang = i18next.language;
  const currentLanguage = lang ? lang.split("-")[0] : void 0;
  const availableLanguages = Object.keys(resources);
  return { changeLanguage, availableLanguages, currentLanguage };
};
const authReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
        isInitialized: true
      };
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
  isInitialized: false,
  logIn: () => Promise.resolve({ success: false, data: void 0 }),
  logOut: () => Promise.resolve(),
  setUrlName: () => {
  },
  userId: void 0,
  urlName: void 0
});
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthStatus);
  const { changeLanguage } = useLanguage$1();
  const { increment, decrement } = useLoading();
  const _dispatch = useDispatch();
  const queryClient2 = useQueryClient();
  const _logIn = async (loginDto) => {
    try {
      await authService.login(loginDto);
      const me = (await userProfileService.GetMe()).data;
      if (me) {
        dispatch({
          type: "LOGIN",
          payload: {
            userId: me.id,
            urlName: me.urlName,
            lang: me.languageCode || "en"
          }
        });
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  const clearUserData = useCallback(() => {
    queryClient2.clear();
    _dispatch(resetState());
  }, [queryClient2, _dispatch]);
  const _logOut = useCallback(async () => {
    increment();
    await authService.logout();
    dispatch({ type: "LOGOUT" });
    clearUserData();
    decrement();
  }, [increment, decrement, clearUserData]);
  const setUrlName = useCallback((urlName) => {
    dispatch({
      type: "UPDATE_URL_NAME",
      payload: urlName
    });
  }, []);
  const initializeRef = React.useRef(false);
  useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;
    const initialize = async () => {
      increment();
      try {
        const result = await userProfileService.GetMe();
        if (!result.success) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              lang: "en"
            }
          });
          return;
        }
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
            userId: result.data?.id,
            urlName: result.data?.urlName,
            lang: result.data?.languageCode || "en"
          }
        });
        changeLanguage(result.data?.languageCode || "en");
      } finally {
        decrement();
      }
    };
    initialize();
  }, []);
  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isInitialized: state.isInitialized,
      userId: state.userId,
      urlName: state.urlName,
      logIn: _logIn,
      logOut: _logOut,
      setUrlName
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.userId,
      state.urlName,
      _logIn,
      _logOut,
      setUrlName
    ]
  );
  return /* @__PURE__ */ jsxDEV(AuthContext.Provider, { value: contextValue, children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/auth/auth-context.tsx",
    lineNumber: 187,
    columnNumber: 10
  }, void 0);
};
const buttonSizes = {
  xs: "px-2 py-1 text-xs",
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
const buttonVariants = {
  primary: "bg-gradient-main text-white hover:bg-gradient-main-move",
  secondary: "bg-bg-second transition-all duration-200 ease text-text-main hover:bg-bg-second/70",
  third: "bg-bg-third transition-all duration-200 ease text-text-main hover:bg-bg-third/70",
  fourth: "bg-bg-fourth transition-all duration-200 ease text-text-main hover:bg-bg-fourth/70"
};
const Button = forwardRef(
  ({ onClick, variant = "primary", sz = "lg-1", className, children, disabled = false, ...props }, ref) => {
    return /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        disabled,
        onClick,
        className: clsx(
          buttonSizes[sz],
          "font-normal rounded-xl select-none",
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/button/button.tsx",
        lineNumber: 46,
        columnNumber: 7
      },
      void 0
    );
  }
);
Button.displayName = "Button";
const emptyAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEX///9+fX12dHTd3d17enp4d3d0c3Pp6emIh4f4+Pj8/PyLiorDw8Px8fF/fn6WlZWysrLQ0NDJycnj4+Ogn5+rqqrt7e2amZnY19e+vb20s7OsrKzPzs6mpaWKiIienZ1v5QZqAAAGLUlEQVR4nO2d2XbqMAxFG2M7zkwSZsjl///yOowJBMggYbVL+6l9KMunljV4ED8/DMMwDMMwDMMwDMMwDMMwDMMwDMMwDDOKIEiCwPUgcPA3cZVFxqRpakyUVfHGdz0kQJJiIZVQUkrvjP2p/n1RJK6HBkESR1pdpbWRSkfxyvUAJ5Kv5Qt5V5Fynbse5AQK81beVaQpXA90JAdPfNZ30ii836ixzHQveWdEVroe8EDCfQ/7bNvq8lfFyTJVg/TVqPQXTWPccwE+TKOIXQ+8L4shK7CJWLgeei/CbLiFXlFZ6Hr4n0nMGAu9Ig35RC5Jpwi0ElPiEoNomkArMaIdNbKpAq3EzLWId0xwMncUYYlzASDQBo25ayGv2IyNg4/ojWsp3SQpkEDPI+pQ19O9zBW5di2mCzAbraFopyGcjdak9NK3OUSguKPI+dMEVqCVSM3Z7MEV7l1LarOC86NXJK2d1B30FNpJ3LkW1SQA11dDqcjIYRLSNoLSZjhgOnOHUmITQKYzdzQdMy3g/UyNorPXv8AwUmumZDYXgVPSO2SS0xLHSK2ZUtnnj9EUUtnmX+IsQ7sQl66lXQDYQnyhkMiuW2CQBHqeoRERE6wptJNIo0j0cTKaGk3jWtEMUeHMtbgTG4zC4oygseWWY4VDGxBpFFBIefdJIY3c+4Co8OBa3Im/b6V/39P8/WixQlRIY880QRPoeTSytnDy/YtXyIhIkY+yl3hSSGU/cY+mkMrpDFrIJxLwbfmENoc0iicLVpFvXAu7USHtCFeuhd0AvYZxh9KFDJzMVLiW1QDFTAkZKVLyTSTtvoCQuMnItagWCEcXZA4tzgTwB2wpjf3uG+CTSGwKEU5JyZyO3ohhYyLFF0Kg7pSYIz1TQk6ioHK+3QLwhim926Un4PZryOzPPJJA2amgscXWQQ6Tnmoae/mdbCFmUWxdy3jHfrpEQWWD7QXVVIeqKFWFnVTTZlGQF/jzs5wiUVC5BfWW3XiPqkndXn9NPrCfwhVJ5Mi3B+W/Mf5G/SOZjDbI7wMM58MtVc/vqVpJcTL9TDRP3Tdy2DQq2fxjITIyRxYXgqW2a083rr+EuwEaldw1cu3CGoDUtHqd5JdeJq2Ea1WJfhqVqJrn9ZfUT6V0TDVZ30Kgal2v95f6s0ally2LXNz+RKyJ1BiFbAQHZVrDDbZGvYkdUimzbVmjbxr/Eykp3PoKK/0w6IdRlfPIinxWKa28aP4QIIqHf4eunNfCpXmywyc/GPpFFWld67yglNZRVfgPw7f++MmGjeMgGXeZoOzYZgkD/7DdV8csyo7Vfnvwg+fJmXd/mFNL3b8I7MrLh1pXmHsvvJJ2VzAG69eeUptiiMawMK9LEnV0FBqT5yXYtC5h4r4DC2LztneWctN5aOV9qCCkkos+J/GbxfveivVHeQ6u8JUdAeB5ZNrbzd7NZDDbebrPB8mvu9RZH4E1SnvrbZk8L8owKbdrr0fSc5H45TPvckiRa8NfarJ9vJmV/ipY+eVsE+8zk77Ldjo+5Kuz6A+vcOsw36CvCTRQXyyo/E9OBgXpfU3itKZzEyR+LWig3Qn+KPFL56YLvPcVn1Bfed0Ncvoylm+c2mzczWCNQr+viPhgtB/oz0qdeZmbQmRvA9zvagy4nXlm7gXidlrAex0zBMybGgjdoMaAZ6eIz9KHgfaIHa07xFCwukkcXCYzbQTKc6HAUUXRhURpmLGl4WbOKIT81Hm61gYheSMSKa7AR4yAjps5I6BXIrEphJ9EnNaP04CdRLR2XuOBfZBBI+VuA5uAIzaGGA/o2za0F/dTgHytD3ZFHRbAC+8E/UwNoK8h6Gdq4DalfJpGas0UqhImVVU0AaswyNT2j0DV+gj91qEA6ttOaPfiEaDdDKSuFxDANCUI8dqTTsdA5KaIrbymA9IMDKVnPhQgvffJVfdNQCp9oinbGZDEjfIytAtxukDSjgbE1SB2toQAoDsm0drwCkCNSDijqQHIao7EFR4nK0T7WgAYAL5cAKkXGxQQPd1AvlsUC5DvLA0iuvFCAH217jZVQgtqaKFSuJNgf0YRag9pGYZhGIZhGIZhGIZhGIZhGIZhGIZhGIZh/j7/AaG2YuXGH+4jAAAAAElFTkSuQmCC";
const sizeClasses$4 = {
  // Mini sizes
  xs: "w-[24px]",
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
  className
}) => {
  const sizeClass = sizeClasses$4[sz];
  const shapeClass = shapeClasses[shape];
  const [imgSrc, setImgSrc] = React.useState(src || emptyAvatar);
  useEffect(() => {
    setImgSrc(src || emptyAvatar);
  }, [src]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative aspect-square object-contain select-none flex-shrink-0",
        "overflow-hidden",
        sizeClass,
        shapeClass,
        className
      ),
      children: /* @__PURE__ */ jsxDEV("div", { className: clsx("absolute inset-0 bg-bg-main overflow-hidden"), children: /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: imgSrc || emptyAvatar,
          alt,
          className: clsx("relative z-0 w-full h-full object-cover"),
          onError: () => setImgSrc(emptyAvatar)
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/avatar/avatar.tsx",
          lineNumber: 56,
          columnNumber: 9
        },
        void 0
      ) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/avatar/avatar.tsx",
        lineNumber: 55,
        columnNumber: 7
      }, void 0)
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/avatar/avatar.tsx",
      lineNumber: 34,
      columnNumber: 5
    },
    void 0
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
  return /* @__PURE__ */ jsxDEV(
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
        count > 0 && /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: clsx(
              "absolute -top-0 bg-red-500 text-text-main text-[10px] min-w-[16px]",
              "h-[16px] px-[4px] rounded-full border-[2px] border-bg-main",
              "flex items-center justify-center",
              count > 99 ? "-right-2" : "-right-1"
            ),
            children: count > 99 ? "99+" : count
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/badge/badge.tsx",
            lineNumber: 31,
            columnNumber: 9
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/badge/badge.tsx",
      lineNumber: 18,
      columnNumber: 5
    },
    this
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
  return /* @__PURE__ */ jsxDEV("label", { className: clsx("relative inline-flex items-center gap-1 select-none", className), children: [
    /* @__PURE__ */ jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/checkbox/checkbox.tsx",
        lineNumber: 30,
        columnNumber: 7
      },
      void 0
    ),
    /* @__PURE__ */ jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/checkbox/checkbox.tsx",
        lineNumber: 41,
        columnNumber: 7
      },
      void 0
    ),
    /* @__PURE__ */ jsxDEV("span", { className: clsx("text-text-main text-sm", className), children: label }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/checkbox/checkbox.tsx",
      lineNumber: 54,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/checkbox/checkbox.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, void 0);
};
const style = {
  "user-bg-image": "_user-bg-image_1igzi_1"
};
function BackgroundImage({
  src,
  alt,
  className,
  children
}) {
  useEffect(() => {
    document.documentElement.style.setProperty("--bg-image", `url(${src})`);
  }, [src]);
  return /* @__PURE__ */ jsxDEV(
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
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/background-image/background-image.tsx",
      lineNumber: 22,
      columnNumber: 5
    },
    this
  );
}
const Link = ({ to, children, onClick, className = "", ...props }) => {
  return /* @__PURE__ */ jsxDEV(
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
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/link/link.tsx",
      lineNumber: 16,
      columnNumber: 5
    },
    void 0
  );
};
const ListItem = ({ key, className, children, ...props }) => {
  return /* @__PURE__ */ jsxDEV("li", { className, ...props, children }, key, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/list/list.tsx",
    lineNumber: 14,
    columnNumber: 5
  }, void 0);
};
const List = ({
  listItems,
  children,
  className,
  itemClassName
}) => {
  return /* @__PURE__ */ jsxDEV("ul", { className, children: [
    listItems?.map((item, index) => /* @__PURE__ */ jsxDEV(ListItem, { className: `${itemClassName} ${item.className}`, children: item.children }, item.key ?? index, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/list/list.tsx",
      lineNumber: 29,
      columnNumber: 9
    }, void 0)),
    children
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/list/list.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, void 0);
};
List.Item = ListItem;
const sizeClasses$3 = {
  xs: {
    logo: "sm:text-[20px] text-[10px]",
    slogan: "sm:text-[10px] text-[15px]"
  },
  "sm-1": {
    logo: "sm:text-[25px] text-[15px]",
    slogan: "sm:text-[15px] text-[20px]"
  },
  "sm-2": {
    logo: "sm:text-[30px] text-[20px]",
    slogan: "sm:text-[15px] text-[20px]"
  },
  "sm-3": {
    logo: "sm:text-[30px] text-[20px]",
    slogan: "sm:text-[15px] text-[20px]"
  },
  "md-1": {
    logo: "sm:text-[35px] text-[30px]",
    slogan: "sm:text-[15px] text-[20px]"
  },
  "md-2": {
    logo: "sm:text-[40px] text-[35px]",
    slogan: "sm:text-[20px] text-[25px]"
  },
  "md-3": {
    logo: "sm:text-[40px] text-[35px]",
    slogan: "sm:text-[20px] text-[25px]"
  },
  "lg-1": {
    logo: "sm:text-[45px] text-[40px]",
    slogan: "sm:text-[20px] text-[25px]"
  },
  "lg-2": {
    logo: "sm:text-[45px] text-[40px]",
    slogan: "sm:text-[20px] text-[25px]"
  },
  "lg-3": {
    logo: "sm:text-[50px] text-[45px]",
    slogan: "sm:text-[25px] text-[30px]"
  },
  "xl-1": {
    logo: "sm:text-[50px] text-[45px]",
    slogan: "sm:text-[25px] text-[30px]"
  },
  "xl-2": {
    logo: "sm:text-[55px] text-[50px]",
    slogan: "sm:text-[25px] text-[30px]"
  },
  "xl-3": {
    logo: "sm:text-[60px] text-[55px]",
    slogan: "sm:text-[30px] text-[35px]"
  }
};
const Logo = ({
  hasSlogan = true,
  sz = "md-1",
  className = "",
  ...props
}) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/logo/logo.tsx",
        lineNumber: 76,
        columnNumber: 7
      },
      void 0
    ),
    hasSlogan && /* @__PURE__ */ jsxDEV(
      "h2",
      {
        className: clsx(
          sizeClasses$3[sz].slogan,
          "text-gradient-second font-light font-bagel_fat_one select-none whitespace-nowrap"
        ),
        children: "Share your fun moments with the world!"
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/logo/logo.tsx",
        lineNumber: 88,
        columnNumber: 9
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/logo/logo.tsx",
    lineNumber: 75,
    columnNumber: 5
  }, void 0);
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
const SelectBox = ({
  options,
  selectedOption,
  onSelect,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(selectedOption);
  const selectBoxRef = React.useRef(null);
  const btnRef = React.useRef(null);
  useClickOutside(
    selectBoxRef,
    btnRef,
    () => {
      if (isOpen) setIsOpen(false);
    }
  );
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("relative", className), children: [
    /* @__PURE__ */ jsxDEV("button", { ref: btnRef, className: "w-full", children: /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: clsx(
          "flex items-center justify-between cursor-pointer",
          "bg-bg-fourth px-4 py-2 rounded-xl shadow-md gap-5",
          "hover:bg-bg-hover transition-colors"
        ),
        onClick: () => setIsOpen(!isOpen),
        children: [
          /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", children: options.find((opt) => opt.key === selected)?.value }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
            lineNumber: 50,
            columnNumber: 11
          }, void 0),
          /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-caret-down" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
            lineNumber: 51,
            columnNumber: 11
          }, void 0)
        ]
      },
      void 0,
      true,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
        lineNumber: 42,
        columnNumber: 9
      },
      void 0
    ) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, void 0),
    isOpen && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: clsx(
          "absolute w-full animate-dropdown-slide",
          "bg-bg-card rounded-lg shadow-md mt-1 z-50 border border-border-main"
        ),
        ref: selectBoxRef,
        children: /* @__PURE__ */ jsxDEV("ul", { className: "p-1", children: options.map((item, index) => /* @__PURE__ */ jsxDEV(
          "li",
          {
            className: clsx(
              "px-4 py-2 hover:bg-bg-hover",
              "cursor-pointer rounded-lg transition-colors"
            ),
            onClick: () => {
              setSelected(item.key);
              onSelect(item.key);
              setIsOpen(false);
            },
            children: item.value
          },
          index,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
            lineNumber: 65,
            columnNumber: 15
          },
          void 0
        )) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
          lineNumber: 63,
          columnNumber: 11
        }, void 0)
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
        lineNumber: 56,
        columnNumber: 9
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/selectbox/selectbox.tsx",
    lineNumber: 40,
    columnNumber: 5
  }, void 0);
};
const sizeClasses$2 = {
  xs: "h-2",
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
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        `animate-pulse rounded-xl bg-bg-seventh`,
        { "aspect-square !rounded-full": variant === "circle" },
        sizeClasses$2[sz],
        className
      )
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/skeleton/skeleton.tsx",
      lineNumber: 30,
      columnNumber: 5
    },
    void 0
  );
};
const styles$2 = {
  "primary-textbox": "_primary-textbox_3nvi8_1",
  "primary-textbox-wrong": "_primary-textbox-wrong_3nvi8_28"
};
const sizeClasses$1 = {
  xs: "px-2 py-1 text-xs",
  "sm-1": "px-3 py-1 text-[13px] ",
  "sm-2": "px-4 py-2 text-[13px] ",
  "sm-3": "px-5 py-2 text-[13px] ",
  "md-1": "px-6 py-3 text-base ",
  "md-2": "px-7 py-3 text-base ",
  "md-3": "px-8 py-4 text-base ",
  "lg-1": "px-8 py-4 text-base ",
  "lg-2": "px-9 py-4 text-base ",
  "lg-3": "px-10 py-5 text-base ",
  "xl-1": "px-10 py-5 text-xl ",
  "xl-2": "px-12 py-6 text-2xl ",
  "xl-3": "px-14 py-7 text-3xl "
};
const Textbox = React.forwardRef(
  ({
    disabled = false,
    isWrong = false,
    wrongMessage,
    className,
    sz = "sm-1",
    type = "text",
    wrapperClassName,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const typeOfText = type === "text" ? "text" : type === "password" ? showPassword ? "text" : "password" : type === "search" ? "search" : type;
    return /* @__PURE__ */ jsxDEV("div", { className: clsx(wrapperClassName), children: [
      /* @__PURE__ */ jsxDEV("div", { className: clsx("relative"), children: [
        /* @__PURE__ */ jsxDEV(
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
              sizeClasses$1[sz],
              className
            ),
            disabled,
            ...props
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
            lineNumber: 60,
            columnNumber: 11
          },
          void 0
        ),
        type === "password" && /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: clsx("absolute right-0 top-1/2 -translate-y-1/2 mr-5"),
            onClick: () => setShowPassword(!showPassword),
            children: showPassword ? /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid fa-eye text-secondary-500") }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
              lineNumber: 87,
              columnNumber: 17
            }, void 0) : /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid fa-eye-slash text-text-main") }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
              lineNumber: 89,
              columnNumber: 17
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
            lineNumber: 81,
            columnNumber: 13
          },
          void 0
        ),
        type === "search" && /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-text-main" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
          lineNumber: 94,
          columnNumber: 13
        }, void 0)
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
        lineNumber: 59,
        columnNumber: 9
      }, void 0),
      isWrong && /* @__PURE__ */ jsxDEV("span", { className: "text-red-400", children: wrongMessage }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
        lineNumber: 97,
        columnNumber: 21
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textbox/textbox.tsx",
      lineNumber: 58,
      columnNumber: 7
    }, void 0);
  }
);
Textbox.displayName = "Textbox";
const styles$1 = {
  "my-textarea": "_my-textarea_jp58s_1",
  "my-textarea-wrong": "_my-textarea-wrong_jp58s_30"
};
const sizeClasses = {
  xs: "px-2 py-1 text-xs min-h-16",
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
    return /* @__PURE__ */ jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/textarea/textarea.tsx",
        lineNumber: 46,
        columnNumber: 7
      },
      void 0
    );
  }
);
TextArea.displayName = "TextArea";
const textSizes = {
  xs: "text-xs",
  "sm-1": "text-xs",
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
    wrap = "whitespace-normal",
    className = "",
    children,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxDEV(
      Component,
      {
        className: clsx(textSizes[sz], weightClasses[weight], colorClasses[color], wrap, className),
        ref,
        ...props,
        children
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/text/text.tsx",
        lineNumber: 64,
        columnNumber: 7
      },
      void 0
    );
  }
);
const Footer = ({ className }) => {
  return /* @__PURE__ */ jsxDEV("footer", { className: clsx("text-center text-text-third text-sm py-4", className), children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " Fatagram. All rights reserved."
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/atoms/footer/footer.tsx",
    lineNumber: 9,
    columnNumber: 5
  }, void 0);
};
var TimeUnit = /* @__PURE__ */ ((TimeUnit2) => {
  TimeUnit2["Miliseconds"] = "Miliseconds";
  TimeUnit2["Seconds"] = "Seconds";
  TimeUnit2["Minutes"] = "Minutes";
  TimeUnit2["Hours"] = "Hours";
  TimeUnit2["Days"] = "Days";
  TimeUnit2["Weeks"] = "Weeks";
  TimeUnit2["Months"] = "Months";
  TimeUnit2["Years"] = "Years";
  return TimeUnit2;
})(TimeUnit || {});
const TimeUnitTranslateMap = {
  [
    "Miliseconds"
    /* Miliseconds */
  ]: "times:time.milisecond",
  [
    "Seconds"
    /* Seconds */
  ]: "times:time.second",
  [
    "Minutes"
    /* Minutes */
  ]: "times:time.minute",
  [
    "Hours"
    /* Hours */
  ]: "times:time.hour",
  [
    "Days"
    /* Days */
  ]: "times:time.day",
  [
    "Weeks"
    /* Weeks */
  ]: "times:time.week",
  [
    "Months"
    /* Months */
  ]: "times:time.month",
  [
    "Years"
    /* Years */
  ]: "times:time.year"
};
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
  timeDistance: {
    value: 0,
    unit: TimeUnit.Miliseconds
  }
};
const PREFIX$2 = `/api/friendship`;
class FriendshipService {
  async GetFriendshipStatus(targetId) {
    try {
      const res = await apiClient.get(`${PREFIX$2}/status/${targetId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async SendAddFriendRequest(receiverId) {
    try {
      const res = await apiClient.post(`${PREFIX$2}/add/${receiverId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async CancelAddFriendRequest(senderId) {
    try {
      const res = await apiClient.delete(`${PREFIX$2}/cancel/${senderId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async AcceptAddFriendRequest(senderId) {
    try {
      const res = await apiClient.post(`${PREFIX$2}/accept/${senderId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async DeclineAddFriendRequest(requesterId) {
    try {
      const res = await apiClient.delete(`${PREFIX$2}/decline/${requesterId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async Unfriend(friendId) {
    try {
      const res = await apiClient.delete(`${PREFIX$2}/unfriend/${friendId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async GetNumberOfFriends(targetId) {
    try {
      const res = await apiClient.get(`${PREFIX$2}/count/${targetId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async GetFriendRequests(page, pageSize) {
    try {
      const res = await apiClient.get(`${PREFIX$2}/requests`, {
        params: {
          page,
          pageSize
        }
      });
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async GetFriends(userId, page, pageSize, keyword) {
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
      const res = await apiClient.get(`${PREFIX$2}/friends/${userId}`, {
        params
      });
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
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
  return /* @__PURE__ */ jsxDEV(Fragment, { children: parts.map((part) => part) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/helper/render-content.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
}
const BaseNotification = ({
  notificationDto,
  children,
  onClick
}) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 select-none", onClick, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: /* @__PURE__ */ jsxDEV(Avatar, { border: 0, src: notificationDto.actorImageUrl, alt: "Avatar", sz: "sm-1" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
      lineNumber: 24,
      columnNumber: 9
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
      lineNumber: 23,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1 flex-1", children: [
      /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", className: clsx({ "opacity-60": notificationDto.isRead }), children: renderContent(notificationDto.content ?? "", {
        actorName: /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", weight: "bold", children: notificationDto.actorName }, notificationDto.actorId, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
          lineNumber: 30,
          columnNumber: 15
        }, void 0)
      }) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, void 0),
      /* @__PURE__ */ jsxDEV(
        Text,
        {
          sz: "sm-1",
          color: notificationDto.isRead ? "primary" : "secondary",
          className: clsx({ "opacity-70": notificationDto.isRead }),
          children: notificationDto.timeDistance.unit === TimeUnit.Seconds || notificationDto.timeDistance.unit === TimeUnit.Miliseconds ? t("times:just_now") : `${t(
            `${TimeUnitTranslateMap[notificationDto.timeDistance.unit]}.${notificationDto.timeDistance.value === 1 ? "one" : "other"}`,
            { count: notificationDto.timeDistance.value }
          )} 
                                                ${t("times:ago")}`
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
          lineNumber: 36,
          columnNumber: 9
        },
        void 0
      ),
      children
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center", children: !notificationDto.isRead && /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-primary-500 rounded-full" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
      lineNumber: 55,
      columnNumber: 37
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
      lineNumber: 54,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/base-notification.tsx",
    lineNumber: 22,
    columnNumber: 5
  }, void 0);
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
  return /* @__PURE__ */ jsxDEV(BaseNotification, { notificationDto, onClick, children: !message ? /* @__PURE__ */ jsxDEV("div", { className: clsx("flex", "gap-1", "mt-1", "justify-start"), children: [
    /* @__PURE__ */ jsxDEV(Button, { sz: "sm-1", variant: "primary", onClick: handleAccept, children: t("user:profileHeader.acceptButton") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/new-friend-request.tsx",
      lineNumber: 59,
      columnNumber: 11
    }, void 0),
    /* @__PURE__ */ jsxDEV(Button, { sz: "sm-1", variant: "secondary", onClick: handleDelete, children: t("user:profileHeader.declineButton") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/new-friend-request.tsx",
      lineNumber: 62,
      columnNumber: 11
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/new-friend-request.tsx",
    lineNumber: 58,
    columnNumber: 9
  }, void 0) : /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", className: clsx("opacity-70"), children: message }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/new-friend-request.tsx",
    lineNumber: 67,
    columnNumber: 9
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/new-friend-request.tsx",
    lineNumber: 56,
    columnNumber: 5
  }, void 0);
};
const NotificationFactory = ({
  notificationDto,
  onClick = () => {
  }
}) => {
  switch (notificationDto.type) {
    case "NewFriendRequest":
      return /* @__PURE__ */ jsxDEV(NewFriendRequest, { notificationDto, onClick }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-factory.tsx",
        lineNumber: 18,
        columnNumber: 14
      }, void 0);
    case "FriendRequestAccepted":
      return /* @__PURE__ */ jsxDEV(BaseNotification, { notificationDto, onClick }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-factory.tsx",
        lineNumber: 21,
        columnNumber: 14
      }, void 0);
    default:
      return /* @__PURE__ */ jsxDEV(BaseNotification, { notificationDto: NotificationDefault, onClick }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-factory.tsx",
        lineNumber: 24,
        columnNumber: 14
      }, void 0);
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
  const [timer, setTimer] = React.useState(null);
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
  return /* @__PURE__ */ jsxDEV(ToastContext.Provider, { value, children: [
    children,
    toast && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `animate-left-to-right fixed bottom-8 left-8 rounded-2xl shadow-2xl
                    bg-bg-second max-w-full z-50
                     ${className}`,
        children: [
          toast.type === "notification" ? /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxDEV(Text, { weight: "bold", children: "New notification" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
              lineNumber: 71,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              NotificationFactory,
              {
                notificationDto: toast.payload.notificationDto,
                onClick: () => navigate(toast.payload.notificationDto.link)
              },
              void 0,
              false,
              {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
                lineNumber: 72,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
            lineNumber: 70,
            columnNumber: 13
          }, this) : /* @__PURE__ */ jsxDEV("div", { children: "More" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
            lineNumber: 78,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Button,
            {
              sz: "sm-1",
              variant: "third",
              className: "absolute top-2 right-2",
              onClick: () => setToast(null),
              children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-xmark" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
                lineNumber: 86,
                columnNumber: 13
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
              lineNumber: 80,
              columnNumber: 11
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
        lineNumber: 64,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
    lineNumber: 61,
    columnNumber: 5
  }, this);
});
const ToastProvider = React.memo(function ToastProvider2({
  children
}) {
  return /* @__PURE__ */ jsxDEV(ToastManager, { children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/toast-context.tsx",
    lineNumber: 99,
    columnNumber: 10
  }, this);
});
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
  return /* @__PURE__ */ jsxDEV(DialogContext.Provider, { value, children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/dialog-context.tsx",
    lineNumber: 48,
    columnNumber: 10
  }, this);
});
const availableThemes = [
  { key: "light", label: "common:themes:light" },
  { key: "dark", label: "common:themes:dark" }
];
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {
  }
});
function ThemeProvider({ children }) {
  const [theme2, setTheme] = useState("light");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && availableThemes.some((t) => t.key === storedTheme)) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme2);
    localStorage.setItem("theme", theme2);
  }, [theme2]);
  return /* @__PURE__ */ jsxDEV(ThemeContext.Provider, { value: { theme: theme2, setTheme }, children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/contexts/common/theme-context.tsx",
    lineNumber: 43,
    columnNumber: 10
  }, this);
}
function useTheme() {
  return useContext(ThemeContext);
}
function ContextTree({ children }) {
  return /* @__PURE__ */ jsxDEV(ThemeProvider, { children: /* @__PURE__ */ jsxDEV(LoadingProvider, { children: /* @__PURE__ */ jsxDEV(DialogProvider, { children: /* @__PURE__ */ jsxDEV(AuthProvider, { children: /* @__PURE__ */ jsxDEV(ToastProvider, { children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/context-tree.tsx",
    lineNumber: 16,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/context-tree.tsx",
    lineNumber: 15,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/context-tree.tsx",
    lineNumber: 14,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/context-tree.tsx",
    lineNumber: 13,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/context-tree.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, this);
}
const LoadingPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("fixed inset-0 z-[9999] flex justify-center items-center bg-bg-main"), children: /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col items-center"), children: /* @__PURE__ */ jsxDEV(Logo, { sz: "lg-1", hasSlogan: false }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/loading/loading-page.tsx",
    lineNumber: 12,
    columnNumber: 9
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/loading/loading-page.tsx",
    lineNumber: 11,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/loading/loading-page.tsx",
    lineNumber: 10,
    columnNumber: 5
  }, void 0);
};
function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Page Not Found";
    return () => {
      document.title = "Fatagram";
    };
  });
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "flex flex-col items-center sm:justify-center h-full w-full gap-[20px] pt-10"
      ),
      children: [
        /* @__PURE__ */ jsxDEV(Logo, { hasSlogan: false, sz: "md-2" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
          lineNumber: 28,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(
          Text,
          {
            sz: "xl-3",
            className: clsx(
              "font-jua bg-primary-500/70 text-primary-600 w-[200px] h-[200px] flex justify-center items-center rounded-full"
            ),
            children: "404"
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
            lineNumber: 29,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(Text, { weight: "extrabold", sz: "lg-3", className: clsx("uppercase text-primary-600"), children: t("notFound.title") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
          lineNumber: 37,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", className: clsx("flex justify-center text-center"), children: t("notFound.description") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
          lineNumber: 40,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: clsx("flex gap-[10px]"), children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            className: clsx("flex items-center"),
            onClick: () => {
              navigate("/");
            },
            children: [
              /* @__PURE__ */ jsxDEV(ArrowLeft, { className: clsx("w-5 h-5 mr-2") }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
                lineNumber: 50,
                columnNumber: 11
              }, this),
              t("notFound.backButton")
            ]
          },
          void 0,
          true,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
            lineNumber: 44,
            columnNumber: 9
          },
          this
        ) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
          lineNumber: 43,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(Footer, { className: clsx("text-text-third") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
          lineNumber: 54,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/not-found/not-found-page.tsx",
      lineNumber: 23,
      columnNumber: 5
    },
    this
  );
}
const HomePage = () => {
  return /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV("h1", { children: "Home Page" }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/home/home-page.tsx",
    lineNumber: 7,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/home/home-page.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};
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
  return /* @__PURE__ */ jsxDEV(
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
        isFocused && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent pointer-events-none" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
          lineNumber: 46,
          columnNumber: 9
        }, void 0),
        /* @__PURE__ */ jsxDEV("div", { className: clsx("grid grid-cols-10 relative z-10"), children: [
          /* @__PURE__ */ jsxDEV(
            Text,
            {
              sz: "md-3",
              className: clsx(
                "flex justify-center items-center h-full col-span-2",
                "transition-all duration-300",
                isFocused ? "text-primary-500 scale-110" : "text-text-second group-hover:text-primary-500 group-hover:scale-105"
              ),
              children: icon
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
              lineNumber: 50,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "col-span-8 flex flex-col justify-center", children: [
            /* @__PURE__ */ jsxDEV(
              Text,
              {
                sz: "md-1",
                className: clsx(
                  "transition-colors duration-300",
                  isFocused ? "text-primary-600 font-semibold" : "text-text-main group-hover:text-primary-600"
                ),
                children: title2
              },
              void 0,
              false,
              {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
                lineNumber: 63,
                columnNumber: 11
              },
              void 0
            ),
            description2 && /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", weight: "light", className: "text-text-second mt-0.5", children: description2 }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
              lineNumber: 75,
              columnNumber: 13
            }, void 0)
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
            lineNumber: 62,
            columnNumber: 9
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
          lineNumber: 49,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-item.tsx",
      lineNumber: 28,
      columnNumber: 5
    },
    void 0
  );
};
const PageNavbarSection = ({
  title: title2,
  className,
  titleClassName,
  children
}) => {
  const [showChildren, setShowChildren] = useState(true);
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full", className), children: [
    title2 && /* @__PURE__ */ jsxDEV(
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
          /* @__PURE__ */ jsxDEV(
            Text,
            {
              sz: "lg-1",
              weight: "bold",
              className: clsx(
                "text-text-third group-hover:text-text-main transition-colors duration-200",
                titleClassName
              ),
              children: title2
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-section.tsx",
              lineNumber: 32,
              columnNumber: 11
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            "i",
            {
              className: clsx(
                "fas fa-chevron-down text-text-third text-sm",
                "transition-transform duration-300",
                "group-hover:text-primary-500",
                showChildren ? "rotate-180" : "rotate-0"
              )
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-section.tsx",
              lineNumber: 42,
              columnNumber: 11
            },
            void 0
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-section.tsx",
        lineNumber: 23,
        columnNumber: 9
      },
      void 0
    ),
    showChildren && /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full animate-dropdown-slide mt-1 space-y-1"), children }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-section.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar-section.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, void 0);
};
const PageNavbar = ({ title: title2, className, children }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "flex flex-col gap-3",
        "bg-bg-main shadow-md rounded-b-2xl",
        "overflow-hidden",
        className
      ),
      children: [
        title2 && /* @__PURE__ */ jsxDEV("div", { className: "relative bg-bg-second mt-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar.tsx",
            lineNumber: 28,
            columnNumber: 11
          }, void 0),
          /* @__PURE__ */ jsxDEV(Text, { sz: "xl-1", weight: "bold", className: "relative pt-4 pb-4 px-6 text-gradient-main", children: title2 }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar.tsx",
            lineNumber: 29,
            columnNumber: 11
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar.tsx",
          lineNumber: 26,
          columnNumber: 9
        }, void 0),
        /* @__PURE__ */ jsxDEV("div", { className: "px-2 pb-3 space-y-1", children }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar.tsx",
          lineNumber: 34,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/page-navbar/page-navbar.tsx",
      lineNumber: 17,
      columnNumber: 5
    },
    void 0
  );
};
PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;
const SettingsNavbar = ({ className, onSelect }) => {
  const { t } = useTranslation();
  const authSettings = [
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 24,
        columnNumber: 13
      }, void 0),
      name: t("settings:navbar.privacy.account"),
      path: "/settings"
    },
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-shield-halved" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 29,
        columnNumber: 13
      }, void 0),
      name: t("settings:navbar.privacy.privacy"),
      path: "/settings/privacy"
    }
  ];
  const generalSettings = [
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-language" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 38,
        columnNumber: 13
      }, void 0),
      name: t("settings:navbar.general.language"),
      path: "/settings/language"
    },
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-bell" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 43,
        columnNumber: 13
      }, void 0),
      name: t("settings:navbar.general.notifications"),
      path: "/settings/notifications"
    },
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-circle-info" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 48,
        columnNumber: 13
      }, void 0),
      name: t("settings:navbar.general.about"),
      path: "/settings/about"
    },
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-palette" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 53,
        columnNumber: 13
      }, void 0),
      name: t("settings:navbar.general.theme"),
      path: "/settings/theme"
    }
  ];
  return /* @__PURE__ */ jsxDEV(PageNavbar, { title: t("settings:navbar.title"), className: clsx("bg-bg-second", className), children: [
    /* @__PURE__ */ jsxDEV(PageNavbar.Section, { title: t("settings:navbar.privacy.title"), children: authSettings.map((item, index) => /* @__PURE__ */ jsxDEV(
      PageNavbar.Item,
      {
        path: item.path,
        icon: item.icon,
        title: item.name,
        onClick: onSelect
      },
      index,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 63,
        columnNumber: 11
      },
      void 0
    )) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(PageNavbar.Section, { title: t("settings:navbar.general.title"), children: generalSettings.map((item, index) => /* @__PURE__ */ jsxDEV(
      PageNavbar.Item,
      {
        path: item.path,
        icon: item.icon,
        title: item.name,
        onClick: onSelect
      },
      index,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
        lineNumber: 74,
        columnNumber: 11
      },
      void 0
    )) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/settings-navbar.tsx",
    lineNumber: 60,
    columnNumber: 5
  }, void 0);
};
const SettingPage = () => {
  const { t } = useTranslation();
  useLayoutEffect(() => {
    document.title = t("settings:title");
  }, [t]);
  const [isShowNavbar, setIsShowNavbar] = React.useState(true);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex flex-col sm:flex-row w-full h-full bg-[var(--second-bg-color)] sm:gap-4"
      ),
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full inset-0 z-10 h-[50px] flex sm:hidden px-2"), children: /* @__PURE__ */ jsxDEV(Text, { sz: "lg-3", children: /* @__PURE__ */ jsxDEV(
          "i",
          {
            className: "fa-solid fa-list text-gradient-main",
            onClick: () => setIsShowNavbar(!isShowNavbar)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
            lineNumber: 29,
            columnNumber: 11
          },
          void 0
        ) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
          lineNumber: 28,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
          lineNumber: 27,
          columnNumber: 7
        }, void 0),
        isShowNavbar && /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: clsx("sm:hidden z-9998 block fixed bg-black/50 w-screen h-screen"),
            onClick: () => setIsShowNavbar(false)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
            lineNumber: 36,
            columnNumber: 9
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV(
          SettingsNavbar,
          {
            className: clsx(
              "sm:flex sm:w-[300px] sm:fixed absolute h-full sm:animate-none animate-left-to-right w-[60%] shadow-lg bg-[var(--main-bg-color)] p-2",
              {
                "absolute z-30": isShowNavbar,
                hidden: !isShowNavbar
              }
            ),
            onSelect: () => setIsShowNavbar(false)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
            lineNumber: 41,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV("div", { className: clsx("sm:col-span-8 flex justify-center flex-1 ml-[300px]"), children: /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full max-w-[700px] p-2"), children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
          lineNumber: 53,
          columnNumber: 11
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
          lineNumber: 52,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
          lineNumber: 51,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/settings/setting-page.tsx",
      lineNumber: 22,
      columnNumber: 5
    },
    void 0
  );
};
const EditableField = ({
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
  return /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center w-full", children: [
    /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", className: "font-light m-2", children: title2 }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
      lineNumber: 49,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "flex sm:items-center items-end gap-4 sm:flex-row flex-col", children: [
      editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxDEV("div", { className: "relative flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxDEV(
          Textbox,
          {
            className: clsx("animate-fade-in px-2 py-1", {
              "mt-[5px]": isError
            }),
            placeholder,
            value: inputValue,
            isWrong: isError,
            onChange: (e) => setInputValue(e.target.value)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
            lineNumber: 55,
            columnNumber: 13
          },
          void 0
        ),
        isError && /* @__PURE__ */ jsxDEV(Text, { sz: "sm-1", className: "text-red-500 ml-2 h-[5px]", children: errorMessage }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
          lineNumber: 65,
          columnNumber: 15
        }, void 0)
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
        lineNumber: 54,
        columnNumber: 11
      }, void 0) : /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", className: clsx(valueClassName), children: value ?? noDataValue }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
        lineNumber: 71,
        columnNumber: 11
      }, void 0),
      canEdit && /* @__PURE__ */ jsxDEV(Fragment, { children: editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxDEV("div", { className: "animate-fade-in gap-1 flex", children: [
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            disabled: value === inputValue,
            sz: "sm-1",
            variant: "primary",
            onClick: () => {
              onSaveClick?.(inputValue);
            },
            children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-floppy-disk mr-2" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
                lineNumber: 87,
                columnNumber: 19
              }, void 0),
              t("settings:editableField.saveButton")
            ]
          },
          void 0,
          true,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
            lineNumber: 79,
            columnNumber: 17
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            sz: "sm-1",
            variant: "fourth",
            onClick: () => {
              onCancelClick?.();
            },
            children: t("settings:editableField.cancelButton")
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
            lineNumber: 90,
            columnNumber: 17
          },
          void 0
        )
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
        lineNumber: 78,
        columnNumber: 15
      }, void 0) : /* @__PURE__ */ jsxDEV(
        Button,
        {
          sz: "sm-1",
          variant: "fourth",
          onClick: () => {
            onChangeClick?.();
          },
          children: btnChildren
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
          lineNumber: 101,
          columnNumber: 15
        },
        void 0
      ) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
        lineNumber: 76,
        columnNumber: 11
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
      lineNumber: 52,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-field.tsx",
    lineNumber: 48,
    columnNumber: 5
  }, void 0);
};
const Card = ({ className, children, title: title2, titleClassName }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "flex flex-col items-start bg-bg-second p-7 rounded-2xl shadow-lg",
        className
      ),
      children: [
        /* @__PURE__ */ jsxDEV(Text, { sz: "lg-2", weight: "bold", className: clsx("mb-5", titleClassName), children: title2 }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/card/card.tsx",
          lineNumber: 20,
          columnNumber: 7
        }, void 0),
        children
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/card/card.tsx",
      lineNumber: 14,
      columnNumber: 5
    },
    void 0
  );
};
function useAuth() {
  return useContext(AuthContext);
}
function useLanguage() {
  const { t } = useTranslation();
  return t;
}
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
const ChangeUrlName = ({ isLoading, urlName: u }) => {
  const t = useLanguage();
  const { setUrlName: _setUrlName } = useAuth();
  const [urlName, setUrlName] = useState();
  const [isEditUrlName, setIsEditUrlName] = useState(false);
  const [isEditUrlNameFailed, setIsEditUrlNameFailed] = useState(false);
  const [editUrlFailedMessage, setEditUrlFailedMessage] = useState("");
  useEffect(() => {
    setUrlName(u);
  }, [u]);
  const handleChangeUrlName = async (urlName2) => {
    const changeUrlNameDto = {
      urlName: urlName2 ?? ""
    };
    const response = await userProfileService.UpdateUrlName(changeUrlNameDto);
    if (response.success) {
      setUrlName(urlName2);
      _setUrlName?.(urlName2);
      setIsEditUrlName(false);
    } else {
      setIsEditUrlNameFailed(true);
      const errorCode = response?.errorCode;
      setEditUrlFailedMessage(t(ErrorCodes$2[errorCode]));
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxDEV(Skeleton, { sz: "md-1", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-url-name.tsx",
      lineNumber: 44,
      columnNumber: 12
    }, void 0);
  }
  return /* @__PURE__ */ jsxDEV(
    EditableField,
    {
      title: t("settings:account.personalInfo.urlName"),
      value: urlName,
      noDataValue: t("settings:account.personalInfo.noUrlName"),
      placeholder: t("settings:account.personalInfo.urlNamePlaceholder"),
      valueClassName: clsx(!urlName && "!opacity-50"),
      btnChildren: /* @__PURE__ */ jsxDEV(Text, { children: [
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-pen mr-2" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-url-name.tsx",
          lineNumber: 56,
          columnNumber: 11
        }, void 0),
        t("settings:account.personalInfo.changeButton")
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-url-name.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, void 0),
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
      onSaveClick: (e) => handleChangeUrlName(e)
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-url-name.tsx",
      lineNumber: 48,
      columnNumber: 5
    },
    void 0
  );
};
const ErrorCodes$1 = {
  NICKNAME_TOO_LONG: "settings:account.personalInfo.errorMessages.changeNickname.nicknameTooLong"
};
const PREFIX$1 = `/api/userinfo`;
class UserInfoService {
  async UpdateNickname(changeNicknameDto) {
    try {
      const res = await apiClient.patch(`${PREFIX$1}/nickname`, changeNicknameDto);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async GetUserInfoOverview(userId) {
    try {
      const res = await apiClient.get(`${PREFIX$1}/overview/${userId}`);
      const response = res.data;
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
}
const userInfoService = new UserInfoService();
const ChangeNickname = ({ isLoading, nickname: n }) => {
  const t = useLanguage();
  const [nickname, setNickname] = useState();
  const [isEditNickname, setIsEditNickname] = useState(false);
  const [isEditNicknameFailed, setIsEditNicknameFailed] = useState(false);
  const [editNicknameFailedMessage, setEditNicknameFailedMessage] = useState("");
  useEffect(() => {
    setNickname(n);
  }, [n]);
  const handleChangeNickname = async (nickname2) => {
    const changeNickname = {
      nickname: nickname2 ?? ""
    };
    const response = await userInfoService.UpdateNickname(changeNickname);
    if (response.success) {
      setNickname(nickname2);
      setIsEditNickname(false);
    } else {
      setIsEditNicknameFailed(true);
      const errorCode = response?.errorCode;
      setEditNicknameFailedMessage(t(ErrorCodes$1[errorCode]));
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxDEV(Skeleton, { sz: "md-1", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-nickname.tsx",
      lineNumber: 43,
      columnNumber: 12
    }, void 0);
  }
  return /* @__PURE__ */ jsxDEV(
    EditableField,
    {
      title: t("settings:account.personalInfo.nickname"),
      value: nickname,
      noDataValue: t("settings:account.personalInfo.noNickname"),
      placeholder: t("settings:account.personalInfo.nicknamePlaceholder"),
      valueClassName: clsx(!nickname && "!opacity-50"),
      btnChildren: /* @__PURE__ */ jsxDEV(Text, { children: [
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-pen mr-2" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-nickname.tsx",
          lineNumber: 55,
          columnNumber: 11
        }, void 0),
        t("settings:account.personalInfo.changeButton")
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-nickname.tsx",
        lineNumber: 54,
        columnNumber: 9
      }, void 0),
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
      onSaveClick: (e) => handleChangeNickname(e)
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-nickname.tsx",
      lineNumber: 47,
      columnNumber: 5
    },
    void 0
  );
};
const AccountSetting = ({ className }) => {
  const t = useLanguage();
  const [fullName, setFullName] = React.useState("");
  const [urlName, setUrlName] = React.useState();
  const [nickname, setNickname] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleChangeName = () => navigate("name");
  useEffect(() => {
    const fetchProfile = async () => {
      const _userId = userId ?? "";
      const response = await userProfileService.GetProfile(_userId, "fullName,urlName,nickname");
      if (response.success) {
        setFullName(response.data.infos.fullName);
        setUrlName(response.data.infos.urlName);
        setNickname(response.data.infos.nickname);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [userProfileService, location.key, userId]);
  return /* @__PURE__ */ jsxDEV("div", { className: clsx(className), children: /* @__PURE__ */ jsxDEV(Card, { title: t("settings:account.personalInfo.title"), className: "mb-0 gap-5", children: [
    isLoading ? /* @__PURE__ */ jsxDEV(Skeleton, { sz: "md-1", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
      lineNumber: 49,
      columnNumber: 11
    }, void 0) : /* @__PURE__ */ jsxDEV(
      EditableField,
      {
        title: t("settings:account.personalInfo.yourName"),
        value: fullName,
        btnChildren: /* @__PURE__ */ jsxDEV(Text, { children: [
          /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-pen mr-2" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
            lineNumber: 56,
            columnNumber: 17
          }, void 0),
          " ",
          t("settings:account.personalInfo.changeButton")
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
          lineNumber: 55,
          columnNumber: 15
        }, void 0),
        onChangeClick: handleChangeName
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
        lineNumber: 51,
        columnNumber: 11
      },
      void 0
    ),
    /* @__PURE__ */ jsxDEV(ChangeUrlName, { isLoading, urlName }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
      lineNumber: 63,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDEV(ChangeNickname, { isLoading, nickname }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
      lineNumber: 64,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
    lineNumber: 47,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/account-setting.tsx",
    lineNumber: 46,
    columnNumber: 5
  }, void 0);
};
const AccountSettingPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex justify-center w-full"), children: [
    /* @__PURE__ */ jsxDEV(AccountSetting, { className: clsx("w-full") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/account-setting-page.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/account-setting-page.tsx",
      lineNumber: 10,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/account-setting-page.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, void 0);
};
const SelectBoxSetting = ({
  options = [],
  selectedOption = "",
  onOptionChange = (e) => {
  },
  title: title2,
  className,
  selectBox
}) => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex justify-between items-center w-full", className), children: [
    /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", className: "m-2", children: title2 }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/selectbox-setting.tsx",
      lineNumber: 24,
      columnNumber: 7
    }, void 0),
    selectBox ? selectBox : /* @__PURE__ */ jsxDEV(
      SelectBox,
      {
        className: "!min-w-[170px]",
        selectedOption,
        options,
        onSelect: onOptionChange
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/selectbox-setting.tsx",
        lineNumber: 30,
        columnNumber: 9
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/selectbox-setting.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, void 0);
};
const ThemeSettings = ({ className }) => {
  const { theme: theme2, setTheme } = useTheme();
  const [themeOptions, setThemeOptions] = useState([]);
  const { t } = useTranslation();
  const selectTheme = (opt) => {
    setTheme(opt);
  };
  useEffect(() => {
    const options = availableThemes.map((theme22) => ({
      key: theme22.key,
      value: t(theme22.label)
    }));
    setThemeOptions(options);
  }, [availableThemes]);
  return /* @__PURE__ */ jsxDEV("div", { className: clsx(className), children: /* @__PURE__ */ jsxDEV(Card, { title: t("settings:theme.title"), children: /* @__PURE__ */ jsxDEV(
    SelectBoxSetting,
    {
      title: t("settings:theme.selectTheme"),
      selectedOption: theme2,
      options: themeOptions,
      onOptionChange: selectTheme
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/theme-setting.tsx",
      lineNumber: 33,
      columnNumber: 9
    },
    void 0
  ) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/theme-setting.tsx",
    lineNumber: 32,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/theme-setting.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, void 0);
};
const ThemeSettingPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex justify-center w-full"), children: /* @__PURE__ */ jsxDEV(ThemeSettings, { className: clsx("w-full") }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/theme-setting-page.tsx",
    lineNumber: 8,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/theme-setting-page.tsx",
    lineNumber: 7,
    columnNumber: 5
  }, void 0);
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
  const [oldFirstName, setOldFirstName] = React.useState("");
  const [oldLastName, setOldLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [firstNameFailed, setFirstNameFailed] = React.useState(false);
  const [lastNameFailed, setLastNameFailed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId } = useAuth();
  const handleClose = () => {
    navigate("/settings");
  };
  const handleSubmit = async () => {
    const response = await userProfileService.UpdateName({ firstName, lastName });
    if (response.success) {
      navigate("/settings", { state: { reload: true } });
    } else {
      const errorCode = response?.errorCodes?.[0] || response.errorCode;
      if (errorCode) {
        setErrorMessage(t(ErrorCodes[errorCode].message));
        setFirstNameFailed(ErrorCodes[errorCode].type === "FirstName");
        setLastNameFailed(ErrorCodes[errorCode].type === "LastName");
      } else {
        setErrorMessage(t(ErrorCodes["UNKNOWN_ERROR"].message));
        setFirstNameFailed(false);
        setLastNameFailed(false);
      }
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userProfileService.GetProfile(userId ?? "", "firstName,lastName");
      if (response.success) {
        setFirstName(response.data.infos.firstName);
        setLastName(response.data.infos.lastName);
        setOldFirstName(response.data.infos.firstName);
        setOldLastName(response.data.infos.lastName);
      }
      setIsLoading(false);
    };
    setErrorMessage("");
    setFirstNameFailed(false);
    setLastNameFailed(false);
    fetchProfile();
  }, [userProfileService, userId]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "fixed inset-0 bg-bg-overlay flex items-center justify-center z-50 lg:pt-0 pt-10",
        className
      ),
      children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: clsx(
            "animate-fade-in relative flex flex-col justify-center bg-bg-second rounded-2xl shadow-lg px-10 py-8"
          ),
          children: [
            /* @__PURE__ */ jsxDEV(Text, { sz: "lg-3", className: clsx("pb-6 px-2 text-gradient-main !font-bold"), children: t("settings:account.personalInfo.changeNameForm.title") }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
              lineNumber: 80,
              columnNumber: 9
            }, void 0),
            isLoading ? /* @__PURE__ */ jsxDEV(Skeleton, {}, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
              lineNumber: 84,
              columnNumber: 11
            }, void 0) : /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: clsx(
                    "animate-fade-in flex flex-wrap gap-7 justify-center w-full rounded-2xl bg-bg-main p-5"
                  ),
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", className: clsx("ml-2 mb-1"), children: t("settings:account.personalInfo.changeNameForm.firstName") }, void 0, false, {
                        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                        lineNumber: 93,
                        columnNumber: 17
                      }, void 0),
                      /* @__PURE__ */ jsxDEV(
                        Textbox,
                        {
                          isWrong: firstNameFailed,
                          value: firstName,
                          placeholder: "First name",
                          className: clsx("py-1 px-2 lg:max-w-[200px]"),
                          onChange: (e) => setFirstName(e.target.value)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                          lineNumber: 96,
                          columnNumber: 17
                        },
                        void 0
                      )
                    ] }, void 0, true, {
                      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                      lineNumber: 92,
                      columnNumber: 15
                    }, void 0),
                    /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", className: clsx("ml-2 mb-1"), children: t("settings:account.personalInfo.changeNameForm.lastName") }, void 0, false, {
                        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                        lineNumber: 105,
                        columnNumber: 17
                      }, void 0),
                      /* @__PURE__ */ jsxDEV(
                        Textbox,
                        {
                          isWrong: lastNameFailed,
                          value: lastName,
                          placeholder: "Last name",
                          className: clsx("py-1 px-2 lg:max-w-[200px]"),
                          onChange: (e) => setLastName(e.target.value)
                        },
                        void 0,
                        false,
                        {
                          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                          lineNumber: 108,
                          columnNumber: 17
                        },
                        void 0
                      )
                    ] }, void 0, true, {
                      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                      lineNumber: 104,
                      columnNumber: 15
                    }, void 0)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                  lineNumber: 87,
                  columnNumber: 13
                },
                void 0
              ),
              errorMessage && /* @__PURE__ */ jsxDEV(Text, { sz: "md-1", color: "danger", className: clsx("mt-2 mx-4"), children: errorMessage }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 118,
                columnNumber: 15
              }, void 0)
            ] }, void 0, true, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
              lineNumber: 86,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDEV(Text, { className: clsx("mx-8 mt-8 mb-4 h-[0.5px] bg-primary-500") }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
              lineNumber: 124,
              columnNumber: 9
            }, void 0),
            /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", className: clsx("font-light px-2 mb-4 flex flex-col gap-1"), children: [
              /* @__PURE__ */ jsxDEV(Text, { weight: "bold", className: clsx("text-single-second"), children: [
                "* ",
                t("settings:account.personalInfo.changeNameForm.note"),
                ":"
              ] }, void 0, true, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 126,
                columnNumber: 11
              }, void 0),
              /* @__PURE__ */ jsxDEV(Text, { className: clsx("opacity-80"), children: [
                "- ",
                t("settings:account.personalInfo.changeNameForm.noteText1"),
                "  ",
                /* @__PURE__ */ jsxDEV(Text, { weight: "bold", className: clsx("text-single-main"), children: [
                  "7 ",
                  t("settings:account.personalInfo.changeNameForm.day")
                ] }, void 0, true, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                  lineNumber: 131,
                  columnNumber: 13
                }, void 0),
                "."
              ] }, void 0, true, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 129,
                columnNumber: 11
              }, void 0),
              /* @__PURE__ */ jsxDEV(Text, { className: clsx("opacity-80"), children: [
                "- ",
                t("settings:account.personalInfo.changeNameForm.noteText2")
              ] }, void 0, true, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 136,
                columnNumber: 11
              }, void 0),
              /* @__PURE__ */ jsxDEV(Text, { className: clsx("opacity-80"), children: [
                "- ",
                t("settings:account.personalInfo.changeNameForm.noteText3"),
                "  ",
                /* @__PURE__ */ jsxDEV(Text, { sz: "md-1", children: "!, #, $, @, ..." }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                  lineNumber: 141,
                  columnNumber: 13
                }, void 0),
                "."
              ] }, void 0, true, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 139,
                columnNumber: 11
              }, void 0)
            ] }, void 0, true, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
              lineNumber: 125,
              columnNumber: 9
            }, void 0),
            /* @__PURE__ */ jsxDEV(
              Button,
              {
                disabled: firstName === oldFirstName && lastName === oldLastName,
                sz: "md-1",
                className: clsx("mt-2"),
                onClick: handleSubmit,
                children: t("settings:account.personalInfo.changeNameForm.acceptButton")
              },
              void 0,
              false,
              {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 144,
                columnNumber: 9
              },
              void 0
            ),
            /* @__PURE__ */ jsxDEV(
              Text,
              {
                sz: "lg-2",
                className: clsx("absolute top-5 right-8 hover:text-primary-500 cursor-pointer"),
                onClick: handleClose,
                children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-xmark" }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                  lineNumber: 157,
                  columnNumber: 11
                }, void 0)
              },
              void 0,
              false,
              {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
                lineNumber: 152,
                columnNumber: 9
              },
              void 0
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
          lineNumber: 75,
          columnNumber: 7
        },
        void 0
      )
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/privacy/components/change-name-form.tsx",
      lineNumber: 69,
      columnNumber: 5
    },
    void 0
  );
};
const SelectLanguage = ({ className }) => {
  const { t } = useTranslation();
  const { changeLanguage, availableLanguages, currentLanguage } = useLanguage$1();
  const options = availableLanguages.map((lang) => ({
    key: lang,
    value: t(`common:language.${lang}`)
  }));
  const _changeLanguage = (key) => {
    changeLanguage(key);
  };
  return /* @__PURE__ */ jsxDEV(
    SelectBox,
    {
      className: clsx(className),
      options,
      selectedOption: currentLanguage,
      onSelect: _changeLanguage
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/select-language.tsx",
      lineNumber: 24,
      columnNumber: 5
    },
    void 0
  );
};
const LanguageSettings = ({ className }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxDEV("div", { className: clsx(className), children: /* @__PURE__ */ jsxDEV(Card, { title: t("settings:language.title"), children: /* @__PURE__ */ jsxDEV(
    SelectBoxSetting,
    {
      title: t("settings:language.yourLanguage"),
      selectBox: /* @__PURE__ */ jsxDEV(SelectLanguage, { className: "!min-w-[180px]" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/language-setting.tsx",
        lineNumber: 20,
        columnNumber: 22
      }, void 0)
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/language-setting.tsx",
      lineNumber: 18,
      columnNumber: 9
    },
    void 0
  ) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/language-setting.tsx",
    lineNumber: 17,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/components/language-setting.tsx",
    lineNumber: 16,
    columnNumber: 5
  }, void 0);
};
const LanguageSettingPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex justify-center w-full"), children: /* @__PURE__ */ jsxDEV(LanguageSettings, { className: clsx("w-full !min-w-[200px]") }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/language-setting-page.tsx",
    lineNumber: 7,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/general/language-setting-page.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};
const settingRoutes = {
  path: "/settings",
  element: /* @__PURE__ */ jsxDEV(SettingPage, {}, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/setting.routes.tsx",
    lineNumber: 10,
    columnNumber: 12
  }, void 0),
  type: "private",
  children: [
    {
      path: "",
      element: /* @__PURE__ */ jsxDEV(AccountSettingPage, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/setting.routes.tsx",
        lineNumber: 15,
        columnNumber: 16
      }, void 0),
      children: [{ path: "name", element: /* @__PURE__ */ jsxDEV(ChangeNameForm, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/setting.routes.tsx",
        lineNumber: 16,
        columnNumber: 43
      }, void 0) }]
    },
    { path: "theme", element: /* @__PURE__ */ jsxDEV(ThemeSettingPage, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/setting.routes.tsx",
      lineNumber: 18,
      columnNumber: 31
    }, void 0) },
    { path: "language", element: /* @__PURE__ */ jsxDEV(LanguageSettingPage, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/setting.routes.tsx",
      lineNumber: 19,
      columnNumber: 34
    }, void 0) }
  ]
};
const styles = {
  "overlay-loading-bg-color": "_overlay-loading-bg-color_snybu_4"
};
const OverlayLoading = () => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "absolute inset-0 flex items-center justify-center z-50",
        styles["overlay-loading-bg-color"]
      ),
      children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: clsx(
            "absolute top-1/2 w-12 h-12 border-4 border-transparent",
            "border-t-primary-700 border-r-primary-700",
            "rounded-full animate-spin"
          )
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/overlay-loading/overlay-loading.tsx",
          lineNumber: 13,
          columnNumber: 7
        },
        void 0
      )
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/overlay-loading/overlay-loading.tsx",
      lineNumber: 7,
      columnNumber: 5
    },
    void 0
  );
};
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
const registerInitialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  isRememberMe: true
};
const registerValidationSchema = Yup.object().shape({
  username: Yup.string().required("auth:register.errors.username.required").min(3, "auth:register.errors.username.tooShort").max(30, "auth:register.errors.username.tooLong").matches(
    /^[a-zA-Z0-9_]+$/,
    "auth:register.errors.username.notCorrectFormat"
  ),
  email: Yup.string().required("auth:register.errors.email.required").email("auth:register.errors.email.notCorrectFormat"),
  password: Yup.string().required("auth:register.errors.password.required").min(8, "auth:register.errors.password.tooShort").max(100, "auth:register.errors.password.tooLong"),
  confirmPassword: Yup.string().required("auth:register.errors.confirmPassword.required").oneOf([Yup.ref("password")], "auth:register.errors.passwords.doNotMatch")
});
const SocialButton = ({ icon, name, onClick }) => {
  return /* @__PURE__ */ jsxDEV(
    Button,
    {
      variant: "fourth",
      className: "flex gap-2 flex-1 items-center justify-center !py-3",
      onClick,
      children: [
        /* @__PURE__ */ jsxDEV("img", { src: icon, alt: name, className: "w-5 h-5" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/social-button.tsx",
          lineNumber: 16,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: name }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/social-button.tsx",
          lineNumber: 17,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/social-button.tsx",
      lineNumber: 11,
      columnNumber: 5
    },
    void 0
  );
};
const SocialButtons = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 w-full", children: [
    /* @__PURE__ */ jsxDEV(SocialButton, { name: "Google", icon: "src/assets/svgs/google-icon.svg" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/social-buttons.tsx",
      lineNumber: 6,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(SocialButton, { name: "Facebook", icon: "src/assets/svgs/facebook-icon.svg" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/social-buttons.tsx",
      lineNumber: 7,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/social-buttons.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, void 0);
};
const LoginForm = ({
  switchForgotPassword,
  showLogo = true,
  showClose = false,
  onClose,
  className
}) => {
  const { t } = useTranslation();
  const [isShowClose] = React.useState(showClose);
  const [isShowLogo] = React.useState(showLogo);
  const { logIn } = useAuth();
  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await logIn({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password
      });
    }
  });
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex flex-col items-center justify-center gap-5 w-[450px] h-[550px]",
        "bg-bg-second rounded-2xl",
        "p-12 animate-fade-in overflow-hidden",
        className
      ),
      children: [
        formik.isSubmitting && /* @__PURE__ */ jsxDEV(OverlayLoading, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
          lineNumber: 59,
          columnNumber: 31
        }, void 0),
        isShowLogo && /* @__PURE__ */ jsxDEV(Logo, { sz: "md-1" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
          lineNumber: 61,
          columnNumber: 22
        }, void 0),
        /* @__PURE__ */ jsxDEV(
          Text,
          {
            sz: "xl-1",
            weight: "extrabold",
            className: clsx(
              "uppercase !text-primary-500",
              "font-bold font-inter select-none"
            ),
            children: t("auth:login.title")
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
            lineNumber: 62,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              className: clsx(
                "text-[14px] w-[100%] px-[20px]",
                "sm:py-[7px] py-[10px] shadow-sm"
              ),
              autoComplete: "username",
              placeholder: t("auth:login.username"),
              onChange: (e) => formik.setFieldValue("usernameOrEmail", e.target.value),
              isWrong: formik.touched.usernameOrEmail && Boolean(formik.errors.usernameOrEmail),
              wrongMessage: t(formik.errors.usernameOrEmail || "")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 73,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              type: "password",
              className: clsx(
                "text-[14px] w-[100%] px-[20px]",
                "sm:py-[7px] py-[10px] shadow-sm"
              ),
              placeholder: t("auth:login.password"),
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              isWrong: formik.touched.password && Boolean(formik.errors.password),
              wrongMessage: t(formik.errors.password || ""),
              autoComplete: "current-password"
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 89,
              columnNumber: 9
            },
            void 0
          )
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
          lineNumber: 72,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between w-[98%] items-center gap-[50px]", children: [
          /* @__PURE__ */ jsxDEV(
            Checkbox,
            {
              label: t("auth:login.rememberMe"),
              onChange: (e) => {
                formik.setFieldValue("rememberMe", e.target.checked);
              }
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 103,
              columnNumber: 9
            },
            void 0
          ),
          switchForgotPassword && /* @__PURE__ */ jsxDEV(
            Text,
            {
              sz: "sm-3",
              className: clsx(
                "!text-primary-500 hover:!text-primary-600",
                "hover:cursor-pointer transition-all duration-100 active:scale-95 select-none"
              ),
              onClick: switchForgotPassword,
              children: t("auth:login.forgotPassword")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 110,
              columnNumber: 11
            },
            void 0
          )
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
          lineNumber: 102,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            type: "button",
            className: "w-full font-montserrat",
            onClick: formik.submitForm,
            sz: "md-1",
            children: t("auth:login.loginButton")
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
            lineNumber: 122,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "w-full flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center w-full gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-border-main flex-1" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 132,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", className: "text-text-third", children: "OR" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 133,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-border-main flex-1" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 136,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
            lineNumber: 131,
            columnNumber: 9
          }, void 0),
          /* @__PURE__ */ jsxDEV(SocialButtons, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
            lineNumber: 138,
            columnNumber: 9
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
          lineNumber: 130,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(Text, { children: [
          t("auth:login.dontHaveAccount"),
          " ",
          /* @__PURE__ */ jsxDEV(Link, { className: "font-bold", to: "/register", children: t("auth:login.registerButton") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
            lineNumber: 143,
            columnNumber: 9
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
          lineNumber: 140,
          columnNumber: 7
        }, void 0),
        isShowClose && /* @__PURE__ */ jsxDEV(
          Text,
          {
            className: clsx(
              "absolute top-3 right-5 text-[20px] text-gradient-main hover:text-single-main cursor-pointer"
            ),
            onClick: onClose,
            children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-xmark" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
              lineNumber: 155,
              columnNumber: 11
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
            lineNumber: 149,
            columnNumber: 9
          },
          void 0
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/login-form.tsx",
      lineNumber: 51,
      columnNumber: 5
    },
    void 0
  );
};
const UserMenu = () => {
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { userId, urlName, logOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userProfileService.GetProfile(userId || "", "avatar,fullName");
      if (response.success) {
        setAvatar(response.data.infos.avatar);
        setFullName(response.data.infos.fullName);
      }
    };
    fetchProfile();
  }, [userId]);
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
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex items-center justify-center relative"), ref: btnRef, children: [
    /* @__PURE__ */ jsxDEV(
      Button,
      {
        variant: "secondary",
        className: clsx("!rounded-full !p-0"),
        onClick: () => {
          setIsOpenMenu(!isOpenMenu);
        },
        children: /* @__PURE__ */ jsxDEV(Avatar, { src: avatar, alt: "Profile", sz: "sm-1", className: "border-4 border-bg-third" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
          lineNumber: 79,
          columnNumber: 9
        }, void 0)
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
        lineNumber: 72,
        columnNumber: 7
      },
      void 0
    ),
    isOpenMenu && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: clsx(
          "absolute top-[120%] right-0 bg-bg-second shadow-xl rounded-xl",
          "p-2 z-10 flex flex-col gap-2 min-w-[300px] min-h-[100px]",
          "animate-dropdown-slide origin-top-right"
        ),
        ref: menuRef,
        children: /* @__PURE__ */ jsxDEV(List, { className: clsx("flex flex-col gap-2 w-full"), children: [
          /* @__PURE__ */ jsxDEV(List.Item, { children: /* @__PURE__ */ jsxDEV(
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
                /* @__PURE__ */ jsxDEV(Avatar, { src: avatar, alt: "avatar", sz: "sm-1" }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
                  lineNumber: 102,
                  columnNumber: 17
                }, void 0),
                /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", weight: "bold", children: fullName }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
                  lineNumber: 103,
                  columnNumber: 17
                }, void 0)
              ]
            },
            void 0,
            true,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
              lineNumber: 92,
              columnNumber: 15
            },
            void 0
          ) }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
            lineNumber: 91,
            columnNumber: 13
          }, void 0),
          /* @__PURE__ */ jsxDEV(
            List.Item,
            {
              className: clsx("items-center mx-auto w-[95%] h-[1px] bg-text-main/10 rounded-full")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
              lineNumber: 108,
              columnNumber: 13
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(List.Item, { children: /* @__PURE__ */ jsxDEV(
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
              children: /* @__PURE__ */ jsxDEV(Text, { className: clsx("flex items-center gap-3"), sz: "md-1", children: [
                /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-gear" }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
                  lineNumber: 123,
                  columnNumber: 19
                }, void 0),
                t("navbar.profileMenu.settings")
              ] }, void 0, true, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
                lineNumber: 122,
                columnNumber: 17
              }, void 0)
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
              lineNumber: 112,
              columnNumber: 15
            },
            void 0
          ) }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
            lineNumber: 111,
            columnNumber: 13
          }, void 0),
          /* @__PURE__ */ jsxDEV(List.Item, { children: /* @__PURE__ */ jsxDEV(
            Button,
            {
              sz: "md-1",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start w-full gap-3 text-red-400",
                "hover:!bg-red-50 transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handleLogout,
              children: /* @__PURE__ */ jsxDEV(Text, { sz: "md-1", className: clsx("flex items-center gap-3"), color: "danger", children: [
                /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-right-from-bracket" }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
                  lineNumber: 140,
                  columnNumber: 19
                }, void 0),
                t("navbar.profileMenu.logout")
              ] }, void 0, true, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
                lineNumber: 139,
                columnNumber: 17
              }, void 0)
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
              lineNumber: 129,
              columnNumber: 15
            },
            void 0
          ) }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
            lineNumber: 128,
            columnNumber: 13
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
          lineNumber: 90,
          columnNumber: 11
        }, void 0)
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
        lineNumber: 82,
        columnNumber: 9
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/user/components/user-menu.tsx",
    lineNumber: 71,
    columnNumber: 5
  }, void 0);
};
const PREFIX = `/api/notification`;
class NotificationService {
  async getNotifications(cursorId, pageSize) {
    try {
      const res = await apiClient.get(`${PREFIX}/getNotifications`, {
        params: {
          cursorId,
          pageSize
        }
      });
      const response = res.data;
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async markAsRead(notificationId) {
    try {
      await apiClient.post(`${PREFIX}/markNotificationAsRead/${notificationId}`);
      return {
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
}
const notificationService = new NotificationService();
const NotificationSkeleton = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex items-center"), children: [
    /* @__PURE__ */ jsxDEV(Skeleton, { sz: "md-2", variant: "circle" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/notification.skeleton.tsx",
      lineNumber: 7,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col w-full flex-1 gap-2 ml-2"), children: [
      /* @__PURE__ */ jsxDEV(Skeleton, { className: clsx("w-full"), sz: "sm-2" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/notification.skeleton.tsx",
        lineNumber: 9,
        columnNumber: 9
      }, void 0),
      /* @__PURE__ */ jsxDEV(Skeleton, { className: clsx("w-[50%]"), sz: "sm-2" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/notification.skeleton.tsx",
        lineNumber: 10,
        columnNumber: 9
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/notification.skeleton.tsx",
      lineNumber: 8,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-items/notification.skeleton.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};
const useNotifications = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();
  const { pageSize, cursorId } = useSelector((state) => state.notifications);
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const res = await notificationService.getNotifications(cursorId, pageSize);
      await new Promise((resolve) => setTimeout(resolve, 1e5));
      dispatch(loadNotifications(res.data));
      return res.data;
    },
    staleTime: 1e3 * 60 * 5,
    enabled: !!userId
  });
};
const NotificationMenu = ({ className, onClick, ref }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate$1();
  const { isLoading, refetch } = useNotifications();
  const { notifications: notifications2, isInNotificationPage, isFull, isShowFull } = useSelector(
    (state) => state.notifications
  );
  const loaderRef = React.useRef(null);
  useEffect(() => {
    if (!loaderRef.current || isFull) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        await refetch();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, isShowFull, isFull, refetch]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top",
        className
      ),
      ref,
      children: [
        /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", weight: "bold", className: "px-2 pt-2", children: t("notifications:notifications.title") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 53,
          columnNumber: 7
        }, void 0),
        notifications2 && notifications2.length > 0 ? /* @__PURE__ */ jsxDEV("ul", { className: "relative py-1 overflow-y-scroll scrollbar-none", children: [
          isShowFull ? notifications2.map((notification) => /* @__PURE__ */ jsxDEV(
            "li",
            {
              className: clsx(
                "px-2 py-3 hover:bg-bg-fourth rounded-lg cursor-pointer",
                "transition-all duration-200 hover:scale-[1.01]",
                "active:scale-[0.99]"
              ),
              children: /* @__PURE__ */ jsxDEV(
                NotificationFactory,
                {
                  notificationDto: notification,
                  onClick: async () => {
                    navigate(notification.link || "/");
                    dispatch(markAsRead(notification.id));
                    await notificationService.markAsRead(notification.id);
                    onClick?.();
                  }
                },
                void 0,
                false,
                {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
                  lineNumber: 68,
                  columnNumber: 19
                },
                void 0
              )
            },
            notification.id,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
              lineNumber: 60,
              columnNumber: 17
            },
            void 0
          )) : notifications2.slice(0, 5).map((notification) => /* @__PURE__ */ jsxDEV(
            "li",
            {
              className: clsx(
                "px-2 py-3 hover:bg-bg-fourth rounded-lg cursor-pointer",
                "transition-all duration-200 hover:scale-[1.01]",
                "active:scale-[0.99]"
              ),
              children: /* @__PURE__ */ jsxDEV(
                NotificationFactory,
                {
                  notificationDto: notification,
                  onClick: async () => {
                    navigate(notification.link || "/");
                    dispatch(markAsRead(notification.id));
                    await notificationService.markAsRead(notification.id);
                    onClick?.();
                  }
                },
                void 0,
                false,
                {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
                  lineNumber: 88,
                  columnNumber: 19
                },
                void 0
              )
            },
            notification.id,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
              lineNumber: 80,
              columnNumber: 17
            },
            void 0
          )),
          isLoading && [...Array(2)].map((_, i) => /* @__PURE__ */ jsxDEV("li", { className: "mt-1", children: /* @__PURE__ */ jsxDEV(NotificationSkeleton, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 102,
            columnNumber: 17
          }, void 0) }, `skeleton-${i}`, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 101,
            columnNumber: 15
          }, void 0)),
          !isShowFull ? /* @__PURE__ */ jsxDEV("li", { className: "mt-2", children: /* @__PURE__ */ jsxDEV(
            Button,
            {
              sz: "sm-1",
              variant: "fourth",
              className: "w-full",
              onClick: () => {
                dispatch(setShowFull(true));
              },
              children: t("notifications:notifications.showMore")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
              lineNumber: 107,
              columnNumber: 15
            },
            void 0
          ) }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 106,
            columnNumber: 13
          }, void 0) : /* @__PURE__ */ jsxDEV("li", { ref: loaderRef }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 119,
            columnNumber: 13
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 57,
          columnNumber: 9
        }, void 0) : /* @__PURE__ */ jsxDEV(Fragment, { children: !isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center h-40", children: t("notifications:notifications.no-notifications") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 125,
          columnNumber: 13
        }, void 0) : /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col px-2 py-2 gap-3", children: [
          /* @__PURE__ */ jsxDEV(NotificationSkeleton, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 130,
            columnNumber: 15
          }, void 0),
          /* @__PURE__ */ jsxDEV(NotificationSkeleton, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 131,
            columnNumber: 15
          }, void 0),
          /* @__PURE__ */ jsxDEV(NotificationSkeleton, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 132,
            columnNumber: 15
          }, void 0),
          /* @__PURE__ */ jsxDEV(NotificationSkeleton, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 133,
            columnNumber: 15
          }, void 0),
          /* @__PURE__ */ jsxDEV(NotificationSkeleton, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
            lineNumber: 134,
            columnNumber: 15
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 129,
          columnNumber: 13
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 123,
          columnNumber: 9
        }, void 0),
        !isInNotificationPage && /* @__PURE__ */ jsxDEV("div", { className: "absolute right-4", onClick: () => navigate("/notifications"), children: /* @__PURE__ */ jsxDEV(Text, { sz: "sm-1", color: "secondary", className: clsx("cursor-pointer underline"), children: "Mở thông báo" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 142,
          columnNumber: 11
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
          lineNumber: 141,
          columnNumber: 9
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-menu.tsx",
      lineNumber: 45,
      columnNumber: 5
    },
    void 0
  );
};
const NotificationBadge = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadCount, isShowNotification, isInNotificationPage } = useSelector(
    (state) => state.notifications
  );
  const menuRef = React.useRef(null);
  const btnRef = React.useRef(null);
  useClickOutside(menuRef, btnRef, () => {
    if (isShowNotification) dispatch(setShowNotification(false));
  });
  useNotifications();
  const handleToggleNotifications = () => {
    if (window.innerWidth < 640 && !isShowNotification) {
      navigate("/notifications");
      return;
    }
    dispatch(setShowNotification(!isShowNotification));
  };
  const isActive = isShowNotification || isInNotificationPage;
  return /* @__PURE__ */ jsxDEV("div", { className: "relative flex items-center justify-center", children: [
    /* @__PURE__ */ jsxDEV(
      Badge,
      {
        count: unreadCount,
        onClick: handleToggleNotifications,
        ref: btnRef,
        className: clsx({
          "!bg-primary-500/30": isActive
        }),
        children: /* @__PURE__ */ jsxDEV(
          Text,
          {
            className: clsx({
              "!text-primary-500": isActive
            }),
            children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-bell" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-badge.tsx",
              lineNumber: 59,
              columnNumber: 11
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-badge.tsx",
            lineNumber: 54,
            columnNumber: 9
          },
          void 0
        )
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-badge.tsx",
        lineNumber: 46,
        columnNumber: 7
      },
      void 0
    ),
    isShowNotification && !isInNotificationPage && /* @__PURE__ */ jsxDEV(
      NotificationMenu,
      {
        className: clsx(
          "!absolute max-h-[600px] z-10 min-w-[350px] min-h-[100px]",
          "sm:top-[120%] sm:right-0 sm:w-auto sm:h-auto sm:p-2",
          "top-[108%] -right-[70px] w-screen h-screen p-6"
        ),
        onClick: () => dispatch(setShowNotification(!isShowNotification)),
        ref: menuRef
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-badge.tsx",
        lineNumber: 63,
        columnNumber: 9
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/notifications/components/notification-menu/notification-badge.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, void 0);
};
const NavbarItem = ({
  children,
  path,
  activeRoute = true,
  className = "",
  onClick
}) => {
  const isFocused = useActiveRoute(path, activeRoute);
  return /* @__PURE__ */ jsxDEV(
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
        isFocused && /* @__PURE__ */ jsxDEV("div", { className: "absolute bg-primary-500 h-[2px] rounded-full w-full bottom-0 left-0" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-item.tsx",
          lineNumber: 41,
          columnNumber: 9
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-item.tsx",
      lineNumber: 24,
      columnNumber: 5
    },
    void 0
  );
};
const Navbar = ({
  className,
  isAuthenticated,
  onLogin,
  onSignup
}) => {
  const navItems = [
    { icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-house" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
      lineNumber: 23,
      columnNumber: 13
    }, void 0), path: "/", isIndex: true },
    { icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-group" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
      lineNumber: 24,
      columnNumber: 13
    }, void 0), path: "/friends", isIndex: false }
  ];
  const navigate = useNavigate();
  const handleGoToHome = useCallback(() => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      onLogin?.();
    }
  }, [isAuthenticated, navigate]);
  return /* @__PURE__ */ jsxDEV(
    "nav",
    {
      className: clsx(
        "flex items-center justify-between",
        "bg-bg-main p-[2px] shadow-md sm:px-8",
        className
      ),
      children: [
        /* @__PURE__ */ jsxDEV("div", { onClick: handleGoToHome, className: "cursor-pointer items-center gap-2", children: /* @__PURE__ */ jsxDEV(Logo, { hasSlogan: false, sz: "sm-3" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
          lineNumber: 46,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
          lineNumber: 45,
          columnNumber: 7
        }, void 0),
        isAuthenticated ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-row gap-3 flex-1", children: [
          /* @__PURE__ */ jsxDEV("div", { className: clsx("hidden w-full justify-center flex-row", "sm:flex sm:flex-1"), children: navItems.map((item, index) => /* @__PURE__ */ jsxDEV(
            NavbarItem,
            {
              path: item.path,
              className: "!px-10",
              activeRoute: item.isIndex,
              children: item.icon
            },
            index,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
              lineNumber: 52,
              columnNumber: 15
            },
            void 0
          )) }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
            lineNumber: 50,
            columnNumber: 11
          }, void 0),
          /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-row gap-2 flex-1 justify-end sm:flex-none"), children: [
            /* @__PURE__ */ jsxDEV(NotificationBadge, {}, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
              lineNumber: 63,
              columnNumber: 13
            }, void 0),
            /* @__PURE__ */ jsxDEV(UserMenu, {}, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
              lineNumber: 64,
              columnNumber: 13
            }, void 0)
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
            lineNumber: 62,
            columnNumber: 11
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
          lineNumber: 49,
          columnNumber: 9
        }, void 0) : /* @__PURE__ */ jsxDEV("div", { className: "flex flex-row gap-2", children: [
          /* @__PURE__ */ jsxDEV(Button, { sz: "sm-1", variant: "secondary", onClick: () => onLogin?.(), children: "Sign in" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
            lineNumber: 69,
            columnNumber: 11
          }, void 0),
          /* @__PURE__ */ jsxDEV(Button, { sz: "sm-1", variant: "primary", onClick: () => onSignup?.(), children: "Sign up" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
            lineNumber: 72,
            columnNumber: 11
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
          lineNumber: 68,
          columnNumber: 9
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar.tsx",
      lineNumber: 38,
      columnNumber: 5
    },
    void 0
  );
};
const NavbarFooter = ({ className, isAuthenticated }) => {
  const navItems = [
    { icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-house" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-footer.tsx",
      lineNumber: 13,
      columnNumber: 13
    }, void 0), path: "/", isIndex: true },
    { icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-group" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-footer.tsx",
      lineNumber: 14,
      columnNumber: 13
    }, void 0), path: "/friends", isIndex: false }
  ];
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("bg-[var(--third-bg-color)] w-full py-1", className), children: isAuthenticated && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-1 items-center justify-center py-1", children: navItems.map((item, index) => /* @__PURE__ */ jsxDEV(NavbarItem, { path: item.path, activeRoute: item.isIndex, children: item.icon }, index, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-footer.tsx",
    lineNumber: 21,
    columnNumber: 13
  }, void 0)) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-footer.tsx",
    lineNumber: 19,
    columnNumber: 9
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/navbar/navbar-footer.tsx",
    lineNumber: 17,
    columnNumber: 5
  }, void 0);
};
const SubNavbarSection = ({
  title: title2,
  className,
  children
}) => {
  const [showChildren, setShowChildren] = useState(true);
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col gap-2", className), children: [
    title2 && /* @__PURE__ */ jsxDEV(
      Text,
      {
        sz: "lg-1",
        weight: "bold",
        className: clsx("p-2 pl-5 text-gradient-main"),
        onClick: () => setShowChildren(!showChildren),
        children: title2
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar-section.tsx",
        lineNumber: 21,
        columnNumber: 9
      },
      void 0
    ),
    showChildren && /* @__PURE__ */ jsxDEV("div", { className: "animate-dropdown-slide", children }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar-section.tsx",
      lineNumber: 30,
      columnNumber: 24
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar-section.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, void 0);
};
const SubNavbarItem = ({ title: title2, path, onClick }) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);
  return /* @__PURE__ */ jsxDEV(
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
      children: /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col gap-1"), children: /* @__PURE__ */ jsxDEV(
        Text,
        {
          sz: "sm-3",
          className: clsx({
            "!text-primary-500 !font-bold": isFocused
          }),
          children: title2
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar-item.tsx",
          lineNumber: 30,
          columnNumber: 9
        },
        void 0
      ) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar-item.tsx",
        lineNumber: 29,
        columnNumber: 7
      }, void 0)
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar-item.tsx",
      lineNumber: 18,
      columnNumber: 5
    },
    void 0
  );
};
const SubNavbar = ({ className, children }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-col gap-1", className), children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/navigation/sub-navbar/sub-navbar.tsx",
    lineNumber: 14,
    columnNumber: 10
  }, void 0);
};
SubNavbar.Item = SubNavbarItem;
SubNavbar.Section = SubNavbarSection;
const Dialog = ({
  title: title2,
  content,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  onClose,
  className
}) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex flex-col gap-4 bg-[var(--second-bg-color)]",
        "rounded-lg shadow-lg",
        className
      ),
      children: [
        title2 && /* @__PURE__ */ jsxDEV(Text, { weight: "bold", sz: "lg-2", children: title2 }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
          lineNumber: 39,
          columnNumber: 9
        }, void 0),
        content && /* @__PURE__ */ jsxDEV("div", { children: content }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
          lineNumber: 43,
          columnNumber: 19
        }, void 0),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end space-x-2", children: [
          tertiaryButton && /* @__PURE__ */ jsxDEV(Button, { onClick: tertiaryButton.onClick, variant: "secondary", sz: "sm-1", children: tertiaryButton.text }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
            lineNumber: 46,
            columnNumber: 11
          }, void 0),
          secondaryButton && /* @__PURE__ */ jsxDEV(Button, { onClick: secondaryButton.onClick, variant: "secondary", sz: "sm-1", children: secondaryButton.text }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
            lineNumber: 51,
            columnNumber: 11
          }, void 0),
          primaryButton && /* @__PURE__ */ jsxDEV(Button, { onClick: primaryButton.onClick, variant: "primary", sz: "sm-1", children: primaryButton.text }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
            lineNumber: 56,
            columnNumber: 11
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
          lineNumber: 44,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(
          Text,
          {
            className: clsx(
              "absolute top-3 right-5 text-[20px]",
              "text-gradient-main hover:text-single-main",
              "cursor-pointer"
            ),
            onClick: onClose,
            children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-xmark" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
              lineNumber: 69,
              columnNumber: 9
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
            lineNumber: 61,
            columnNumber: 7
          },
          void 0
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/dialog.tsx",
      lineNumber: 31,
      columnNumber: 5
    },
    void 0
  );
};
function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
const GlobalDialog = () => {
  const { isOpen, dialogProps, closeDialog } = useDialog();
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx("fixed z-[9998] inset-0 flex items-center justify-center", "bg-bg-overlay"),
      children: /* @__PURE__ */ jsxDEV(Dialog, { ...dialogProps, onClose: closeDialog }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/global-dialog.tsx",
        lineNumber: 14,
        columnNumber: 7
      }, void 0)
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/organisms/dialog/global-dialog.tsx",
      lineNumber: 11,
      columnNumber: 5
    },
    void 0
  );
};
const RegisterForm = ({
  className,
  showLogo = true,
  showClose = false,
  onClose
}) => {
  const { t } = useTranslation();
  const [isShowClose] = React.useState(showClose);
  const [isShowLogo] = React.useState(showLogo);
  useNavigate();
  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      await authService.register({
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.email,
        phoneNumber: values.phoneNumber
      });
    }
  });
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex flex-col items-center justify-center gap-3 w-[450px]",
        "bg-bg-second rounded-2xl",
        "p-12 animate-fade-in overflow-hidden",
        className
      ),
      onSubmit: formik.submitForm,
      children: [
        formik.isSubmitting && /* @__PURE__ */ jsxDEV(OverlayLoading, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 59,
          columnNumber: 31
        }, void 0),
        isShowLogo && /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 61,
          columnNumber: 22
        }, void 0),
        /* @__PURE__ */ jsxDEV(
          Text,
          {
            sz: "xl-1",
            weight: "extrabold",
            className: "uppercase !text-primary-500 select-none text-center",
            children: t("auth:register.title")
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
            lineNumber: 63,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              value: formik.values.username,
              autoComplete: "username",
              className: "text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm",
              placeholder: t("auth:register.username"),
              onChange: (e) => formik.setFieldValue("username", e.target.value),
              isWrong: formik.touched.username && Boolean(formik.errors.username),
              wrongMessage: t(formik.errors.username || "")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 71,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              value: formik.values.email,
              autoComplete: "email",
              className: "text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm",
              placeholder: t("auth:register.email"),
              onChange: (e) => formik.setFieldValue("email", e.target.value),
              isWrong: formik.touched.email && Boolean(formik.errors.email),
              wrongMessage: t(formik.errors.email || "")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 80,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              value: formik.values.phoneNumber,
              autoComplete: "tel",
              className: "text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm",
              placeholder: t("auth:register.phoneNumber"),
              onChange: (e) => formik.setFieldValue("phoneNumber", e.target.value),
              isWrong: formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber),
              wrongMessage: t(formik.errors.phoneNumber || "")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 89,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              type: "password",
              value: formik.values.password,
              className: "text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm",
              placeholder: t("auth:register.password"),
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              isWrong: formik.touched.password && Boolean(formik.errors.password),
              wrongMessage: t(formik.errors.password || "")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 98,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            Textbox,
            {
              type: "password",
              value: formik.values.confirmPassword,
              className: "text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm",
              placeholder: t("auth:register.confirmPassword"),
              onChange: (e) => formik.setFieldValue("confirmPassword", e.target.value),
              isWrong: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword),
              wrongMessage: t(formik.errors.confirmPassword || "")
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 107,
              columnNumber: 9
            },
            void 0
          )
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 70,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(
          Checkbox,
          {
            className: "text-[15px] text-single-third gap-[8px]",
            label: /* @__PURE__ */ jsxDEV(Text, { className: "flex items-center flex-wrap", children: [
              t("auth:register.agree"),
              " ",
              /* @__PURE__ */ jsxDEV(Link, { className: "sm:text-[15px]", to: "/terms", children: t("auth:register.termsOfService") }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
                lineNumber: 122,
                columnNumber: 13
              }, void 0),
              " ",
              t("auth:register.and"),
              " ",
              /* @__PURE__ */ jsxDEV(Link, { className: "sm:text-[15px]", to: "/policy", children: t("auth:register.privacyPolicy") }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
                lineNumber: 127,
                columnNumber: 13
              }, void 0),
              "."
            ] }, void 0, true, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 120,
              columnNumber: 11
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
            lineNumber: 117,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV(Button, { type: "button", sz: "md-1", className: "w-full", onClick: formik.submitForm, children: /* @__PURE__ */ jsxDEV(Text, { children: t("auth:register.registerButton") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 135,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 134,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV("div", { className: "w-full flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center w-full gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-border-main flex-1" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 139,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", className: "text-text-third", children: "OR" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 140,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-border-main flex-1" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 143,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
            lineNumber: 138,
            columnNumber: 9
          }, void 0),
          /* @__PURE__ */ jsxDEV(SocialButtons, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
            lineNumber: 145,
            columnNumber: 9
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 137,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(Link, { className: "font-bold", to: "/login", children: t("auth:register.loginButton") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
          lineNumber: 147,
          columnNumber: 7
        }, void 0),
        isShowClose && /* @__PURE__ */ jsxDEV(
          Text,
          {
            sz: "lg-1",
            className: clsx(
              "absolute z-50 top-3 right-5 text-gradient-main hover:text-single-main cursor-pointer"
            ),
            onClick: onClose,
            children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-xmark" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
              lineNumber: 158,
              columnNumber: 11
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
            lineNumber: 151,
            columnNumber: 9
          },
          void 0
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/auth/components/register-form.tsx",
      lineNumber: 49,
      columnNumber: 5
    },
    void 0
  );
};
function RegisterPage() {
  useEffect(() => {
    document.title = "Register - Fatagram";
  }, []);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx("relative flex h-screen w-screen bg-bg-main", "justify-center items-center"),
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 filter blur-lg opacity-80 background-image" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/register/register-page.tsx",
          lineNumber: 17,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: clsx("relative flex items-center bg-bg-second", "rounded-3xl overflow-hidden"),
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative hidden sm:block flex-1 login-bg w-[1000px] h-[800px]", children: /* @__PURE__ */ jsxDEV(Text, { sz: "xl-3", className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", children: "Feeling" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/register/register-page.tsx",
                lineNumber: 22,
                columnNumber: 11
              }, this) }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/register/register-page.tsx",
                lineNumber: 21,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV(RegisterForm, { className: "min-h-[700px] max-h-[800px]" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/register/register-page.tsx",
                lineNumber: 26,
                columnNumber: 9
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/register/register-page.tsx",
            lineNumber: 18,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/register/register-page.tsx",
      lineNumber: 14,
      columnNumber: 5
    },
    this
  );
}
function LoginPage() {
  const [forgotPassword, setForgotPassword] = React.useState(false);
  useEffect(() => {
    document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
  }, [forgotPassword]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex h-screen w-screen bg-bg-main",
        "justify-center items-center"
      ),
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 filter blur-lg opacity-80 background-image" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/login/login-page.tsx",
          lineNumber: 24,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: clsx(
              "relative flex items-center bg-bg-second",
              "rounded-3xl overflow-hidden"
            ),
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative hidden sm:block flex-1 login-bg w-[1000px] h-[800px]", children: /* @__PURE__ */ jsxDEV(
                Text,
                {
                  sz: "xl-3",
                  className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  children: "Feeling"
                },
                void 0,
                false,
                {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/login/login-page.tsx",
                  lineNumber: 32,
                  columnNumber: 11
                },
                this
              ) }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/login/login-page.tsx",
                lineNumber: 31,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV(
                LoginForm,
                {
                  className: "min-h-[700px]",
                  switchForgotPassword: () => setForgotPassword(true)
                },
                void 0,
                false,
                {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/login/login-page.tsx",
                  lineNumber: 39,
                  columnNumber: 9
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/login/login-page.tsx",
            lineNumber: 25,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/login/login-page.tsx",
      lineNumber: 18,
      columnNumber: 5
    },
    this
  );
}
const FriendsNavbar = ({ className, onSelect }) => {
  const { t } = useTranslation();
  const friendPageItems = [
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-plus" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friends-navbar.tsx",
        lineNumber: 24,
        columnNumber: 13
      }, void 0),
      name: t("friends:navbar.suggestedFriends"),
      path: "/friends"
    },
    {
      icon: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-check" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friends-navbar.tsx",
        lineNumber: 29,
        columnNumber: 13
      }, void 0),
      name: t("friends:navbar.invite"),
      path: "requests"
    }
  ];
  return /* @__PURE__ */ jsxDEV(PageNavbar, { title: t("friends:navbar.title"), className: clsx("bg-bg-second", className), children: /* @__PURE__ */ jsxDEV(PageNavbar.Section, { children: friendPageItems.map((item, index) => /* @__PURE__ */ jsxDEV(
    PageNavbar.Item,
    {
      path: item.path,
      icon: item.icon,
      title: item.name,
      onClick: onSelect
    },
    index,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friends-navbar.tsx",
      lineNumber: 39,
      columnNumber: 11
    },
    void 0
  )) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friends-navbar.tsx",
    lineNumber: 37,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friends-navbar.tsx",
    lineNumber: 36,
    columnNumber: 5
  }, void 0);
};
const FriendPage = () => {
  const { t } = useTranslation();
  const [isShowNavbar, setIsShowNavbar] = React.useState(true);
  useEffect(() => {
    document.title = t("friends:title");
  }, [t]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex flex-col sm:flex-row w-full h-full",
        "bg-[var(--second-bg-color)] sm:gap-4"
      ),
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full inset-0 z-10 h-[50px] flex sm:hidden px-2"), children: /* @__PURE__ */ jsxDEV(Text, { sz: "lg-3", children: /* @__PURE__ */ jsxDEV(
          "i",
          {
            className: "fa-solid fa-list text-gradient-main",
            onClick: () => setIsShowNavbar(!isShowNavbar)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
            lineNumber: 27,
            columnNumber: 11
          },
          void 0
        ) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
          lineNumber: 26,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
          lineNumber: 25,
          columnNumber: 7
        }, void 0),
        isShowNavbar && /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: clsx("sm:hidden z-9998 block fixed bg-black/50 w-screen h-screen"),
            onClick: () => setIsShowNavbar(false)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
            lineNumber: 34,
            columnNumber: 9
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV(
          FriendsNavbar,
          {
            className: clsx(
              "sm:flex sm:w-[300px] sm:fixed absolute sm:animate-none",
              "animate-left-to-right w-[60%]",
              "shadow-lg h-full bg-[var(--main-bg-color)] p-2",
              {
                "absolute z-30": isShowNavbar,
                hidden: !isShowNavbar
              }
            ),
            onSelect: () => setIsShowNavbar(false)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
            lineNumber: 39,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV("div", { className: clsx("sm:col-span-8 flex justify-center flex-1 ml-[300px]"), children: /* @__PURE__ */ jsxDEV("div", { className: clsx("max-w-[1000px] w-full p-2"), children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
          lineNumber: 53,
          columnNumber: 11
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
          lineNumber: 52,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
          lineNumber: 51,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/friends/friends-page.tsx",
      lineNumber: 19,
      columnNumber: 5
    },
    void 0
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
  const handleNavigate = () => {
    navigate(path);
  };
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "flex flex-col items-start bg-bg-main",
        "sm:w-[calc(25%-6px)]",
        "w-[calc(50%-4px)]",
        "sm:min-w-[220px] h-auto",
        "rounded-2xl shadow-lg p-4 gap-1"
      ),
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-full cursor-pointer", onClick: handleNavigate, children: /* @__PURE__ */ jsxDEV(Avatar, { src: avatar, alt: "avatar", shape: "rounded", className: "w-full" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
          lineNumber: 42,
          columnNumber: 9
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
          lineNumber: 41,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(
          Text,
          {
            sz: "md-2",
            weight: "bold",
            onClick: handleNavigate,
            className: clsx("truncate overflow-hidden w-full"),
            children: name
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
            lineNumber: 44,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV(Text, { sz: "sm-1", weight: "light", children: time2 }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
          lineNumber: 52,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(Button, { variant: "primary", sz: "sm-1", className: clsx("w-full mt-2 mb-1"), onClick: onAccept, children: t("user:profileHeader:acceptButton") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
          lineNumber: 55,
          columnNumber: 7
        }, void 0),
        /* @__PURE__ */ jsxDEV(Button, { variant: "fourth", sz: "sm-1", className: clsx("w-full mt-2r"), onClick: onCancel, children: t("user:profileHeader:declineButton") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
          lineNumber: 58,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/components/friend-request-item.tsx",
      lineNumber: 32,
      columnNumber: 5
    },
    void 0
  );
};
const FriendRequests = ({ className }) => {
  const [requests, setRequests] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(8);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFull, setIsFull] = React.useState(false);
  const loaderRef = React.useRef(null);
  const [total, setTotal] = React.useState(0);
  const { t } = useTranslation();
  const fetchFriendRequests = React.useCallback(async () => {
    setIsLoading(true);
    const response = await friendshipService.GetFriendRequests(page, limit);
    if (response.success) {
      setRequests((prev) => [...prev, ...response.data?.friendRequests ?? []]);
      setTotal(response.data?.total ?? 0);
      if (response.data?.friendRequests.length && response.data?.friendRequests.length < limit) {
        setIsFull(true);
      }
    }
    setIsLoading(false);
  }, [page, limit]);
  const handleAcceptRequest = useCallback(async (requestId) => {
    const response = await friendshipService.AcceptAddFriendRequest(requestId);
    if (response.success) {
      setRequests(
        (prevRequests) => prevRequests.filter((request) => request.senderId !== requestId)
      );
      setTotal((prevTotal) => prevTotal - 1);
    }
  }, []);
  const handleRejectRequest = useCallback(async (senderId) => {
    const response = await friendshipService.DeclineAddFriendRequest(senderId);
    if (response.success) {
      setRequests(
        (prevRequests) => prevRequests.filter((request) => request.senderId !== senderId)
      );
      setTotal((prevTotal) => prevTotal - 1);
    }
  }, []);
  useEffect(() => {
    setIsLoading(true);
    fetchFriendRequests();
  }, [fetchFriendRequests]);
  useEffect(() => {
    if (!loaderRef.current || isFull) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, isFull]);
  return /* @__PURE__ */ jsxDEV(Card, { title: `Danh sách lời mời (${total})`, className, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 h-full w-full", children: requests.length > 0 ? /* @__PURE__ */ jsxDEV(Fragment, { children: requests.map((request, index) => /* @__PURE__ */ jsxDEV(
      FriendRequestItem,
      {
        name: request.senderName,
        avatar: request.senderAvatar,
        path: `/${request.senderUrlName || request.senderId}`,
        time: request.createdAt.unit === TimeUnit.Seconds || request.createdAt.unit === TimeUnit.Miliseconds ? t("times:just_now") : `${t(
          `${TimeUnitTranslateMap[request.createdAt.unit]}.${request.createdAt.value === 1 ? "one" : "other"}`,
          { count: request.createdAt.value }
        )} 
                                        ${t("times:ago")}`,
        onAccept: () => handleAcceptRequest(request.senderId),
        onCancel: () => handleRejectRequest(request.senderId)
      },
      index,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
        lineNumber: 103,
        columnNumber: 15
      },
      void 0
    )) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
      lineNumber: 101,
      columnNumber: 11
    }, void 0) : /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", children: t("friends:friendRequest.noRequests") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
      lineNumber: 126,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
      lineNumber: 99,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { ref: loaderRef, className: "w-full h-0" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
      lineNumber: 130,
      columnNumber: 7
    }, void 0),
    isLoading && /* @__PURE__ */ jsxDEV("div", { className: clsx("flex justify-center items-center w-full h-10 gap-1 mt-5"), children: [
      /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: clsx(
            "w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0s]"
          )
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
          lineNumber: 133,
          columnNumber: 11
        },
        void 0
      ),
      /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: clsx(
            "w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0.2s]"
          )
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
          lineNumber: 138,
          columnNumber: 11
        },
        void 0
      ),
      /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: clsx(
            "w-2 h-2 rounded-full bg-[var(--text-color)] animate-bounce [animation-delay:0.4s]"
          )
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
          lineNumber: 143,
          columnNumber: 11
        },
        void 0
      )
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
      lineNumber: 132,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/components/friend-request.tsx",
    lineNumber: 98,
    columnNumber: 5
  }, void 0);
};
const FriendRequests$1 = React.memo(FriendRequests);
const RequestsPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center w-full", children: /* @__PURE__ */ jsxDEV(FriendRequests$1, { className: "w-full" }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/requests-page.tsx",
    lineNumber: 9,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/friends/requests/requests-page.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, void 0);
};
const RequestsPage$1 = React.memo(RequestsPage);
const friendsRoutes = {
  path: "/friends",
  element: /* @__PURE__ */ jsxDEV(FriendPage, {}, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/friends.routes.tsx",
    lineNumber: 7,
    columnNumber: 12
  }, void 0),
  type: "private",
  children: [
    {
      path: "requests",
      element: /* @__PURE__ */ jsxDEV(RequestsPage$1, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/friends.routes.tsx",
        lineNumber: 12,
        columnNumber: 16
      }, void 0),
      keepAlive: true
    }
  ]
};
const NotificationsPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setInNotificationPage(true));
    return () => {
      dispatch(setInNotificationPage(false));
      dispatch(setShowNotification(false));
    };
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("relative flex items-start justify-center w-full h-full mt-1"), children: /* @__PURE__ */ jsxDEV(NotificationMenu, { className: clsx("h-full max-w-[600px] w-full px-2 py-4 pb-2 mx-4") }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/notifications/notifications-page.tsx",
    lineNumber: 24,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/notifications/notifications-page.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, void 0);
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
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "bg-bg-fourth transition-all duration-200 ease hover:bg-bg-fourth/40",
        "rounded-lg px-4 py-2 cursor-pointer text-[13px]",
        className
      ),
      onClick: handleClick,
      children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept,
            multiple,
            className: "hidden",
            onChange: handleChange,
            title: "Select a file"
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/select-file/select-file.tsx",
            lineNumber: 40,
            columnNumber: 7
          },
          void 0
        ),
        children
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/select-file/select-file.tsx",
      lineNumber: 32,
      columnNumber: 5
    },
    void 0
  );
};
function useUserId(userParam) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-profile-id", userParam],
    queryFn: async ({ signal }) => {
      const timeoutId = setTimeout(() => {
        if (signal) {
          const controller = signal;
          controller.abort?.();
        }
      }, 1e4);
      try {
        const response = await userProfileService.GetProfile(userParam, "id");
        clearTimeout(timeoutId);
        console.log("Fetch userId for", userParam, response);
        if (response.success) {
          return {
            userId: response.data.infos.id,
            userExist: true
          };
        }
        return {
          userId: void 0,
          userExist: false
        };
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("Error fetching userId:", error);
        return {
          userId: void 0,
          userExist: false
        };
      }
    },
    staleTime: 1e3 * 60 * 5,
    gcTime: 1e3 * 60 * 10,
    enabled: !!userParam,
    retry: 1
  });
  return {
    userId: data?.userId,
    userExist: isError ? false : data?.userExist,
    isLoading
  };
}
const ProfilePageContext = createContext({
  isOwner: false,
  targetId: "",
  userParam: void 0
});
function ProfilePageProvider({ children }) {
  const { userId } = useAuth();
  const { increment, decrement } = useLoading();
  const userParam = useParams();
  const { userId: targetId, userExist, isLoading } = useUserId(userParam.userParam || "");
  const prevLoadingRef = useRef(null);
  const cachedTargetIdRef = useRef(void 0);
  if (targetId) {
    cachedTargetIdRef.current = targetId;
  }
  useEffect(() => {
    if (isLoading !== prevLoadingRef.current) {
      if (isLoading) {
        increment();
      } else if (prevLoadingRef.current !== null) {
        decrement();
      }
      prevLoadingRef.current = isLoading;
    }
  }, [isLoading, increment, decrement]);
  const validTargetId = targetId || cachedTargetIdRef.current || "";
  const contextValue = useMemo(
    () => ({
      isOwner: userId === validTargetId,
      targetId: validTargetId,
      userParam: userParam.userParam
    }),
    [userId, validTargetId, userParam.userParam]
  );
  if (userExist === false) {
    return /* @__PURE__ */ jsxDEV(NotFoundPage, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/context/profile-page-context.tsx",
      lineNumber: 68,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(ProfilePageContext.Provider, { value: contextValue, children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/context/profile-page-context.tsx",
    lineNumber: 72,
    columnNumber: 10
  }, this);
}
function useProfilePage() {
  const context = useContext(ProfilePageContext);
  if (!context) {
    throw new Error("useProfilePage must be used within a ProfilePageProvider");
  }
  return context;
}
const ProfileBackground = ({
  isLoading,
  background,
  handleSelectBackground
}) => {
  const { t } = useTranslation();
  const { isOwner } = useProfilePage();
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("relative aspect-[16/6] w-full rounded-[15px]"), children: isLoading ? /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-full" }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-background.tsx",
    lineNumber: 27,
    columnNumber: 9
  }, void 0) : /* @__PURE__ */ jsxDEV(
    BackgroundImage,
    {
      src: background,
      alt: "Background Image",
      className: clsx("relative h-full w-full"),
      children: isOwner && /* @__PURE__ */ jsxDEV(
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
            /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid fa-camera") }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-background.tsx",
              lineNumber: 44,
              columnNumber: 15
            }, void 0),
            /* @__PURE__ */ jsxDEV(Text, { className: clsx("sm:flex hidden"), sz: "md-1", children: background ? t("user:profileHeader.changeButton") : t("user:profileHeader.addButton") }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-background.tsx",
              lineNumber: 45,
              columnNumber: 15
            }, void 0)
          ]
        },
        void 0,
        true,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-background.tsx",
          lineNumber: 35,
          columnNumber: 13
        },
        void 0
      )
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-background.tsx",
      lineNumber: 29,
      columnNumber: 9
    },
    void 0
  ) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-background.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, void 0);
};
const ProfileAvatar = ({
  isLoading,
  avatar,
  className,
  ref,
  handleSelectAvatar
}) => {
  const { isOwner } = useProfilePage();
  return /* @__PURE__ */ jsxDEV("div", { className: clsx$1("relative", className), ref, children: isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "bg-bg-main rounded-full", children: /* @__PURE__ */ jsxDEV(Skeleton, { className: "border-4 border-bg-main h-[192px]", variant: "circle" }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-avatar.tsx",
    lineNumber: 26,
    columnNumber: 11
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-avatar.tsx",
    lineNumber: 25,
    columnNumber: 9
  }, void 0) : /* @__PURE__ */ jsxDEV(
    Avatar,
    {
      src: avatar,
      alt: "Avatar",
      sz: "lg-2",
      className: "border-4 border-bg-main flex-shrink-0"
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-avatar.tsx",
      lineNumber: 29,
      columnNumber: 9
    },
    void 0
  ) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-avatar.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, void 0);
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
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("rounded-2xl p-2 bg-bg-seventh", className), ref, children: [
    showPolygon && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: clsx(
          "absolute hidden sm:flex sm:-top-2 sm:left-[10%] -translate-x-1/2 w-0 h-0",
          "border-l-8 border-l-transparent",
          "border-r-8 border-r-transparent",
          "border-b-8 border-b-bg-seventh rounded-sm"
        )
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/dropdown/dropdown.tsx",
        lineNumber: 34,
        columnNumber: 9
      },
      void 0
    ),
    /* @__PURE__ */ jsxDEV("ul", { className: "flex flex-col gap-1 w-full", children: items.map((item, index) => /* @__PURE__ */ jsxDEV(
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
      index,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/dropdown/dropdown.tsx",
        lineNumber: 45,
        columnNumber: 11
      },
      void 0
    )) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/dropdown/dropdown.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/molecules/dropdown/dropdown.tsx",
    lineNumber: 32,
    columnNumber: 5
  }, void 0);
};
const FriendButton = ({ uid, sz = "md-1" }) => {
  const { t } = useTranslation();
  if (!useAuth().isAuthenticated) return null;
  const [friendshipStatus, setFriendshipStatus] = useState("None");
  const [isShowFriendOptions, setIsShowFriendOptions] = useState(false);
  const [isShowRequestOptions, setIsShowRequestOptions] = useState(false);
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
  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      const response = await friendshipService.GetFriendshipStatus(uid ? uid : "");
      if (response.success) {
        setFriendshipStatus(response.data?.status ?? "None");
      }
    };
    fetchFriendshipStatus();
  }, [uid, friendshipService, setFriendshipStatus]);
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
        content: /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-user-xmark", "mr-2") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
            lineNumber: 107,
            columnNumber: 13
          }, void 0),
          " ",
          t("user:profileHeader.unfriendButton")
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
          lineNumber: 106,
          columnNumber: 11
        }, void 0),
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
        content: /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-check", "mr-2") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
            lineNumber: 126,
            columnNumber: 13
          }, void 0),
          " ",
          t("user:profileHeader.acceptButton")
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
          lineNumber: 125,
          columnNumber: 11
        }, void 0),
        onClick: async () => await handleAcceptAddFriendRequest?.(uid)
      },
      {
        id: "cancelRequest",
        content: /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-xmark", "mr-2") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, void 0),
          " ",
          t("user:profileHeader.declineButton")
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, void 0),
        onClick: async () => await handleDeclineAddFriendRequest?.(uid)
      }
    ],
    [uid, handleAcceptAddFriendRequest, handleDeclineAddFriendRequest, t]
  );
  return /* @__PURE__ */ jsxDEV("div", { children: friendshipStatus === "None" ? /* @__PURE__ */ jsxDEV(Button, { sz, onClick: handleSentAddFriendRequest, children: [
    /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-plus") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
      lineNumber: 150,
      columnNumber: 11
    }, void 0),
    " ",
    t("user:profileHeader.addFriendButton")
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
    lineNumber: 149,
    columnNumber: 9
  }, void 0) : friendshipStatus === "SentByMe" ? /* @__PURE__ */ jsxDEV(Button, { sz, onClick: handleCancelAddFriendRequest, children: [
    /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-xmark") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
      lineNumber: 154,
      columnNumber: 11
    }, void 0),
    " ",
    t("user:profileHeader.cancelRequestButton")
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
    lineNumber: 153,
    columnNumber: 9
  }, void 0) : friendshipStatus === "SentByThem" ? /* @__PURE__ */ jsxDEV("div", { className: clsx("sm:relative", "z-50"), children: [
    /* @__PURE__ */ jsxDEV(
      Button,
      {
        sz,
        ref: btnRequestRef,
        onClick: () => {
          setIsShowRequestOptions(!isShowRequestOptions);
        },
        children: [
          /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-reply") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
            lineNumber: 166,
            columnNumber: 13
          }, void 0),
          " ",
          t("user:profileHeader.respondRequestButton")
        ]
      },
      void 0,
      true,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
        lineNumber: 159,
        columnNumber: 11
      },
      void 0
    ),
    /* @__PURE__ */ jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
        lineNumber: 169,
        columnNumber: 11
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
    lineNumber: 158,
    columnNumber: 9
  }, void 0) : /* @__PURE__ */ jsxDEV("div", { className: clsx("sm:relative", "z-50"), children: [
    /* @__PURE__ */ jsxDEV(
      Button,
      {
        sz,
        ref: btnFriendRef,
        onClick: () => {
          setIsShowFriendOptions(!isShowFriendOptions);
        },
        children: [
          /* @__PURE__ */ jsxDEV("i", { className: clsx("fa-solid", "fa-user-check") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, void 0),
          " ",
          t("user:profileHeader.friendButton")
        ]
      },
      void 0,
      true,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
        lineNumber: 189,
        columnNumber: 11
      },
      void 0
    ),
    /* @__PURE__ */ jsxDEV(
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
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
        lineNumber: 199,
        columnNumber: 11
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
    lineNumber: 188,
    columnNumber: 9
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/friend-button.tsx",
    lineNumber: 147,
    columnNumber: 5
  }, void 0);
};
const ProfileHeader = ({ className, onUserNotFound }) => {
  const [fullName, setFullName] = React.useState("");
  const [nickname, setNickname] = React.useState(null);
  const [avatar, setAvatar] = React.useState("");
  const [background, setBackground] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingNumOfFriends, setIsLoadingNumOfFriends] = React.useState(true);
  const [numberOfFriends, setNumberOfFriends] = React.useState(0);
  const avtRef = useRef(null);
  const t = useLanguage();
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialog();
  const { targetId, isOwner } = useProfilePage();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const response = await userProfileService.GetProfile(
        targetId,
        "avatar,background,fullName,nickname"
      );
      if (response.success) {
        setFullName(response.data.infos.fullName);
        setNickname(response.data.infos.nickname);
      } else {
        onUserNotFound?.();
      }
      setIsLoading(false);
    };
    const fetchNumberOfFriends = async () => {
      setIsLoadingNumOfFriends(true);
      const response = await friendshipService.GetNumberOfFriends(targetId);
      if (response.success) {
        setNumberOfFriends(response.data?.numberOfFriends ?? 0);
      }
      setIsLoadingNumOfFriends(false);
    };
    if (targetId) {
      fetchProfile();
      fetchNumberOfFriends();
    }
  }, [targetId, onUserNotFound, friendshipService]);
  const handleSelectBackground = useCallback(
    async (file) => {
      const result = await userProfileService.UploadBackground(file);
      if (result.success) ;
      else if (result.errorCode === "LARGE_FILE_ERROR") {
        openDialog({
          title: t("user:profileHeader.oversizeErrorTitle"),
          content: t("user:profileHeader.oversizeErrorMessage"),
          primaryButton: {
            text: t("user:profileHeader.oversizeErrorButton"),
            onClick: closeDialog
          }
        });
      }
    },
    [openDialog, closeDialog, t]
  );
  const handleSelectAvatar = useCallback(
    async (file) => {
      const result = await userProfileService.UploadAvatar(file);
      if (result.success) {
        setAvatar(result.data);
      } else if (result.errorCode === "LARGE_FILE_ERROR") {
        openDialog({
          title: t("user:profileHeader.oversizeErrorTitle"),
          content: t("user:profileHeader.oversizeErrorMessage"),
          primaryButton: {
            text: t("user:profileHeader.oversizeErrorButton"),
            onClick: closeDialog
          }
        });
      }
    },
    [openDialog, closeDialog, t]
  );
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("relative w-full flex flex-col items-center", className), children: [
    /* @__PURE__ */ jsxDEV("div", { className: "relative w-full mt-2", children: /* @__PURE__ */ jsxDEV(
      ProfileBackground,
      {
        isLoading,
        background,
        handleSelectBackground
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
        lineNumber: 126,
        columnNumber: 9
      },
      void 0
    ) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
      lineNumber: 125,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "-mt-[80px] flex w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end mb-5 lg:gap-0 gap-3", children: [
      /* @__PURE__ */ jsxDEV(
        ProfileAvatar,
        {
          isLoading,
          avatar,
          handleSelectAvatar,
          ref: avtRef
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
          lineNumber: 134,
          columnNumber: 9
        },
        void 0
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-2 items-start flex-1 mb-3 ml-4", children: [
        isLoading ? /* @__PURE__ */ jsxDEV(Skeleton, { sz: "sm-3", className: "w-56" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
          lineNumber: 142,
          columnNumber: 13
        }, void 0) : /* @__PURE__ */ jsxDEV(Text, { sz: "xl-1", weight: "bold", className: "lg:text-left text-center break-words", children: [
          fullName,
          nickname && /* @__PURE__ */ jsxDEV(Text, { sz: "lg-3", weight: "light", className: "lg:text-left text-center lg:ml-2", children: [
            "(",
            nickname,
            ")"
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
            lineNumber: 147,
            columnNumber: 17
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
          lineNumber: 144,
          columnNumber: 13
        }, void 0),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center w-full lg:flex-row", children: [
          !isLoadingNumOfFriends ? /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", weight: "semibold", className: "text-[var(--text-color)] opacity-70", children: numberOfFriends > 0 ? numberOfFriends + " " + t("user:profileHeader.friendsCount") : t("user:profileHeader.noFriendsCount") }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, void 0) : /* @__PURE__ */ jsxDEV(Skeleton, { sz: "sm-3", className: "w-36" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
            lineNumber: 162,
            columnNumber: 15
          }, void 0),
          !isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap flex-row gap-2 mt-2 lg:ml-auto lg:mt-0", children: [
            isAuthenticated && /* @__PURE__ */ jsxDEV(Fragment, { children: isOwner ? /* @__PURE__ */ jsxDEV(
              Button,
              {
                sz: "sm-1",
                onClick: () => {
                  navigate(`/settings`);
                },
                children: [
                  /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-pen" }, void 0, false, {
                    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
                    lineNumber: 175,
                    columnNumber: 25
                  }, void 0),
                  " ",
                  t("user:profileHeader.editButton")
                ]
              },
              void 0,
              true,
              {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
                lineNumber: 169,
                columnNumber: 23
              },
              void 0
            ) : /* @__PURE__ */ jsxDEV(FriendButton, { sz: "sm-1", uid: targetId }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
              lineNumber: 179,
              columnNumber: 23
            }, void 0) }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
              lineNumber: 167,
              columnNumber: 19
            }, void 0),
            !isOwner && isAuthenticated && /* @__PURE__ */ jsxDEV(Button, { sz: "sm-1", variant: "secondary", children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-comment" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
                lineNumber: 186,
                columnNumber: 21
              }, void 0),
              " ",
              t("user:profileHeader.messageButton")
            ] }, void 0, true, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
              lineNumber: 185,
              columnNumber: 19
            }, void 0),
            /* @__PURE__ */ jsxDEV(Button, { sz: "sm-1", variant: "secondary", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-circle-info" }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
              lineNumber: 190,
              columnNumber: 19
            }, void 0) }, void 0, false, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
              lineNumber: 189,
              columnNumber: 17
            }, void 0)
          ] }, void 0, true, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
            lineNumber: 165,
            columnNumber: 15
          }, void 0) : /* @__PURE__ */ jsxDEV(Skeleton, { sz: "md-1", className: "w-[250px] lg:ml-auto mb-1" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
            lineNumber: 194,
            columnNumber: 15
          }, void 0)
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
          lineNumber: 154,
          columnNumber: 11
        }, void 0)
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
        lineNumber: 140,
        columnNumber: 9
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-header.tsx",
    lineNumber: 124,
    columnNumber: 5
  }, void 0);
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
  const itemRefs = useRef([]);
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
  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerSize.width === 0) return;
      let total = showMoreRef.current?.offsetWidth ?? 0;
      const newVisibleItems = [];
      const newHiddenItems = [];
      navbarItems.forEach((item, index) => {
        if (item.isOwnerOnly && !isOwner) return;
        const itemWidth = itemRefs.current[index]?.offsetWidth ?? 0;
        if (total + itemWidth < containerSize.width + 32) {
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
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("relative flex py-2", className), ref: containerRef, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute invisible", children: navbarItems.map((item, index) => {
      if (item.isOwnerOnly && !isOwner) return null;
      return /* @__PURE__ */ jsxDEV(
        "div",
        {
          ref: (el) => {
            if (el) itemRefs.current[index] = el;
          },
          children: /* @__PURE__ */ jsxDEV(
            NavbarItem,
            {
              path: item.href ?? "",
              children: item.name,
              onClick: () => setShowDropdown(false),
              activeRoute: item.isIndex ?? true
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
              lineNumber: 128,
              columnNumber: 15
            },
            void 0
          )
        },
        index,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
          lineNumber: 122,
          columnNumber: 13
        },
        void 0
      );
    }) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
      lineNumber: 118,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "flex", children: visibleItems.map((item) => /* @__PURE__ */ jsxDEV(
      NavbarItem,
      {
        path: item.href ?? "",
        children: item.name,
        onClick: () => setShowDropdown(false),
        activeRoute: item.isIndex ?? true
      },
      item.name,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
        lineNumber: 140,
        columnNumber: 11
      },
      void 0
    )) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
      lineNumber: 138,
      columnNumber: 7
    }, void 0),
    hiddenItems.length > 0 && /* @__PURE__ */ jsxDEV(
      Button,
      {
        variant: "secondary",
        className: clsx("relative bg-transparent hover:bg-[var(--main-bg-color)]"),
        onClick: () => setShowDropdown(!showDropdown),
        ref: showMoreRef,
        children: [
          /* @__PURE__ */ jsxDEV(
            Text,
            {
              className: clsx(
                "whitespace-nowrap",
                isChooseHiddenItem ? "!text-single-main" : "text-[var(--text-color)]"
              ),
              children: [
                "More ",
                /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-caret-down ml-1" }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
                  lineNumber: 162,
                  columnNumber: 18
                }, void 0)
              ]
            },
            void 0,
            true,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
              lineNumber: 156,
              columnNumber: 11
            },
            void 0
          ),
          isChooseHiddenItem && /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: clsx(
                "absolute bg-primary-500 h-[2px] rounded-full",
                "w-full bottom-0 left-0"
              )
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
              lineNumber: 165,
              columnNumber: 13
            },
            void 0
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
        lineNumber: 150,
        columnNumber: 9
      },
      void 0
    ),
    showDropdown && /* @__PURE__ */ jsxDEV(
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
          content: /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: clsx(
                "flex justify-between items-center",
                location.pathname === item.href ? "text-single-main" : "text-[var(--text-color)]"
              ),
              children: [
                item.name,
                location.pathname === item.href && /* @__PURE__ */ jsxDEV("i", { className: "fas fa-check" }, void 0, false, {
                  fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
                  lineNumber: 192,
                  columnNumber: 53
                }, void 0)
              ]
            },
            void 0,
            true,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
              lineNumber: 185,
              columnNumber: 15
            },
            void 0
          ),
          onClick: () => {
            navigate(item.href ?? "/");
            setShowDropdown(false);
          }
        }))
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
        lineNumber: 175,
        columnNumber: 9
      },
      void 0
    )
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-navbar.tsx",
    lineNumber: 117,
    columnNumber: 5
  }, void 0);
};
const ProfileBody = ({ className }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full flex flex-col", className), children: [
    /* @__PURE__ */ jsxDEV(ProfileNavbar, { className: "bg-bg-main justify-start rounded-2xl shadow-md mt-2 p-2 w-full" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-body.tsx",
      lineNumber: 13,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "w-full", children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-body.tsx",
      lineNumber: 15,
      columnNumber: 9
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-body.tsx",
      lineNumber: 14,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/components/profile-body.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, void 0);
};
const ProfilePage = () => {
  return /* @__PURE__ */ jsxDEV(ProfilePageProvider, { children: /* @__PURE__ */ jsxDEV("div", { className: clsx("relative", "justify-start", "items-center", "flex", "flex-col"), children: [
    /* @__PURE__ */ jsxDEV("div", { className: clsx("flex", "justify-center", "w-full", "bg-bg-main", "z-10"), children: /* @__PURE__ */ jsxDEV(ProfileHeader, { className: "layout-1000" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/profile/profile-page.tsx",
      lineNumber: 12,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/profile/profile-page.tsx",
      lineNumber: 11,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: clsx("layout-1000", "w-full"), children: /* @__PURE__ */ jsxDEV(ProfileBody, { className: "w-full" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/profile/profile-page.tsx",
      lineNumber: 15,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/profile/profile-page.tsx",
      lineNumber: 14,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/profile/profile-page.tsx",
    lineNumber: 10,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/pages/profile/profile-page.tsx",
    lineNumber: 9,
    columnNumber: 5
  }, void 0);
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
  onChangeClick,
  onSaveClick,
  onCancelClick
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const { t } = useTranslation();
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center w-full", children: [
    title2 && /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", className: "font-light m-2", children: title2 }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
      lineNumber: 52,
      columnNumber: 9
    }, void 0),
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 flex-col w-full", children: [
      editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxDEV("div", { className: "relative flex flex-col gap-1 w-full", children: [
        /* @__PURE__ */ jsxDEV(
          TextArea,
          {
            className: clsx("animate-fade-in px-2 py-1 w-full h-[50px]", isError && "mt-[5px]"),
            placeholder,
            value: inputValue,
            isWrong: isError,
            onChange: (e) => setInputValue(e.target.value)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
            lineNumber: 59,
            columnNumber: 13
          },
          void 0
        ),
        isError && /* @__PURE__ */ jsxDEV(Text, { sz: "sm-1", className: "text-red-500 ml-2 h-[5px]", children: errorMessage }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
          lineNumber: 67,
          columnNumber: 15
        }, void 0)
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, void 0) : /* @__PURE__ */ jsxDEV(
        Text,
        {
          sz: "lg-1",
          className: clsx(valueClassName, "select-auto"),
          wrap: "whitespace-pre-wrap",
          children: value ?? noDataValue
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
          lineNumber: 73,
          columnNumber: 11
        },
        void 0
      ),
      canEdit && /* @__PURE__ */ jsxDEV(Fragment, { children: editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxDEV("div", { className: "animate-fade-in gap-1 flex w-full", children: [
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            disabled: value === inputValue,
            sz: "sm-1",
            variant: "primary",
            onClick: () => {
              onSaveClick?.(inputValue);
            },
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-floppy-disk mr-2" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
                lineNumber: 94,
                columnNumber: 19
              }, void 0),
              t("settings:editableField.saveButton")
            ]
          },
          void 0,
          true,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
            lineNumber: 85,
            columnNumber: 17
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            sz: "sm-1",
            variant: "fourth",
            onClick: () => {
              onCancelClick?.();
            },
            className: "flex-1",
            children: t("settings:editableField.cancelButton")
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
            lineNumber: 97,
            columnNumber: 17
          },
          void 0
        )
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
        lineNumber: 84,
        columnNumber: 15
      }, void 0) : /* @__PURE__ */ jsxDEV(
        Button,
        {
          sz: "sm-1",
          variant: "fourth",
          onClick: () => {
            onChangeClick?.();
          },
          className: "w-full",
          children: btnChildren
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
          lineNumber: 109,
          columnNumber: 15
        },
        void 0
      ) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
        lineNumber: 82,
        columnNumber: 11
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/settings/components/editable-textarea.tsx",
    lineNumber: 50,
    columnNumber: 5
  }, void 0);
};
const ProfileIntroduction = ({ className }) => {
  const [bio, setBio] = React.useState(void 0);
  const [isEditBio, setIsEditBio] = React.useState(false);
  const [description2, setDescription] = React.useState(void 0);
  const [isEditDescription, setIsEditDescription] = React.useState(false);
  const [email, setEmail] = React.useState(void 0);
  const [phone, setPhone] = React.useState(void 0);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { isOwner, targetId } = useProfilePage();
  const canEdit = useMemo(() => isAuthenticated && isOwner, [isAuthenticated, isOwner]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await userInfoService.GetUserInfoOverview(targetId ?? "");
      if (response) {
        setBio(response.data?.bio);
        setDescription(response.data?.description);
        setEmail(response.data?.email);
        setPhone(response.data?.phone);
      }
    };
    fetchData();
  }, [targetId]);
  const handleSaveBio = async (value) => {
    var res = await userProfileService.UpdateProfile({ bio: value });
    if (res.success) {
      setBio(value);
      setIsEditBio(false);
    }
  };
  const handleSaveDescription = async (value) => {
    var res = await userProfileService.UpdateProfile({ description: value });
    if (res.success) {
      setDescription(value);
      setIsEditDescription(false);
    }
  };
  return /* @__PURE__ */ jsxDEV(
    Card,
    {
      title: t("user:profilePosts.overview"),
      className: clsx("flex-col gap-4", className),
      titleClassName: "text-2xl font-bold !mb-0",
      children: [
        (bio || canEdit) && /* @__PURE__ */ jsxDEV(
          EditableTextArea,
          {
            editableMode: "inline",
            isEdit: isEditBio,
            placeholder: t("user:profilePosts.bioPlaceholder"),
            value: bio,
            onChangeClick: () => setIsEditBio(true),
            onSaveClick: (value) => handleSaveBio(value),
            valueClassName: "text-[1.2rem] font-semibold",
            canEdit: canEdit || false,
            onCancelClick: () => setIsEditBio(false),
            btnChildren: /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fas fa-pencil-alt" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
                lineNumber: 81,
                columnNumber: 15
              }, void 0),
              "   ",
              t("user:profilePosts.bioBtn")
            ] }, void 0, true, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
              lineNumber: 80,
              columnNumber: 13
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
            lineNumber: 69,
            columnNumber: 9
          },
          void 0
        ),
        description2 && /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", weight: "bold", children: t("user:profilePosts.description") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
          lineNumber: 88,
          columnNumber: 9
        }, void 0),
        (description2 || canEdit) && /* @__PURE__ */ jsxDEV(
          EditableTextArea,
          {
            editableMode: "inline",
            isEdit: isEditDescription,
            placeholder: t("user:profilePosts.descriptionPlaceholder"),
            value: description2,
            canEdit: canEdit || false,
            valueClassName: "text-[1.1rem]",
            onChangeClick: () => setIsEditDescription(true),
            onSaveClick: (value) => handleSaveDescription(value),
            onCancelClick: () => setIsEditDescription(false),
            btnChildren: /* @__PURE__ */ jsxDEV(Text, { sz: "sm-2", children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fas fa-pencil-alt" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
                lineNumber: 105,
                columnNumber: 15
              }, void 0),
              "   ",
              t("user:profilePosts.descriptionBtn")
            ] }, void 0, true, {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
              lineNumber: 104,
              columnNumber: 13
            }, void 0)
          },
          void 0,
          false,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
            lineNumber: 93,
            columnNumber: 9
          },
          void 0
        ),
        (bio || description2) && /* @__PURE__ */ jsxDEV("hr", { className: "border-[var(--border-color)] w-full" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
          lineNumber: 111,
          columnNumber: 32
        }, void 0),
        email && /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(Text, { className: "hover:text-primary-500", children: [
          /* @__PURE__ */ jsxDEV("i", { className: "fas fa-envelope" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
            lineNumber: 116,
            columnNumber: 13
          }, void 0),
          "   ",
          email
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
          lineNumber: 115,
          columnNumber: 11
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
          lineNumber: 114,
          columnNumber: 9
        }, void 0),
        phone && /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(Text, { className: "hover:text-primary-500", children: [
          /* @__PURE__ */ jsxDEV("i", { className: "fas fa-phone" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
            lineNumber: 123,
            columnNumber: 13
          }, void 0),
          "   ",
          phone
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
          lineNumber: 122,
          columnNumber: 11
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
          lineNumber: 121,
          columnNumber: 9
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/components/profile-introduction.tsx",
      lineNumber: 63,
      columnNumber: 5
    },
    void 0
  );
};
const PostsPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("grid grid-cols-golden gap-2 w-full"), children: [
    /* @__PURE__ */ jsxDEV(ProfileIntroduction, { className: clsx("bg-bg-main rounded-md rounded-l-2xl mt-2") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/posts-page.tsx",
      lineNumber: 8,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(Card, { className: clsx("bg-bg-main rounded-md rounded-r-2xl mt-2") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/posts-page.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/posts/posts-page.tsx",
    lineNumber: 7,
    columnNumber: 5
  }, void 0);
};
const useFriends = ({ userId = "", keyword, page = 1, pageSize = 10 }) => {
  return useQuery({
    queryKey: ["friends", userId, keyword, page, pageSize],
    queryFn: async () => {
      const res = await friendshipService.GetFriends(userId, page, pageSize, keyword);
      return res.data;
    },
    staleTime: 1e3 * 60 * 5,
    enabled: true
  });
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
        content: /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-xmark mr-2" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
            lineNumber: 52,
            columnNumber: 13
          }, void 0),
          " ",
          t("user:profileHeader.unfriendButton")
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
          lineNumber: 51,
          columnNumber: 11
        }, void 0),
        onClick: async () => await handleUnfriend?.(friendDto.id)
      }
    ],
    [friendDto.id, handleUnfriend, t]
  );
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex items-center justify-between rounded-xl",
        "hover:bg-bg-fourth cursor-pointer transition-colors",
        className
      ),
      children: [
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "relative flex p-3 gap-4 items-center",
            onClick: () => navigate(`/${friendDto.id}`),
            children: [
              /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(Avatar, { alt: "Avatar", src: friendDto.avatar ?? void 0, sz: "sm-1" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
                lineNumber: 74,
                columnNumber: 11
              }, void 0) }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
                lineNumber: 73,
                columnNumber: 9
              }, void 0),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full justify-center flex-1", children: /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", weight: "bold", children: friendDto.name }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
                lineNumber: 77,
                columnNumber: 11
              }, void 0) }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
                lineNumber: 76,
                columnNumber: 9
              }, void 0)
            ]
          },
          void 0,
          true,
          {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
            lineNumber: 69,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "relative pr-2", children: isFriend ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              "aria-label": "More options",
              ref: btnRef,
              className: "w-10 h-10 rounded-full hover:bg-bg-third",
              onClick: (e) => {
                e.stopPropagation();
                setIsShowDropdown(!isShowDrowdown);
              },
              children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-ellipsis-v" }, void 0, false, {
                fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
                lineNumber: 94,
                columnNumber: 15
              }, void 0)
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
              lineNumber: 85,
              columnNumber: 13
            },
            void 0
          ),
          /* @__PURE__ */ jsxDEV(
            Dropdown,
            {
              isShow: isShowDrowdown,
              className: clsx(
                "absolute flex sm:top-[130%] top-[110%] left-[1%] p-2",
                "rounded-lg shadow-md z-10 min-w-[200px] w-[calc(100%-2%)]"
              ),
              ref: dropdownRef,
              items: requestOptions
            },
            void 0,
            false,
            {
              fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
              lineNumber: 96,
              columnNumber: 13
            },
            void 0
          )
        ] }, void 0, true, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
          lineNumber: 84,
          columnNumber: 11
        }, void 0) : /* @__PURE__ */ jsxDEV(FriendButton, { sz: "sm-1", uid: friendDto.id }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
          lineNumber: 107,
          columnNumber: 11
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
          lineNumber: 82,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/friend-item.tsx",
      lineNumber: 62,
      columnNumber: 5
    },
    void 0
  );
};
const ProfileFriends = ({ className = "" }) => {
  const { t } = useTranslation();
  const [friends2, setFriends] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(12);
  const [isFull, setIsFull] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const { targetId } = useProfilePage();
  const { isLoading, refetch } = useFriends({
    userId: targetId,
    keyword,
    page,
    pageSize
  });
  const handleOnChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
    setIsFull(false);
  };
  useEffect(() => {
    const fetchFriends = async () => {
      const result = await refetch();
      if (page === 1) {
        setFriends(result.data?.friends || []);
      } else {
        setFriends((prev) => [...prev, ...result.data?.friends || []]);
      }
      if ((result.data?.friends || []).length < pageSize) {
        setIsFull(true);
      }
    };
    fetchFriends();
  }, [page, keyword, targetId]);
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("flex flex-1 justify-end flex-col w-full", className), children: [
    /* @__PURE__ */ jsxDEV(
      Textbox,
      {
        type: "search",
        placeholder: t("user:profileFriends.searchFriends"),
        className: "p-1",
        onChange: handleOnChange
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
        lineNumber: 55,
        columnNumber: 7
      },
      void 0
    ),
    !isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "relative flex flex-wrap gap-2 w-full mt-2", children: [
      friends2.map((friend, index) => /* @__PURE__ */ jsxDEV(FriendItem, { className: "w-[calc(50%-4px)]", friendDto: friend }, index, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
        lineNumber: 64,
        columnNumber: 13
      }, void 0)),
      friends2.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex w-full justify-center mb-10 mt-10", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center text-[var(--text-color)] opacity-30", children: [
        /* @__PURE__ */ jsxDEV(Text, { sz: "xl-3", weight: "bold", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user-xmark" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
          lineNumber: 70,
          columnNumber: 19
        }, void 0) }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
          lineNumber: 69,
          columnNumber: 17
        }, void 0),
        /* @__PURE__ */ jsxDEV(Text, { sz: "md-2", className: "mt-2", children: t("user:profileFriends.noFriends") }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
          lineNumber: 72,
          columnNumber: 17
        }, void 0)
      ] }, void 0, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
        lineNumber: 68,
        columnNumber: 15
      }, void 0) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
        lineNumber: 67,
        columnNumber: 13
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
      lineNumber: 62,
      columnNumber: 9
    }, void 0) : /* @__PURE__ */ jsxDEV("div", { className: "relative flex flex-wrap gap-2 w-full mt-4 items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "fa-solid fa-spinner animate-spin text-2xl text-single-main" }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
      lineNumber: 81,
      columnNumber: 11
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
      lineNumber: 80,
      columnNumber: 9
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/components/profile-friend.tsx",
    lineNumber: 54,
    columnNumber: 5
  }, void 0);
};
const ProfileFriendsPage = () => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxDEV(Card, { title: t("user:profileFriends.friends"), className: clsx("rounded-2xl mt-2"), children: /* @__PURE__ */ jsxDEV(ProfileFriends, {}, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/profile-friends-page.tsx",
    lineNumber: 11,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/friends/profile-friends-page.tsx",
    lineNumber: 10,
    columnNumber: 5
  }, void 0);
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
  return /* @__PURE__ */ jsxDEV(Card, { title: t("user:profileAbout.title"), className: clsx(className), children: /* @__PURE__ */ jsxDEV(SubNavbar, { className: "w-full", children: aboutNavbarItems.map((item, index) => /* @__PURE__ */ jsxDEV(SubNavbar.Item, { title: item.title, path: item.path }, index, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-navbar.tsx",
    lineNumber: 30,
    columnNumber: 11
  }, void 0)) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-navbar.tsx",
    lineNumber: 28,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-navbar.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, void 0);
};
const ProfileAboutPage = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("grid grid-cols-golden gap-2 lg:flex-row flex-col"), children: [
    /* @__PURE__ */ jsxDEV(ProfileAboutNavbar, { className: clsx("rounded-r-lg mt-2") }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/profile-about-page.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(Card, { className: clsx("rounded-l-lg mt-2 pt-0"), children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/profile-about-page.tsx",
      lineNumber: 11,
      columnNumber: 9
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/profile-about-page.tsx",
      lineNumber: 10,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/profile-about-page.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, void 0);
};
const ProfileAboutSection = ({
  title: title2,
  className,
  children
}) => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx(className), children: [
    title2 && /* @__PURE__ */ jsxDEV(Text, { sz: "lg-1", weight: "bold", children: title2 }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-section.tsx",
      lineNumber: 18,
      columnNumber: 9
    }, void 0),
    children
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-section.tsx",
    lineNumber: 16,
    columnNumber: 5
  }, void 0);
};
const ProfileOverview = ({}) => {
  const [emails, setEmails] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const { targetId, isOwner } = useProfilePage();
  useEffect(() => {
    const fetchData = async () => {
      const response = await userInfoService.GetUserInfoOverview(targetId ?? "");
      if (response) {
        if (response.data?.email) {
          setEmails([...emails, response.data.email]);
        }
        if (response.data?.phone) {
          setPhoneNumbers([...phoneNumbers, response.data.phone]);
        }
      }
    };
    fetchData();
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(ProfileAboutSection, { title: "Liên hệ", className: clsx("mb-4", "w-full"), children: [
    emails.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: clsx("flex", "items-start", "w-full", "gap-4", "mb-6", "mt-4"), children: [
      /* @__PURE__ */ jsxDEV(Text, { sz: "lg-3", className: clsx("opacity-50"), children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-envelope" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 37,
        columnNumber: 15
      }, void 0) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 36,
        columnNumber: 13
      }, void 0),
      /* @__PURE__ */ jsxDEV("div", { children: emails.map((email, index) => /* @__PURE__ */ jsxDEV("div", { className: clsx("flex", "flex-col"), children: [
        /* @__PURE__ */ jsxDEV(Text, { weight: "bold", children: email }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
          lineNumber: 42,
          columnNumber: 19
        }, void 0),
        /* @__PURE__ */ jsxDEV(Text, { sz: "sm-3", className: clsx("opacity-50"), children: "Email" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
          lineNumber: 43,
          columnNumber: 19
        }, void 0)
      ] }, index, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 41,
        columnNumber: 17
      }, void 0)) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 39,
        columnNumber: 13
      }, void 0),
      isOwner && /* @__PURE__ */ jsxDEV("div", { className: clsx("ml-auto"), children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "secondary",
          className: clsx("!rounded-full", "!p-0", "w-10", "h-10"),
          children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-pencil-alt" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
            lineNumber: 55,
            columnNumber: 19
          }, void 0)
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
          lineNumber: 51,
          columnNumber: 17
        },
        void 0
      ) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 50,
        columnNumber: 15
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
      lineNumber: 35,
      columnNumber: 11
    }, void 0),
    phoneNumbers.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: clsx("flex", "items-start", "gap-4"), children: [
      /* @__PURE__ */ jsxDEV(Text, { sz: "lg-3", className: clsx("opacity-50"), children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-phone" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 64,
        columnNumber: 15
      }, void 0) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 63,
        columnNumber: 13
      }, void 0),
      /* @__PURE__ */ jsxDEV("div", { children: phoneNumbers.map((phone, index) => /* @__PURE__ */ jsxDEV("div", { className: clsx("flex", "flex-col"), children: [
        /* @__PURE__ */ jsxDEV(Text, { weight: "bold", children: phone }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
          lineNumber: 69,
          columnNumber: 19
        }, void 0),
        /* @__PURE__ */ jsxDEV(Text, { sz: "sm-3", className: clsx("opacity-50"), children: "Di động" }, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
          lineNumber: 70,
          columnNumber: 19
        }, void 0)
      ] }, index, true, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 68,
        columnNumber: 17
      }, void 0)) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 66,
        columnNumber: 13
      }, void 0),
      isOwner && /* @__PURE__ */ jsxDEV("div", { className: clsx("ml-auto"), children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "secondary",
          className: clsx("!rounded-full", "!p-0", "w-10", "h-10"),
          children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-pencil-alt" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
            lineNumber: 82,
            columnNumber: 19
          }, void 0)
        },
        void 0,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
          lineNumber: 78,
          columnNumber: 17
        },
        void 0
      ) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
        lineNumber: 77,
        columnNumber: 15
      }, void 0)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
      lineNumber: 62,
      columnNumber: 11
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
    lineNumber: 33,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-overview.tsx",
    lineNumber: 32,
    columnNumber: 5
  }, void 0);
};
const ProfileAboutOverview = () => {
  return /* @__PURE__ */ jsxDEV("div", { className: clsx("w-full"), children: /* @__PURE__ */ jsxDEV(ProfileOverview, {}, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-overview.tsx",
    lineNumber: 7,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/features/profile/about/components/profile-about-overview.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};
const userRoute = {
  path: "/:userParam",
  element: /* @__PURE__ */ jsxDEV(ProfilePage, {}, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
    lineNumber: 10,
    columnNumber: 12
  }, void 0),
  type: "public",
  children: [
    {
      path: "",
      element: /* @__PURE__ */ jsxDEV(PostsPage, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
        lineNumber: 15,
        columnNumber: 16
      }, void 0),
      type: "public",
      index: true
    },
    {
      path: "friends",
      element: /* @__PURE__ */ jsxDEV(ProfileFriendsPage, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
        lineNumber: 21,
        columnNumber: 16
      }, void 0),
      type: "public"
    },
    {
      path: "about",
      element: /* @__PURE__ */ jsxDEV(ProfileAboutPage, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
        lineNumber: 26,
        columnNumber: 16
      }, void 0),
      type: "public",
      children: [
        {
          path: "overview",
          element: /* @__PURE__ */ jsxDEV(ProfileAboutOverview, {}, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
            lineNumber: 31,
            columnNumber: 20
          }, void 0),
          type: "public",
          index: true
        },
        {
          path: "work-and-education",
          element: /* @__PURE__ */ jsxDEV("div", { children: "Work and Education" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
            lineNumber: 37,
            columnNumber: 20
          }, void 0),
          type: "public"
        },
        {
          path: "contact-info",
          element: /* @__PURE__ */ jsxDEV("div", { children: "Contact Information" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
            lineNumber: 42,
            columnNumber: 20
          }, void 0),
          type: "public"
        },
        {
          path: "places-lived",
          element: /* @__PURE__ */ jsxDEV("div", { children: "Places Lived" }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
            lineNumber: 47,
            columnNumber: 20
          }, void 0),
          type: "public"
        }
      ]
    },
    {
      path: "photos",
      element: /* @__PURE__ */ jsxDEV("div", { children: "Photos" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
        lineNumber: 54,
        columnNumber: 16
      }, void 0),
      type: "public"
    },
    {
      path: "videos",
      element: /* @__PURE__ */ jsxDEV("div", { children: "Videos" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
        lineNumber: 59,
        columnNumber: 16
      }, void 0),
      type: "public"
    },
    {
      path: "settings",
      element: /* @__PURE__ */ jsxDEV("div", { children: "Settings" }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/profile.routes.tsx",
        lineNumber: 64,
        columnNumber: 16
      }, void 0),
      type: "public"
    }
  ]
};
const LayoutHeader = forwardRef(
  ({ children, className }, ref) => {
    return /* @__PURE__ */ jsxDEV("header", { ref, className: clsx("fixed z-40 w-full", className), children }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/layout/layout.tsx",
      lineNumber: 13,
      columnNumber: 7
    }, void 0);
  }
);
LayoutHeader.displayName = "Layout.Header";
const LayoutMain = ({
  children,
  className,
  style: style2
}) => {
  return /* @__PURE__ */ jsxDEV("main", { className: clsx("relative h-full", className), style: style2, children }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/layout/layout.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, void 0);
};
const LayoutFooter = ({ children, className }) => {
  return /* @__PURE__ */ jsxDEV(
    "footer",
    {
      className: clsx("sm:hidden flex fixed z-40 bottom-0 w-full", className),
      children
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/layout/layout.tsx",
      lineNumber: 46,
      columnNumber: 5
    },
    void 0
  );
};
const Layout = ({ children, className }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: clsx(
        "relative flex flex-col bg-bg-eighth min-h-screen",
        className
      ),
      children
    },
    void 0,
    false,
    {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/components/layout/layout.tsx",
      lineNumber: 69,
      columnNumber: 5
    },
    void 0
  );
};
Layout.Header = LayoutHeader;
Layout.Main = LayoutMain;
Layout.Footer = LayoutFooter;
const DefaultLayout = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const { openDialog, closeDialog } = useDialog();
  const [headerRef, headerSize] = useSize();
  const openLoginOverlay = useCallback(() => {
    openDialog({
      content: /* @__PURE__ */ jsxDEV(LoginForm, { showLogo: false }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
        lineNumber: 18,
        columnNumber: 16
      }, void 0)
    });
  }, [openDialog]);
  const openRegisterOverlay = useCallback(() => {
    openDialog({
      content: /* @__PURE__ */ jsxDEV(RegisterForm, { showLogo: false }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
        lineNumber: 24,
        columnNumber: 16
      }, void 0)
    });
  }, [openDialog]);
  useEffect(() => {
    if (!isInitialized) return;
    if (isAuthenticated) {
      closeDialog();
    } else {
      openLoginOverlay();
    }
    return () => closeDialog();
  }, [isAuthenticated, isInitialized, closeDialog, openLoginOverlay]);
  return /* @__PURE__ */ jsxDEV(Layout, { children: [
    /* @__PURE__ */ jsxDEV(Layout.Header, { ref: headerRef, children: /* @__PURE__ */ jsxDEV(
      Navbar,
      {
        isAuthenticated,
        onLogin: openLoginOverlay,
        onSignup: openRegisterOverlay
      },
      void 0,
      false,
      {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
        lineNumber: 43,
        columnNumber: 9
      },
      void 0
    ) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(Layout.Main, { style: { paddingTop: headerSize?.height }, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
      lineNumber: 50,
      columnNumber: 9
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
      lineNumber: 49,
      columnNumber: 7
    }, void 0),
    /* @__PURE__ */ jsxDEV(Layout.Footer, { children: /* @__PURE__ */ jsxDEV(NavbarFooter, { isAuthenticated }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, void 0) }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
      lineNumber: 52,
      columnNumber: 7
    }, void 0)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/default-layout.tsx",
    lineNumber: 41,
    columnNumber: 5
  }, void 0);
};
const SecondLayout = () => {
  return /* @__PURE__ */ jsxDEV(Layout, { children: /* @__PURE__ */ jsxDEV(Layout.Main, { children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/second-layout.tsx",
    lineNumber: 8,
    columnNumber: 9
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/second-layout.tsx",
    lineNumber: 7,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/layouts/second-layout.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, void 0);
};
const mainRoutes = [
  {
    element: /* @__PURE__ */ jsxDEV(DefaultLayout, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
      lineNumber: 17,
      columnNumber: 14
    }, void 0),
    type: "public",
    children: [
      {
        path: "/",
        element: /* @__PURE__ */ jsxDEV(HomePage, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
          lineNumber: 22,
          columnNumber: 18
        }, void 0),
        type: "private",
        index: true,
        keepAlive: true
      },
      friendsRoutes,
      settingRoutes,
      userRoute,
      {
        path: "/notifications",
        element: /* @__PURE__ */ jsxDEV(NotificationsPage, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
          lineNumber: 32,
          columnNumber: 18
        }, void 0),
        type: "private"
      },
      { path: "/loading", type: "public", element: /* @__PURE__ */ jsxDEV(LoadingPage, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
        lineNumber: 35,
        columnNumber: 52
      }, void 0) },
      { path: "*", type: "public", element: /* @__PURE__ */ jsxDEV(NotFoundPage, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
        lineNumber: 36,
        columnNumber: 45
      }, void 0) }
    ]
  },
  {
    element: /* @__PURE__ */ jsxDEV(SecondLayout, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
      lineNumber: 40,
      columnNumber: 14
    }, void 0),
    type: "public",
    children: [
      {
        path: "/login",
        element: /* @__PURE__ */ jsxDEV(LoginPage, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
          lineNumber: 45,
          columnNumber: 18
        }, void 0),
        type: "auth"
      },
      {
        path: "/register",
        element: /* @__PURE__ */ jsxDEV(RegisterPage, {}, void 0, false, {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/routes/main.routes.tsx",
          lineNumber: 50,
          columnNumber: 18
        }, void 0),
        type: "auth"
      }
    ]
  }
];
const GuestOnlyRoute = ({ children }) => {
  const auth2 = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (auth2 && auth2.isAuthenticated) {
      const returnTo = searchParams.get("returnTo") || "/";
      navigate(returnTo, { replace: true });
    }
  }, [auth2, navigate, searchParams]);
  if (!auth2) return null;
  return children;
};
const UserOnlyRoute = ({ children }) => {
  const auth2 = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth2 && auth2.isAuthenticated === false) {
      navigate("/login", { replace: true });
    }
  }, [auth2, navigate]);
  if (!auth2) return null;
  return children;
};
const RouteWrapper = ({
  type,
  // keepAlive,
  // path,
  element
}) => {
  let wrapped = element;
  if (type === "private") wrapped = /* @__PURE__ */ jsxDEV(UserOnlyRoute, { children: wrapped }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/routes/route-wrapper.tsx",
    lineNumber: 28,
    columnNumber: 37
  }, void 0);
  else if (type === "auth")
    wrapped = /* @__PURE__ */ jsxDEV(GuestOnlyRoute, { children: wrapped }, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/routes/route-wrapper.tsx",
      lineNumber: 30,
      columnNumber: 15
    }, void 0);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: wrapped }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/components/routes/route-wrapper.tsx",
    lineNumber: 32,
    columnNumber: 10
  }, void 0);
};
const AppRoutes = () => {
  const generateRoutes = useCallback((routes) => {
    return routes.map((route, idx) => {
      const key = route.path ?? `route-${idx}`;
      return /* @__PURE__ */ jsxDEV(
        Route,
        {
          path: route.path,
          element: /* @__PURE__ */ jsxDEV(RouteWrapper, { ...route }, void 0, false, {
            fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/index.tsx",
            lineNumber: 16,
            columnNumber: 20
          }, void 0),
          children: route.children && generateRoutes(route.children)
        },
        key,
        false,
        {
          fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/index.tsx",
          lineNumber: 13,
          columnNumber: 9
        },
        void 0
      );
    });
  }, []);
  return /* @__PURE__ */ jsxDEV(AliveScope, { children: /* @__PURE__ */ jsxDEV(Routes, { children: generateRoutes(mainRoutes) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/index.tsx",
    lineNumber: 26,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/routes/index.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, void 0);
};
let connection = null;
const createSignalRConnection = () => {
  try {
    connection = new signalR.HubConnectionBuilder().withUrl(`${appConfig.apiUrl}/hubs/notification`, {
      withCredentials: true
    }).withAutomaticReconnect().configureLogging(signalR.LogLevel.Error).build();
    return connection;
  } catch (error) {
    console.error("Error creating SignalR connection: ", error);
    throw error;
  }
};
function useNotificationHub(onReceiveNotification) {
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
          conn.on("ReceiveNotification", (data) => {
            if (isMounted) {
              onReceiveNotification(data);
            }
          });
        } catch (err) {
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
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
function NotificationListener() {
  const dispatch = useDispatch();
  const { pushToast } = useToast();
  const handleNewNotification = useCallback(
    (data) => {
      if (data.type === "CancelNotification") {
        dispatch(deleteNotification(data.data.noticationId));
        return;
      } else {
        dispatch(addNewNotification(data));
      }
      pushToast({
        id: data.id,
        type: "notification",
        payload: {
          notificationDto: data
        },
        duration: 5e3
      });
    },
    [dispatch, pushToast]
  );
  useNotificationHub(handleNewNotification);
  return null;
}
const store = configureStore({
  reducer: {
    notifications: notificationsReducer
  }
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1e3,
      // 5 minutes
      gcTime: 10 * 60 * 1e3
      // 10 minutes (garbage collection time)
    }
  }
});
function App() {
  return /* @__PURE__ */ jsxDEV(Provider, { store, children: /* @__PURE__ */ jsxDEV(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxDEV(ContextTree, { children: /* @__PURE__ */ jsxDEV("main", { children: [
    /* @__PURE__ */ jsxDEV(AppRoutes, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
      lineNumber: 28,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(GlobalDialog, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
      lineNumber: 29,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(NotificationListener, {}, void 0, false, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
      lineNumber: 30,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
    lineNumber: 27,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
    lineNumber: 26,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
    lineNumber: 25,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/App.tsx",
    lineNumber: 24,
    columnNumber: 5
  }, this);
}
function render(_url, options) {
  const url = _url.startsWith("/") ? _url : "/" + _url;
  return renderToPipeableStream(
    /* @__PURE__ */ jsxDEV(StrictMode, { children: [
      /* @__PURE__ */ jsxDEV(StaticRouter, { location: url, children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/entry-server.tsx",
        lineNumber: 15,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/entry-server.tsx",
        lineNumber: 14,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ jsxDEV("vite-streaming-end", {}, void 0, false, {
        fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/entry-server.tsx",
        lineNumber: 17,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "/home/ngocphat/projects/fatagram/fatagram-frontend-ssr/src/entry-server.tsx",
      lineNumber: 13,
      columnNumber: 5
    }, this),
    options
  );
}
export {
  render
};
