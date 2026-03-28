import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/auth",
  withCredentials: true,
});

/**
 * @params {username, email, password}
 * @returns message and user
 * @description registers new user and sets a token cookie
 */
export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", { username, email, password });

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @params {email, password}
 * @returns message, user
 * @description logs in user and sets a token cookie
 */
export async function login({ email, password }) {
  try {
    const response = await api.post("/login", { email, password });

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description logs out user, clears token cookie
 */
export async function logout() {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description returns current logged in user's info
 */
export async function getMe() {
  try {
    const response = await api.get("/get-me");

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
