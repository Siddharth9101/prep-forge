import { useAuth } from "../../auth/hooks/useAuth.jsx";
import "../styles/navbar.scss";

const Navbar = () => {
  const { user, handleLogout } = useAuth();

  return (
    <nav>
      <div className="logo-container">
        <h1>PrepForge</h1>
        {user && <p>Welcome, {user.username}!</p>}
      </div>
      <div>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
