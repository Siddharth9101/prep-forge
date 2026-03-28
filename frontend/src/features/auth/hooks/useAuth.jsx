import { useContext } from "react";
import { AuthContext } from "../auth.context.js";
import { register, login, logout } from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  /**
   * @params email and password
   * @description logs in and sets user to useAuth
   */
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    const data = await login({ email, password });
    setUser(data.user);
    setLoading(false);
  };

  /**
   * @params username, email and password
   * @description registers and sets user to useAuth
   */
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    const data = await register({ username, email, password });
    setUser(data.user);
    setLoading(false);
  };

  /**
   * @description logs out, clear cookies and set user to null
   */
  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setUser(null);
    setLoading(false);
  };

  return { user, loading, handleLogin, handleRegister, handleLogout };
};
