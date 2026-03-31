import { useContext } from "react";
import { AuthContext } from "../auth.context.js";
import { register, login, logout } from "../services/auth.api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const { user, setUser, loading, setLoading } = context;

  /**
   * @params email and password
   * @description logs in and sets user to useAuth
   */
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (!data.user) {
        throw new Error();
      }
      setUser(data.user);
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to login, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * @params username, email and password
   * @description registers and sets user to useAuth
   */
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      if (!data.user) {
        throw new Error();
      }
      setUser(data.user);
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to register, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description logs out, clear cookies and set user to null
   */
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to logout, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleLogin, handleRegister, handleLogout };
};
