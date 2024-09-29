import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <div className="font-medium text-xl">
        Welcome, <span className="capitalize ">{user?.name}</span>
      </div>
      <img src="/dashboard.png" className="w-full" alt="" />
    </div>
  );
}

export default Dashboard;
