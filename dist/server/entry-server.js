import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useNavigate, Link as Link$1, useLocation, useResolvedPath, useMatch, Outlet, useParams, useSearchParams, Route, Routes, StaticRouter } from "react-router-dom";
import i18next, { t } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import axios from "axios";
import React, { useState, useCallback, createContext, useContext, useReducer, useEffect, useMemo, forwardRef, useRef, useId, useLayoutEffect, useImperativeHandle, memo, lazy, Suspense } from "react";
import { useQueryClient, useInfiniteQuery, useQuery, useQueries, QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import clsx, { clsx as clsx$1 } from "clsx";
import { useNavigate as useNavigate$1 } from "react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Swiper, SwiperSlide } from "swiper/react";
import * as signalR from "@microsoft/signalr";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowLeft } from "lucide-react";
import Cropper from "react-easy-crop";
import { useShallow } from "zustand/react/shallow";
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
const onboarding$1 = { "welcome": "Welcome!", "description": "Discover a new way to connect and share with your friends. Let's get started on your journey to a more vibrant social experience!", "getStarted": "Get Started", "completeInfo": "Please complete the necessary information", "privacy": "Your information is kept completely private", "form": { "firstName": { "title": "First name", "placeholder": "First name" }, "middleName": { "title": "Middle name", "placeholder": "Middle name" }, "lastName": { "title": "Last name", "placeholder": "Last name" }, "birthday": { "title": "Birthday" }, "gender": { "title": "Gender", "options": { "male": "Male", "female": "Female", "other": "Other" } }, "submit": "Complete" }, "validation": { "firstNameTooShort": "First name is too short", "firstNameRequired": "First name is required", "lastNameTooShort": "Last name is too short", "lastNameRequired": "Last name is required", "birthdayInvalid": "Birthday is invalid", "birthdayRequired": "Birthday is required", "genderRequired": "Gender is required" } };
const themes$1 = { "light": "Light", "dark": "Dark", "universe": "Universe", "neon": "Neon", "darkSea": "Dark Sea", "darkBlue": "Dark Blue", "darkYellow": "Dark Yellow", "lightYellowPink": "Light Yellow Pink", "pastelYellowPink": "Pastel Yellow & Pink (Cute)", "darkRed": "Dark Red", "emerald": "Emerald", "aurora": "Aurora (Northern Lights)" };
const conversations$1 = { "title": "Conversations", "turnBack": "Turn back", "search": "Search conversations...", "notFound": "No conversations found", "notFoundMessage": "Select a conversation or start a new one", "you": "You", "noConversations": "No conversations", "noConversationsMessage": "Your conversations will appear here", "noSelectConversation": "No conversation selected", "noSelectConversationMessage": "Select a conversation to start chatting", "sent": "Sent", "systemMessage": { "createGroup": "{{creatorName}} created the group" }, "sentImageMessage": "Sent {{count}} images", "sentMediaMessage": "Sent a attached file", "privacyDescription": "Feel free to share your best moments! This conversation is always kept private and completely secure.", "openFatalk": "Open Fatalk", "enterGroupNameOptional": "Enter group name (optional)", "loadingOldMessages": "Loading messages...", "createGroupChat": "Create group chat" };
const chat$1 = { "upload": { "fileTooLarge": "{{fileName}} is too large. Maximum file size is {{maxSize}}.", "imageCompressed": "Image compressed from {{original}} MB to {{compressed}} MB", "compressionError": "Failed to compress {{fileName}}. Please try again.", "invalidFileType": "Invalid file type. Please check the file.", "uploadError": "Failed to upload file. Please try again." } };
const offline$1 = { "message": "You are offline", "retry": "Retry" };
const common$1 = {
  language: language$3,
  navbar: navbar$5,
  notFound: notFound$1,
  onboarding: onboarding$1,
  themes: themes$1,
  conversations: conversations$1,
  chat: chat$1,
  offline: offline$1
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
const requests$1 = { "title": "Friend Requests", "noRequests": "No friend requests", "noRequestsDescription": "You're all caught up! When friends send requests, you'll see them here." };
const friends$1 = {
  title: title$3,
  description: description$2,
  navbar: navbar$3,
  requests: requests$1
};
const time$1 = { "second": { "one": "{{count}} second", "other": "{{count}} seconds" }, "minute": { "one": "{{count}} minute", "other": "{{count}} minutes" }, "hour": { "one": "{{count}} hour", "other": "{{count}} hours" }, "day": { "one": "{{count}} day", "other": "{{count}} days" }, "week": { "one": "{{count}} week", "other": "{{count}} weeks" }, "month": { "one": "{{count}} month", "other": "{{count}} months" }, "year": { "one": "{{count}} year", "other": "{{count}} years" } };
const ago$1 = "ago";
const just_now$1 = "Just now";
const yesterday$1 = "Yesterday";
const tomorrow$1 = "Tomorrow";
const weekday$1 = { "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday" };
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
const onboarding = { "welcome": "Chào mừng đến với Fatagram!", "description": "Khám phá cách mới để kết nối và chia sẻ với bạn bè của bạn. Hãy bắt đầu hành trình trải nghiệm xã hội sôi động hơn của bạn!", "getStarted": "Bắt đầu", "completeInfo": "Hãy hoàn tất thông tin cần thiết", "privacy": "Thông tin của bạn được bảo mật tuyệt đối", "form": { "firstName": { "title": "Họ", "placeholder": "Họ" }, "middleName": { "title": "Tên đệm", "placeholder": "Tên đệm" }, "lastName": { "title": "Tên", "placeholder": "Tên" }, "birthday": { "title": "Ngày sinh" }, "gender": { "title": "Giới tính", "options": { "male": "Nam", "female": "Nữ", "other": "Khác" } }, "submit": "Hoàn tất" }, "validation": { "firstNameTooShort": "Họ quá ngắn", "firstNameRequired": "Họ là bắt buộc", "lastNameTooShort": "Tên quá ngắn", "lastNameRequired": "Tên là bắt buộc", "birthdayInvalid": "Ngày sinh không hợp lệ", "birthdayRequired": "Ngày sinh là bắt buộc", "genderRequired": "Giới tính là bắt buộc" } };
const themes = { "light": "Sáng", "dark": "Tối", "universe": "Vũ trụ", "neon": "Neon", "darkSea": "Biển đêm", "darkBlue": "Xanh đậm", "darkYellow": "Vàng tối", "lightYellowPink": "Vàng hồng", "pastelYellowPink": "Vàng - Hồng Pastel (Cute)", "darkRed": "Đỏ tối", "emerald": "Ngọc lục bảo", "aurora": "Cực Quang (Aurora Borealis)" };
const conversations = { "title": "Cuộc trò chuyện", "turnBack": "Quay lại", "search": "Tìm kiếm cuộc trò chuyện...", "notFound": "Không tìm thấy cuộc trò chuyện", "notFoundMessage": "Chọn một cuộc trò chuyện hoặc bắt đầu một cuộc trò chuyện mới", "you": "Bạn", "no-conversations": "Không có cuộc trò chuyện", "sent": "Đã gửi", "systemMessage": { "createGroup": "{{creatorName}} đã tạo nhóm" }, "sentImageMessage": "Đã gửi {{count}} hình ảnh", "sentMediaMessage": "Đã gửi một tệp đính kèm", "privacyDescription": "Hãy yên tâm chia sẻ những khoảnh khắc tuyệt vời nhất! Cuộc trò chuyện này luôn được giữ kín và an toàn tuyệt đối.", "openFatalk": "Mở Fatalk", "enterGroupNameOptional": "Nhập tên nhóm chat (Không bắt buộc)", "loadingOldMessages": "Đang tải tin nhắn...", "createGroupChat": "Tạo nhóm chat" };
const chat = { "upload": { "fileTooLarge": "{{fileName}} quá lớn. Kích thước file tối đa là {{maxSize}}.", "imageCompressed": "Ảnh đã được nén từ {{original}} MB xuống {{compressed}} MB", "compressionError": "Không thể nén {{fileName}}. Vui lòng thử lại.", "invalidFileType": "Loại file không hợp lệ. Vui lòng kiểm tra file.", "uploadError": "Không thể tải file. Vui lòng thử lại." } };
const offline = { "message": "Bạn đang ngoại tuyến", "retry": "Thử lại" };
const common = {
  language: language$1,
  navbar: navbar$2,
  notFound,
  onboarding,
  themes,
  conversations,
  chat,
  offline
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
const requests = { "title": "Lời mời kết bạn", "noRequests": "Không có lời mời kết bạn", "noRequestsDescription": "Bạn đã xử lý hết lời mời. Khi có người muốn kết bạn, họ sẽ xuất hiện ở đây." };
const friends = {
  title,
  description,
  navbar,
  requests
};
const time = { "second": { "one": "{{count}} giây", "other": "{{count}} giây" }, "minute": { "one": "{{count}} phút", "other": "{{count}} phút" }, "hour": { "one": "{{count}} giờ", "other": "{{count}} giờ" }, "day": { "one": "{{count}} ngày", "other": "{{count}} ngày" }, "week": { "one": "{{count}} tuần", "other": "{{count}} tuần" }, "month": { "one": "{{count}} tháng", "other": "{{count}} tháng" }, "year": { "one": "{{count}} năm", "other": "{{count}} năm" } };
const ago = "trước";
const just_now = "Vừa xong";
const yesterday = "Hôm qua";
const tomorrow = "Ngày mai";
const weekday = { "0": "Chủ nhật", "1": "Thứ hai", "2": "Thứ ba", "3": "Thứ tư", "4": "Thứ năm", "5": "Thứ sáu", "6": "Thứ bảy" };
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
const PREFIX$8 = buildApiPath("/auth");
class AuthService {
  // login method
  async login(dto) {
    return apiPost(`${PREFIX$8}/login`, {
      usernameOrEmail: dto.usernameOrEmail,
      password: dto.password,
      isRememberMe: dto.isRememberMe
    });
  }
  async loginWithGoogle(code) {
    return apiPost(`${PREFIX$8}/oauth/google/callback`, { code });
  }
  // logout method
  async logout() {
    return apiPost(`${PREFIX$8}/logout`);
  }
  async register(dto) {
    return apiPost(`${PREFIX$8}/register`, {
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
    return apiGet(`${PREFIX$8}/ping`);
  }
}
const authService = new AuthService();
const PREFIX$7 = buildApiPath("/userprofile");
class UserProfileService {
  // Check if user exists by id or urlName
  async checkUserExist(key) {
    return await apiGet(`${PREFIX$7}/exist?key=${key}`);
  }
  async getProfile(target, fields) {
    return await apiGet(`${PREFIX$7}/${target}`, { fields });
  }
  async getUserId(target) {
    return await apiGet(`${PREFIX$7}/${target}`, { fields: "id" });
  }
  // Get current user profile
  async getMe() {
    return await apiGet(`${PREFIX$7}/me`);
  }
  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await apiPatchFormData(`${PREFIX$7}/avatar`, formData);
  }
  // Upload background image
  async uploadBackground(file, metadata) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));
    return await apiPatchFormData(`${PREFIX$7}/background`, formData);
  }
  // Update simple profile fields such as bio, description, etc.
  async updateProfile(data) {
    return apiPut(`${PREFIX$7}`, data);
  }
  // Update user's URL name
  async updateUrlName(changeUrlNameDto) {
    return apiPatch(`${PREFIX$7}/urlName`, changeUrlNameDto);
  }
  // Complete onboarding
  async completeOnboarding(onboardingDto) {
    return apiPost(`${PREFIX$7}/onboarding`, onboardingDto);
  }
  // Update user's name
  async updateName(changeNameDto) {
    return apiPatch(`${PREFIX$7}/name`, changeNameDto);
  }
  async updateNickname(changeNicknameDto) {
    return apiPatch(`${PREFIX$7}/nickname`, changeNicknameDto);
  }
  // Get onboarding default data
  async getOnboardingDefaults() {
    return apiGet(`${PREFIX$7}/onboarding/defaults`);
  }
}
const userProfileService = new UserProfileService();
const CHAT_STORAGE_KEY = "fatagram_open_chats";
const saveToStorage = (activeIds, minimizedIds, registry) => {
  try {
    const nonTempChats = activeIds.filter((id) => {
      const meta = registry[id];
      return meta?.type !== "temp";
    });
    const nonTempMinimized = minimizedIds.filter((id) => {
      const meta = registry[id];
      return meta?.type !== "temp";
    });
    const nonTempRegistry = {};
    [...nonTempChats, ...nonTempMinimized].forEach((id) => {
      nonTempRegistry[id] = registry[id];
    });
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        activeIds: nonTempChats,
        minimizedIds: nonTempMinimized,
        registry: nonTempRegistry
      })
    );
  } catch (e) {
    console.error("Failed to save chats to localStorage:", e);
  }
};
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        activeIds: data.activeIds || [],
        minimizedIds: data.minimizedIds || [],
        registry: data.registry || {}
      };
    }
  } catch (e) {
    console.error("Failed to load chats from localStorage:", e);
  }
  return { activeIds: [], minimizedIds: [], registry: {} };
};
const useChatStore = create((set) => ({
  focusOnId: null,
  activeIds: [],
  minimizedIds: [],
  registry: {},
  initializeFromStorage: () => {
    const { activeIds, minimizedIds, registry } = loadFromStorage();
    set({
      activeIds,
      minimizedIds,
      registry
    });
  },
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
    saveToStorage(newActiveIds, newMinimizedIds, newRegistry);
    return {
      activeIds: newActiveIds,
      minimizedIds: newMinimizedIds,
      registry: newRegistry
    };
  }),
  closeChat: (id) => set((state) => {
    const newActiveIds = state.activeIds.filter((activeId) => activeId !== id);
    const newMinimizedIds = state.minimizedIds.filter((minimizedId) => minimizedId !== id);
    saveToStorage(newActiveIds, newMinimizedIds, state.registry);
    return {
      activeIds: newActiveIds,
      minimizedIds: newMinimizedIds
    };
  }),
  toggleMinimize: (id) => set((state) => {
    if (state.activeIds.includes(id)) {
      const newActiveIds2 = state.activeIds.filter((activeId) => activeId !== id);
      const newMinimizedIds2 = [...state.minimizedIds, id];
      saveToStorage(newActiveIds2, newMinimizedIds2, state.registry);
      return {
        activeIds: newActiveIds2,
        minimizedIds: newMinimizedIds2
      };
    }
    const newActiveIds = [...state.activeIds, id];
    const newMinimizedIds = state.minimizedIds.filter((minimizedId) => minimizedId !== id);
    saveToStorage(newActiveIds, newMinimizedIds, state.registry);
    return {
      activeIds: newActiveIds,
      minimizedIds: newMinimizedIds
    };
  }),
  replaceChat: (oldId, newId) => {
    set((state) => {
      const restRegistry = { ...state.registry };
      delete restRegistry[oldId];
      const newRegistry = {
        ...restRegistry,
        [newId]: { type: "conversation", conversationId: newId }
      };
      const newActiveIds = state.activeIds.map((id) => id === oldId ? newId : id);
      const newMinimizedIds = state.minimizedIds.map((id) => id === oldId ? newId : id);
      saveToStorage(newActiveIds, newMinimizedIds, newRegistry);
      return {
        activeIds: newActiveIds,
        minimizedIds: newMinimizedIds,
        registry: newRegistry
      };
    });
  },
  reset: () => set(() => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    return {
      activeIds: [],
      minimizedIds: [],
      registry: {}
    };
  }),
  setFocusOn: (id) => set({ focusOnId: id })
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
  const fetch2 = useCallback(
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
    fetch: fetch2
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
          const payload = {
            userId: data?.infos.id,
            urlName: data?.infos.urlName,
            lang: data?.infos.languageCode || "en"
          };
          dispatch({ type: "LOGIN", payload });
          try {
            localStorage.setItem("fatagram:user", JSON.stringify(payload));
          } catch (e) {
          }
        }
      });
    }
  });
  const { fetch: logout } = useResultFetcher(authService.logout, {
    onSuccess: () => {
      dispatch({ type: "LOGOUT" });
      try {
        localStorage.removeItem("fatagram:user");
      } catch (e) {
      }
      clearUserData();
    }
  });
  const { redirectToGoogle, fetcher: loginWithGoogle } = useGoogleLogin();
  const handleLoginWithGoogle = async (code) => {
    await loginWithGoogle.fetch(code, {
      onSuccess: async () => {
        await me({
          onSuccess: async (data) => {
            const payload = {
              userId: data?.infos.id,
              urlName: data?.infos.urlName,
              lang: data?.infos.languageCode || "en"
            };
            dispatch({ type: "LOGIN", payload });
            try {
              localStorage.setItem("fatagram:user", JSON.stringify(payload));
            } catch (e) {
            }
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
  useEffect(() => {
    if (!state.userId) {
      try {
        const raw = localStorage.getItem("fatagram:user");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.userId) {
            const payload = {
              userId: parsed.userId,
              urlName: parsed.urlName,
              lang: parsed.lang || "en"
            };
            dispatch({ type: "LOGIN", payload });
          }
        }
      } catch (e) {
      }
    }
  }, []);
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
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl"
};
const buttonVariants$1 = {
  primary: "bg-gradient-main text-white hover:bg-gradient-main-move",
  secondary: "bg-bg-second text-text-main hover:bg-bg-second/70",
  third: "bg-bg-third text-text-main hover:bg-bg-third/70",
  fourth: "bg-bg-fourth text-text-main hover:bg-bg-fourth/70"
};
const Button = forwardRef(
  ({ variant = "primary", sz = "md", className, disabled = false, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        type: "button",
        disabled,
        className: clsx(
          "font-normal rounded-xl select-none transition-all duration-200 ease-out",
          buttonSizes$1[sz],
          disabled ? "bg-bg-disabled text-text-fourth cursor-not-allowed opacity-60" : [buttonVariants$1[variant], "active:scale-[0.98] active:opacity-80 cursor-pointer"],
          className
        ),
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const buttonSizes = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-14 h-14 text-xl"
};
const buttonVariants = {
  primary: "text-text-main hover:bg-bg-fourth",
  secondary: "bg-bg-second text-text-main hover:bg-bg-second/70"
};
const MiniButton = forwardRef(
  ({ onClick, variant = "primary", sz = "md", className, children, disabled = false, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        disabled,
        onClick,
        ref,
        className: clsx(
          "rounded-full select-none flex items-center justify-center font-normal",
          "transition-all duration-300 ease-out",
          buttonSizes[sz],
          disabled ? "bg-bg-disabled text-text-fourth cursor-not-allowed opacity-60" : [buttonVariants[variant], "active:scale-[0.98] active:opacity-80 cursor-pointer"],
          className
        ),
        ...props,
        children
      }
    );
  }
);
MiniButton.displayName = "MiniButton";
const emptyAvatar = "/images/empty_avatar.png";
const sizeClasses$6 = {
  xs: "w-3 h-3",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24"
};
const shapeClasses = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none"
};
const Avatar = ({
  src,
  alt,
  sz = "md",
  shape = "circle",
  className,
  children,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const imageSource = hasError || !src ? emptyAvatar : src;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex-shrink-0 select-none overflow-hidden",
        "aspect-square object-contain bg-bg-main",
        sizeClasses$6[sz],
        shapeClasses[shape],
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imageSource,
            alt,
            className: "w-full h-full object-cover relative z-0",
            onError: () => setHasError(true)
          }
        ),
        children
      ]
    }
  );
};
Avatar.displayName = "Avatar";
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
const styles$2 = {
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
  const checkmarkClass = styles$2["checkmark"];
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
  "user-bg-image": "_user-bg-image_1roog_1"
};
function BackgroundImage({
  src,
  alt,
  className,
  children,
  metadata
}) {
  const containerRef = useRef(null);
  console.log("BackgroundImage metadata:", metadata);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--bg-image", `url(${src})`);
      if (metadata && metadata.width && metadata.height) {
        const { x = 0, y = 0, width = 100, height = 100 } = metadata;
        const sizeX = 100 / (width / 100);
        const sizeY = 100 / (height / 100);
        const posX = width < 100 ? x / (100 - width) * 100 : 50;
        const posY = height < 100 ? y / (100 - height) * 100 : 50;
        containerRef.current.style.setProperty("--bg-size", `${sizeX}% ${sizeY}%`);
        containerRef.current.style.setProperty("--bg-position", `${posX}% ${posY}%`);
      } else {
        containerRef.current.style.setProperty("--bg-size", `cover`);
        containerRef.current.style.setProperty("--bg-position", `center`);
      }
    }
  }, [src, metadata]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: clsx(
        "rounded-2xl relative overflow-hidden",
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
const sizeClasses$5 = {
  sm: {
    logo: "text-base sm:text-lg",
    // Khoảng 16-18px
    slogan: "text-xs"
    // 12px (Giới hạn tối thiểu an toàn)
  },
  md: {
    logo: "text-xl sm:text-2xl",
    // Khoảng 20-24px (Vừa vặn cho thanh điều hướng)
    slogan: "text-xs"
    // 12px
  },
  lg: {
    logo: "text-3xl sm:text-4xl",
    // Khoảng 30-36px (Phù hợp trang giới thiệu)
    slogan: "text-sm"
    // 14px
  },
  xl: {
    logo: "text-4xl sm:text-5xl",
    // Khoảng 36-48px (Vừa phải cho màn hình đăng nhập)
    slogan: "text-base text-gray-400"
    // 16px
  }
};
const Logo = ({ hasSlogan = true, sz = "md", className, ...props }) => {
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col items-center", className), ...props, children: [
    /* @__PURE__ */ jsx(
      "h1",
      {
        className: clsx("font-bagel_fat_one text-gradient-main select-none", sizeClasses$5[sz].logo),
        children: "Fatagram"
      }
    ),
    hasSlogan && /* @__PURE__ */ jsx(
      "p",
      {
        className: clsx(
          "text-gradient-second font-light font-bagel_fat_one select-none whitespace-nowrap",
          sizeClasses$5[sz].slogan
        ),
        children: "Share your fun moments with the world!"
      }
    )
  ] });
};
const useClickOutside = (refTarget, refException, callback, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;
    const handleClickOutside = (event) => {
      if (refTarget.current && !refTarget.current.contains(event.target)) {
        if (refException.current && refException.current.contains(event.target)) return;
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refTarget, refException, callback, isActive]);
};
const AnimationLib = {
  SoftFade: {
    in: "animate-soft-fade-in",
    out: "animate-soft-fade-out",
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
const useMediaQuery = (query) => {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };
  const [matches, setMatches] = useState(getInitial);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [query]);
  return matches;
};
const sizeClasses$4 = {
  sm: { main: "px-3 py-2", text: "text-sm" },
  md: { main: "px-4 py-3", text: "text-base" },
  lg: { main: "px-6 py-4", text: "text-lg" },
  xl: { main: "px-8 py-5", text: "text-xl" }
};
const SelectBox = ({
  title: title2,
  showTitle = true,
  isRequired = false,
  options,
  selectedOption,
  onSelect,
  optionClassName,
  optionActiveClassName,
  dropdownClassName,
  className,
  sz = "md",
  disabled = false,
  ...props
}) => {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const btnRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);
  useClickOutside(
    desktopDropdownRef,
    btnRef,
    () => {
      if (isOpen) setIsOpen(false);
    },
    !isMobile
  );
  const selectedItem = options.find((opt) => opt.key === selectedOption);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    showTitle && title2 && /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: selectId,
        className: clsx(
          "flex items-center gap-1 mb-1 ml-1 font-medium text-text-secondary",
          sizeClasses$4[sz].text
        ),
        children: [
          title2,
          isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        id: selectId,
        ref: btnRef,
        type: "button",
        disabled,
        onClick: () => setIsOpen(!isOpen),
        className: clsx(
          "w-full flex items-center justify-between",
          "border-[2px] border-transparent rounded-xl outline-none transition-all duration-300",
          sizeClasses$4[sz].main,
          sizeClasses$4[sz].text,
          disabled ? "bg-bg-second opacity-60 cursor-not-allowed" : "bg-bg-fourth shadow-sm hover:bg-bg-hover focus:border-primary-500",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: selectedItem ? selectedItem.value : "Select..." }),
          /* @__PURE__ */ jsx(
            "i",
            {
              className: clsx("fa-solid fa-caret-down transition-transform", isOpen && "rotate-180")
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Transition,
      {
        animation: AnimationLib.DropdownSlide,
        show: isOpen,
        duration: 100,
        className: "hidden sm:block absolute w-full z-50 mt-1",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: desktopDropdownRef,
            className: clsx(
              "bg-bg-card rounded-xl shadow-lg border border-border-main overflow-hidden",
              dropdownClassName
            ),
            children: /* @__PURE__ */ jsx("ul", { className: "max-h-60 overflow-y-auto p-1", children: options.map((item) => /* @__PURE__ */ jsx(
              "li",
              {
                className: clsx(
                  "px-4 py-2 cursor-pointer rounded-lg transition-colors truncate",
                  sizeClasses$4[sz].text,
                  optionClassName,
                  selectedOption === item.key ? optionActiveClassName || "bg-primary-500/10 text-primary-600 font-medium" : "hover:bg-bg-hover"
                ),
                onClick: () => {
                  onSelect(item.key);
                  setIsOpen(false);
                },
                children: item.value
              },
              String(item.key)
            )) })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      Transition,
      {
        animation: AnimationLib.SoftFade,
        show: isOpen,
        duration: 200,
        className: "fixed inset-0 sm:hidden",
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-[9999]", onClick: () => setIsOpen(false) })
      }
    ),
    /* @__PURE__ */ jsx(
      Transition,
      {
        animation: AnimationLib.SlideUp,
        show: isOpen,
        duration: 200,
        className: "sm:hidden fixed inset-x-0 bottom-0 z-[9999]",
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: (e) => e.stopPropagation(),
            className: clsx(
              "bg-bg-card rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.1)] border-t border-border-main",
              "max-h-[72vh] flex flex-col",
              dropdownClassName
            ),
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-1.5 bg-border-main/50 rounded-full mx-auto mt-3 mb-1 shrink-0" }),
              /* @__PURE__ */ jsx("div", { className: "px-6 py-3 shrink-0 border-b border-border-main/30", children: /* @__PURE__ */ jsx("div", { className: "text-center text-lg font-semibold text-text-primary", children: title2 || "Select Option" }) }),
              /* @__PURE__ */ jsx("ul", { className: "py-2 overflow-y-auto", children: options.map((item) => /* @__PURE__ */ jsx(
                "li",
                {
                  className: clsx(
                    "px-6 py-4 cursor-pointer transition-colors border-b border-border-main/10 last:border-none",
                    sizeClasses$4[sz].text,
                    optionClassName,
                    selectedOption === item.key ? optionActiveClassName || "bg-primary-500/10 text-primary-600 font-medium" : "hover:bg-bg-hover/60"
                  ),
                  onClick: () => {
                    onSelect(item.key);
                    setIsOpen(false);
                  },
                  children: item.value
                },
                String(item.key)
              )) }),
              /* @__PURE__ */ jsx("div", { className: "h-6 shrink-0" })
            ]
          }
        )
      }
    )
  ] });
};
const sizeClasses$3 = {
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-32"
};
const Skeleton = ({
  className,
  sz = "md",
  variant = "text",
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "w-full animate-pulse bg-bg-third",
        sizeClasses$3[sz],
        {
          "rounded-md": variant === "text",
          "rounded-xl": variant === "rect",
          "aspect-square !w-auto !rounded-full": variant === "circle"
        },
        className
      ),
      ...props
    }
  );
};
const styles$1 = {
  "primary-textbox": "_primary-textbox_1akqj_1",
  "primary-textbox-wrong": "_primary-textbox-wrong_1akqj_28"
};
const sizeClasses$2 = {
  sm: { mainText: "px-2 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-2 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-3 py-5 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-4 py-6 text-xl", titleText: "text-xl" }
};
const Textbox = forwardRef(
  ({
    isWrong = false,
    wrongMessage,
    title: title2,
    isRequired = false,
    className,
    sz = "md",
    wrapperClassName,
    placeholder,
    type,
    disabled,
    value,
    onChange,
    autoComplete = "off",
    ...props
  }, ref) => {
    const inputId = useId();
    const [showPassword, setShowPassword] = useState(false);
    const typeOfText = type === "password" ? showPassword ? "text" : "password" : type;
    return /* @__PURE__ */ jsxs("div", { className: clsx(wrapperClassName, "flex flex-col gap-1"), children: [
      title2 && /* @__PURE__ */ jsxs(
        "label",
        {
          htmlFor: inputId,
          className: clsx("flex items-center gap-1 ml-1 font-medium", sizeClasses$2[sz].titleText),
          children: [
            title2,
            isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        type === "search" && /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 z-10" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: inputId,
            type: typeOfText,
            ref,
            disabled,
            placeholder,
            value,
            onChange,
            autoComplete,
            className: clsx(
              "w-full border-[2px] text-text-main",
              "font-normal rounded-xl outline-none caret-primary-500 selection:!bg-primary-600",
              "transition-all duration-300 ease-out",
              sizeClasses$2[sz].mainText,
              {
                "pl-10": type === "search",
                "pr-12": type === "password",
                "bg-bg-main opacity-60 cursor-not-allowed": disabled,
                "focus:bg-gradient-main-move": !disabled,
                [styles$1["primary-textbox-wrong"]]: isWrong && !disabled,
                [styles$1["primary-textbox"]]: !isWrong && !disabled
              },
              className
            ),
            ...props
          }
        ),
        type === "password" && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            tabIndex: -1,
            className: "absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-1",
            onClick: () => setShowPassword(!showPassword),
            children: /* @__PURE__ */ jsx(
              "i",
              {
                className: clsx(
                  "fa-solid",
                  showPassword ? "fa-eye text-secondary-500" : "fa-eye-slash text-text-main"
                )
              }
            )
          }
        )
      ] }),
      isWrong && wrongMessage && /* @__PURE__ */ jsx("span", { className: "text-red-400 text-sm ml-1", children: wrongMessage })
    ] });
  }
);
Textbox.displayName = "Textbox";
const styles = {
  "my-textarea": "_my-textarea_1dfsx_1",
  "my-textarea-wrong": "_my-textarea-wrong_1dfsx_30",
  "custom-scrollbar": "_custom-scrollbar_1dfsx_60"
};
const sizeClasses$1 = {
  sm: { mainText: "px-2 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-2 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-3 py-5 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-4 py-6 text-xl", titleText: "text-xl" }
};
const TextArea = forwardRef(
  ({
    isWrong = false,
    wrongMessage,
    title: title2,
    isRequired = false,
    className,
    containerClassName,
    sz = "md",
    wrapperClassName,
    topContent,
    topContentClassName,
    placeholder,
    disabled,
    value,
    onChange,
    rows = 1,
    maxRows,
    ...props
  }, ref) => {
    const inputId = useId();
    const innerRef = useRef(null);
    const styleCache = useRef(
      null
    );
    const setRefs = useCallback(
      (node) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    const autoResize = useCallback(() => {
      const textarea = innerRef.current;
      if (!textarea) return;
      if (!styleCache.current) {
        const compStyle = window.getComputedStyle(textarea);
        styleCache.current = {
          lineHeight: parseFloat(compStyle.lineHeight) || 20,
          paddingY: (parseFloat(compStyle.paddingTop) || 0) + (parseFloat(compStyle.paddingBottom) || 0),
          borderY: (parseFloat(compStyle.borderTopWidth) || 0) + (parseFloat(compStyle.borderBottomWidth) || 0)
        };
      }
      const { lineHeight, paddingY, borderY } = styleCache.current;
      textarea.style.height = "0px";
      const minHeight = rows * lineHeight + paddingY + borderY;
      const maxHeight = maxRows && maxRows > 0 ? maxRows * lineHeight + paddingY + borderY : Number.POSITIVE_INFINITY;
      const nextHeight = Math.min(Math.max(textarea.scrollHeight + borderY, minHeight), maxHeight);
      textarea.style.height = `${nextHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [maxRows, rows]);
    useLayoutEffect(() => {
      autoResize();
    }, [autoResize, value]);
    const handleChange = (event) => {
      autoResize();
      onChange?.(event);
    };
    return /* @__PURE__ */ jsxs("div", { className: clsx(wrapperClassName, "flex flex-col gap-1"), children: [
      title2 && /* @__PURE__ */ jsxs(
        "label",
        {
          htmlFor: inputId,
          className: clsx("flex items-center gap-1 ml-1 font-medium", sizeClasses$1[sz].titleText),
          children: [
            title2,
            isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: clsx(
            "w-full border-[2px] text-text-main",
            "font-normal rounded-xl transition-all duration-300 ease-out",
            "focus-within:bg-gradient-main-move",
            {
              "bg-bg-main opacity-60 cursor-not-allowed": disabled,
              [styles["my-textarea-wrong"]]: isWrong && !disabled,
              [styles["my-textarea"]]: !isWrong && !disabled
            },
            containerClassName,
            className
          ),
          children: [
            topContent && /* @__PURE__ */ jsx("div", { className: clsx(topContentClassName), children: topContent }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: inputId,
                ref: setRefs,
                disabled,
                placeholder,
                value,
                onChange: handleChange,
                rows,
                className: clsx(
                  "w-full bg-transparent text-text-main resize-none",
                  "outline-none caret-primary-500 selection:!bg-primary-600",
                  "rounded-b-[inherit]",
                  "block",
                  { "pt-0": rows > 0 },
                  sizeClasses$1[sz].mainText,
                  styles["custom-scrollbar"]
                ),
                ...props
              }
            )
          ]
        }
      ),
      isWrong && wrongMessage && /* @__PURE__ */ jsx("span", { className: "text-red-400 text-sm ml-1", children: wrongMessage })
    ] });
  }
);
TextArea.displayName = "TextArea";
const textSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl"
};
const weightClasses = {
  light: "font-light",
  regular: "font-[400]",
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
    sz = "md",
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
        className: clsx(
          textSizes[sz],
          weightClasses[weight],
          colorClasses[color],
          wrap,
          "break-words",
          className
        ),
        ref,
        ...props,
        children
      }
    );
  }
);
Text.displayName = "Text";
const Footer = ({ className }) => {
  return /* @__PURE__ */ jsxs("footer", { className: clsx("text-center text-text-third text-sm py-4", className), children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " Fatagram. All rights reserved."
  ] });
};
const sizeClasses = {
  sm: { mainText: "px-3 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-4 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-6 py-4 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-8 py-5 text-xl", titleText: "text-xl" }
};
const SelectDay = forwardRef(
  ({
    title: title2,
    isRequired = false,
    isWrong = false,
    wrongMessage,
    className,
    sz = "md",
    disabled = false,
    ...props
  }, ref) => {
    const inputId = useId();
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-full", children: [
      title2 && /* @__PURE__ */ jsxs(
        "label",
        {
          htmlFor: inputId,
          className: clsx(
            "flex items-center gap-1 ml-1 font-medium text-text-secondary",
            sizeClasses[sz].titleText
          ),
          children: [
            title2,
            isRequired && /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: inputId,
          type: "date",
          ref,
          disabled,
          className: clsx(
            "w-full border-[2px] text-text-main font-normal rounded-xl outline-none",
            "caret-primary-500 selection:!bg-primary-600 shadow-sm",
            "transition-all duration-300 ease-out",
            sizeClasses[sz].mainText,
            disabled ? "bg-bg-second opacity-60 cursor-not-allowed" : "bg-bg-fourth border-border-main focus:ring-2 focus:ring-primary-500",
            isWrong && "border-red-400",
            className
          ),
          ...props
        }
      ),
      isWrong && wrongMessage && /* @__PURE__ */ jsx("span", { className: "text-sm text-red-400 ml-1", children: wrongMessage })
    ] });
  }
);
SelectDay.displayName = "SelectDay";
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
const PREFIX$6 = buildApiPath("/friendship");
class FriendshipService {
  async GetFriendshipStatus(targetId) {
    return apiGet(`${PREFIX$6}/status/${targetId}`);
  }
  async SendAddFriendRequest(receiverId) {
    return apiPost(`${PREFIX$6}/add/${receiverId}`);
  }
  async CancelAddFriendRequest(senderId) {
    return apiDelete(`${PREFIX$6}/cancel/${senderId}`);
  }
  async AcceptAddFriendRequest(senderId) {
    return apiPost(`${PREFIX$6}/accept/${senderId}`);
  }
  async DeclineAddFriendRequest(requesterId) {
    return apiDelete(`${PREFIX$6}/decline/${requesterId}`);
  }
  async Unfriend(friendId) {
    return apiDelete(`${PREFIX$6}/unfriend/${friendId}`);
  }
  async GetNumberOfFriends(targetId) {
    return apiGet(`${PREFIX$6}/count/${targetId}`);
  }
  async GetFriendRequests(query) {
    return await apiGet(`${PREFIX$6}/requests`, query);
  }
  async GetFriends(userId, query) {
    return await apiGet(`${PREFIX$6}/friends/${userId}`, query);
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
function getNotificationContent(type, fallbackContent, t2) {
  const i18nKey = typeToI18nKey[type];
  if (i18nKey && t2) {
    return `{actorName} ${t2(i18nKey)}`;
  }
  if (fallbackContent) {
    return fallbackContent;
  }
  return t2 ? `{actorName} ${t2("notifications:notifications.default-notification")}` : "{actorName}";
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
  const { t: t2 } = useTranslation();
  const formatTime = (rawTime) => {
    const _rawTime = new Date(rawTime);
    const time2 = timeDistance(_rawTime);
    if (time2.count) {
      return t2(`${time2.unit}`, { count: time2.count }) + " " + t2(time2.text);
    }
    return t2("times:just_now");
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
      return `${t2("times:yesterday")} ${time2}`;
    }
    if (diffInDays < 7) {
      const time2 = _date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      return `${t2(`times:weekday:${_date.getDay()}`)} ${time2}`;
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
  const { t: t2 } = useTranslation();
  const content = getNotificationContent(notificationDto.type, notificationDto.content, t2);
  const { formatTime } = useFormatTime();
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2 select-none", onClick, children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-start", children: /* @__PURE__ */ jsx(Avatar, { src: notificationDto.actorImageUrl, alt: "Avatar", sz: "md" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
      /* @__PURE__ */ jsx(
        Text,
        {
          sz: "sm",
          className: clsx({ "opacity-60": notificationDto.isRead }),
          wrap: "whitespace-normal",
          children: renderContent(content, {
            actorName: /* @__PURE__ */ jsx(Text, { sz: "sm", weight: "bold", children: notificationDto.actorName }, notificationDto.actorId)
          })
        }
      ),
      /* @__PURE__ */ jsx(
        Text,
        {
          sz: "sm",
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
  const { t: t2 } = useTranslation();
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
        setMessage(t2("notifications:notifications.accepted"));
        messageMap[notificationDto.id] = t2("notifications:notifications.accepted");
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
        setMessage(t2("notifications:notifications.declined"));
        messageMap[notificationDto.id] = t2("notifications:notifications.declined");
      }
    };
    deleteFriendRequest();
  };
  return /* @__PURE__ */ jsx(BaseNotification, { notificationDto, onClick: handleClick, children: !message ? /* @__PURE__ */ jsxs("div", { className: clsx("flex", "gap-1", "mt-1", "justify-start"), children: [
    /* @__PURE__ */ jsx(Button, { sz: "sm", variant: "primary", onClick: handleAccept, children: t2("user:profileHeader.acceptButton") }),
    /* @__PURE__ */ jsx(
      Button,
      {
        sz: "sm",
        variant: "secondary",
        onClick: handleDelete,
        className: "border-[1.5px] border-primary-500",
        children: t2("user:profileHeader.declineButton")
      }
    )
  ] }) : /* @__PURE__ */ jsx(Text, { sz: "sm", className: clsx("opacity-70"), children: message }) });
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
    /* @__PURE__ */ jsx(Skeleton, { sz: "md", variant: "circle" }),
    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col w-full flex-1 gap-2 ml-2"), children: [
      /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-full"), sz: "sm" }),
      /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-[50%]"), sz: "sm" })
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
              sz: "sm",
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
  return /* @__PURE__ */ jsx("div", { className: clsx("fixed inset-0 z-[9999] flex justify-center items-center bg-bg-main"), children: /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col items-center"), children: /* @__PURE__ */ jsx(Logo, { sz: "lg", hasSlogan: false }) }) });
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
  "light-yellow-pink",
  "pastel-yellow-pink",
  "dark-red",
  "emerald",
  "aurora",
  "dark-blue"
];
const ThemeContext = createContext({
  availableThemes: [],
  theme: "light",
  setTheme: () => {
  }
});
function getInitialTheme() {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("theme");
      if (stored && ThemeList.some((t2) => t2 === stored)) {
        return stored;
      }
    } catch {
    }
    const domTheme = window.document?.documentElement?.getAttribute("data-theme");
    if (domTheme && ThemeList.some((t2) => t2 === domTheme)) {
      return domTheme;
    }
  }
  return "light";
}
function ThemeProvider({ children }) {
  const [theme2, setTheme] = useState(getInitialTheme);
  const t2 = useTranslation().t;
  const availableThemes = [
    { key: "light", label: t2("common:themes:light") },
    { key: "dark", label: t2("common:themes:dark") },
    { key: "universe", label: t2("common:themes:universe") },
    { key: "neon", label: t2("common:themes:neon") },
    { key: "dark-sea", label: t2("common:themes:darkSea") },
    { key: "dark-yellow", label: t2("common:themes:darkYellow") },
    { key: "dark-blue", label: t2("common:themes:darkBlue") },
    { key: "light-yellow-pink", label: t2("common:themes:lightYellowPink") },
    { key: "pastel-yellow-pink", label: t2("common:themes:pastelYellowPink") },
    { key: "dark-red", label: t2("common:themes:darkRed") },
    { key: "emerald", label: t2("common:themes:emerald") },
    { key: "aurora", label: t2("common:themes:aurora") }
  ];
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme2);
    localStorage.setItem("theme", theme2);
    const updateThemeColor = () => {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.appendChild(meta);
      }
      const raw = getComputedStyle(root).getPropertyValue("--bg-main").trim();
      const parts = raw.includes(",") ? raw.split(",") : raw.split(/\s+/);
      const nums = parts.map((p) => Number.parseInt(p.trim(), 10)).filter((n) => Number.isFinite(n));
      if (nums.length < 3) return;
      const [r, g, b] = nums;
      const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      meta.setAttribute("content", hex);
    };
    requestAnimationFrame(updateThemeColor);
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
const MediaViewerContext = createContext({
  onOpen: () => {
  },
  onClose: () => {
  },
  conversationId: null,
  media: null
});
const MediaViewerProvider = ({ children }) => {
  const [conversationId, setConversationId] = useState(null);
  const [media, setMedia] = useState(null);
  const onOpen = useCallback(
    (options) => {
      setConversationId(options.conversationId);
      setMedia({ id: options.id, url: options.url, type: options.type });
    },
    []
  );
  const onClose = useCallback(() => {
    setMedia(null);
    setConversationId(null);
  }, []);
  return /* @__PURE__ */ jsx(MediaViewerContext.Provider, { value: { onOpen, onClose, conversationId, media }, children });
};
function useMediaViewer() {
  const context = useContext(MediaViewerContext);
  if (context === void 0) {
    throw new Error("useMediaViewer must be used within a MediaViewerProvider");
  }
  return context;
}
function ContextTree({ children, authContext }) {
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(
    AuthProvider,
    {
      initialIsAuthenticated: authContext?.isAuthenticated,
      userData: authContext?.userData,
      children: /* @__PURE__ */ jsx(LoadingProvider, { children: /* @__PURE__ */ jsx(DialogProvider, { children: /* @__PURE__ */ jsx(SnackbarProvider, { children: /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx(MediaViewerProvider, { children }) }) }) }) })
    }
  ) });
}
const ImageView = ({ url, className }) => {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: url,
      alt: "media-view",
      className: clsx("max-h-[85vh] max-w-[90vw] object-contain rounded-lg select-none", className),
      draggable: false
    }
  );
};
const SPEED_OPTIONS = [0.75, 1, 1.5, 2];
const VideoMessage = ({
  url,
  className,
  onFullscreenToggle,
  onFrameClick
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const formatTime = (seconds, totalDuration) => {
    const displaySeconds = Math.min(seconds, totalDuration);
    const mins = Math.floor(displaySeconds / 60);
    const secs = Math.floor(displaySeconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const onVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      setCurrentTime(videoRef.current.duration);
    }
  };
  const handleInitialPlay = () => {
    setHasStarted(true);
    videoRef.current?.play();
  };
  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };
  const handleSeek = (e) => {
    const time2 = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time2;
      setCurrentTime(time2);
    }
  };
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      if (newMutedState) {
        videoRef.current.volume = 0;
      } else {
        const restoreVolume = volume === 0 ? 1 : volume;
        setVolume(restoreVolume);
        videoRef.current.volume = restoreVolume;
      }
    }
  };
  const safeTimeRatio = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const timeFillPercent = `${safeTimeRatio * 100}%`;
  const volumePercent = (isMuted ? 0 : volume) * 100;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `relative group bg-black overflow-hidden flex items-center justify-center transition-all duration-300
        ${className}`,
      children: [
        /* @__PURE__ */ jsx(
          "video",
          {
            ref: videoRef,
            src: url,
            className: `w-full h-full object-contain cursor-pointer ${!hasStarted ? "opacity-60" : "opacity-100"}`,
            onClick: () => {
              if (onFrameClick) {
                onFrameClick();
                return;
              }
              if (hasStarted) {
                togglePlay();
                return;
              }
              handleInitialPlay();
            },
            onWaiting: () => setIsWaiting(true),
            onCanPlay: () => setIsWaiting(false),
            onPlaying: () => {
              setIsPlaying(true);
              setIsWaiting(false);
            },
            onPause: () => setIsPlaying(false),
            onEnded: onVideoEnded,
            onTimeUpdate: () => setCurrentTime(videoRef.current?.currentTime || 0),
            onLoadedMetadata: () => setDuration(videoRef.current?.duration || 0),
            muted: isMuted,
            playsInline: true
          }
        ),
        !hasStarted && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleInitialPlay,
            className: clsx(
              "absolute z-10",
              "w-16 h-16 !rounded-full text-white flex items-center justify-center transition-all active:scale-98"
            ),
            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play text-2xl pl-[2px]" })
          }
        ),
        isWaiting && hasStarted && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-spinner fa-spin text-white text-4xl opacity-80" }) }),
        hasStarted && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 
          ${isPlaying && !isWaiting ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-full h-4 flex items-center mb-4 cursor-pointer group/seek", children: [
                /* @__PURE__ */ jsx("div", { className: "relative w-full h-1.5 rounded-full bg-white/30 overflow-hidden", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute left-0 top-0 h-full rounded-full bg-primary-500",
                    style: { width: timeFillPercent }
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute w-3.5 h-3.5 rounded-full bg-primary-500 shadow-md -translate-x-1/2",
                    style: { left: timeFillPercent }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "range",
                    min: 0,
                    max: duration || 0,
                    step: "0.1",
                    value: currentTime,
                    onChange: handleSeek,
                    className: "absolute inset-0 w-full opacity-0 cursor-pointer"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-white drop-shadow-md", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
                  /* @__PURE__ */ jsx("button", { onClick: togglePlay, className: "hover:text-primary-400 transition-colors w-5", children: /* @__PURE__ */ jsx("i", { className: `fas ${isPlaying ? "fa-pause" : "fa-play"} text-xl` }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center group/volume relative", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: toggleMute,
                        className: "hover:text-primary-400 transition-colors w-5 shrink-0",
                        children: /* @__PURE__ */ jsx(
                          "i",
                          {
                            className: `fas ${isMuted || volume === 0 ? "fa-volume-mute" : volume < 0.5 ? "fa-volume-down" : "fa-volume-up"}`
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "hidden sm:flex items-center overflow-hidden w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 group-hover/volume:ml-2 transition-all duration-300 ease-in-out", children: /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "range",
                        min: 0,
                        max: 1,
                        step: 0.05,
                        value: isMuted ? 0 : volume,
                        onChange: handleVolumeChange,
                        className: "w-full h-1.5 accent-primary-500 cursor-pointer appearance-none bg-white/30 rounded-full",
                        style: {
                          background: `linear-gradient(to right, rgb(var(--primary-500)) ${volumePercent}%, rgba(255,255,255,0.3) ${volumePercent}%)`
                        }
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs bg-black/40 px-2 py-1 rounded font-semibold tabular-nums", children: [
                    formatTime(currentTime, duration),
                    " / ",
                    formatTime(duration, duration)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => {
                        const nextIndex = (SPEED_OPTIONS.indexOf(playbackRate) + 1) % SPEED_OPTIONS.length;
                        const newSpeed = SPEED_OPTIONS[nextIndex];
                        setPlaybackRate(newSpeed);
                        if (videoRef.current) videoRef.current.playbackRate = newSpeed;
                      },
                      className: "text-[10px] font-black border-2 border-white/50 px-2 py-0.5 rounded-lg hover:bg-white/20 transition-all uppercase w-10 text-center",
                      children: [
                        playbackRate,
                        "x"
                      ]
                    }
                  ),
                  onFullscreenToggle && /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: onFullscreenToggle,
                      className: "hover:text-primary-400 transition-colors w-5 text-right",
                      children: /* @__PURE__ */ jsx("i", { className: `fas fa-expand` })
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
};
const VideoView = ({ url, className }) => {
  return /* @__PURE__ */ jsx(
    VideoMessage,
    {
      url,
      className: ["max-h-[85vh] max-w-[90vw] min-h-[220px] min-w-[320px] rounded-lg", className].filter(Boolean).join(" ")
    }
  );
};
const PREFIX$5 = buildApiPath("/conversation");
class ConversationService {
  async getConversations(query) {
    const res = await apiGet(`${PREFIX$5}`, query);
    return res;
  }
  async getDeltaConversations(since) {
    return await apiGet(`${PREFIX$5}/delta`, { since });
  }
  async getConversation(conversationId) {
    return await apiGet(`${PREFIX$5}/${conversationId}`);
  }
  async getConversationWith(targetUserId) {
    return await apiGet(`${PREFIX$5}/with/${targetUserId}`);
  }
  async getMessages(conversationId, query) {
    return await apiGet(`${PREFIX$5}/${conversationId}/messages`, query);
  }
  async getDeltaMessages(conversationId, sinceSequenceNumber) {
    return await apiGet(`${PREFIX$5}/${conversationId}/messages/delta`, { sinceSequenceNumber });
  }
  async createGroupConversation(participantIds, name) {
    return await apiPost(`${PREFIX$5}`, { participantIds, name });
  }
  async markAsSeen(conversationId, messageSeq) {
    return await apiPost(`${PREFIX$5}/${conversationId}/messages/markSeen/${messageSeq}`);
  }
  async getParticipantsSeen(conversationId) {
    return await apiGet(`${PREFIX$5}/${conversationId}/participants/seen`);
  }
  async getUnreadCount() {
    return await apiGet(`${PREFIX$5}/unread-count`);
  }
  async getMediaAround(conversationId, mediaId, config) {
    const { limit = 20, before = true } = config;
    return await apiGet(`${PREFIX$5}/${conversationId}/media/around/${mediaId}`, {
      limit,
      before
    });
  }
  async getMediaAroundAnchor(conversationId, mediaId, count = 10) {
    return await apiGet(`${PREFIX$5}/${conversationId}/media/around-anchor/${mediaId}`, { count });
  }
}
const conversationService = new ConversationService();
function createSafeQueryOptions(params) {
  return {
    queryKey: params.queryKey,
    queryFn: async () => {
      const result = await params.fn();
      if (!result.success) throw result;
      if (result.data === void 0) {
        throw new Error("Success result is missing data");
      }
      return result.data;
    }
  };
}
function useSafeQueryResult(params) {
  const { fn, options, fetchOptions, ...queryOptions } = params;
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });
  const callbacksCalledRef = useRef(false);
  const safeOptions = createSafeQueryOptions({
    queryKey: queryOptions.queryKey,
    fn
  });
  const query = useQuery({
    retry: 0,
    ...queryOptions,
    ...safeOptions,
    ...fetchOptions
  });
  const lastDataUpdatedAtRef = useRef(0);
  useEffect(() => {
    if (query.isSuccess && query.data !== void 0) {
      if (query.dataUpdatedAt > lastDataUpdatedAtRef.current) {
        lastDataUpdatedAtRef.current = query.dataUpdatedAt;
        onSuccessRef.current?.(query.data);
      }
    } else if (query.isError) {
      if (!callbacksCalledRef.current) {
        const errRes = query.error;
        onErrorRef.current?.(errRes.error, errRes.errors);
        callbacksCalledRef.current = true;
      }
    } else if (query.isFetching) {
      callbacksCalledRef.current = false;
    }
  }, [query.status, query.isFetching, query.dataUpdatedAt]);
  return query;
}
function useSafeInfiniteQueryResult(params) {
  const { fn, options, fetchOptions, ...queryOptions } = params;
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });
  const callbacksCalledRef = useRef(false);
  const query = useInfiniteQuery({
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
    },
    retry: 0,
    ...queryOptions,
    ...fetchOptions
  });
  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (!callbacksCalledRef.current) {
        const pages = query.data.pages;
        const lastPage = pages[pages.length - 1];
        if (lastPage) {
          onSuccessRef.current?.(lastPage);
        }
        callbacksCalledRef.current = true;
      }
    } else if (query.isError && query.error) {
      if (!callbacksCalledRef.current) {
        const errRes = query.error;
        onErrorRef.current?.(errRes.error, errRes.errors);
        callbacksCalledRef.current = true;
      }
    } else if (query.isFetching) {
      callbacksCalledRef.current = false;
    }
  }, [query.status, query.isFetching]);
  return query;
}
const conversationKeys = {
  list: (queryParams) => ["conversations", queryParams],
  detail: (conversationId) => ["conversation", conversationId],
  withUser: (targetId) => ["conversation", "with", targetId]
};
const conversationDetailQueryOptions = (conversationId) => createSafeQueryOptions({
  queryKey: conversationKeys.detail(conversationId),
  fn: async () => await conversationService.getConversation(conversationId)
});
const useFetchConversationWith = () => {
  return useResultFetcher(
    async (targetId) => await conversationService.getConversationWith(targetId)
  );
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
        showSnackbar(error?.code ?? "Tạo cuộc trò chuyện nhóm thất bại", "error");
      }
    }
  );
};
const useMarkConversationAsRead = () => {
  return useResultFetcher(
    async ({ conversationId, messageSeq }) => {
      var r = await conversationService.markAsSeen(conversationId, messageSeq);
      return r;
    }
  );
};
const useLocalMarkAsRead = () => {
  const { markAsRead } = useConversationCacheMutations();
  return (conversationId, messageSeq) => {
    markAsRead(conversationId, messageSeq);
  };
};
const useGetPariticipantsSeen = (conversationId) => {
  const queryClient = useQueryClient();
  const queryKey = ["conversation", conversationId, "participantsSeen"];
  useEffect(() => {
    if (conversationId) {
      try {
        queryClient.removeQueries({ queryKey, exact: true });
      } catch (e) {
      }
    }
  }, [conversationId, queryClient, queryKey]);
  return useSafeQueryResult({
    queryKey,
    fn: async () => await conversationService.getParticipantsSeen(conversationId),
    enabled: !!conversationId,
    staleTime: 0,
    gcTime: 0,
    fetchOptions: { refetchOnMount: "always" },
    options: {
      onSuccess: (data) => {
        console.log("Participants seen data: ", data);
        useMessageStore.getState().setBulkParticipantsSeen(conversationId, data.participantsSeenInfo);
      }
    }
  });
};
const useConversations = (queryParams) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const queryOptions = useMemo(
    () => ({
      onSuccess: (data) => {
        const conversations2 = data.items;
        if (conversations2.length > 0) {
          const lastMessageSeqs = {};
          conversations2.forEach((conv) => {
            if (conv.lastMessage) {
              lastMessageSeqs[conv.id] = conv.lastMessage.sequenceNumber;
            }
            const key = ["conversation", "unread-count", conv.id];
            const serverCount = conv.unreadMessageCount ?? 0;
            queryClient.setQueryData(key, (oldCount) => {
              const currentCount = oldCount ?? 0;
              return Math.max(currentCount, serverCount);
            });
          });
          useMessageStore.getState().setBulkLastMessages(lastMessageSeqs);
        }
      }
    }),
    [queryClient]
  );
  return useSafeInfiniteQueryResult({
    queryKey: conversationKeys.list(queryParams),
    fn: async (cursor) => await conversationService.getConversations({ ...queryParams, cursor }),
    enabled: !!userId,
    staleTime: Infinity,
    options: queryOptions
  });
};
const useGetDeltaConversations = () => {
  const { data } = useConversations();
  const { mergeDeltaConversations } = useConversationCacheMutations();
  const fetcher = useResultFetcher(
    async (since) => await conversationService.getDeltaConversations(since)
  );
  const fetcherDelta = async () => {
    const lastActiveAt = data?.pages[0]?.items[0]?.lastMessage?.createdAt;
    return await fetcher.fetch(lastActiveAt ?? /* @__PURE__ */ new Date(0), {
      onSuccess: (data2) => {
        mergeDeltaConversations(data2 ?? []);
      }
    });
  };
  return { fetcherDelta };
};
const useConversationCacheMutations = () => {
  const queryClient = useQueryClient();
  const updateDetailCache = (conversationId, updateFn) => {
    const detailKey = conversationKeys.detail(conversationId);
    queryClient.setQueryData(detailKey, (oldDetail) => {
      if (!oldDetail) return oldDetail;
      return updateFn(oldDetail);
    });
  };
  const updateConversationInCache = (conversationId, updateFn) => {
    const listKey = conversationKeys.list();
    queryClient.setQueryData(listKey, (oldData) => {
      if (!oldData || !oldData.pages.length) return oldData;
      const newPages = oldData.pages.map((page) => ({
        ...page,
        items: page.items.map((item) => item.id === conversationId ? updateFn(item) : item)
      }));
      return {
        ...oldData,
        pages: newPages
      };
    });
    updateDetailCache(conversationId, updateFn);
  };
  const markAsRead = async (conversationId, messageSeq) => {
    updateConversationInCache(conversationId, (conv) => ({
      ...conv,
      myLastSeenMessageSeq: messageSeq,
      unreadMessageCount: 0
    }));
  };
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
    queryClient.setQueryData(conversationKeys.detail(conversationId), existedConv);
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
  const mergeDeltaConversations = (deltaConvs) => {
    const listKey = conversationKeys.list();
    queryClient.setQueryData(listKey, (oldData) => {
      if (!oldData || deltaConvs.length === 0) return oldData;
      const deltaMap = new Map(deltaConvs.map((c) => [c.id, c]));
      const mergedItemsMap = /* @__PURE__ */ new Map();
      let newPages = oldData.pages.map((page) => {
        const remainingItems = page.items.filter((item) => {
          if (deltaMap.has(item.id)) {
            mergedItemsMap.set(item.id, { ...item, ...deltaMap.get(item.id) });
            return false;
          }
          return true;
        });
        return { ...page, items: remainingItems };
      });
      const topItems = deltaConvs.map(
        (delta) => mergedItemsMap.has(delta.id) ? mergedItemsMap.get(delta.id) : delta
      );
      if (newPages.length > 0) {
        const orderedTopItems = [...topItems].reverse();
        newPages[0] = {
          ...newPages[0],
          items: [...orderedTopItems, ...newPages[0].items]
        };
      }
      return { ...oldData, pages: newPages };
    });
  };
  return { mergeDeltaConversations, pushConversationToTop, updateConversationInCache, markAsRead };
};
const useGetUnreadMessageCount = () => {
  const { userId } = useAuth();
  return useSafeQueryResult({
    queryKey: ["conversation", "unread-count", userId],
    fn: async () => await conversationService.getUnreadCount()
  });
};
const useUnreadMessageCountCacheMutations = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const setUnreadCount = (update) => {
    const key = ["conversation", "unread-count", userId];
    queryClient.setQueryData(key, (oldCount) => {
      const currentCount = oldCount ?? 0;
      const newCount = update(currentCount);
      return Math.max(0, newCount);
    });
  };
  const setUnreadCountForConversation = (conversationId, update) => {
    const key = ["conversation", "unread-count", conversationId];
    queryClient.setQueryData(key, (oldCount) => {
      const currentCount = oldCount ?? 0;
      const newCount = update(currentCount);
      return Math.max(0, newCount);
    });
  };
  const getUnreadCountForConversation = (conversationId) => {
    const key = ["conversation", "unread-count", conversationId];
    return queryClient.getQueryData(key) ?? 0;
  };
  return { setUnreadCount, setUnreadCountForConversation, getUnreadCountForConversation };
};
const useUnreadMessageCountCache = (conversationId) => {
  const { data: unreadCount } = useQuery({
    queryKey: ["conversation", "unread-count", conversationId],
    queryFn: () => {
      return 0;
    },
    enabled: !!conversationId,
    staleTime: Infinity,
    initialData: 0
  });
  return unreadCount ?? 0;
};
const useMessageStore = create((set) => ({
  lastMessageMap: {},
  messageUserSeenMap: {},
  setLastMessage: (conversationId, messageSeq) => set((state) => ({
    lastMessageMap: {
      ...state.lastMessageMap,
      [conversationId]: messageSeq
    }
  })),
  setBulkLastMessages: (data) => set((state) => ({
    lastMessageMap: {
      ...state.lastMessageMap,
      ...Object.entries(data).reduce(
        (acc, [convId, newSeq]) => {
          const currentSeq = state.lastMessageMap[convId];
          acc[convId] = currentSeq !== void 0 ? Math.max(currentSeq, newSeq) : newSeq;
          return acc;
        },
        {}
      )
    }
  })),
  setParticipantsSeen: (conversationId, userId, participantSeen) => {
    set((state) => {
      const rawConvMap = state.messageUserSeenMap?.[conversationId] || {};
      const newMsgSeq = participantSeen.sequenceNumber;
      let previousSeq;
      for (const [messageSeq, viewers] of Object.entries(rawConvMap)) {
        if (viewers.some((viewer) => viewer.userId === userId)) {
          previousSeq = Number(messageSeq);
          break;
        }
      }
      if (previousSeq === newMsgSeq) {
        const existingAtNew = rawConvMap[newMsgSeq] || [];
        const existingViewer = existingAtNew.find((viewer) => viewer.userId === userId);
        if (existingViewer?.seenAt === participantSeen.seenAt) {
          return state;
        }
      }
      const nextConvMap = { ...rawConvMap };
      if (previousSeq !== void 0) {
        const reducedPrev = (rawConvMap[previousSeq] || []).filter(
          (viewer) => viewer.userId !== userId
        );
        if (reducedPrev.length > 0) {
          nextConvMap[previousSeq] = reducedPrev;
        } else {
          delete nextConvMap[previousSeq];
        }
      }
      const currentAtNew = nextConvMap[newMsgSeq] ? [...nextConvMap[newMsgSeq]] : [];
      const existingIndex = currentAtNew.findIndex((viewer) => viewer.userId === userId);
      if (existingIndex >= 0) {
        currentAtNew[existingIndex] = { userId, seenAt: participantSeen.seenAt };
      } else {
        currentAtNew.push({ userId, seenAt: participantSeen.seenAt });
      }
      nextConvMap[newMsgSeq] = currentAtNew;
      return {
        messageUserSeenMap: {
          ...state.messageUserSeenMap,
          [conversationId]: nextConvMap
        }
      };
    });
  },
  setBulkParticipantsSeen: (conversationId, data) => {
    set((state) => {
      if (!data) return state;
      const currentConvMap = state.messageUserSeenMap?.[conversationId] || {};
      const toTime = (value) => {
        const t2 = new Date(value).getTime();
        return Number.isFinite(t2) ? t2 : 0;
      };
      const mergedByUser = {};
      Object.entries(currentConvMap).forEach(([messageSeq, viewers]) => {
        viewers.forEach((viewer) => {
          const existing = mergedByUser[viewer.userId];
          if (!existing || toTime(viewer.seenAt) > toTime(existing.seenAt)) {
            mergedByUser[viewer.userId] = {
              sequenceNumber: Number(messageSeq),
              seenAt: viewer.seenAt
            };
          }
        });
      });
      Object.entries(data).forEach(([userId, seenInfo]) => {
        const existing = mergedByUser[userId];
        if (!existing || toTime(seenInfo.seenAt) > toTime(existing.seenAt)) {
          mergedByUser[userId] = {
            sequenceNumber: Number(seenInfo.sequenceNumber),
            seenAt: seenInfo.seenAt
          };
        }
      });
      const newConvMap = {};
      Object.entries(mergedByUser).forEach(([userId, seenInfo]) => {
        if (!newConvMap[seenInfo.sequenceNumber]) newConvMap[seenInfo.sequenceNumber] = [];
        newConvMap[seenInfo.sequenceNumber].push({ userId, seenAt: seenInfo.seenAt });
      });
      return {
        messageUserSeenMap: {
          ...state.messageUserSeenMap,
          [conversationId]: newConvMap
        }
      };
    });
  }
}));
const useMediaAroundAnchor = (conversationId, mediaId) => {
  return useSafeQueryResult({
    queryKey: ["conversation", conversationId, "media-around-anchor", mediaId],
    fn: async () => await conversationService.getMediaAroundAnchor(conversationId, mediaId, 10),
    enabled: !!conversationId && !!mediaId,
    staleTime: 0,
    gcTime: 0
  });
};
const useMediaAround = () => {
  return useResultFetcher(
    async (data) => await conversationService.getMediaAround(data.conversationId, data.mediaId, data.config)
  );
};
var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2["Text"] = "Text";
  MessageType2["Media"] = "Media";
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
var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["Image"] = "Image";
  MediaType2["Video"] = "Video";
  MediaType2["File"] = "File";
  MediaType2["Audio"] = "Audio";
  return MediaType2;
})(MediaType || {});
const PREFETCH_DISTANCE = 3;
const FETCH_BATCH_SIZE = 10;
const MediaViewer = ({ className }) => {
  const { conversationId, media, onClose } = useMediaViewer();
  const [activeMedia, setActiveMedia] = useState(media);
  const [isDownloading, setIsDownloading] = useState(false);
  const [leftMedia, setLeftMedia] = useState([]);
  const [rightMedia, setRightMedia] = useState([]);
  const isFetchingLeft = useRef(false);
  const isFetchingRight = useRef(false);
  const [canFetchLeft, setCanFetchLeft] = useState(true);
  const [canFetchRight, setCanFetchRight] = useState(true);
  const swiperRef = useRef(null);
  const initializedAnchor = useRef(null);
  const thumbnailRefs = useRef({});
  const { data: mediaAroundAnchor } = useMediaAroundAnchor(conversationId || "", media?.id || "");
  const { fetch: fetchMediaAround } = useMediaAround();
  const mergeUniqueMedia = useCallback((items) => {
    const map = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      map.set(item.id || item.url, item);
    });
    return Array.from(map.values());
  }, []);
  useEffect(() => {
    if (mediaAroundAnchor && media?.id && initializedAnchor.current !== media.id) {
      setLeftMedia(mediaAroundAnchor.left || []);
      setRightMedia(mediaAroundAnchor.right || []);
      setCanFetchLeft(true);
      setCanFetchRight(true);
      initializedAnchor.current = media.id;
    }
  }, [mediaAroundAnchor, media?.id]);
  const allMedia = useMemo(() => {
    if (!media) return [];
    const combined = [...leftMedia, media, ...rightMedia];
    return mergeUniqueMedia(combined);
  }, [leftMedia, media, mergeUniqueMedia, rightMedia]);
  const activeIndex = allMedia.findIndex(
    (m) => (m.id || m.url) === (activeMedia?.id || activeMedia?.url)
  );
  const handlePrev = (e) => {
    e?.stopPropagation();
    swiperRef.current?.slidePrev();
  };
  const handleNext = (e) => {
    e?.stopPropagation();
    swiperRef.current?.slideNext();
  };
  const handleSlideChange = (swiper) => {
    const currentMedia = allMedia[swiper.activeIndex];
    if (currentMedia) {
      setActiveMedia(currentMedia);
    }
  };
  const prefetchRight = useCallback(async () => {
    if (!conversationId || isFetchingRight.current || !canFetchRight || allMedia.length === 0)
      return;
    const lastMedia = allMedia[allMedia.length - 1];
    if (!lastMedia?.id) return;
    isFetchingRight.current = true;
    try {
      await fetchMediaAround(
        {
          conversationId,
          mediaId: lastMedia.id,
          config: { limit: FETCH_BATCH_SIZE, before: false }
        },
        {
          onSuccess: (fetchedMedia) => {
            const fetched = fetchedMedia || [];
            if (fetched.length === 0) {
              setCanFetchRight(false);
              return;
            }
            setRightMedia((prev) => mergeUniqueMedia([...prev, ...fetched]));
            if (fetched.length < FETCH_BATCH_SIZE) {
              setCanFetchRight(false);
            }
          }
        }
      );
    } finally {
      isFetchingRight.current = false;
    }
  }, [allMedia, canFetchRight, conversationId, fetchMediaAround, mergeUniqueMedia]);
  const prefetchLeft = useCallback(async () => {
    if (!conversationId || isFetchingLeft.current || !canFetchLeft || allMedia.length === 0) return;
    const firstMedia = allMedia[0];
    if (!firstMedia?.id) return;
    isFetchingLeft.current = true;
    try {
      await fetchMediaAround(
        {
          conversationId,
          mediaId: firstMedia.id,
          config: { limit: FETCH_BATCH_SIZE, before: true }
        },
        {
          onSuccess: (fetchedMedia) => {
            const fetched = fetchedMedia || [];
            if (fetched.length === 0) {
              setCanFetchLeft(false);
              return;
            }
            setLeftMedia((prev) => mergeUniqueMedia([...fetched, ...prev]));
            if (fetched.length < FETCH_BATCH_SIZE) {
              setCanFetchLeft(false);
            }
          }
        }
      );
    } finally {
      isFetchingLeft.current = false;
    }
  }, [allMedia, canFetchLeft, conversationId, fetchMediaAround, mergeUniqueMedia]);
  useEffect(() => {
    setActiveMedia(media);
  }, [media]);
  useEffect(() => {
    if (!activeMedia) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") handlePrev(event);
      else if (event.key === "ArrowRight") handleNext(event);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMedia, onClose]);
  useLayoutEffect(() => {
    if (swiperRef.current && activeIndex !== -1) {
      swiperRef.current.slideTo(activeIndex, 0, false);
    }
  }, [allMedia.length, activeIndex]);
  useEffect(() => {
    if (!activeMedia?.id) return;
    const activeThumbEl = thumbnailRefs.current[activeMedia.id];
    if (activeThumbEl) {
      requestAnimationFrame(() => {
        activeThumbEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      });
    }
  }, [activeMedia?.id, allMedia.length]);
  useEffect(() => {
    if (activeIndex < 0 || allMedia.length === 0) return;
    const distanceToStart = activeIndex;
    const distanceToEnd = allMedia.length - 1 - activeIndex;
    if (distanceToEnd < PREFETCH_DISTANCE && canFetchRight && !isFetchingRight.current) {
      void prefetchRight();
    }
    if (distanceToStart < PREFETCH_DISTANCE && canFetchLeft && !isFetchingLeft.current) {
      void prefetchLeft();
    }
  }, [activeIndex, allMedia.length, canFetchLeft, canFetchRight, prefetchLeft, prefetchRight]);
  if (!activeMedia) return null;
  const onDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(activeMedia.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      const urlPath = new URL(activeMedia.url).pathname;
      const fileName = urlPath.substring(urlPath.lastIndexOf("/") + 1) || (activeMedia.type === MediaType.Image ? "image.jpg" : "video.mp4");
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch {
      console.error("Failed to download media");
    } finally {
      setIsDownloading(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md transition-opacity overscroll-none touch-none",
        className
      ),
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex h-16 w-full items-center justify-end px-6 shrink-0 bg-gradient-to-b from-black/60 to-transparent z-10",
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                MiniButton,
                {
                  className: "!text-white/70 hover:!text-white hover:!bg-white/10 transition-colors",
                  onClick: onDownload,
                  disabled: isDownloading,
                  title: "Download",
                  children: /* @__PURE__ */ jsx(
                    "i",
                    {
                      className: clsx(
                        "fa-solid text-xl",
                        isDownloading ? "fa-spinner fa-spin" : "fa-download"
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                MiniButton,
                {
                  className: "!text-white/70 hover:!text-white hover:!bg-white/10 transition-colors",
                  onClick: onClose,
                  title: "Close (Esc)",
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark text-2xl" })
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-1 min-h-0 items-center justify-center overflow-hidden w-full", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: clsx(
                "absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all hidden md:block",
                activeIndex > 0 ? "text-white/50 hover:text-white hover:bg-white/10 cursor-pointer" : "text-white/10 cursor-not-allowed opacity-50"
              ),
              onClick: handlePrev,
              disabled: activeIndex <= 0,
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left text-3xl" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "h-full w-full", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
            Swiper,
            {
              onSwiper: (swiper) => swiperRef.current = swiper,
              onSlideChange: handleSlideChange,
              initialSlide: activeIndex,
              spaceBetween: 20,
              slidesPerView: 1,
              grabCursor: true,
              className: "w-full h-full",
              children: allMedia.map((m) => {
                const isActive = (m.id || m.url) === (activeMedia?.id || activeMedia?.url);
                return /* @__PURE__ */ jsx(SwiperSlide, { className: "h-full w-full", children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center px-4 py-2 md:px-6 md:py-4", children: m.type === MediaType.Image ? /* @__PURE__ */ jsx(
                  ImageView,
                  {
                    url: m.url,
                    className: "max-h-full max-w-full object-contain rounded-md select-none"
                  }
                ) : isActive ? (
                  // Only mount the real, heavy VideoView when the slide is active
                  /* @__PURE__ */ jsx(VideoView, { url: m.url, className: "max-h-full max-w-full rounded-md" })
                ) : (
                  // Render a lightweight "poster" for inactive video slides to prevent black screens and save data
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "relative max-h-full max-w-full rounded-md overflow-hidden bg-black flex items-center justify-center cursor-pointer",
                      style: { aspectRatio: "16/9" },
                      children: [
                        /* @__PURE__ */ jsx(
                          "video",
                          {
                            src: `${m.url}#t=0.1`,
                            className: "max-h-full max-w-full object-contain opacity-50",
                            preload: "metadata",
                            muted: true,
                            playsInline: true
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play text-white text-6xl opacity-70 drop-shadow-lg" }) })
                      ]
                    }
                  )
                ) }) }, m.id);
              })
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: clsx(
                "absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all hidden md:block",
                activeIndex < allMedia.length - 1 ? "text-white/50 hover:text-white hover:bg-white/10 cursor-pointer" : "text-white/10 cursor-not-allowed opacity-50"
              ),
              onClick: handleNext,
              disabled: activeIndex >= allMedia.length - 1,
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-right text-3xl" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "hidden w-full shrink-0 items-center justify-center bg-black/40 px-4 md:flex z-10",
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsx("div", { className: "max-w-[960px] overflow-x-auto overflow-y-hidden scroll-smooth", children: /* @__PURE__ */ jsx("div", { className: "flex min-w-max items-center gap-2 px-2 py-3", children: allMedia.map((m, index) => {
              const isActive = (m.id || m.url) === (activeMedia?.id || activeMedia?.url);
              return /* @__PURE__ */ jsx(
                "div",
                {
                  ref: (el) => {
                    thumbnailRefs.current[m.id] = el;
                  },
                  onClick: () => {
                    swiperRef.current?.slideTo(index);
                  },
                  className: clsx(
                    "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md transition-all duration-200",
                    isActive ? "ring-4 ring-primary-500 scale-105 opacity-100 z-10" : "opacity-50 hover:opacity-100 hover:scale-105"
                  ),
                  children: m.type === MediaType.Image ? /* @__PURE__ */ jsx("img", { src: m.url, alt: "Thumbnail", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      "video",
                      {
                        src: `${m.url}#t=0.1`,
                        className: "h-full w-full object-cover pointer-events-none",
                        preload: "metadata",
                        muted: true,
                        playsInline: true
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play text-white text-xs" }) })
                  ] })
                },
                m.id
              );
            }) }) })
          }
        )
      ]
    }
  );
};
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
        "relative flex flex-col gap-4 bg-bg-main p-4",
        "rounded-lg shadow-lg",
        className
      ),
      children: [
        title2 && /* @__PURE__ */ jsx(Text, { weight: "bold", sz: "lg", children: title2 }),
        content && /* @__PURE__ */ jsx("div", { children: content }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
          tertiaryButton && /* @__PURE__ */ jsx(Button, { onClick: tertiaryButton.onClick, variant: "secondary", sz: "sm", children: tertiaryButton.text }),
          secondaryButton && /* @__PURE__ */ jsx(Button, { onClick: secondaryButton.onClick, variant: "secondary", sz: "sm", children: secondaryButton.text }),
          primaryButton && /* @__PURE__ */ jsx(Button, { onClick: primaryButton.onClick, variant: "primary", sz: "sm", children: primaryButton.text })
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
const MAX_RETRY = 5;
function useAppHub(onReceiveMessage, onReconnect) {
  const connectionRef = useRef(null);
  const onReceiveMessageRef = useRef(onReceiveMessage);
  const onReconnectRef = useRef(onReconnect);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    onReceiveMessageRef.current = onReceiveMessage;
    onReconnectRef.current = onReconnect;
  }, [onReceiveMessage, onReconnect]);
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    let reconnectTimer = null;
    const receiveMessageHandler = (message) => {
      if (isMounted) {
        onReceiveMessageRef.current(message);
      }
    };
    const tryConnect = async (retry = 0, isReconnectingEvent = false) => {
      const conn = connectionRef.current;
      if (!conn) return;
      try {
        if (conn.state === HubConnectionState.Disconnected) {
          await conn.start();
          conn.off("ReceiveMessage", receiveMessageHandler);
          conn.on("ReceiveMessage", receiveMessageHandler);
          if (isReconnectingEvent && onReconnectRef.current) {
            onReconnectRef.current();
          }
        }
      } catch (err) {
        if (err?.message?.includes("ONBOARDING_NOT_COMPLETED")) {
          authEvents.emit("redirectToOnboarding");
          return;
        }
        console.error("SignalR connection error: ", err);
        if (retry < MAX_RETRY) {
          reconnectTimer = setTimeout(() => tryConnect(retry + 1, isReconnectingEvent), 500);
        }
      }
    };
    const handleSignalRReconnected = () => {
      if (onReconnectRef.current) {
        onReconnectRef.current();
      }
    };
    const startConnection = async () => {
      connectionRef.current = createSignalRConnection();
      connectionRef.current.onreconnected(handleSignalRReconnected);
      await tryConnect();
    };
    startConnection();
    const handleOnboardingCompleted = async () => {
      await tryConnect(0, true);
    };
    const handleNetworkOrVisibilityChange = async () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        const conn = connectionRef.current;
        if (conn?.state === HubConnectionState.Disconnected) {
          await tryConnect(0, true);
        } else if (conn?.state === HubConnectionState.Reconnecting) {
          await conn.stop();
          await tryConnect(0, true);
        }
      }
    };
    authEvents.on("onboardingCompleted", handleOnboardingCompleted);
    window.addEventListener("online", handleNetworkOrVisibilityChange);
    document.addEventListener("visibilitychange", handleNetworkOrVisibilityChange);
    return () => {
      isMounted = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveMessage", receiveMessageHandler);
        connectionRef.current.onreconnected(() => {
        });
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      authEvents.off("onboardingCompleted", handleOnboardingCompleted);
      window.removeEventListener("online", handleNetworkOrVisibilityChange);
      document.removeEventListener("visibilitychange", handleNetworkOrVisibilityChange);
    };
  }, [isAuthenticated]);
}
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
function useMessageListenerHandler() {
  const { addMessageToCache } = useMessageCacheMutations();
  const { pushConversationToTop, updateConversationInCache } = useConversationCacheMutations();
  const { setUnreadCount, setUnreadCountForConversation } = useUnreadMessageCountCacheMutations();
  const { setParticipantsSeen } = useMessageStore();
  const { userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetch: markAsRead } = useMarkConversationAsRead();
  const markAsReadLocal = useLocalMarkAsRead();
  const autoReadMessageKeysRef = useRef(/* @__PURE__ */ new Set());
  const createAutoReadKey = (conversationId, messageSeq) => `${conversationId}:${messageSeq}`;
  const handleNewMessage = useCallback(
    async (message) => {
      const data = message.payload;
      const conversationId = data.conversationId;
      const isOwnMessage = data.senderId === userId;
      if (data.correlationId && useChatStore.getState().registry[data.correlationId]) {
        useChatStore.getState().replaceChat(data.correlationId, conversationId);
      } else {
        const queryParams = new URLSearchParams(location.search);
        const currentTempId = queryParams.get("tempId");
        if (useChatStore.getState().registry["temp-" + data.senderId]) {
          useChatStore.getState().replaceChat("temp-" + data.senderId, conversationId);
        } else if (location.pathname === "/fatalk/temp" && currentTempId === data.senderId) {
          navigate(`/fatalk/${conversationId}`, { replace: true });
        }
        useChatStore.getState().openChat(conversationId, { type: "conversation", conversationId });
      }
      useMessageStore.getState().setLastMessage(conversationId, data.sequenceNumber);
      addMessageToCache(conversationId, data, true);
      pushConversationToTop(conversationId, data);
      if (data.senderId === userId) {
        updateConversationInCache(conversationId, (conv) => ({
          ...conv,
          myLastSeenMessageSeq: data.sequenceNumber
        }));
        markAsReadLocal(conversationId, data.sequenceNumber);
        try {
          await markAsRead({
            conversationId,
            messageSeq: data.sequenceNumber
          });
        } catch {
        }
      }
      const { focusOnId: currentFocusId, activeIds, minimizedIds } = useChatStore.getState();
      const isActiveChat = activeIds.includes(conversationId);
      const isMinimizedChat = minimizedIds.includes(conversationId);
      const isDisplayedChat = isActiveChat && !isMinimizedChat;
      const isDocumentFocused = document.hasFocus();
      if (currentFocusId !== conversationId || !isDisplayedChat || !isDocumentFocused) {
        if (!isOwnMessage) {
          if (data.shouldIncreaseUnreadCount) {
            setUnreadCount((prev) => prev + 1);
          }
          setUnreadCountForConversation(conversationId, (prev) => prev + 1);
        }
      } else if (!isOwnMessage && isDisplayedChat && isDocumentFocused) {
        const autoReadKey = createAutoReadKey(conversationId, data.sequenceNumber);
        autoReadMessageKeysRef.current.add(autoReadKey);
        markAsReadLocal(conversationId, data.sequenceNumber);
        try {
          await markAsRead({
            conversationId,
            messageSeq: data.sequenceNumber
          });
        } catch {
          autoReadMessageKeysRef.current.delete(autoReadKey);
        }
      }
    },
    [
      addMessageToCache,
      location.pathname,
      location.search,
      markAsRead,
      markAsReadLocal,
      navigate,
      pushConversationToTop,
      setUnreadCount,
      setUnreadCountForConversation,
      updateConversationInCache,
      userId
    ]
  );
  const handleSeenMessage = useCallback(
    (message) => {
      const data = message.payload;
      const conversationId = data.conversationId;
      const otherUserId = data.userId;
      setParticipantsSeen(conversationId, data.userId, {
        sequenceNumber: data.messageSeq,
        seenAt: data.seenAt
      });
      if (otherUserId !== userId) {
        updateConversationInCache(conversationId, (conv) => ({
          ...conv,
          otherLastSeenMessageSeq: data.messageSeq
        }));
      } else {
        updateConversationInCache(conversationId, (conv) => ({
          ...conv,
          myLastSeenMessageSeq: data.messageSeq
        }));
        const autoReadKey = createAutoReadKey(conversationId, data.messageSeq);
        const isAutoReadAck = autoReadMessageKeysRef.current.has(autoReadKey);
        if (isAutoReadAck) {
          autoReadMessageKeysRef.current.delete(autoReadKey);
        }
        if (data.shouldDecreaseUnreadCount && !isAutoReadAck) {
          setUnreadCount((prev) => prev - 1);
        }
        setUnreadCountForConversation(conversationId, (_prev) => 0);
      }
    },
    [
      setParticipantsSeen,
      setUnreadCount,
      setUnreadCountForConversation,
      updateConversationInCache,
      userId
    ]
  );
  return useCallback(
    async (message) => {
      switch (message.event) {
        case "NewMessage":
          await handleNewMessage(message);
          break;
        case "SeenMessage":
          handleSeenMessage(message);
          break;
      }
    },
    [handleNewMessage, handleSeenMessage]
  );
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
function useNotificationListenerHandler() {
  const { pushToast } = useToast();
  const { incrementUnread, decrementUnread } = useUnreadCount();
  const { addNotificationToCache, removeNotificationFromCache } = useNotificationCacheMutations();
  return useCallback(
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
}
function AppHubListener() {
  const handleMessageEvent = useMessageListenerHandler();
  const handleNotificationEvent = useNotificationListenerHandler();
  const { fetcherDelta } = useGetDeltaConversations();
  useAppHub(
    async (message) => {
      switch (message.event) {
        case "NewMessage":
        case "SeenMessage":
          await handleMessageEvent(message);
          break;
        case "NewNotification":
          handleNotificationEvent(message);
          break;
      }
    },
    async () => {
      console.log("Reconnected to App Hub, fetching delta conversations...");
      await fetcherDelta();
    }
  );
  return null;
}
const OfflineStatusNotification = () => {
  const { t: t2 } = useTranslation("common");
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsVisible(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (!navigator.onLine) {
      setIsOnline(false);
      setIsVisible(true);
    }
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setIsVisible(false);
    }
  };
  if (!isVisible || isOnline) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: { bottom: "calc(env(safe-area-inset-bottom) + 16px)" },
      className: "fixed inset-x-0 z-[9999] flex justify-center pointer-events-none px-4",
      children: /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto inline-flex items-center gap-3 px-5 py-3 bg-bg-fourth text-text-main rounded-full shadow-sm shadow-warning border border-border-main animate-slide-up-in max-w-sm w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex h-3 w-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-warning/40 opacity-60" }),
          /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-warning" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium flex-1 truncate", children: t2("offline.message") }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleRetry,
            className: "flex-shrink-0 px-3 py-1.5 rounded-full border border-warning text-warning text-xs font-semibold hover:bg-warning/10 active:scale-95 transition-all duration-150",
            children: t2("offline.retry")
          }
        )
      ] })
    }
  );
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
              sz: "md",
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
                sz: "md",
                className: clsx(
                  "transition-colors duration-300",
                  isFocused ? "text-primary-600 font-semibold" : "text-text-main group-hover:text-primary-600"
                ),
                children: title2
              }
            ),
            description2 && /* @__PURE__ */ jsx(Text, { sz: "sm", weight: "light", className: "text-text-second mt-0.5", children: description2 })
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
              sz: "lg",
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
        "bg-bg-main sm:bg-bg-second shadow-md border-r-0 sm:border-r-2 border-bg-eighth",
        "overflow-y-auto",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "flex flex-col relative bg-bg-main sm:bg-bg-second mt-4 mb-2",
              headerClassName
            ),
            children: [
              title2 && /* @__PURE__ */ jsx(Text, { weight: "bold", className: "relative px-6 text-gradient-main !text-2xl", children: title2 }),
              header
            ]
          }
        ),
        children
      ]
    }
  );
};
PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;
const FriendsNavbar = ({ className, onSelect }) => {
  const { t: t2 } = useTranslation();
  const friendPageItems = [
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-plus" }),
      name: t2("friends:navbar.suggestedFriends"),
      path: "/friends"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-check" }),
      name: t2("friends:navbar.invite"),
      path: "requests"
    }
  ];
  return /* @__PURE__ */ jsx(PageNavbar, { title: t2("friends:navbar.title"), className: clsx(className), children: /* @__PURE__ */ jsx(PageNavbar.Section, { className: "px-2 pb-3 space-y-1", children: friendPageItems.map((item, index) => /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(Text, { sz: "lg", weight: "bold", className: clsx(titleClassName), children: title2 }),
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
  const { t: t2 } = useTranslation();
  useEffect(() => {
    document.title = t2("friends:title");
  }, [t2]);
  return /* @__PURE__ */ jsx(
    SidebarPageLayout,
    {
      title: t2("friends:title"),
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
  const { t: t2 } = useTranslation();
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
        /* @__PURE__ */ jsx("div", { className: "w-full cursor-pointer", onClick: handleNavigate, children: /* @__PURE__ */ jsx(Avatar, { src: avatar, alt: "avatar", shape: "rounded", className: "w-full h-full" }) }),
        /* @__PURE__ */ jsx(
          Text,
          {
            sz: "md",
            weight: "bold",
            onClick: handleNavigate,
            className: clsx("truncate overflow-hidden w-full"),
            children: name
          }
        ),
        /* @__PURE__ */ jsxs(Text, { sz: "sm", weight: "light", children: [
          timeDist.count && t2(timeDist.unit || "", { count: timeDist.count }),
          " ",
          t2(timeDist.text)
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "primary", sz: "sm", className: clsx("w-full mt-2 mb-1"), onClick: onAccept, children: t2("user:profileHeader:acceptButton") }),
        /* @__PURE__ */ jsx(Button, { variant: "fourth", sz: "sm", className: clsx("w-full mt-2r"), onClick: onCancel, children: t2("user:profileHeader:declineButton") })
      ]
    }
  );
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
const NotFound = ({ icon, title: title2, description: description2, className }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx("flex flex-col items-center justify-center gap-4 animate-fade-in", className),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 rounded-full bg-bg-third/50 text-text-third", children: /* @__PURE__ */ jsx("i", { className: clsx("text-3xl", icon) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsx(Text, { sz: "md", weight: "bold", className: "text-text-main text-base font-medium", children: title2 }),
          /* @__PURE__ */ jsx(
            Text,
            {
              sz: "sm",
              wrap: "whitespace-pre-wrap",
              className: "text-text-main/60 text-sm text-text-fourth",
              children: description2
            }
          )
        ] })
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
  const { t: t2 } = useTranslation();
  const [_total, _setTotal] = React.useState(0);
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } = useListFriendRequests({
    limit: 20
  });
  const requestsData = React.useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);
  const { fetch: acceptFriendRequest } = useAcceptFriendRequest();
  const { fetch: rejectFriendRequest } = useDeclineFriendRequest();
  return /* @__PURE__ */ jsx(SidebarPageCard, { title: t2("friends:requests.title") || "Lời mời kết bạn", children: /* @__PURE__ */ jsx(
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
      isLoading: isFetching || isPending,
      itemKey: (item) => item.senderId,
      emptyComponent: /* @__PURE__ */ jsx(
        NotFound,
        {
          icon: "fa-solid fa-user-plus text-3xl",
          title: t2("friends:requests.noRequests") || "Không có lời mời nào",
          description: t2("friends:requests.noRequestsDescription") || "Khi có người muốn kết bạn với bạn, họ sẽ xuất hiện ở đây."
        }
      ),
      numberOfSkeletons: 2,
      loadingSkeleton: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 rounded-xl p-2 bg-bg-second items-center", children: [
        /* @__PURE__ */ jsx(Skeleton, { sz: "lg", className: "w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "self-start w-[80%]" }),
        /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "self-start w-[85%]" })
      ] })
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
function NotFoundPage$1() {
  const navigate = useNavigate();
  const { t: t2 } = useTranslation();
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
        "flex flex-col items-center sm:justify-start flex-1 w-full gap-[20px] pt-10",
        "bg-bg-main sm:bg-bg-second"
      ),
      children: [
        /* @__PURE__ */ jsx(Logo, { hasSlogan: false, sz: "md" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              "font-bagel_fat_one leading-none tracking-tighter",
              "text-8xl sm:text-9xl",
              "text-gradient-main",
              "drop-shadow-sm"
            ),
            children: "404"
          }
        ),
        /* @__PURE__ */ jsx(Text, { weight: "extrabold", sz: "xl", className: clsx("uppercase text-gradient-second"), children: t2("notFound.title") }),
        /* @__PURE__ */ jsx(Text, { sz: "lg", className: clsx("flex justify-center text-center"), wrap: "whitespace-normal", children: t2("notFound.description") }),
        /* @__PURE__ */ jsx("div", { className: clsx("flex gap-[10px]"), children: /* @__PURE__ */ jsxs(
          Button,
          {
            className: clsx("flex items-center"),
            onClick: () => {
              navigate("/");
            },
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: clsx("w-5 h-5 mr-2") }),
              t2("notFound.backButton")
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Footer, { className: clsx("text-text-third") })
      ]
    }
  );
}
const notFoundPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotFoundPage$1
}, Symbol.toStringTag, { value: "Module" }));
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
  const { data, isLoading, isFetching, isPending } = useUserId(userParam.userParam || "");
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
  if (isLoading || isFetching || isPending) {
    return /* @__PURE__ */ jsx(LoadingPage, {});
  }
  if (!data) {
    return /* @__PURE__ */ jsx(NotFoundPage$1, {});
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
const USER_PROFILE_BASE_KEY = ["user", "profile"];
const FULL_PROFILE_FIELDS = "id,firstName,lastName,middleName,fullName,nickname,avatar,background,urlName";
const SUMMARY_PROFILE_FIELDS = "id,fullName,avatar,urlName";
const DETAILS_PROFILE_FIELDS = "bio,description";
const normalizeFields = (fields) => fields.split(",").map((field) => field.trim()).filter(Boolean).sort().join(",");
const userProfilePrefixKey = (userId) => ["user", "profile", userId];
const profileQueryKey = (userId, fields) => ["user", "profile", userId, normalizeFields(fields)];
const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useResultFetcher(userProfileService.completeOnboarding, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_BASE_KEY
      });
    }
  });
};
const useGetUserProfile = (userId) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId ?? "", FULL_PROFILE_FIELDS),
    fn: async () => await userProfileService.getProfile(userId, FULL_PROFILE_FIELDS),
    enabled: !!userId
  });
};
const useGetUserProfiles = (userIds) => {
  const normalizedUserIds = useMemo(
    () => [...new Set(userIds.filter(Boolean))].sort(),
    [userIds.join(",")]
  );
  console.log("fetching profiles for userIds", normalizedUserIds);
  const queries = useQueries({
    queries: normalizedUserIds.map((id) => ({
      queryKey: profileQueryKey(id, SUMMARY_PROFILE_FIELDS),
      queryFn: async () => {
        console.log("fetching profile for user", id);
        return await userProfileService.getProfile(id, SUMMARY_PROFILE_FIELDS);
      },
      enabled: !!id,
      staleTime: 0,
      refetchOnMount: "always"
    }))
  });
  const isLoading = queries.some((q) => q.isLoading);
  const userProfileMap = useMemo(
    () => Object.fromEntries(
      queries.filter((q) => q.data?.data?.infos).map((q) => [(q.data?.data?.infos).id, q.data?.data?.infos])
    ),
    [queries]
  );
  console.log("userProfileMap", userProfileMap);
  return { userProfileMap, isLoading };
};
const useGetUserAvatar = (userId) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId, "avatar"),
    fn: async () => await userProfileService.getProfile(userId, "avatar"),
    enabled: !!userId
  });
};
const useGetUserBackground = (userId) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId, "background,backgroundMetadata"),
    fn: async () => await userProfileService.getProfile(userId, "background,backgroundMetadata"),
    enabled: !!userId
  });
};
const useGetUserProfileDetails = (userId) => {
  return useSafeQueryResult({
    queryKey: profileQueryKey(userId, DETAILS_PROFILE_FIELDS),
    fn: async () => await userProfileService.getProfile(userId, DETAILS_PROFILE_FIELDS),
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
          queryKey: userProfilePrefixKey(userId)
        });
      }
    }
  );
};
const useUpdateUrlName = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(userProfileService.updateUrlName, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: userProfilePrefixKey(userId)
      });
    }
  });
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
          queryKey: userProfilePrefixKey(userId)
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
        queryKey: userProfilePrefixKey(userId)
      });
    }
  });
};
const useSelectBackground = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(
    async (data) => await userProfileService.uploadBackground(data.file, data.metadata),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: userProfilePrefixKey(userId)
        });
      }
    }
  );
};
const useSelectAvatar = (userId) => {
  const qc = useQueryClient();
  return useResultFetcher(userProfileService.uploadAvatar, {
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: userProfilePrefixKey(userId)
      });
    }
  });
};
const ZoomOutIcon = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-gray-500 hover:text-gray-800 transition-colors",
    children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
      /* @__PURE__ */ jsx("line", { x1: "8", y1: "11", x2: "14", y2: "11" })
    ]
  }
);
const ZoomInIcon = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-gray-500 hover:text-gray-800 transition-colors",
    children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
      /* @__PURE__ */ jsx("line", { x1: "11", y1: "8", x2: "11", y2: "14" }),
      /* @__PURE__ */ jsx("line", { x1: "8", y1: "11", x2: "14", y2: "11" })
    ]
  }
);
const UpdateBackgroundContent = forwardRef(({ imageSrc }, ref) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const onCropComplete = (_croppedAreaPercentage, _croppedAreaPixels) => {
    setCroppedArea(_croppedAreaPercentage);
  };
  useImperativeHandle(ref, () => ({
    getMetadata: () => ({
      x: croppedArea?.x || 0,
      y: croppedArea?.y || 0,
      width: croppedArea?.width || 100,
      height: croppedArea?.height || 100
    })
  }));
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 w-full bg-bg-main rounded-xl box-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[250px] sm:h-[300px] rounded-xl overflow-hidden bg-bg-fourth/50 shadow-inner border border-bg-fourth group", children: [
      /* @__PURE__ */ jsx(
        Cropper,
        {
          image: imageSrc,
          crop,
          zoom,
          aspect: 16 / 6,
          onCropChange: setCrop,
          onZoomChange: setZoom,
          onCropComplete,
          showGrid: true,
          style: {
            containerStyle: { borderRadius: "0.75rem", width: "100%", height: "100%" }
          }
        }
      ),
      /* @__PURE__ */ jsx(Text, { className: "absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm", children: "Drag to reposition" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-1", children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm font-semibold", children: "Zoom level" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-primary-600 bg-primary-500/20 px-2.5 py-1 rounded-md ", children: [
          Math.round(zoom * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-bg-fourth p-3.5 rounded-lg border border-bg-fourth/60 w-full box-border", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setZoom((z) => Math.max(1, z - 0.1)),
            className: "p-1.5 shrink-0 hover:bg-bg-second hover:shadow-sm rounded-md transition-all active:scale-95",
            "aria-label": "Zoom out",
            children: /* @__PURE__ */ jsx(ZoomOutIcon, {})
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            value: zoom,
            min: 1,
            max: 3,
            step: 0.01,
            onChange: (e) => setZoom(Number(e.target.value)),
            className: "flex-1 min-w-0 h-1.5 bg-bg-third rounded-lg appearance-none cursor-pointer accent-primary-500 transition-all  focus:ring-primary-700 focus:ring-offset-1"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setZoom((z) => Math.min(3, z + 0.1)),
            className: "p-1.5 shrink-0 hover:bg-white hover:shadow-sm rounded-md transition-all active:scale-95",
            "aria-label": "Zoom in",
            children: /* @__PURE__ */ jsx(ZoomInIcon, {})
          }
        )
      ] })
    ] })
  ] });
});
UpdateBackgroundContent.displayName = "UpdateBackgroundContent";
const ProfileBackground = ({}) => {
  const { t: t2 } = useTranslation();
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserBackground(targetId);
  console.log("DATA: ", data);
  const { fetch: fetch2, isFetching: isUpdating } = useSelectBackground(targetId);
  const { showSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const handleSelectBackgroundFile = (file) => {
    const objectUrl = URL.createObjectURL(file);
    const contentRef = React.createRef();
    openDialog({
      title: "Adjust Background",
      content: /* @__PURE__ */ jsx(UpdateBackgroundContent, { ref: contentRef, imageSrc: objectUrl }),
      className: "w-[400px]",
      primaryButton: {
        text: "Save",
        onClick: async () => {
          const metadata = contentRef.current?.getMetadata() || {
            x: 0,
            y: 0,
            width: 100,
            height: 100
          };
          await fetch2(
            { file, metadata },
            {
              onSuccess: () => {
                showSnackbar("Background updated successfully", "success");
                URL.revokeObjectURL(objectUrl);
                closeDialog();
              },
              onError: () => {
                URL.revokeObjectURL(objectUrl);
                closeDialog();
              }
            }
          );
        }
      },
      secondaryButton: {
        text: "Cancel",
        onClick: () => {
          URL.revokeObjectURL(objectUrl);
          closeDialog();
        }
      },
      onClose: () => {
        URL.revokeObjectURL(objectUrl);
        closeDialog();
      }
    });
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("relative aspect-[16/6] w-full overflow-hidden sm:rounded-xl rounded-none"),
      children: isLoading || isFetching || isUpdating ? /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full" }) : /* @__PURE__ */ jsx(
        BackgroundImage,
        {
          src: data?.infos.background,
          alt: "Background Image",
          className: clsx("relative h-full w-full sm:rounded-xl rounded-none"),
          metadata: typeof data?.infos.backgroundMetadata === "string" ? JSON.parse(data?.infos.backgroundMetadata || "{}") : data?.infos.backgroundMetadata,
          children: isOwner && /* @__PURE__ */ jsxs(
            SelectFile,
            {
              onChange: handleSelectBackgroundFile,
              accept: "image/*",
              multiple: false,
              className: clsx(
                "absolute flex items-center right-2 bottom-2 z-10",
                "opacity-40 hover:opacity-70 gap-2"
              ),
              children: [
                /* @__PURE__ */ jsx("i", { className: clsx("fa-solid fa-camera") }),
                /* @__PURE__ */ jsx(Text, { className: clsx("sm:flex hidden"), sz: "md", children: data?.infos.background ? t2("user:profileHeader.changeButton") : t2("user:profileHeader.addButton") })
              ]
            }
          )
        }
      )
    }
  );
};
const ProfileAvatar = ({ className }) => {
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserAvatar(targetId);
  const { fetch: fetch2, isFetching: isUpdating } = useSelectAvatar(targetId);
  const { showSnackbar } = useSnackbar();
  const handleSelectAvatar = async (file) => {
    await fetch2(file, {
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
      className: "w-[192px] h-[192px] border-4 border-bg-main flex-shrink-0",
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
  const { t: t2 } = useTranslation();
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
          t2("user:profileHeader.unfriendButton")
        ] }),
        onClick: async () => {
          await handleUnfriend?.(uid);
        }
      }
    ],
    [uid, handleUnfriend, t2]
  );
  const requestOptions = useMemo(
    () => [
      {
        id: "acceptRequest",
        content: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-check", "mr-2") }),
          " ",
          t2("user:profileHeader.acceptButton")
        ] }),
        onClick: async () => await handleAcceptAddFriendRequest?.(uid)
      },
      {
        id: "cancelRequest",
        content: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-xmark", "mr-2") }),
          " ",
          t2("user:profileHeader.declineButton")
        ] }),
        onClick: async () => await handleDeclineAddFriendRequest?.(uid)
      }
    ],
    [uid, handleAcceptAddFriendRequest, handleDeclineAddFriendRequest, t2]
  );
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsx(Button, { sz, disabled: true, children: /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-spinner", "fa-spin") }) });
  }
  return /* @__PURE__ */ jsx("div", { children: currentFriendshipStatus === "None" ? /* @__PURE__ */ jsxs(Button, { sz, onClick: handleSentAddFriendRequest, children: [
    /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-plus") }),
    " ",
    t2("user:profileHeader.addFriendButton")
  ] }) : currentFriendshipStatus === "SentByMe" ? /* @__PURE__ */ jsxs(Button, { sz, onClick: handleCancelAddFriendRequest, children: [
    /* @__PURE__ */ jsx("i", { className: clsx("fa-solid", "fa-xmark") }),
    " ",
    t2("user:profileHeader.cancelRequestButton")
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
          t2("user:profileHeader.respondRequestButton")
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
          t2("user:profileHeader.friendButton")
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
  const { t: t2 } = useTranslation();
  return t2;
}
const useOpenChat = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { openChat, registry, setFocusOn } = useChatStore(
    useShallow((state) => ({
      openChat: state.openChat,
      registry: state.registry,
      setFocusOn: state.setFocusOn
    }))
  );
  const { fetch: fetchConversationWith } = useFetchConversationWith();
  const navigate = useNavigate();
  const location = useLocation();
  const _openChat = useCallback(
    (conversationId) => {
      if (isMobile || location.pathname.startsWith("/fatalk")) {
        navigate(`/fatalk/${conversationId}`);
      } else {
        openChat(conversationId, { type: "conversation", conversationId });
      }
    },
    [isMobile, location.pathname, navigate, openChat]
  );
  const _openChatWithTarget = useCallback(
    async (targetId) => {
      if (registry[`temp-${targetId}`]) {
        if (isMobile || location.pathname.startsWith("/fatalk")) {
          navigate(`/fatalk/temp?tempId=${targetId}`, {
            state: { correlationId: `temp-${targetId}` }
          });
        } else {
          openChat(`temp-${targetId}`, { type: "temp", targetId });
        }
        return;
      }
      await fetchConversationWith(targetId, {
        onSuccess: (data) => {
          if (!data) return;
          if (isMobile || location.pathname.startsWith("/fatalk")) {
            navigate(`/fatalk/${data.id}`);
          } else {
            openChat(data.id, { type: "conversation", conversationId: data.id });
          }
        },
        onError: () => {
          if (isMobile || location.pathname.startsWith("/fatalk")) {
            navigate(`/fatalk/temp?tempId=${targetId}`, {
              state: { correlationId: `temp-${targetId}` }
            });
          }
          openChat(`temp-${targetId}`, { type: "temp", targetId });
        }
      });
    },
    [fetchConversationWith, isMobile, location.pathname, navigate, openChat]
  );
  const _checkConversationWith = useCallback(
    async (tempId) => {
      if (registry[`temp-${tempId}`]) {
        return void 0;
      }
      let result;
      await fetchConversationWith(tempId, {
        onSuccess: (data) => {
          result = data?.id;
        }
      });
      return result;
    },
    [registry, fetchConversationWith]
  );
  return {
    openChat: _openChat,
    openChatWithTarget: _openChatWithTarget,
    checkConversationWith: _checkConversationWith,
    setFocusOn
  };
};
const ProfileHeader = ({ className }) => {
  const t2 = useLanguage$1();
  const navigate = useNavigate();
  const { targetId, isOwner } = useProfilePage();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isFetching } = useGetUserProfile(targetId);
  const userProfile = data?.infos;
  const { openChat } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const { data: numberOfFriends, isFetching: numberOfFriendsFetching } = useGetNumberOfFriends(targetId);
  const { openChatWithTarget } = useOpenChat();
  const handleMessageClick = useCallback(async () => {
    if (!targetId) return;
    await openChatWithTarget(targetId);
  }, [isMobile, targetId, openChatWithTarget, openChat]);
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative w-full flex flex-col items-center", className), children: [
    /* @__PURE__ */ jsx("div", { className: "relative w-full", children: /* @__PURE__ */ jsx(ProfileBackground, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "-mt-[80px] flex w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end mb-5 lg:gap-0 gap-3", children: [
      /* @__PURE__ */ jsx(ProfileAvatar, {}),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 items-start flex-1 lg:mb-3 lg:ml-4", children: [
        isLoading || isFetching ? /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "!w-56" }) : /* @__PURE__ */ jsxs(Text, { weight: "bold", className: "!text-2xl text-center break-words w-full lg:w-auto", children: [
          userProfile?.fullName,
          userProfile?.nickname && /* @__PURE__ */ jsxs(Text, { sz: "lg", weight: "light", className: "lg:text-left text-center ml-2", children: [
            "(",
            userProfile?.nickname,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full lg:flex-row", children: [
          !numberOfFriendsFetching ? /* @__PURE__ */ jsx(Text, { sz: "md", weight: "medium", className: "text-[var(--text-color)] opacity-70", children: numberOfFriends && numberOfFriends > 0 ? numberOfFriends + " " + t2("user:profileHeader.friendsCount") : t2("user:profileHeader.noFriendsCount") }) : /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "!w-36" }),
          !isLoading || !isFetching ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap flex-row gap-2 mt-2 lg:ml-auto lg:mt-0", children: [
            isAuthenticated && /* @__PURE__ */ jsx(Fragment, { children: isOwner ? /* @__PURE__ */ jsxs(
              Button,
              {
                sz: "sm",
                onClick: () => {
                  navigate(`/settings`);
                },
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-pen" }),
                  " ",
                  t2("user:profileHeader.editButton")
                ]
              }
            ) : /* @__PURE__ */ jsx(FriendButton, { sz: "sm", uid: targetId }) }),
            !isOwner && isAuthenticated && /* @__PURE__ */ jsx(Button, { sz: "sm", variant: "secondary", onClick: handleMessageClick, children: t2("user:profileHeader.messageButton") }),
            /* @__PURE__ */ jsx(Button, { sz: "sm", variant: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info" }) })
          ] }) : /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "!w-[250px] lg:ml-auto mb-1" })
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
        "bg-bg-main p-[2px] shadow-sm sm:px-8 justify-between",
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
  const { t: t2 } = useTranslation();
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
        name: t2("user:profileMenu.posts"),
        href: `/${userParam}`,
        isOwnerOnly: false,
        isIndex: true
      },
      {
        name: t2("user:profileMenu.friends"),
        href: `/${userParam}/friends`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t2("user:profileMenu.photos"),
        href: `/${userParam}/photos`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t2("user:profileMenu.videos"),
        href: `/${userParam}/videos`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t2("user:profileMenu.about"),
        href: `/${userParam}/about`,
        isOwnerOnly: false,
        isIndex: false
      },
      {
        name: t2("user:profileMenu.settings"),
        href: `/${userParam}/settings`,
        isOwnerOnly: true,
        isIndex: false
      }
    ],
    [userParam, t2]
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
  const { t: t2 } = useTranslation();
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
    title2 && /* @__PURE__ */ jsx(Text, { sz: "lg", className: "font-light", children: title2 }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 flex-col w-full", children: [
      editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-1 w-full", children: [
        /* @__PURE__ */ jsx(
          TextArea,
          {
            className: clsx("animate-fade-in ", isError && "mt-[5px]"),
            placeholder,
            value: inputValue,
            isWrong: isError,
            onChange: (e) => setInputValue(e.target.value)
          }
        ),
        isError && /* @__PURE__ */ jsx(Text, { sz: "sm", className: "text-red-500 ml-2 h-[5px]", children: errorMessage })
      ] }) : /* @__PURE__ */ jsx(Text, { sz: "lg", className: clsx(valueClassName, "select-auto"), wrap: "whitespace-pre-wrap", children: value ?? noDataValue }),
      canEdit && /* @__PURE__ */ jsx(Fragment, { children: editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "animate-fade-in gap-1 flex w-full", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            disabled: value === inputValue || isLoading,
            sz: "sm",
            variant: "primary",
            onClick: () => {
              onSaveClick?.(inputValue);
            },
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-floppy-disk mr-2" }),
              t2("settings:editableField.saveButton")
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            sz: "sm",
            variant: "fourth",
            onClick: () => {
              onCancelClick?.();
            },
            className: "flex-1",
            children: t2("settings:editableField.cancelButton")
          }
        )
      ] }) : /* @__PURE__ */ jsx(
        Button,
        {
          sz: "sm",
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
const ProfileIntroduction = ({ className }) => {
  const [isEditBio, setIsEditBio] = React.useState(false);
  const [isEditDescription, setIsEditDescription] = React.useState(false);
  const { t: t2 } = useTranslation();
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
      title: t2("user:profilePosts.overview"),
      titleClassName: "text-2xl font-bold !mb-0",
      childrenClassName: "flex flex-col gap-4",
      className,
      children: [
        (userProfile?.bio || canEdit) && /* @__PURE__ */ jsx(
          EditableTextArea,
          {
            editableMode: "inline",
            isEdit: isEditBio,
            placeholder: t2("user:profilePosts.bioPlaceholder"),
            value: userProfile?.bio,
            onChangeClick: () => setIsEditBio(true),
            onSaveClick: (value) => handleSaveBio(value),
            valueClassName: "text-[1.2rem] font-semibold",
            canEdit: canEdit || false,
            isLoading: updateProfileMutation.isFetching,
            onCancelClick: () => setIsEditBio(false),
            btnChildren: /* @__PURE__ */ jsxs(Text, { sz: "sm", children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-pencil-alt" }),
              "   ",
              t2("user:profilePosts.bioBtn")
            ] })
          }
        ),
        userProfile?.description && /* @__PURE__ */ jsx(Text, { sz: "lg", weight: "bold", children: t2("user:profilePosts.description") }),
        (userProfile?.description || canEdit) && /* @__PURE__ */ jsx(
          EditableTextArea,
          {
            editableMode: "inline",
            isEdit: isEditDescription,
            placeholder: t2("user:profilePosts.descriptionPlaceholder"),
            value: userProfile?.description,
            canEdit: canEdit || false,
            valueClassName: "text-[1.1rem]",
            isLoading: updateProfileMutation.isFetching,
            onChangeClick: () => setIsEditDescription(true),
            onSaveClick: (value) => handleSaveDescription(value),
            onCancelClick: () => setIsEditDescription(false),
            btnChildren: /* @__PURE__ */ jsxs(Text, { sz: "sm", children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-pencil-alt" }),
              "   ",
              t2("user:profilePosts.descriptionBtn")
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
  const { t: t2 } = useTranslation();
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
          t2("user:profileHeader.unfriendButton")
        ] }),
        onClick: async () => await handleUnfriend?.(friendDto.id)
      }
    ],
    [friendDto.id, handleUnfriend, t2]
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
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Avatar, { alt: "Avatar", src: friendDto.avatar ?? void 0, sz: "sm" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full justify-center flex-1", children: /* @__PURE__ */ jsx(Text, { sz: "md", weight: "bold", children: friendDto.name }) })
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
        ] }) : /* @__PURE__ */ jsx(FriendButton, { sz: "sm", uid: friendDto.id }) })
      ]
    }
  );
};
const ProfileFriends = ({ className = "" }) => {
  const { t: t2 } = useTranslation();
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
        sz: "sm",
        type: "search",
        placeholder: t2("user:profileFriends.searchFriends"),
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
          /* @__PURE__ */ jsx(Text, { sz: "xl", weight: "bold", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user-xmark" }) }),
          /* @__PURE__ */ jsx(Text, { sz: "md", className: "mt-2", children: t2("user:profileFriends.noFriends") })
        ] }) })
      }
    )
  ] });
};
const ProfileFriendsPage = () => {
  const { t: t2 } = useTranslation();
  return /* @__PURE__ */ jsx(
    Card,
    {
      title: t2("user:profileFriends.friends"),
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
        sz: "lg",
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
          sz: "md",
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
const ProfileAboutNavbar = ({ className }) => {
  const { t: t2 } = useTranslation();
  const aboutNavbarItems = [
    { title: t2("user:profileAbout.overview"), path: "" },
    {
      title: t2("user:profileAbout.workAndEducation"),
      path: "work-and-education"
    },
    { title: t2("user:profileAbout.placesLived"), path: "places-lived" }
  ];
  return /* @__PURE__ */ jsx(Card, { title: t2("user:profileAbout.title"), className: clsx(className), children: /* @__PURE__ */ jsx(SubNavbar, { className: "w-full", children: aboutNavbarItems.map((item, index) => /* @__PURE__ */ jsx(SubNavbar.Item, { title: item.title, path: item.path }, index)) }) });
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
    title2 && /* @__PURE__ */ jsx(Text, { sz: "lg", weight: "bold", children: title2 }),
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
      /* @__PURE__ */ jsx(Text, { sz: "lg", className: clsx("opacity-50"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-envelope" }) }),
      /* @__PURE__ */ jsx("div", { children: emails.map((email, index) => /* @__PURE__ */ jsxs("div", { className: clsx("flex", "flex-col"), children: [
        /* @__PURE__ */ jsx(Text, { weight: "bold", children: email }),
        /* @__PURE__ */ jsx(Text, { sz: "md", className: clsx("opacity-50"), children: "Email" })
      ] }, index)) }),
      isOwner && /* @__PURE__ */ jsx("div", { className: clsx("ml-auto"), children: /* @__PURE__ */ jsx(Button, { variant: "secondary", className: clsx("!rounded-full", "!p-0", "w-10", "h-10"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pencil-alt" }) }) })
    ] }),
    phoneNumbers.length > 0 && /* @__PURE__ */ jsxs("div", { className: clsx("flex", "items-start", "gap-4"), children: [
      /* @__PURE__ */ jsx(Text, { sz: "lg", className: clsx("opacity-50"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-phone" }) }),
      /* @__PURE__ */ jsx("div", { children: phoneNumbers.map((phone, index) => /* @__PURE__ */ jsxs("div", { className: clsx("flex", "flex-col"), children: [
        /* @__PURE__ */ jsx(Text, { weight: "bold", children: phone }),
        /* @__PURE__ */ jsx(Text, { sz: "md", className: clsx("opacity-50"), children: "Di động" })
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
const NotificationMenu = ({ className, ref }) => {
  const { t: t2 } = useTranslation();
  const navigate = useNavigate$1();
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } = useNotifications({
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
        "bg-bg-main sm:bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide",
        className
      ),
      ref,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 pt-2", children: [
          /* @__PURE__ */ jsx(Text, { sz: "lg", weight: "bold", children: t2("notifications:notifications.title") }),
          notifications2.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            unreadCount > 0 && /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer",
                onClick: handleMarkAllAsRead,
                title: t2("notifications:notifications.mark-all-read"),
                children: /* @__PURE__ */ jsx(Text, { sz: "md", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check-double" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer",
                onClick: handleDeleteAll,
                title: t2("notifications:notifications.delete-all"),
                children: /* @__PURE__ */ jsx(Text, { sz: "md", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can" }) })
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
            isLoading: isFetching || isPending,
            loadingSkeleton: /* @__PURE__ */ jsx(NotificationSkeleton, {}),
            numberOfSkeletons: 2,
            emptyComponent: /* @__PURE__ */ jsx(
              NotFound,
              {
                icon: "fa-regular fa-bell-slash",
                title: t2("notifications:notifications.no-notifications"),
                description: "When you have new updates, they will appear here."
              }
            )
          }
        ) }),
        !isInNotificationPage && /* @__PURE__ */ jsx("div", { className: "flex justify-center border-t border-text-main/10 pt-2 pb-1 px-2", children: /* @__PURE__ */ jsxs(
          "button",
          {
            className: "p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center gap-2",
            onClick: () => navigate("/notifications"),
            title: t2("notifications:notifications.open-notifications"),
            children: [
              /* @__PURE__ */ jsx(Text, { sz: "sm", color: "secondary", children: t2("notifications:notifications.open-notifications") }),
              /* @__PURE__ */ jsx(Text, { sz: "sm", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-up-right-from-square" }) })
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
const SocialButton = ({ icon, name, onClick, disabled }) => {
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "fourth",
      className: "flex gap-2 flex-1 items-center justify-center",
      onClick,
      sz: "sm",
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
  const { t: t2 } = useTranslation();
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
        isShowLogo && /* @__PURE__ */ jsx(Logo, { sz: "md" }),
        /* @__PURE__ */ jsx(
          Text,
          {
            weight: "extrabold",
            className: clsx(
              "uppercase !text-primary-500",
              "font-bold font-inter select-none !text-3xl"
            ),
            children: t2("auth:login.title")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ jsx(
            Textbox,
            {
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:login.username"),
              onChange: (e) => formik.setFieldValue("usernameOrEmail", e.target.value),
              isWrong: formik.touched.usernameOrEmail && Boolean(formik.errors.usernameOrEmail) || Boolean(usernameOrEmailError),
              wrongMessage: t2(usernameOrEmailError || formik.errors.usernameOrEmail || ""),
              disabled: formik.isSubmitting,
              type: "text",
              autoComplete: "username"
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              type: "password",
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:login.password"),
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              isWrong: formik.touched.password && Boolean(formik.errors.password) || Boolean(passwordError),
              wrongMessage: t2(passwordError || formik.errors.password || ""),
              disabled: formik.isSubmitting,
              autoComplete: "current-password"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full items-center gap-[50px]", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              label: t2("auth:login.rememberMe"),
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
              sz: "md",
              className: clsx(
                "!text-primary-500 hover:!text-primary-600",
                "hover:cursor-pointer transition-all duration-100 active:scale-95 select-none"
              ),
              onClick: switchForgotPassword,
              children: t2("auth:login.forgotPassword")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            onClick: formik.submitForm,
            sz: "md",
            className: "w-full flex items-center justify-center",
            disabled: formik.isSubmitting,
            children: [
              formik.isSubmitting && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) }),
              t2("auth:login.loginButton")
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" }),
            /* @__PURE__ */ jsx(Text, { sz: "sm", className: "text-text-third", children: "OR" }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" })
          ] }),
          /* @__PURE__ */ jsx(SocialButtons, { disabled: formik.isSubmitting })
        ] }),
        /* @__PURE__ */ jsxs(Text, { children: [
          t2("auth:login.dontHaveAccount"),
          " ",
          /* @__PURE__ */ jsx(Link, { className: "font-bold", to: "/register", children: t2("auth:login.registerButton") })
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
const RegisterForm = ({
  className,
  showLogo = true,
  showClose = false,
  onClose
}) => {
  const { t: t2 } = useTranslation();
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
        isShowLogo && /* @__PURE__ */ jsx(Logo, { sz: "md" }),
        /* @__PURE__ */ jsx(
          Text,
          {
            weight: "extrabold",
            className: "!text-3xl uppercase !text-primary-500 select-none text-center",
            children: t2("auth:register.title")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ jsx(
            Textbox,
            {
              value: formik.values.username,
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:register.username"),
              onChange: (e) => formik.setFieldValue("username", e.target.value),
              isWrong: formik.touched.username && Boolean(formik.errors.username) || Boolean(usernameError),
              wrongMessage: t2(usernameError || formik.errors.username || ""),
              disabled: formik.isSubmitting,
              type: "text",
              autoComplete: "username"
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              value: formik.values.email,
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:register.email"),
              onChange: (e) => formik.setFieldValue("email", e.target.value),
              isWrong: formik.touched.email && Boolean(formik.errors.email) || Boolean(emailError),
              wrongMessage: t2(emailError || formik.errors.email || ""),
              disabled: formik.isSubmitting,
              type: "email",
              autoComplete: "email"
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              value: formik.values.phoneNumber,
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:register.phoneNumber"),
              onChange: (e) => formik.setFieldValue("phoneNumber", e.target.value),
              isWrong: formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber) || Boolean(phoneNumberError),
              wrongMessage: t2(phoneNumberError || formik.errors.phoneNumber || ""),
              disabled: formik.isSubmitting,
              type: "text",
              autoComplete: "tel"
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              type: "password",
              value: formik.values.password,
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:register.password"),
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              isWrong: formik.touched.password && Boolean(formik.errors.password) || Boolean(passwordError),
              wrongMessage: t2(passwordError || formik.errors.password || ""),
              disabled: formik.isSubmitting,
              autoComplete: "new-password"
            }
          ),
          /* @__PURE__ */ jsx(
            Textbox,
            {
              type: "password",
              value: formik.values.confirmPassword,
              sz: "sm",
              className: "w-full",
              placeholder: t2("auth:register.confirmPassword"),
              onChange: (e) => formik.setFieldValue("confirmPassword", e.target.value),
              isWrong: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword) || Boolean(confirmPasswordError),
              wrongMessage: t2(confirmPasswordError || formik.errors.confirmPassword || ""),
              disabled: formik.isSubmitting,
              autoComplete: "new-password"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            className: "text-[15px] text-single-third gap-[8px] w-full",
            label: /* @__PURE__ */ jsxs(Text, { className: "flex items-center flex-wrap", children: [
              t2("auth:register.agree"),
              " ",
              /* @__PURE__ */ jsx(Link, { className: "sm:text-[15px]", to: "/terms", children: t2("auth:register.termsOfService") }),
              " ",
              t2("auth:register.and"),
              " ",
              /* @__PURE__ */ jsx(Link, { className: "sm:text-[15px]", to: "/policy", children: t2("auth:register.privacyPolicy") }),
              "."
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            sz: "md",
            className: "flex justify-center w-full",
            onClick: formik.submitForm,
            disabled: formik.isSubmitting,
            children: [
              formik.isSubmitting && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) }),
              /* @__PURE__ */ jsx(Text, { children: t2("auth:register.registerButton") })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" }),
            /* @__PURE__ */ jsx(Text, { sz: "sm", className: "text-text-third", children: "OR" }),
            /* @__PURE__ */ jsx("div", { className: "h-[1px] bg-border-main flex-1" })
          ] }),
          /* @__PURE__ */ jsx(SocialButtons, { disabled: formik.isSubmitting })
        ] }),
        /* @__PURE__ */ jsx(Link, { className: "font-bold", to: "/login", children: t2("auth:register.loginButton") }),
        isShowClose && /* @__PURE__ */ jsx(
          Text,
          {
            sz: "lg",
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
const UserMenu = ({ menuClassName, menuStyle }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { userId, urlName, logOut } = useAuth();
  const { t: t2 } = useTranslation();
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
            sz: "md",
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
          "p-3 z-10 flex flex-col gap-2 min-w-[300px] min-h-[100px]",
          menuClassName
        ),
        style: menuStyle,
        ref: menuRef,
        children: /* @__PURE__ */ jsxs(List, { className: clsx("flex flex-col gap-2 w-full"), children: [
          /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsxs(
            Button,
            {
              sz: "md",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start gap-3 w-full !pl-3 py-3",
                "hover:!bg-bg-fourth transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handlePersonalPage,
              children: [
                /* @__PURE__ */ jsx(Avatar, { src: avatarProfile?.infos.avatar ?? "", alt: "avatar", sz: "md" }),
                /* @__PURE__ */ jsx(Text, { sz: "lg", weight: "bold", children: userProfile?.infos.fullName ?? "" })
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
              sz: "md",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start w-full gap-3",
                "hover:!bg-bg-fourth transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handleSettings,
              children: /* @__PURE__ */ jsxs(Text, { className: clsx("flex items-center gap-3"), sz: "md", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-gear" }),
                t2("navbar.profileMenu.settings")
              ] })
            }
          ) }),
          /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
            Button,
            {
              sz: "md",
              variant: "secondary",
              className: clsx(
                "flex items-center justify-start w-full gap-3 text-red-400",
                "hover:!bg-bg-fourth transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]"
              ),
              onClick: handleLogout,
              children: /* @__PURE__ */ jsxs(Text, { sz: "md", className: clsx("flex items-center gap-3"), color: "danger", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-right-from-bracket" }),
                t2("navbar.profileMenu.logout")
              ] })
            }
          ) })
        ] })
      }
    )
  ] });
};
const PREFIX$3 = buildApiPath("/message");
class MessageService {
  async sendMessage(request) {
    return await apiPost(`${PREFIX$3}/${request.conversationId}`, request);
  }
}
const messageService = new MessageService();
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
  return useResultFetcher(async (data) => {
    return await messageService.sendMessage(data);
  });
};
const useRenderConversationContent = () => {
  const { t: t2 } = useTranslation();
  const { userId } = useAuth();
  const renderSystemMessage = (message) => {
    if (message.type === MessageType.CreateGroup) {
      const { creatorName, creatorId } = message.metadata || {};
      return t2("common:conversations.systemMessage.createGroup", {
        creatorName: userId === creatorId ? t2("common:conversations.you") : creatorName || "Unknown"
      });
    }
  };
  const renderConversationName = (conversation) => {
    if (conversation?.isGroup && !conversation.name) {
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
const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};
const SPEEDS = [0.75, 1, 1.5, 2];
const AudioMessage = ({ url, className, isMyMessage }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const formatTime = (time2) => {
    const mins = Math.floor(time2 / 60);
    const secs = Math.floor(time2 % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };
  const handleSeek = (e) => {
    const time2 = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time2;
      setCurrent(time2);
    }
  };
  const changeSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[nextIndex];
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 p-2 h-[60px] w-full max-w-[320px] ${className || ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: togglePlay,
          className: clsx(isMyMessage ? "text-text-my-msg" : "text-text-other-msg", "w-8"),
          children: playing ? /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pause text-lg" }) : /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play text-lg pl-[2px]" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: duration || 0,
            value: current,
            onChange: handleSeek,
            className: "w-full h-1.5 bg-bg-sixth rounded-lg appearance-none cursor-pointer accent-primary-500"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
            formatTime(current),
            " / ",
            formatTime(duration)
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: changeSpeed,
              className: "text-xs bg-bg-fourth px-2 py-0.5 rounded-md font-bold transition-colors",
              children: [
                SPEEDS[speedIndex],
                "x"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "audio",
      {
        ref: audioRef,
        src: url,
        onPlay: () => setPlaying(true),
        onPause: () => setPlaying(false),
        onTimeUpdate: () => setCurrent(audioRef.current?.currentTime || 0),
        onLoadedMetadata: () => setDuration(audioRef.current?.duration || 0)
      }
    )
  ] });
};
const EMPTY_VIEWERS = [];
const PendingIndicator = () => /* @__PURE__ */ jsx("div", { className: "absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent" }) });
const getMessageBubbleShapeClass = (isMyMessage, isFirstMessageInGroup, isLastMessageInGroup, isOnlyMessageInGroup) => clsx(
  isMyMessage ? "rounded-l-3xl self-end" : "rounded-r-3xl self-start",
  isOnlyMessageInGroup && "!rounded-3xl",
  isLastMessageInGroup && (isMyMessage ? "rounded-br-none" : "rounded-bl-none"),
  isFirstMessageInGroup && (isMyMessage ? "rounded-tr-none" : "rounded-tl-none"),
  !isFirstMessageInGroup && !isLastMessageInGroup && (isMyMessage ? "rounded-tr-none rounded-br-none" : "rounded-tl-none rounded-bl-none")
);
const MessageRowComponent = ({
  message,
  prevMessage,
  nextMessage,
  index,
  userId,
  conversationId,
  isGroup,
  className,
  userInfo,
  userProfileMap,
  ref
}) => {
  const { t: t2 } = useTranslation();
  const [hasDelayed, setHasDelayed] = useState(false);
  const { getDiffBetween, formatTime, formatSmartTimestamp } = useFormatTime();
  const { renderSystemMessage } = useRenderConversationContent();
  const { onOpen: openMediaViewer } = useMediaViewer();
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isSystem = isSystemMessage(message.type);
  const timeoutRef = useRef(null);
  const seenBy = useMessageStore((state) => {
    const convId = conversationId || "";
    const messageSeq = message.sequenceNumber || 0;
    return state.messageUserSeenMap?.[convId]?.[messageSeq] ?? EMPTY_VIEWERS;
  });
  const isShowTime = !prevMessage || isSystemMessage(prevMessage.type) || getDiffBetween(message.createdAt, prevMessage.createdAt, "minute") > 30;
  const isPrevMessageShowTime = !!nextMessage && getDiffBetween(message.createdAt, nextMessage.createdAt, "minute") > 30;
  const isLastMessageInGroup = !prevMessage || prevMessage.senderId !== message.senderId || isShowTime;
  const isFirstMessageInGroup = !nextMessage || nextMessage.senderId !== message.senderId || isPrevMessageShowTime;
  const isOnlyMessageInGroup = isFirstMessageInGroup && isLastMessageInGroup;
  const isMyMessage = message.senderId === userId;
  const isShowName = isLastMessageInGroup && !isMyMessage && isGroup;
  const hasAvatar = isFirstMessageInGroup;
  const isFooterVisible = index === 0 && isMyMessage;
  const isTextMessage = message.type === MessageType.Text;
  const isMediaMessage = message.type === MessageType.Media;
  const isImageMessage = isMediaMessage && message.media?.some((media) => media.type === MediaType.Image);
  const isVideoMessage = isMediaMessage && message.media?.some((media) => media.type === MediaType.Video);
  const isAudioMessage = isMediaMessage && message.media?.some((media) => media.type === MediaType.Audio);
  const isFileMessage = isMediaMessage && message.media?.some((media) => media.type === MediaType.File);
  const stackImage = message.media?.filter((media) => media.type === MediaType.Image) || [];
  const messageBubbleShapeClass = getMessageBubbleShapeClass(
    isMyMessage,
    isFirstMessageInGroup,
    isLastMessageInGroup,
    isOnlyMessageInGroup
  );
  const isOnlyEmoji = isTextMessage && message.content.trim() !== "" && (() => {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const segments = [...segmenter.segment(message.content.trim())].map((s) => s.segment);
    return segments.length < 6 && segments.every(
      (char) => new RegExp("\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F|\\p{Emoji_Modifier_Base}", "u").test(char)
    );
  })();
  const renderOnlyEmojiMessage = () => /* @__PURE__ */ jsx("div", { className: clsx("text-4xl", isMyMessage ? "text-white" : "text-text-main"), children: message.content });
  const renderTextMessage = () => /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "px-3 py-2 break-words rounded-xl shadow-sm relative max-w-full",
        isMyMessage ? isFailed ? "bg-primary-800" : "bg-primary-600" : "bg-bg-fourth",
        isFailed && "border-red-500 border-2 opacity-50",
        messageBubbleShapeClass
      ),
      children: [
        /* @__PURE__ */ jsx(
          Text,
          {
            sz: "md",
            wrap: "whitespace-pre-wrap",
            weight: "regular",
            className: clsx(isMyMessage ? "text-white " : "text-text-main"),
            children: message.content
          }
        ),
        hasDelayed && /* @__PURE__ */ jsx(PendingIndicator, {})
      ]
    }
  );
  const renderFileMessage = () => /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative flex px-4 py-3 rounded-xl items-center gap-3",
        "max-w-full",
        isMyMessage ? isFailed ? "bg-primary-800" : "bg-primary-600" : "bg-bg-fourth",
        messageBubbleShapeClass
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
          "i",
          {
            className: clsx(
              "fa-solid fa-file text-2xl",
              isMyMessage ? "text-text-reverse-main" : "text-text-main"
            )
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          " ",
          /* @__PURE__ */ jsx(
            Text,
            {
              className: clsx(
                "underline cursor-pointer break-all leading-tight",
                isMyMessage ? "text-text-reverse-main" : "text-text-main"
              ),
              onClick: () => window.open(message.media?.[0].url, "_blank"),
              wrap: "whitespace-pre-wrap",
              children: message.media?.[0].metadata?.name || t2("conversations.file")
            }
          ),
          /* @__PURE__ */ jsx(
            Text,
            {
              className: clsx(
                "text-[10px] text-muted-foreground mt-1",
                isMyMessage ? "text-text-reverse-main" : "text-text-main"
              ),
              children: message.media?.[0].metadata?.size ? formatFileSize(message.media?.[0].metadata?.size) : "Unknown size"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "flex-shrink-0 hover:text-primary transition-colors ml-1",
            onClick: () => {
              const anchor = document.createElement("a");
              anchor.href = message.media?.[0].url || "";
              anchor.download = message.media?.[0].metadata?.name || "file";
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
            },
            children: /* @__PURE__ */ jsx(
              "i",
              {
                className: clsx(
                  "fa-solid fa-download",
                  isMyMessage ? "text-text-reverse-main" : "text-text-main"
                )
              }
            )
          }
        ),
        hasDelayed && /* @__PURE__ */ jsx(PendingIndicator, {})
      ]
    }
  );
  const renderVideoMessage = () => /* @__PURE__ */ jsx(
    VideoMessage,
    {
      onFrameClick: () => {
        openMediaViewer({
          id: message.media?.[0].id || "",
          url: message.media?.[0].url,
          type: MediaType.Video,
          conversationId
        });
      },
      onFullscreenToggle: () => {
        openMediaViewer({
          id: message.media?.[0].id || "",
          url: message.media?.[0].url,
          type: MediaType.Video,
          conversationId
        });
      },
      className: clsx(messageBubbleShapeClass),
      url: message.media?.[0].url
    }
  );
  const renderAudioMessage = () => /* @__PURE__ */ jsx(
    AudioMessage,
    {
      className: clsx(
        isMyMessage ? isFailed ? "bg-primary-800" : "bg-primary-600" : "bg-bg-fourth",
        messageBubbleShapeClass
      ),
      url: message.media?.[0].url,
      isMyMessage
    }
  );
  const renderImageStackMessage = () => /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "relative h-[200px] w-[110px] flex items-center justify-center cursor-pointer",
        isMyMessage ? "self-end mr-4" : "self-start ml-4",
        messageBubbleShapeClass,
        "[&>img:last-child]:opacity-100",
        "[&>img:nth-last-child(2)]:opacity-80",
        "[&>img:nth-last-child(3)]:opacity-60"
      ),
      onClick: () => {
        openMediaViewer({
          id: stackImage[stackImage.length - 1].id || "",
          url: stackImage[stackImage.length - 1].url,
          type: MediaType.Image,
          conversationId
        });
      },
      children: [
        stackImage[0] && /* @__PURE__ */ jsx(
          "img",
          {
            src: stackImage[0].url,
            alt: "Image 1",
            className: clsx(
              "absolute w-[130px] h-[130px] object-cover shadow-sm rounded-xl",
              "rotate-[-12deg] -translate-x-3 translate-y-1 z-10 transition-transform"
            )
          }
        ),
        stackImage[1] && /* @__PURE__ */ jsx(
          "img",
          {
            src: stackImage[1].url,
            alt: "Image 2",
            className: clsx(
              "absolute w-[130px] h-[130px] object-cover rounded-xl shadow-md",
              "rotate-[8deg] translate-x-2 -translate-y-1 z-20 transition-transform"
            )
          }
        ),
        stackImage[2] && /* @__PURE__ */ jsx(
          "img",
          {
            src: stackImage[2].url,
            alt: "Image 3",
            className: clsx(
              "absolute w-[130px] h-[130px] object-cover rounded-xl shadow-lg",
              "rotate-0 z-30 border-2 border-white/50"
            )
          }
        ),
        hasDelayed && /* @__PURE__ */ jsx(PendingIndicator, {})
      ]
    }
  );
  const renderSingleImageMessage = () => /* @__PURE__ */ jsxs("div", { className: clsx("relative rounded-2xl h-fit overflow-hidden", messageBubbleShapeClass), children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: stackImage[0].url,
        alt: "Image 1",
        className: "w-[200px] h-[200px] object-cover cursor-pointer",
        onClick: () => {
          openMediaViewer({
            id: stackImage[0].id || "",
            url: stackImage[0].url,
            type: MediaType.Image,
            conversationId
          });
        }
      }
    ),
    hasDelayed && /* @__PURE__ */ jsx(PendingIndicator, {})
  ] });
  useEffect(() => {
    if (!isPending) {
      setHasDelayed(false);
      return;
    }
    timeoutRef.current = window.setTimeout(() => {
      setHasDelayed(true);
    }, 2e3);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPending]);
  if (isSystem) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full my-2", children: /* @__PURE__ */ jsx(Text, { sz: "sm", className: "opacity-80", children: renderSystemMessage(message) }) });
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
        isShowTime && /* @__PURE__ */ jsx(Text, { sz: "xs", className: "text-center my-2", children: formatSmartTimestamp(message.createdAt) }),
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
                  src: message.senderAvatarUrl,
                  alt: "Avatar",
                  sz: "sm"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col", "max-w-[75%]"), children: [
                isShowName && /* @__PURE__ */ jsx(
                  Text,
                  {
                    sz: "xs",
                    className: clsx(
                      "mb-1 min-h-[1rem]",
                      isMyMessage ? "text-right mr-1" : "text-left ml-1"
                    ),
                    children: userInfo?.fullName
                  }
                ),
                isOnlyEmoji ? renderOnlyEmojiMessage() : null,
                isTextMessage && !isOnlyEmoji && renderTextMessage(),
                isFileMessage && renderFileMessage(),
                isVideoMessage && renderVideoMessage(),
                isAudioMessage && renderAudioMessage(),
                isImageMessage && stackImage.length > 1 && renderImageStackMessage(),
                isImageMessage && stackImage.length === 1 && renderSingleImageMessage(),
                (seenBy?.length === 0 || seenBy.length === 1 && seenBy[0].userId === userId) && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: clsx(
                      "flex items-center justify-end mr-2 overflow-hidden transition-all duration-200",
                      isFooterVisible ? "h-[15px] mt-1" : "h-0 mt-0"
                    ),
                    children: isFooterVisible && !isFailed && !isPending && /* @__PURE__ */ jsxs(Text, { sz: "xs", children: [
                      t2("conversations.sent"),
                      " ",
                      getDiffBetween(message.createdAt, /* @__PURE__ */ new Date(), "second") > 60 && /* @__PURE__ */ jsx(Text, { sz: "xs", children: formatTime(message.createdAt) })
                    ] })
                  }
                )
              ] }),
              isFailed && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-exclamation text-red-500" }) })
            ]
          }
        ),
        seenBy?.length > 0 && !(seenBy.length === 1 && seenBy[0].userId === userId) && /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-1 mt-1", children: seenBy.map((seenInfo) => {
          if (seenInfo.userId === userId) return null;
          return /* @__PURE__ */ jsx(
            MiniAvatar,
            {
              uid: seenInfo.userId,
              seenAt: seenInfo.seenAt,
              userInfo: userProfileMap?.[seenInfo.userId]
            },
            seenInfo.userId
          );
        }) })
      ]
    }
  );
};
const MiniAvatar = memo(
  ({ uid, seenAt, userInfo }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { formatSmartTimestamp } = useFormatTime();
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative",
        onMouseEnter: () => setShowTooltip(true),
        onMouseLeave: () => setShowTooltip(false),
        children: [
          /* @__PURE__ */ jsx(Avatar, { sz: "xs", src: userInfo?.avatar, alt: "mini" }),
          showTooltip && /* @__PURE__ */ jsxs("div", { className: "absolute right-full mr-2 -top-7 px-2 py-1 bg-bg-main text-text-main text-xs rounded shadow-md z-50 whitespace-nowrap border border-border-main", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: userInfo?.fullName || uid }),
            /* @__PURE__ */ jsx("div", { className: "text-xs opacity-75", children: formatSmartTimestamp(seenAt) })
          ] })
        ]
      }
    );
  }
);
const MessageRow = memo(MessageRowComponent);
const InfiniteScrollReverse = forwardRef(
  function InfiniteScrollReverse2({
    items,
    className,
    hasMore = true,
    isLoading = false,
    spinnerContent,
    itemTemplate,
    onLoadMore,
    isShowLastSeen = false,
    lastSeen,
    gap,
    parentRef,
    itemKey,
    emptyComponent
  }, ref) {
    const containerRef = useRef(null);
    useImperativeHandle(ref, () => containerRef.current);
    const sentinelRef = useRef(null);
    const isLoadingRef = useRef(isLoading);
    const pendingLoadRef = useRef(false);
    const { t: t2 } = useTranslation();
    useEffect(() => {
      isLoadingRef.current = isLoading;
      if (!isLoading) {
        pendingLoadRef.current = false;
      }
    }, [isLoading]);
    const _loadMore = async () => {
      if (pendingLoadRef.current) return;
      if (isLoadingRef.current) return;
      pendingLoadRef.current = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 30));
        await onLoadMore();
      } finally {
        pendingLoadRef.current = false;
      }
    };
    useEffect(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        async ([entry]) => {
          if (!entry.isIntersecting) return;
          if (!hasMore) return;
          _loadMore();
        },
        {
          root: parentRef?.current || containerRef.current,
          rootMargin: "200px 0px 0px 0px"
        }
      );
      observer.observe(sentinel);
      return () => {
        observer.disconnect();
        observer.unobserve(sentinel);
      };
    }, [hasMore, parentRef, items.length]);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: containerRef,
        className: clsx("relative overflow-y-auto h-full flex flex-col-reverse", className),
        style: { gap: gap ?? "0.5rem", overflowAnchor: "auto", overscrollBehaviorY: "contain" },
        children: [
          items.map((item, index) => /* @__PURE__ */ jsx("div", { children: itemTemplate ? itemTemplate(item, index, null) : item }, itemKey(item, index))),
          hasMore && /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-full flex justify-center py-2 shrink-0",
              style: { overflowAnchor: "none" },
              children: spinnerContent ?? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/50 text-xs text-primary-500", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-notch animate-spin" }),
                /* @__PURE__ */ jsx("span", { children: t2("common:conversations.loadingOldMessages") })
              ] })
            }
          ),
          hasMore && /* @__PURE__ */ jsx(
            "div",
            {
              ref: sentinelRef,
              className: clsx("h-px w-full shrink-0"),
              style: { overflowAnchor: "none" }
            }
          ),
          items.length > 0 && !hasMore && !isLoading && isShowLastSeen && /* @__PURE__ */ jsx("div", { className: "order-last w-full text-center py-4 text-text-third text-sm", children: lastSeen || "Đã xem hết kết quả." }),
          items.length === 0 && !isLoading && emptyComponent
        ]
      }
    );
  }
);
const MessageList = forwardRef(function MessageList2({ isGroup, className, conversationId, parentRef, lastSeen }, ref) {
  const { userId } = useAuth();
  const scrollContainerRef = useRef(null);
  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }
  }));
  const {
    data: _messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading: isMessagesLoading
  } = useMessages(conversationId, { sortDesc: true, limit: 20 });
  const { data: participantsSeen } = useGetPariticipantsSeen(conversationId);
  const participantIds = useMemo(() => {
    return participantsSeen ? Object.keys(participantsSeen.participantsSeenInfo) : [];
  }, [participantsSeen]);
  const messages = useMemo(() => {
    return _messages ? _messages.pages.flatMap((page) => page.items) : [];
  }, [_messages]);
  const senderIds = useMemo(() => {
    return [...new Set(participantIds)];
  }, [participantIds]);
  const { userProfileMap } = useGetUserProfiles(senderIds);
  const initialLoading = isPending || isMessagesLoading;
  if (initialLoading && !messages.length) {
    return /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col gap-4 py-2 w-full h-full justify-end", className), children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "flex gap-3 w-[80%]",
          i % 2 === 0 ? "self-end flex-row-reverse" : "self-start"
        ),
        children: [
          /* @__PURE__ */ jsx(Skeleton, { sz: "md", variant: "circle", className: "w-8 h-8 shrink-0" }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: clsx(
                "flex flex-col gap-2 flex-1",
                i % 2 === 0 ? "items-end" : "items-start"
              ),
              children: [
                /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "w-[80%]" }),
                /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "w-[30%]" })
              ]
            }
          )
        ]
      },
      i
    )) });
  }
  return /* @__PURE__ */ jsx(
    InfiniteScrollReverse,
    {
      ref: scrollContainerRef,
      items: messages,
      onLoadMore: fetchNextPage,
      className: clsx(
        "flex flex-col gap-[0.1rem] px-1 sm:scrollbar-default scrollbar-hide",
        className
      ),
      itemTemplate: (item, index, ref2) => {
        const prevMessage = index < messages.length - 1 ? messages[index + 1] : void 0;
        const nextMessage = index > 0 ? messages[index - 1] : void 0;
        return /* @__PURE__ */ jsx(
          MessageRow,
          {
            ref: ref2,
            message: item,
            prevMessage,
            nextMessage,
            userId,
            index,
            isGroup,
            conversationId,
            userInfo: userProfileMap[item?.senderId || ""],
            userProfileMap
          }
        );
      },
      hasMore: !!hasNextPage,
      isLoading: isFetchingNextPage,
      gap: 2,
      parentRef,
      itemKey: (item) => item.id,
      isShowLastSeen: true,
      lastSeen
    }
  );
});
const PREFIX$2 = buildApiPath("/upload");
class UploadService {
  async getSignature(folder, resourceType) {
    return await apiGet(`${PREFIX$2}/signature?folder=${folder}&resourceType=${resourceType}`, {});
  }
  async upload(file, resourceType) {
    const signatureData = (await this.getSignature("chat-messages", resourceType)).data;
    if (!signatureData) {
      return {
        success: false,
        error: {
          detail: "Failed to get upload signature",
          code: "UPLOAD_SIGNATURE_ERROR"
        }
      };
    }
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${signatureData.resourceType}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", signatureData.folder);
    formData.append("overwrite", String(signatureData.overwrite));
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("resource_type", signatureData.resourceType);
    formData.append("api_key", signatureData.apiKey);
    formData.append("signature", signatureData.signature);
    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData
      }).catch((err) => {
        console.error("Network error during upload:", err);
        throw new Error("Network error during upload");
      });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Cloudinary Detailed Error:", errorBody);
        return {
          success: false,
          error: {
            detail: `Upload failed with status ${response.status}`,
            code: "UPLOAD_ERROR"
          }
        };
      }
      const _res = await response.json();
      const extension = _res.display_name.split(".").pop();
      return {
        success: true,
        data: {
          url: _res.secure_url,
          type: _res.resource_type,
          original_filename: `${_res.original_filename}.${extension}`,
          bytes: _res.bytes
        }
      };
    } catch (err) {
      console.error("Upload error:");
      return {
        success: false,
        error: {
          detail: err instanceof Error ? err.message : "Unknown error",
          code: "UPLOAD_EXCEPTION"
        }
      };
    }
  }
}
const uploadService = new UploadService();
const getMediaTypeFromFileType = (fileType) => {
  switch (fileType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/webp":
    case "image/svg+xml":
    case "image/bmp":
    case "image/tiff":
      return MediaType.Image;
    case "video/mp4":
    case "video/webm":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/mpeg":
    case "video/ogg":
    case "video/3gpp":
      return MediaType.Video;
    case "audio/mpeg":
    case "audio/wav":
    case "audio/ogg":
    case "audio/aac":
    case "audio/flac":
    case "audio/x-m4a":
    case "audio/mp4":
    case "audio/webm":
    case "audio/opus":
      return MediaType.Audio;
    default:
      return MediaType.File;
  }
};
const getCloudinaryResourceTypeFromFileType = (fileType) => {
  switch (fileType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/webp":
    case "image/svg+xml":
    case "image/bmp":
    case "image/tiff":
      return "image";
    case "video/mp4":
    case "video/webm":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/mpeg":
    case "video/ogg":
    case "video/3gpp":
    case "audio/mpeg":
    case "audio/wav":
    case "audio/ogg":
    case "audio/aac":
    case "audio/flac":
    case "audio/x-m4a":
    case "audio/mp4":
    case "audio/webm":
    case "audio/opus":
      return "video";
    default:
      return "raw";
  }
};
const useChatUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const upload = async (files) => {
    setLoading(true);
    setError(null);
    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadService.upload(
          file,
          getCloudinaryResourceTypeFromFileType(file.type)
        );
        if (!result.success || !result.data) {
          throw new Error(result.error?.detail || "Upload failed");
        }
        return result.data;
      });
      const results = await Promise.all(uploadPromises);
      setLoading(false);
      return results;
    } catch (err) {
      setError(err);
      setLoading(false);
      return [];
    }
  };
  return { upload, loading, error };
};
const compressImage = async (file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: file.lastModified
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      const result = event.target?.result;
      if (typeof result === "string") {
        img.src = result;
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};
const compressVideo = async (file, options) => {
  const maxWidth = options?.maxWidth;
  const maxHeight = options?.maxHeight;
  const videoBitsPerSecond = options?.videoBitsPerSecond;
  const sourceUrl = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.src = sourceUrl;
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    await new Promise((resolve, reject) => {
      const onLoaded = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Failed to load video metadata"));
      };
      const cleanup = () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
      };
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);
    });
    const ratio = Math.min(maxWidth / video.videoWidth, maxHeight / video.videoHeight, 1);
    const targetWidth = Math.max(2, Math.floor(video.videoWidth * ratio / 2) * 2);
    const targetHeight = Math.max(2, Math.floor(video.videoHeight * ratio / 2) * 2);
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to initialize video encoder");
    }
    const outputStream = canvas.captureStream(30);
    const videoWithCapture = video;
    const capturedVideoStream = typeof videoWithCapture.captureStream === "function" ? videoWithCapture.captureStream() : null;
    capturedVideoStream?.getAudioTracks().forEach((track) => {
      outputStream.addTrack(track);
    });
    const mimeTypeCandidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm"
    ];
    const mimeType = mimeTypeCandidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || "video/webm";
    const recorder = new MediaRecorder(outputStream, {
      mimeType,
      videoBitsPerSecond
    });
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    const recordPromise = new Promise((resolve, reject) => {
      recorder.onerror = () => reject(new Error("Failed to compress video"));
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };
    });
    const drawFrame = () => {
      if (video.paused || video.ended) {
        return;
      }
      context.drawImage(video, 0, 0, targetWidth, targetHeight);
      requestAnimationFrame(drawFrame);
    };
    recorder.start(100);
    try {
      await video.play();
    } catch {
      recorder.stop();
      throw new Error("Unable to start video compression playback");
    }
    drawFrame();
    await new Promise((resolve) => {
      video.onended = () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
        resolve();
      };
    });
    const compressedBlob = await recordPromise;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const compressedFile = new File([compressedBlob], `${baseName}.webm`, {
      type: "video/webm",
      lastModified: file.lastModified
    });
    if (compressedFile.size >= file.size) {
      return file;
    }
    return compressedFile;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
};
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const validateFileSize = (file, maxSize = MAX_FILE_SIZE) => {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "FILE_TOO_LARGE"
      /* FILE_TOO_LARGE */
    };
  }
  return { valid: true };
};
const ChatInput = ({
  conversationId,
  correlationId,
  receiverId,
  onFocus,
  onAfterSend,
  className
}) => {
  const [hasInput, setHasInput] = useState(false);
  const [fileUrls, setFileUrls] = useState([]);
  const textboxRef = useRef(null);
  const containerRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { fetch: send } = useSendMessage();
  const { addMessageToCache } = useMessageCacheMutations();
  const { userId } = useAuth();
  const { upload } = useChatUpload();
  const { t: t2 } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const handleInputChange = (e) => {
    setHasInput(e.target.value.trim() !== "");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    const content = textboxRef.current?.value.trim() || "";
    if (!content && fileUrls.length === 0) {
      return;
    }
    const baseBody = {
      conversationId,
      correlationId,
      receiverId
    };
    const basePreviewBody = {
      conversationId: conversationId || "",
      senderId: userId,
      status: "pending",
      content,
      createdAt: /* @__PURE__ */ new Date(),
      sequenceNumber: -1,
      isGroup: false
    };
    const currentFiles = [...fileUrls];
    if (textboxRef.current) textboxRef.current.value = "";
    setFileUrls([]);
    setHasInput(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onAfterSend?.();
      });
    });
    const imageMedia = currentFiles.filter(
      (it) => getMediaTypeFromFileType(it.file.type) === MediaType.Image
    );
    const otherMedia = currentFiles.filter(
      (it) => getMediaTypeFromFileType(it.file.type) !== MediaType.Image
    );
    const otherMediaTypes = otherMedia.map((it) => getMediaTypeFromFileType(it.file.type));
    const tempOtherMediaIds = otherMedia.map(() => crypto.randomUUID());
    let tempTextId = "";
    let tempImageId = "";
    if (imageMedia.length > 0) {
      tempImageId = crypto.randomUUID();
      addMessageToCache(conversationId || "", {
        ...basePreviewBody,
        id: tempImageId,
        clientTempId: tempImageId,
        type: MessageType.Media,
        media: imageMedia.map((it) => ({
          url: it.url,
          type: getMediaTypeFromFileType(it.file.type),
          metadata: { name: it.file.name, size: it.file.size }
        }))
      });
    }
    for (let i = 0; i < otherMedia.length; i++) {
      const it = otherMedia[i];
      const tempId = tempOtherMediaIds[i];
      const url = URL.createObjectURL(it.file);
      addMessageToCache(conversationId || "", {
        ...basePreviewBody,
        id: tempId,
        clientTempId: tempId,
        type: MessageType.Media,
        media: [
          {
            url,
            type: getMediaTypeFromFileType(it.file.type),
            metadata: { name: it.file.name, size: it.file.size }
          }
        ]
      });
    }
    if (content && content.trim() !== "") {
      tempTextId = crypto.randomUUID();
      addMessageToCache(conversationId || "", {
        ...basePreviewBody,
        id: tempTextId,
        clientTempId: tempTextId,
        type: MessageType.Text
      });
    }
    if (imageMedia.length > 0) {
      try {
        const image = await upload(imageMedia.map((it) => it.file));
        await send({
          ...baseBody,
          clientTempId: tempImageId,
          content: "",
          type: MessageType.Media,
          media: image.map((url) => ({
            url: url.url,
            type: MediaType.Image,
            metadata: { name: url.original_filename, size: url.bytes }
          }))
        });
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
    if (otherMedia.length > 0) {
      const otherMediaUrls = await upload(otherMedia.map((it) => it.file));
      for (let i = 0; i < otherMedia.length; i++) {
        const url = otherMediaUrls[i];
        await send({
          ...baseBody,
          clientTempId: tempOtherMediaIds[i],
          content: "",
          type: MessageType.Media,
          media: [
            {
              url: url.url,
              type: otherMediaTypes[i],
              metadata: { name: url.original_filename, size: url.bytes }
            }
          ]
        });
      }
    }
    if (content && content.trim() !== "") {
      await send({
        ...baseBody,
        clientTempId: tempTextId,
        content,
        type: MessageType.Text
      });
    }
    fileUrls.forEach((it) => URL.revokeObjectURL(it.url));
    setFileUrls([]);
  };
  const handleSelectFiles = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newItems = [];
      for (const file of fileArray) {
        const sizeValidation = validateFileSize(file, MAX_FILE_SIZE);
        if (!sizeValidation.valid) {
          showSnackbar(
            t2("chat.upload.fileTooLarge", {
              fileName: file.name,
              maxSize: "50MB"
            }),
            "error"
          );
          continue;
        }
        let fileToAdd = file;
        if (file.type.startsWith("image/")) {
          try {
            fileToAdd = await compressImage(file, 1920, 1920, 0.8);
          } catch (error) {
            console.error("Error compressing image:", error);
            showSnackbar(t2("chat.upload.compressionError", { fileName: file.name }), "error");
            continue;
          }
        } else if (file.type.startsWith("video/")) {
          try {
            fileToAdd = await compressVideo(file, {
              maxWidth: 1280,
              maxHeight: 720,
              videoBitsPerSecond: 9e5
            });
          } catch (error) {
            console.error("Error compressing video:", error);
            showSnackbar(t2("chat.upload.compressionError", { fileName: file.name }), "error");
          }
        }
        newItems.push({ url: URL.createObjectURL(fileToAdd), file: fileToAdd });
      }
      if (newItems.length > 0) {
        setFileUrls((prev) => [...prev, ...newItems]);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };
  const renderFilePreview = (it) => {
    const type = getMediaTypeFromFileType(it.file.type);
    switch (type) {
      case MediaType.Image:
        return /* @__PURE__ */ jsx("img", { src: it.url, alt: "preview", className: "h-16 w-16 object-cover rounded-xl" });
      case MediaType.Video:
        return /* @__PURE__ */ jsxs("div", { className: "h-16 w-16 bg-black rounded-xl flex items-center justify-center relative", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-video text-white/50 text-xl" }),
          /* @__PURE__ */ jsx(
            "video",
            {
              src: it.url,
              className: "absolute inset-0 h-full w-full object-cover opacity-30 rounded-xl"
            }
          )
        ] });
      case MediaType.Audio:
        return /* @__PURE__ */ jsxs("div", { className: "h-16 w-32 bg-primary-100 rounded-xl flex flex-col items-center justify-center px-2", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-microphone text-primary-500 mb-1" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] truncate w-full text-center", children: it.file.name })
        ] });
      default:
        return /* @__PURE__ */ jsxs("div", { className: "h-16 w-32 bg-bg-main border border-border-main rounded-xl flex flex-col items-center justify-center px-2", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-file-lines text-primary-500 mb-1" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] truncate w-full text-center", children: it.file.name })
        ] });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col w-full bg-bg-third", className), ref: containerRef, children: /* @__PURE__ */ jsxs("div", { className: "w-full flex items-end gap-1", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: imageInputRef,
        className: "hidden",
        multiple: true,
        accept: "image/*",
        onChange: handleSelectFiles
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        multiple: true,
        accept: "video/*,audio/*,.pdf,.doc,.docx,.zip,.rar",
        onChange: handleSelectFiles
      }
    ),
    /* @__PURE__ */ jsx(
      MiniButton,
      {
        onClick: () => fileInputRef.current?.click(),
        onPointerDown: (e) => e.preventDefault(),
        children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paperclip text-primary-500" })
      }
    ),
    /* @__PURE__ */ jsx(
      MiniButton,
      {
        onClick: () => imageInputRef.current?.click(),
        onPointerDown: (e) => e.preventDefault(),
        children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image text-primary-500" })
      }
    ),
    /* @__PURE__ */ jsx(
      TextArea,
      {
        sz: "sm",
        className: "!rounded-2xl",
        wrapperClassName: "flex-1 min-w-0",
        placeholder: "Tin nhắn của bạn",
        onKeyDown: handleKeyDown,
        ref: textboxRef,
        onChange: handleInputChange,
        rows: 0,
        maxRows: 5,
        onFocus: () => {
          onFocus?.();
        },
        topContent: /* @__PURE__ */ jsx(Fragment, { children: fileUrls.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 overflow-x-auto py-2 px-2", children: fileUrls.map((it) => /* @__PURE__ */ jsxs("div", { className: "relative group flex-shrink-0", children: [
          renderFilePreview(it),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: clsx(
                "absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5",
                "flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              ),
              onClick: () => {
                URL.revokeObjectURL(it.url);
                setFileUrls((prev) => prev.filter((u) => u.url !== it.url));
              },
              children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark text-[10px]" })
            }
          )
        ] }, it.url)) }) })
      }
    ),
    /* @__PURE__ */ jsx(
      MiniButton,
      {
        onClick: handleSendMessage,
        disabled: !hasInput && fileUrls.length === 0,
        onPointerDown: (e) => e.preventDefault(),
        children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paper-plane text-primary-500" })
      }
    )
  ] }) });
};
const ChatWindow = ({ className, conversationId }) => {
  const [chatTitle, setChatTitle] = useState("");
  const [chatAvatar, setChatAvatar] = useState("");
  const { toggleMinimize, closeChat, registry } = useChatStore(
    useShallow((state) => ({
      toggleMinimize: state.toggleMinimize,
      closeChat: state.closeChat,
      registry: state.registry
    }))
  );
  const { renderConversationName } = useRenderConversationContent();
  const { t: t2 } = useTranslation();
  const scrollRef = useRef(null);
  const panelRef = useRef(null);
  const { fetch: markAsRead } = useMarkConversationAsRead();
  const markAsReadLocal = useLocalMarkAsRead();
  const lastMessageSeq = useMessageStore((state) => state.lastMessageMap[conversationId]);
  const setFocusOn = useChatStore((state) => state.setFocusOn);
  const chat2 = registry[conversationId];
  const tempTargetId = chat2?.type === "temp" ? chat2.targetId : void 0;
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
  const handleMarkAsReadOnFocus = useCallback(async () => {
    if (!conversationData?.id || !document.hasFocus()) return;
    setFocusOn(conversationData.id);
    const lastMsgSeq = lastMessageSeq || conversationData?.lastMessageNumber;
    const myLastSeenSeq = conversationData.myLastSeenMessageSeq || 0;
    if (!lastMsgSeq) return;
    if (lastMsgSeq <= myLastSeenSeq) return;
    markAsReadLocal(conversationData.id, lastMsgSeq);
    await markAsRead({
      conversationId: conversationData.id,
      messageSeq: lastMsgSeq
    });
  }, [
    conversationData?.id,
    conversationData?.lastMessage?.sequenceNumber,
    lastMessageSeq,
    markAsRead,
    markAsReadLocal,
    setFocusOn
  ]);
  useEffect(() => {
    if (!conversationData?.id) return;
    const handleUserInteract = () => {
      void handleMarkAsReadOnFocus();
    };
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setFocusOn(null);
      }
    };
    const handleWindowBlur = () => {
      setFocusOn(null);
    };
    const messageArea = scrollRef.current;
    if (messageArea) {
      messageArea.addEventListener("click", handleUserInteract);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      if (messageArea) {
        messageArea.removeEventListener("click", handleUserInteract);
      }
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [conversationData?.id, handleMarkAsReadOnFocus, setFocusOn]);
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
    setFocusOn(null);
    closeChat(conversationId);
  }, [closeChat, conversationId, setFocusOn]);
  const handleOnMinimum = useCallback(() => {
    setFocusOn(null);
    toggleMinimize(conversationId);
  }, [conversationId, setFocusOn, toggleMinimize]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "w-[330px] h-[450px] bg-bg-main rounded-xl shadow-lg overflow-hidden flex flex-col",
        "border border-bg-seventh shadow-xl",
        className
      ),
      ref: panelRef,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center px-4 h-[13%] bg-bg-second", children: [
          isLoadingHeader ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Skeleton, { sz: "md", variant: "circle", className: "w-8" }),
            /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "ml-2 flex-1" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Avatar, { src: chatAvatar, alt: "Avatar", sz: "sm" }),
            /* @__PURE__ */ jsx(
              Text,
              {
                sz: "sm",
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
          /* @__PURE__ */ jsx(MiniButton, { sz: "sm", onClick: handleOnMinimum, children: /* @__PURE__ */ jsx("i", { className: "fas fa-minus" }) }),
          /* @__PURE__ */ jsx(MiniButton, { sz: "sm", onClick: handleOnClose, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { ref: scrollRef, className: "flex flex-col px-0 flex-1 overflow-y-auto bg-bg-second", children: [
          tempTargetId ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center h-full text-center px-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative mb-3", children: [
              /* @__PURE__ */ jsx(Avatar, { src: chatAvatar, alt: "Avatar", sz: "sm" }),
              /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" })
            ] }),
            /* @__PURE__ */ jsx(Text, { sz: "sm", weight: "bold", className: "text-white", children: chatTitle }),
            /* @__PURE__ */ jsx(Text, { sz: "sm", className: "text-gray-400 mt-1", children: "Hai bạn chưa có tin nhắn nào" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 px-3 py-2 bg-gray-700/30 rounded-full", children: /* @__PURE__ */ jsx(Text, { sz: "sm", className: "text-gray-300", children: "Gửi lời chào đầu tiên 👋" }) })
          ] }) : null,
          !tempTargetId && /* @__PURE__ */ jsx(
            MessageList,
            {
              className: "px-2",
              conversationId,
              isGroup: conversationData?.isGroup,
              parentRef: scrollRef,
              lastSeen: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center h-full text-center px-4", children: [
                /* @__PURE__ */ jsx("div", { className: "relative mb-4", children: /* @__PURE__ */ jsx(Avatar, { src: conversationData?.avatarUrl || "", alt: "Avatar", sz: "md" }) }),
                /* @__PURE__ */ jsx(Text, { sz: "sm", weight: "bold", children: chatTitle }),
                /* @__PURE__ */ jsx(Text, { sz: "xs", wrap: "whitespace-normal", children: t2("common:conversations:privacyDescription") })
              ] })
            },
            conversationId
          )
        ] }),
        /* @__PURE__ */ jsx(
          ChatInput,
          {
            className: "!bg-bg-main h-fit py-2 pr-1",
            conversationId: !tempTargetId ? conversationId : void 0,
            correlationId: tempTargetId ? conversationId : void 0,
            receiverId: tempTargetId,
            onFocus: tempTargetId ? void 0 : () => void handleMarkAsReadOnFocus()
          }
        )
      ]
    }
  );
};
const GroupChatWindow = ({ className }) => {
  const activeIds = useChatStore((state) => state.activeIds);
  return /* @__PURE__ */ jsx("div", { className: clsx("flex gap-3", className), children: activeIds.map((id) => {
    return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ChatWindow, { className: "rounded-b-none", conversationId: id }) }, id);
  }) });
};
const BubbleChat = ({ className, conversationId }) => {
  const { toggleMinimize, closeChat, registry } = useChatStore(
    useShallow((state) => ({
      toggleMinimize: state.toggleMinimize,
      closeChat: state.closeChat,
      registry: state.registry
    }))
  );
  const chat2 = registry[conversationId];
  const tempTargetId = chat2?.type === "temp" ? chat2.targetId : void 0;
  const { data: tempUser } = useGetUserProfile(tempTargetId);
  const { data: conversationData } = useGetConversation(
    conversationId,
    void 0,
    !!conversationId
  );
  const chatAvatar = tempUser ? tempUser.infos.avatar : conversationData?.avatarUrl || "";
  const handleOnClick = useCallback(async () => {
    toggleMinimize(conversationId);
  }, [toggleMinimize, conversationId]);
  const handleOnClose = (e) => {
    e.stopPropagation();
    closeChat(conversationId);
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("relative flex gap-4 group", className), onClick: handleOnClick, children: [
    /* @__PURE__ */ jsx(
      Avatar,
      {
        sz: "md",
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
      "button",
      {
        className: clsx(
          "absolute opacity-0 group-hover:opacity-100 bg-gray-500 !duration-100 top-[-20%] right-[-20%]",
          "w-7 h-7 rounded-full flex items-center justify-center text-white",
          "hover:bg-gray-600 transition-colors"
        ),
        onClick: handleOnClose,
        children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
      }
    )
  ] });
};
const BubbleChatList = ({ className }) => {
  const minimizedIds = useChatStore((state) => state.minimizedIds);
  return /* @__PURE__ */ jsx("div", { className: clsx("flex gap-4 flex-col", className), children: minimizedIds.map((id) => /* @__PURE__ */ jsx(BubbleChat, { conversationId: id }, id)) });
};
const ChatLayer = ({ className }) => {
  const isFatalkPage = useLocation().pathname.startsWith("/fatalk");
  const initializeFromStorage = useChatStore((state) => state.initializeFromStorage);
  useEffect(() => {
    initializeFromStorage?.();
  }, [initializeFromStorage]);
  if (isFatalkPage) return null;
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex items-end gap-4", className), children: [
    /* @__PURE__ */ jsx(GroupChatWindow, {}),
    /* @__PURE__ */ jsx(BubbleChatList, { className: "mb-5" })
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
  lastSeen,
  gap,
  parentRef,
  itemKey,
  emptyComponent
}) {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const isLoadingRef = useRef(isLoading);
  const pendingLoadRef = useRef(false);
  useEffect(() => {
    isLoadingRef.current = isLoading;
    if (!isLoading) {
      pendingLoadRef.current = false;
    }
  }, [isLoading]);
  const _loadMore = async () => {
    if (pendingLoadRef.current) return;
    if (isLoadingRef.current) return;
    pendingLoadRef.current = true;
    await new Promise((resolve) => setTimeout(resolve, 50));
    await onLoadMore();
  };
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!hasMore) return;
        _loadMore();
      },
      {
        root: parentRef?.current || containerRef.current,
        rootMargin: "300px 0px 200px 0px"
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, parentRef]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: clsx("relative overflow-y-auto h-full flex flex-col", className),
      style: { gap: gap ?? "0.5rem" },
      children: [
        items.map((item, index) => /* @__PURE__ */ jsx("div", { children: itemTemplate ? itemTemplate(item, index, null) : item }, itemKey(item, index))),
        isLoading && /* @__PURE__ */ jsx("div", { className: "relative w-full", style: { overflowAnchor: "none" }, children: Array.from({ length: numberOfSkeletons }).map((_, index) => /* @__PURE__ */ jsx("div", { className: "relative", children: loadingSkeleton ?? "Loading..." }, `skeleton-${index}`)) }),
        hasMore && /* @__PURE__ */ jsx(
          "div",
          {
            ref: sentinelRef,
            className: clsx("h-px w-full shrink-0"),
            style: { overflowAnchor: "none" }
          }
        ),
        items.length > 0 && !hasMore && !isLoading && isShowLastSeen && /* @__PURE__ */ jsx("div", { className: "w-full text-center py-4 text-text-third text-sm", children: lastSeen || "Đã xem hết kết quả." }),
        items.length === 0 && !isLoading && emptyComponent
      ]
    }
  );
}
const ChatItem = ({ conversation, onClick }) => {
  const lastMessage = conversation.lastMessage;
  const location = useLocation();
  const currentConversationId = location.pathname.split("/").pop();
  const { t: t2 } = useTranslation();
  const { renderConversationName, renderSystemMessage } = useRenderConversationContent();
  const { formatTime } = useFormatTime();
  const unreadCount = useUnreadMessageCountCache(conversation.id);
  const isUnread = unreadCount > 0;
  const isOtherUserRead = conversation.otherLastSeenMessageSeq && conversation.lastMessage?.sequenceNumber && conversation.otherLastSeenMessageSeq >= conversation.lastMessage.sequenceNumber;
  const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const { userId } = useAuth();
  const renderMessagePreview = () => {
    if (unreadCount > 1) {
      return `Bạn có ${unreadLabel} tin nhắn chưa đọc`;
    }
    if (!lastMessage) {
      return t2("common:conversations.noMessagesYet");
    }
    if (isSystemMessage(lastMessage.type || MessageType.System)) {
      return renderSystemMessage(lastMessage);
    }
    const senderName = userId === lastMessage.senderId ? t2("common:conversations.you") : lastMessage.senderFullName;
    switch (lastMessage.type) {
      case MessageType.Text:
        return `${senderName}: ${lastMessage.content}`;
      case MessageType.Media:
        if (lastMessage.media && lastMessage.media.some((m) => m.type === MediaType.Image)) {
          return `${senderName}: ${t2("common:conversations.sentImageMessage", { count: lastMessage.media.length })}`;
        }
        return `${senderName}: ${t2("common:conversations.sentMediaMessage")}`;
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex gap-2 px-1 py-3",
        "hover:bg-bg-fourth rounded-lg transition-colors",
        "cursor-pointer",
        conversation.id === currentConversationId && "bg-bg-fourth"
      ),
      onClick: () => onClick(),
      children: [
        /* @__PURE__ */ jsx(Avatar, { src: conversation.avatarUrl ?? "", alt: "Conversation Avatar", sz: "md" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 min-w-0 justify-center", children: [
          /* @__PURE__ */ jsx(
            Text,
            {
              sz: "sm",
              weight: isUnread ? "bold" : "regular",
              className: clsx("line-clamp-1 truncate max-w-full"),
              children: renderConversationName(conversation)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center opacity-80", children: [
            /* @__PURE__ */ jsx(Text, { sz: "xs", className: "truncate max-w-full", weight: isUnread ? "bold" : "regular", children: renderMessagePreview() }),
            /* @__PURE__ */ jsx(Text, { sz: "xs", className: "mx-2 shrink-0", weight: isUnread ? "bold" : "regular", children: "•" }),
            /* @__PURE__ */ jsx(Text, { sz: "xs", className: "shrink-0", weight: isUnread ? "bold" : "regular", children: formatTime(conversation.lastMessage?.createdAt ?? "") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center justify-end gap-2", children: [
          !conversation.isGroup && isOtherUserRead && !isUnread ? /* @__PURE__ */ jsx(Avatar, { sz: "xs", src: conversation.avatarUrl || "", alt: "seen", className: "my-auto" }) : null,
          Boolean(isUnread) === true && /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: clsx("w-2 h-2 rounded-full", "my-auto", "bg-primary-500") })
        ] })
      ]
    },
    conversation.id
  );
};
const ChatList = ({
  className,
  onConversationClick,
  data,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetching
}) => {
  const { t: t2 } = useTranslation();
  const { openChat } = useOpenChat();
  const conversations2 = data?.pages.flatMap((page) => page.items) || [];
  const handleConversationClick = useCallback(
    async (conversationId) => {
      onConversationClick?.(conversationId);
      openChat(conversationId);
    },
    [onConversationClick, openChat]
  );
  const scrollWrapperRef = useRef(null);
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col p-2", className), children: [
    /* @__PURE__ */ jsx(
      Textbox,
      {
        placeholder: t2("common:conversations.search"),
        sz: "sm",
        className: "border-0 w-full",
        type: "search"
      }
    ),
    /* @__PURE__ */ jsx("div", { ref: scrollWrapperRef, className: "flex-1 overflow-y-auto mt-2 ", children: /* @__PURE__ */ jsx(
      InfiniteScrollFlex,
      {
        className: "scrollbar-hide sm:scrollbar-default",
        items: conversations2,
        parentRef: scrollWrapperRef,
        onLoadMore: fetchNextPage ?? (() => {
        }),
        hasMore: hasNextPage,
        itemTemplate: (item) => /* @__PURE__ */ jsx(ChatItem, { conversation: item, onClick: () => handleConversationClick(item.id) }),
        itemKey: (item) => item.id,
        isLoading: isLoading || isFetching,
        loadingSkeleton: /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center my-2"), children: [
          /* @__PURE__ */ jsx(Skeleton, { sz: "md", variant: "circle" }),
          /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col w-full flex-1 gap-2 ml-2"), children: [
            /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-full"), sz: "sm" }),
            /* @__PURE__ */ jsx(Skeleton, { className: clsx("w-[50%]"), sz: "sm" })
          ] })
        ] }),
        numberOfSkeletons: 2,
        emptyComponent: /* @__PURE__ */ jsx(
          NotFound,
          {
            icon: "fa-regular fa-message",
            title: t2("common:conversations.noConversations"),
            description: t2("common:conversations.noConversationsMessage"),
            className: "py-5"
          }
        )
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
        "flex flex-col gap-1 overflow-hidden",
        isLoading ? "opacity-50 cursor-not-allowed" : "",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: clsx("mb-2 gap-4", selectClassName), children: [...defaultSelected, ...selected].map((item, index) => {
          const isDefault = defaultSelected.some((s) => s.value === item.value);
          return /* @__PURE__ */ jsx("div", { className: "relative", children: isDefault ? defaultItemTemplate(item.item, () => handleRemoveSelected(item.value), index) : selectItemTemplate(item.item, () => handleRemoveSelected(item.value), index) }, item.value);
        }) }),
        /* @__PURE__ */ jsx("div", { className: clsx("flex flex-col flex-1 gap-1 overflow-y-auto", optionClassName), children: /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsxs("div", { className: "w-full flex gap-1 mt-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              sz: "sm",
              className: "flex flex-1 items-center justify-center",
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
              sz: "sm",
              className: "flex flex-1 items-center justify-center",
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
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col h-full overflow-hidden px-2 pb-4", className), children: [
    /* @__PURE__ */ jsx("div", { className: "ml-1", children: /* @__PURE__ */ jsx(Text, { weight: "bold", sz: "md", children: t("common:conversations.createGroupChat") }) }),
    /* @__PURE__ */ jsx(
      Textbox,
      {
        sz: "sm",
        placeholder: t("common:conversations.enterGroupNameOptional"),
        className: "w-full !rounded-lg my-2",
        ref: textboxRef,
        disabled: isFetching,
        type: "text"
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
              /* @__PURE__ */ jsx("div", { className: "relative flex-shrink-0", children: /* @__PURE__ */ jsx(Avatar, { src: item.avatar, alt: item.name, sz: "md" }) }),
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
        selectItemTemplate: (item, onRemove) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "flex items-center gap-1 px-3 py-2 rounded-md  text-primary-500 bg-primary-500/15 text-xs"
            ),
            children: [
              /* @__PURE__ */ jsx("span", { className: "truncate max-w-[100px]", children: item.name }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "flex items-center justify-center w-4 h-4 rounded-sm hover:bg-primary-500/20 transition-colors",
                  onClick: onRemove,
                  children: "×"
                }
              )
            ]
          }
        ),
        defaultItemTemplate: (item) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 px-3 py-2 rounded-md bg-gray-500/15 text-xs", children: /* @__PURE__ */ jsx("span", { className: "truncate max-w-[100px]", children: item.name }) }),
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        selectClassName: clsx(
          "flex flex-wrap gap-1 border-2 border-bg-third bg-bg-sixth rounded-lg px-2 py-2",
          "min-h-[50px] max-h-[300px] overflow-y-auto scrollbar-hide"
        ),
        optionClassName: "h-full overflow-y-auto pr-1 border-2 rounded-md border-bg-third",
        className: "flex-1",
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
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useConversations();
  const { t: t2 } = useTranslation();
  const navigate = useNavigate();
  const handleSelectConversation = (conversationId) => {
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
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 flex mt-3 mr-3 gap-2", children: /* @__PURE__ */ jsx(MiniButton, { sz: "sm", className: "bg-bg-fifth", onClick: handleCreateConversation, children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-pen-to-square" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between px-2 pt-2", children: /* @__PURE__ */ jsx(Text, { sz: "lg", weight: "bold", children: t2("common:conversations.title") }) }),
        tab === "list" && /* @__PURE__ */ jsx(
          ChatList,
          {
            className: "overflow-y-auto pt-0 h-full",
            onConversationClick: handleSelectConversation,
            data,
            fetchNextPage,
            hasNextPage,
            isLoading,
            isFetching
          }
        ),
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
            title: t2("common:conversations.openFatalk"),
            children: [
              /* @__PURE__ */ jsx(Text, { sz: "sm", color: "secondary", children: t2("common:conversations.openFatalk") }),
              /* @__PURE__ */ jsx(Text, { sz: "sm", color: "secondary", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-up-right-from-square" }) })
            ]
          }
        ) })
      ]
    }
  );
};
const ChatBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: count = 0 } = useGetUnreadMessageCount();
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
const MessageIconWithBadge = () => {
  const { data: count = 0 } = useGetUnreadMessageCount();
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-message" }),
    count > 0 && /* @__PURE__ */ jsx(
      "span",
      {
        className: clsx(
          "absolute -top-1 left-3",
          "text-xs h-3 min-w-[12px]",
          "px-1",
          "flex items-center justify-center",
          "text-white bg-red-500 rounded-full",
          "ring-2 ring-bg-main"
        ),
        children: count > 99 ? "99+" : count
      }
    )
  ] });
};
const NotificationIconWithBadge = () => {
  const { unreadCount } = useUnreadCount();
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bell" }),
    unreadCount > 0 && /* @__PURE__ */ jsx(
      "span",
      {
        className: clsx(
          "absolute -top-1 left-2",
          "text-xs h-3 min-w-[12px]",
          "px-1",
          "flex items-center justify-center",
          "text-white bg-red-500 rounded-full",
          "ring-2 ring-bg-main"
        ),
        children: unreadCount > 99 ? "99+" : unreadCount
      }
    )
  ] });
};
const DefaultLayout = () => {
  const { isAuthenticated } = useAuth();
  const isAuthed = Boolean(isAuthenticated);
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
      icon: /* @__PURE__ */ jsx(MessageIconWithBadge, {}),
      path: "/fatalk",
      isIndex: false,
      showOnDesktop: false
    },
    {
      icon: /* @__PURE__ */ jsx(NotificationIconWithBadge, {}),
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
    handleResize();
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
    if (isAuthed) {
      closeDialog();
    } else {
      if (isMobile) return;
      openLoginOverlay();
    }
    return () => closeDialog();
  }, [isMobile, isAuthenticated, closeDialog, openLoginOverlay]);
  const handleGoToHome = useCallback(() => {
    if (isAuthed) {
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
              children: /* @__PURE__ */ jsx("div", { onClick: handleGoToHome, children: /* @__PURE__ */ jsx(Logo, { sz: "sm", hasSlogan: false }) })
            }
          ),
          /* @__PURE__ */ jsx(
            Navbar,
            {
              isAuthenticated: isAuthed,
              items,
              logo: !isMobile && /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: handleGoToHome,
                  className: "sm:block hidden cursor-pointer items-center gap-2",
                  children: /* @__PURE__ */ jsx(Logo, { hasSlogan: false, sz: "md" })
                }
              ),
              optionClassName: "!justify-end",
              options: isAuthed ? /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center gap-2"), children: [
                /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex gap-2", children: [
                  !isFatalkPage && /* @__PURE__ */ jsx(ChatBadge, {}),
                  /* @__PURE__ */ jsx(NotificationBadge, {})
                ] }),
                /* @__PURE__ */ jsx(UserMenu, {})
              ] }) : !isMobile && /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center gap-2"), children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    sz: "sm",
                    variant: "secondary",
                    className: "whitespace-nowrap inline-flex",
                    onClick: openLoginOverlay,
                    children: "Sign in"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    sz: "sm",
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
          /* @__PURE__ */ jsx(Text, { sz: "sm", className: "text-center", wrap: "whitespace-normal", children: "Join Fatagram to connect with your friends and the world around you!" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center h-full", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                sz: "sm",
                variant: "primary",
                className: "whitespace-nowrap inline-flex flex-1 justify-center",
                onClick: openLoginOverlay,
                children: "Sign in"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                sz: "sm",
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
const SettingsNavbar = ({ className, onSelect }) => {
  const { t: t2 } = useTranslation();
  const authSettings = [
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user" }),
      name: t2("settings:navbar.privacy.account"),
      path: "/settings"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-shield-halved" }),
      name: t2("settings:navbar.privacy.privacy"),
      path: "/settings/privacy"
    }
  ];
  const generalSettings = [
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-language" }),
      name: t2("settings:navbar.general.language"),
      path: "/settings/language"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bell" }),
      name: t2("settings:navbar.general.notifications"),
      path: "/settings/notifications"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info" }),
      name: t2("settings:navbar.general.about"),
      path: "/settings/about"
    },
    {
      icon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-palette" }),
      name: t2("settings:navbar.general.theme"),
      path: "/settings/theme"
    }
  ];
  return /* @__PURE__ */ jsxs(PageNavbar, { title: t2("settings:navbar.title"), className: clsx(className), children: [
    /* @__PURE__ */ jsx(PageNavbar.Section, { title: t2("settings:navbar.privacy.title"), className: "px-2 space-y-1", children: authSettings.map((item, index) => /* @__PURE__ */ jsx(
      PageNavbar.Item,
      {
        path: item.path,
        icon: item.icon,
        title: item.name,
        onClick: onSelect
      },
      index
    )) }),
    /* @__PURE__ */ jsx(PageNavbar.Section, { title: t2("settings:navbar.general.title"), className: "px-2 space-y-1", children: generalSettings.map((item, index) => /* @__PURE__ */ jsx(
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
  const { t: t2 } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    document.title = t2("settings:title");
  }, [t2]);
  return /* @__PURE__ */ jsx(
    SidebarPageLayout,
    {
      title: t2("settings:title"),
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
  const [inputValue, setInputValue] = useState(value ?? "");
  const { t: t2 } = useTranslation();
  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex flex-col sm:flex-row sm:justify-between sm:items-center w-full",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(Text, { sz: "lg", className: "font-semibold mb-0", children: title2 }),
        /* @__PURE__ */ jsxs("div", { className: "flex sm:items-center items-end gap-4 justify-between", children: [
          editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx(
              Textbox,
              {
                sz: "sm",
                placeholder,
                isWrong: isError,
                type: "text",
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value)
              }
            ),
            isError && /* @__PURE__ */ jsx(Text, { sz: "sm", className: "!text-red-500 ml-0 h-[5px]", children: errorMessage })
          ] }) : /* @__PURE__ */ jsx(Text, { sz: "lg", className: clsx(valueClassName), children: value ?? noDataValue }),
          canEdit && /* @__PURE__ */ jsx(Fragment, { children: editableMode === "inline" && isEdit ? /* @__PURE__ */ jsxs("div", { className: "animate-fade-in gap-1 flex", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                disabled: value === inputValue,
                sz: "sm",
                variant: "primary",
                onClick: () => {
                  onSaveClick?.(inputValue);
                },
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-floppy-disk mr-2" }),
                  t2("settings:editableField.saveButton")
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                sz: "sm",
                variant: "fourth",
                onClick: () => {
                  onCancelClick?.();
                },
                children: t2("settings:editableField.cancelButton")
              }
            )
          ] }) : /* @__PURE__ */ jsx(
            Button,
            {
              sz: "sm",
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
  URLNAME_ALREADY_EXISTS: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameAlreadyExist",
  URL_NAME_TOO_SHORT: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameTooShort",
  URL_NAME_TOO_LONG: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameTooLong",
  URL_NAME_EMPTY: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameEmpty",
  URL_NAME_CONTAINS_SPACE: "settings:account.personalInfo.errorMessages.changeUrlName.urlNameContainsSpace",
  UNKNOWN_ERROR: "settings:account.personalInfo.errorMessages.changeUrlName.unknownError",
  INTERNAL_SERVER_ERROR: "settings:account.personalInfo.errorMessages.changeUrlName.internalServerError"
};
const ChangeUrlName = ({ userId }) => {
  const t2 = useLanguage$1();
  const { setUrlName: _setUrlName } = useAuth();
  const [isEditUrlName, setIsEditUrlName] = useState(false);
  const [isEditUrlNameFailed, setIsEditUrlNameFailed] = useState(false);
  const [editUrlFailedMessage, setEditUrlFailedMessage] = useState("");
  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const { fetch: updateUrlNameMutation } = useUpdateUrlName(userId);
  const handleSaveUrlName = (newUrlName) => {
    if (!newUrlName) return;
    updateUrlNameMutation(
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
            setEditUrlFailedMessage(t2(ErrorCodes$2[errorCode]));
          } else {
            setEditUrlFailedMessage(t2(ErrorCodes$2["UNKNOWN_ERROR"]));
          }
          setIsEditUrlNameFailed(true);
        }
      }
    );
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" });
  }
  return /* @__PURE__ */ jsx(
    EditableField,
    {
      title: t2("settings:account.personalInfo.urlName"),
      value: userProfile?.infos.urlName,
      noDataValue: t2("settings:account.personalInfo.noUrlName"),
      placeholder: t2("settings:account.personalInfo.urlNamePlaceholder"),
      valueClassName: clsx(!userProfile?.infos.urlName && "!opacity-50"),
      btnChildren: /* @__PURE__ */ jsxs(Text, { children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen mr-2" }),
        t2("settings:account.personalInfo.changeButton")
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
  const t2 = useLanguage$1();
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
            setEditNicknameFailedMessage(t2(ErrorCodes$1[errorCode]));
          } else {
            setEditNicknameFailedMessage(
              t2("settings:account.personalInfo.errorMessages.changeNickname.unknownError")
            );
          }
          setIsEditNicknameFailed(true);
        }
      }
    );
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" });
  }
  return /* @__PURE__ */ jsx(
    EditableField,
    {
      title: t2("settings:account.personalInfo.nickname"),
      value: userProfile?.infos.nickname,
      noDataValue: t2("settings:account.personalInfo.noNickname"),
      placeholder: t2("settings:account.personalInfo.nicknamePlaceholder"),
      valueClassName: clsx(!userProfile?.infos.nickname && "!opacity-50"),
      btnChildren: /* @__PURE__ */ jsxs(Text, { children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen mr-2" }),
        t2("settings:account.personalInfo.changeButton")
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
  const t2 = useLanguage$1();
  const { userId } = useAuth();
  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const navigate = useNavigate();
  const handleChangeName = () => navigate("name");
  return /* @__PURE__ */ jsxs(SidebarPageCard, { title: t2("settings:account.personalInfo.title"), children: [
    isLoading ? /* @__PURE__ */ jsx(Skeleton, { sz: "md", className: "w-full lg:ml-auto mb-7 mt-2 lg:mt-0" }) : /* @__PURE__ */ jsx(
      EditableField,
      {
        title: t2("settings:account.personalInfo.yourName"),
        value: userProfile?.infos.fullName,
        btnChildren: /* @__PURE__ */ jsxs(Text, { children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen mr-2" }),
          " ",
          t2("settings:account.personalInfo.changeButton")
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
    /* @__PURE__ */ jsx(Text, { sz: "lg", className: "", children: title2 }),
    selectBox ? selectBox : /* @__PURE__ */ jsx(
      SelectBox,
      {
        showTitle: false,
        title: title2,
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
  const { t: t2 } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const selectTheme = (opt) => {
    setTheme(opt);
    showSnackbar(t2("settings:theme.themeChanged"), "info");
  };
  useEffect(() => {
    const options = availableThemes.map((theme22) => ({
      key: theme22.key,
      value: t2(theme22.label)
    }));
    setThemeOptions(options);
  }, [availableThemes, t2]);
  return /* @__PURE__ */ jsx(SidebarPageCard, { title: t2("settings:theme.title"), children: /* @__PURE__ */ jsx(
    SelectBoxSetting,
    {
      title: t2("settings:theme.selectTheme"),
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
  const { t: t2 } = useTranslation();
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
            setErrorMessage(t2(ErrorCodes[errorCode].message));
            setFirstNameFailed(ErrorCodes[errorCode].type === "FirstName");
            setLastNameFailed(ErrorCodes[errorCode].type === "LastName");
          } else {
            setErrorMessage(t2(ErrorCodes["UNKNOWN_ERROR"].message));
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
            "animate-fade-in relative flex flex-col justify-center bg-bg-second sm:rounded-2xl shadow-lg px-10 py-10",
            "rounded-none w-full h-full sm:h-fit sm:w-fit"
          ),
          children: [
            /* @__PURE__ */ jsx(Text, { className: clsx("sm:mb-4 text-gradient-main !font-bold !text-2xl"), children: t2("settings:account.personalInfo.changeNameForm.title") }),
            isLoading ? /* @__PURE__ */ jsx(Skeleton, {}) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: clsx(
                    "animate-fade-in flex flex-col sm:flex-row gap-7 justify-center w-full rounded-2xl sm:bg-bg-main sm:px-5 py-5"
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsx(Text, { sz: "md", className: clsx("ml-2 mb-1"), children: t2("settings:account.personalInfo.changeNameForm.firstName") }),
                      /* @__PURE__ */ jsx(
                        Textbox,
                        {
                          isWrong: firstNameFailed,
                          value: newFirstName,
                          onChange: (e) => setNewFirstName(e.target.value),
                          placeholder: "First name",
                          className: clsx("w-full py-1 px-2 lg:max-w-[200px]"),
                          type: "text",
                          sz: "sm"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsx(Text, { sz: "md", className: clsx("ml-2 mb-1"), children: t2("settings:account.personalInfo.changeNameForm.middleName") }),
                      /* @__PURE__ */ jsx(
                        Textbox,
                        {
                          isWrong: middleNameFailed,
                          value: newMiddleName,
                          onChange: (e) => setNewMiddleName(e.target.value),
                          placeholder: "Middle name",
                          className: clsx("w-full py-1 px-2 lg:max-w-[200px]"),
                          type: "text",
                          sz: "sm"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: clsx("flex flex-col"), children: [
                      /* @__PURE__ */ jsx(Text, { sz: "md", className: clsx("ml-2 mb-1"), children: t2("settings:account.personalInfo.changeNameForm.lastName") }),
                      /* @__PURE__ */ jsx(
                        Textbox,
                        {
                          isWrong: lastNameFailed,
                          value: newLastName,
                          onChange: (e) => setNewLastName(e.target.value),
                          placeholder: "Last name",
                          className: clsx("w-full py-1 px-2 lg:max-w-[200px]"),
                          type: "text",
                          sz: "sm"
                        }
                      )
                    ] })
                  ]
                }
              ),
              errorMessage && /* @__PURE__ */ jsx(Text, { sz: "md", color: "danger", className: clsx("mt-2 mx-4"), children: errorMessage })
            ] }),
            /* @__PURE__ */ jsx("span", { className: clsx("mx-8 mt-4 mb-4 h-[0.5px] bg-primary-500") }),
            /* @__PURE__ */ jsxs(Text, { sz: "sm", className: clsx("font-light px-2 mb-4 flex flex-col gap-1"), children: [
              /* @__PURE__ */ jsxs(Text, { weight: "bold", className: clsx("text-single-second"), children: [
                "* ",
                t2("settings:account.personalInfo.changeNameForm.note"),
                ":"
              ] }),
              /* @__PURE__ */ jsxs(Text, { className: clsx("opacity-80"), wrap: "whitespace-normal", children: [
                "- ",
                t2("settings:account.personalInfo.changeNameForm.noteText1"),
                "  ",
                /* @__PURE__ */ jsxs(Text, { weight: "bold", className: clsx("text-single-main"), children: [
                  "7 ",
                  t2("settings:account.personalInfo.changeNameForm.day")
                ] }),
                "."
              ] }),
              /* @__PURE__ */ jsxs(Text, { className: clsx("opacity-80"), wrap: "whitespace-normal", children: [
                "- ",
                t2("settings:account.personalInfo.changeNameForm.noteText2")
              ] }),
              /* @__PURE__ */ jsxs(Text, { className: clsx("opacity-80"), wrap: "whitespace-normal", children: [
                "- ",
                t2("settings:account.personalInfo.changeNameForm.noteText3"),
                "  ",
                /* @__PURE__ */ jsx(Text, { sz: "md", children: "!, #, $, @, ..." }),
                "."
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                disabled: isSubmitting || newFirstName === userProfile?.infos.firstName && newMiddleName === (userProfile?.infos.middleName || "") && newLastName === userProfile?.infos.lastName,
                sz: "md",
                className: clsx("mt-2"),
                onClick: handleSubmit,
                children: isSubmitting ? t2("settings:account.personalInfo.changeNameForm.submitting") : t2("settings:account.personalInfo.changeNameForm.acceptButton")
              }
            ),
            /* @__PURE__ */ jsx(
              Text,
              {
                sz: "lg",
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
  const { t: t2 } = useTranslation();
  const { changeLanguage, availableLanguages, currentLanguage } = useLanguage();
  const { fetch: changeLanguageFetch } = useChangeLanguage();
  const options = availableLanguages.map((lang) => ({
    key: lang,
    value: t2(`common:language.${lang}`)
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
      showTitle: false,
      title: t2("settings:language.yourLanguage"),
      className: clsx(className),
      options,
      selectedOption: currentLanguage ?? "en",
      onSelect: _changeLanguage
    }
  );
};
const LanguageSettings = () => {
  const { t: t2 } = useTranslation();
  return /* @__PURE__ */ jsx(SidebarPageCard, { title: t2("settings:language.title"), children: /* @__PURE__ */ jsx(
    SelectBoxSetting,
    {
      title: t2("settings:language.yourLanguage"),
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
const NotFoundPage = lazy(() => Promise.resolve().then(() => notFoundPage));
const HomePage = lazy(() => import("./assets/home-page-DmDUw1Te.js"));
const RegisterPage = lazy(() => import("./assets/register-page-C7jmGits.js"));
const LoginPage = lazy(() => import("./assets/login-page-B8IKLw6p.js"));
const NotificationPage = lazy(() => import("./assets/notifications-page-DPh2o-5z.js"));
const GoogleCallbackPage = lazy(
  () => import("./assets/google-callback-page-N7twKa-M.js")
);
const OnboardingPage = lazy(() => import("./assets/onboarding-page-yHLJzkxd.js"));
const FatalkPage = lazy(() => import("./assets/fatalk-page-CWCx4Lnn.js"));
const ConversationPage = lazy(
  () => import("./assets/conversation-page-BzUApiXd.js").then((module) => ({
    default: module.ConversationPage
  }))
);
const TempConversation = lazy(
  () => import("./assets/temp-conversation-BzbxnkeA.js").then((module) => ({
    default: module.TempConversation
  }))
);
const ThuNghiemCuon = lazy(() => import("./assets/tests-infinity-scroll-page-CVrRFnCY.js"));
const withFallback = (element) => /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPage, {}), children: element });
const mainRoutes = [
  {
    element: /* @__PURE__ */ jsx(DefaultLayout, {}),
    type: "public",
    children: [
      {
        path: "/",
        element: withFallback(/* @__PURE__ */ jsx(HomePage, {})),
        type: "private",
        index: true,
        keepAlive: true
      },
      friendsRoutes,
      settingRoutes,
      userRoute,
      {
        path: "/notifications",
        element: withFallback(/* @__PURE__ */ jsx(NotificationPage, {})),
        type: "private"
      },
      {
        path: "/fatalk",
        element: /* @__PURE__ */ jsx(FatalkPage, {}),
        type: "private",
        children: [
          {
            path: ":conversationId",
            element: withFallback(/* @__PURE__ */ jsx(ConversationPage, {})),
            type: "private"
          },
          {
            path: "temp",
            element: withFallback(/* @__PURE__ */ jsx(TempConversation, {})),
            type: "private"
          }
        ]
      },
      { path: "/loading", type: "public", element: /* @__PURE__ */ jsx(LoadingPage, {}) },
      { path: "*", type: "public", element: withFallback(/* @__PURE__ */ jsx(NotFoundPage, {})) },
      {
        path: "/thu-nghiem-cuon",
        element: withFallback(/* @__PURE__ */ jsx(ThuNghiemCuon, {})),
        type: "public"
      }
    ]
  },
  {
    element: /* @__PURE__ */ jsx(SecondLayout, {}),
    type: "public",
    children: [
      {
        path: "/login",
        element: withFallback(/* @__PURE__ */ jsx(LoginPage, {})),
        type: "auth"
      },
      {
        path: "/register",
        element: withFallback(/* @__PURE__ */ jsx(RegisterPage, {})),
        type: "auth"
      },
      {
        path: "/auth/google/callback",
        element: withFallback(/* @__PURE__ */ jsx(GoogleCallbackPage, {})),
        type: "auth"
      },
      {
        path: "/onboarding",
        element: withFallback(/* @__PURE__ */ jsx(OnboardingPage, {})),
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
    return /* @__PURE__ */ jsx(LoadingPage, {});
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
    return /* @__PURE__ */ jsx(LoadingPage, {});
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
    /* @__PURE__ */ jsx(MediaViewer, {}),
    /* @__PURE__ */ jsx(AppHubListener, {}),
    /* @__PURE__ */ jsx(OfflineStatusNotification, {})
  ] });
}
const DB_NAME = "fatagram-query-cache";
const STORE_NAME = "tanstack-query";
const DB_VERSION = 1;
const CLIENT_KEY = "client";
const noopPersister = {
  persistClient: async () => {
  },
  restoreClient: async () => void 0,
  removeClient: async () => {
  }
};
const openDatabase = async () => {
  return await new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
const putValue = async (db, key, value) => {
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
const getValue = async (db, key) => {
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
const deleteValue = async (db, key) => {
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
const createQueryPersister = () => {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return noopPersister;
  }
  return {
    persistClient: async (client) => {
      try {
        const db = await openDatabase();
        await putValue(db, CLIENT_KEY, client);
      } catch (error) {
        console.error("Persist query cache failed:", error);
      }
    },
    restoreClient: async () => {
      try {
        const db = await openDatabase();
        return await getValue(db, CLIENT_KEY);
      } catch (error) {
        console.error("Restore query cache failed:", error);
        return void 0;
      }
    },
    removeClient: async () => {
      try {
        const db = await openDatabase();
        await deleteValue(db, CLIENT_KEY);
      } catch (error) {
        console.error("Remove query cache failed:", error);
      }
    }
  };
};
const getConversationIdsFromMessageQueries = (queryClient) => {
  const ids = /* @__PURE__ */ new Set();
  const queries = queryClient.getQueryCache().findAll({ queryKey: ["messages"] });
  for (const query of queries) {
    const [prefix, conversationId] = query.queryKey;
    if (prefix === "messages" && typeof conversationId === "string") {
      ids.add(conversationId);
    }
  }
  return ids;
};
const ChatQueryNetworkSync = () => {
  const queryClient = useQueryClient();
  const focusOnId = useChatStore((state) => state.focusOnId);
  const activeIds = useChatStore((state) => state.activeIds);
  const latestFocusRef = useRef(focusOnId);
  const latestActiveIdsRef = useRef(activeIds);
  const lastSyncKeyRef = useRef("");
  useEffect(() => {
    latestFocusRef.current = focusOnId;
    latestActiveIdsRef.current = activeIds;
  }, [focusOnId, activeIds]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const invalidateMessageQueries = (isOnline) => {
      const focusId = latestFocusRef.current;
      const activeIdList = latestActiveIdsRef.current;
      const syncKey = `${isOnline ? "online" : "offline"}|${focusId ?? ""}|${activeIdList.join(",")}`;
      if (syncKey === lastSyncKeyRef.current && !isOnline) {
        return;
      }
      lastSyncKeyRef.current = syncKey;
      const refetchFullIds = new Set(activeIdList);
      if (focusId) {
        refetchFullIds.add(focusId);
      }
      const cachedConversationIds = getConversationIdsFromMessageQueries(queryClient);
      refetchFullIds.forEach((id) => cachedConversationIds.add(id));
      cachedConversationIds.forEach((conversationId) => {
        const shouldRefetchActive = isOnline && refetchFullIds.has(conversationId);
        void queryClient.invalidateQueries({
          queryKey: ["messages", conversationId],
          refetchType: shouldRefetchActive ? "active" : "none"
        });
      });
    };
    const invalidateSeenQueries = (isOnline) => {
      const focusId = latestFocusRef.current;
      if (focusId) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", focusId, "participantsSeen"],
          refetchType: isOnline ? "active" : "none"
        });
      }
    };
    const handleOffline = () => {
      invalidateMessageQueries(false);
      invalidateSeenQueries(false);
    };
    const handleOnline = () => {
      invalidateMessageQueries(true);
      invalidateSeenQueries(true);
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    if (!navigator.onLine) {
      invalidateMessageQueries(false);
      invalidateSeenQueries(false);
    }
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [queryClient]);
  return null;
};
function App({ authContext }) {
  const queryClientRef = useRef(null);
  const persisterRef = useRef(createQueryPersister());
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
  return /* @__PURE__ */ jsx(
    PersistQueryClientProvider,
    {
      client: queryClientRef.current,
      persistOptions: {
        persister: persisterRef.current,
        buster: "fatagram-query-cache-v1",
        maxAge: 1e3 * 60 * 60 * 24
      },
      children: /* @__PURE__ */ jsxs(ContextTree, { authContext, children: [
        /* @__PURE__ */ jsx(ChatQueryNetworkSync, {}),
        /* @__PURE__ */ jsx(Main, {})
      ] })
    }
  );
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
  Avatar as A,
  Button as B,
  ChatList as C,
  MessageType as D,
  InfiniteScrollFlex as I,
  LoginForm as L,
  MiniButton as M,
  NotificationMenu as N,
  PageNavbar as P,
  RegisterForm as R,
  SelectDay as S,
  Text as T,
  useAuth as a,
  LoadingPage as b,
  useOnboarding as c,
  authEvents as d,
  Textbox as e,
  SelectBox as f,
  userProfileService as g,
  Logo as h,
  useCreateGroupConversation as i,
  useConversations as j,
  CreateGroupChat as k,
  SidebarLayout as l,
  NotFound as m,
  useRenderConversationContent as n,
  useMarkConversationAsRead as o,
  useLocalMarkAsRead as p,
  useMessageStore as q,
  useChatStore as r,
  render,
  useGetConversation as s,
  Skeleton as t,
  useNotificationUiState as u,
  MessageList as v,
  ChatInput as w,
  useGetUserProfile as x,
  useOpenChat as y,
  useSendMessage as z
};
