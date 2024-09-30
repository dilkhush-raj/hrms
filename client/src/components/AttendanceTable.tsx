import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "../styles/CandidateTable.css";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Attendance {
  _id: string;
  status: string;
  user: User;
}

export default function AttendanceTable() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>(
    []
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/attendance`;

  // Fetch attendances from backend
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const attendances = response.data.attendances;
          setAttendances(attendances);
          setFilteredAttendances(attendances);
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching attendances:", error);
      }
    };

    fetchAttendances();
  }, [apiUrl]);

  useEffect(() => {
    filterAttendances();
  }, [attendances, statusFilter, searchTerm]);

  const filterAttendances = () => {
    let filtered = attendances;
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (attendance) =>
          attendance.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((attendance) =>
        Object.values(attendance.user).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredAttendances(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "late":
        return "status-late";
      default:
        return "";
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="flex">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendances?.map((attendance, index) => (
              <tr
                key={attendance._id}
                className={getStatusColor(attendance.status) + " cursor"}
              >
                <td>{index + 1}</td>
                <td>{attendance.user.name}</td>
                <td>{attendance.user.email}</td>
                <td>{attendance.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
