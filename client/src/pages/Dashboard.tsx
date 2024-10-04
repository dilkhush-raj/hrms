import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1>
        Welcome, <span className="capitalize ">{user?.name}</span>
      </h1>
      <p>
        <span>
          Your role is <span className="uppercase">{user?.role}</span>
        </span>
        <br />
        <span>
          Your email is <span className="">{user?.email}</span>
        </span>
        <br />
      </p>
      {/* <img src="/dashboard.png" width={"100%"} alt="" /> */}
    </div>
  );
}

export default Dashboard;
