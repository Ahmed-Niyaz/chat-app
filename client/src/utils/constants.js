// import dotenv from 'dotenv';
// dotenv.config()

// export const HOST = process.env.BACKEND_SERVER_URL;
// this above one worked when run with node this filename, but not on web browser
// export const HOST = 'http://localhost:3000'

// To prevent accidentally leaking env variables to the client, only variables prefixed with VITE_ are exposed to your Vite-processed code
export const HOST = import.meta.env.VITE_BACKEND_SERVER_URL;

export const AUTH_ROUTE = 'api/auth';
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const USER_INFO_ROUTE = `${AUTH_ROUTE}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`

export const SELECTED_USER_INFO_ROUTE = `${AUTH_ROUTE}/get-selected-user-info`

export const CONTACTS_ROUTE = 'api/contacts'
export const SEARCH_ROUTE = `${CONTACTS_ROUTE}/search`
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-contacts-for-dm`
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-all-contacts`

export const MESSAGES_ROUTES = 'api/messages'
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`

export const CHANNEL_ROUTES = 'api/channel';
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`

console.log(HOST)