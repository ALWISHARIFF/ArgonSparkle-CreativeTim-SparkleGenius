import axios from "axios";
import config from "../config";

// const https = require('https');
//
// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

const instance = axios.create({
  baseURL: config.WS_BASE_URL,
});
const instance3 = axios.create({
  baseURL: config.CLOUDFLARE,
});
instance3.defaults.headers.post["Access-Control-Allow-Headers"] = "*";
instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers.authentication = token ? `Bearer ${token}` : "";
  config.headers.ContentType = "application/json";
  return config;
});
instance3.interceptors.request.use(async (config) => {
  config.headers.ContentType = "application/json";
  config.headers.contenttype = "*";
  return config;
});

// export const getAll = async () => (
//     await instance.post('users/all')
// );

export const register = async (name, email, password) =>
  await instance.post("/api/auth/signup", { name, email, password });
export const cloudflare = async () => await instance3.get("/");

export const confirmRegister = async (id) =>
  await instance.post(`users/confirm/${id}`);

export const forgotPassword = async (email) =>
  await instance.post("/api/mail/resetPass", { email });

export const confirmReset = async (id, password) =>
  await instance.post(`users/resetpass/${id}`, { password });

export const login = async (email, password) =>
  await instance.post("/api/auth/login", { email, password });

export const logout = async (token) =>
  await instance.post("users/logout", { token });

export const edit = async (userID, name) =>
  await instance.put(`/api/user/profile`, { userID, name });
