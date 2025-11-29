import { useContext } from "react";
import { UserContext } from "./UseContext";

export default function Dashboard() {
  const { user, login, logout } = useContext(UserContext);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ name: "Tanu", role: "admin" })}>
          Login as Admin
        </button>
      )}
    </div>
  );
}
