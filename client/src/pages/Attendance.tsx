import AttendanceTable from "../components/AttendanceTable";
import Loader from "../components/Loader";

function Attendance() {
  return (
    <div>
      <Loader percentage={20} colour="blue" />
      <AttendanceTable />
    </div>
  );
}

export default Attendance;
