import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1>
        Welcome, <span className="capitalize ">{user?.name}</span>
      </h1>
      <p>
        You are logged in as a <b>{user?.role}</b> user and your email is:{" "}
        <b>{user?.email}</b>
      </p>
      <img src="/dashboard.png" width={"100%"} alt="" />
    </div>
  );
}

export default Dashboard;
