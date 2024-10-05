import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import "../styles/CandidateTable.css";
import TaskForm from "./forms/AttendanceForm";

type Status = "present" | "absent" | "medical-leave" | "work-from-home";

interface Attendance {
  _id: string;
  task: string;
  status: Status;
  user: {
    _id: string;
    name: string;
    position: string;
    department: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 200;
const STATUS_OPTIONS: Status[] = [
  "present",
  "absent",
  "medical-leave",
  "work-from-home",
];

export default function AttendanceTable() {
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [filteredAttendanceList, setFilteredAttendanceList] = useState<
    Attendance[]
  >([]);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [departments, setDepartments] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
  });
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/task/attendance`;

  const fetchAttendanceList = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}?page=${pagination.currentPage}&limit=${ITEMS_PER_PAGE}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const { attends, currentPage, totalPages } = response.data;
        setAttendanceList(attends);
        setFilteredAttendanceList(attends);
        setPagination({
          currentPage,
          totalPages,
        });

        const uniqueDepartments = Array.from(
          new Set(
            attends.map((attendance: Attendance) => attendance.user.department)
          )
        );
        setDepartments(uniqueDepartments as string[]);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  }, [apiUrl, pagination.currentPage]);

  useEffect(() => {
    fetchAttendanceList();
  }, [fetchAttendanceList]);

  useEffect(() => {
    const filterAttendance = () => {
      let filtered = attendanceList;

      if (departmentFilter !== "All") {
        filtered = filtered.filter(
          (attendance) => attendance.user.department === departmentFilter
        );
      }

      setFilteredAttendanceList(filtered);
    };
    filterAttendance();
  }, [attendanceList, departmentFilter]);

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    setUpdatingStatus(taskId);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/task/updateAttendenceStatus/${taskId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(`Status updated successfully to ${newStatus}`);
        await fetchAttendanceList();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/task/delete/${taskId}`,
        { withCredentials: true }
      );
      await fetchAttendanceList();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <select
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
        <div>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="add-btn whitespace-nowrap"
          >
            Add Task
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TaskForm
          toggleModal={() => setIsModalOpen(false)}
          onTaskAdded={fetchAttendanceList}
        />
      )}

      <div className="overflow-x-auto">
        <div className="table-container">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Task</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceList?.map((attendance, index) => (
                <tr key={attendance._id} className="cursor">
                  <td>{index + 1}</td>
                  <td>{attendance.user.name}</td>
                  <td>{attendance.user.position}</td>
                  <td>{attendance.user.department}</td>
                  <td>{attendance.task}</td>
                  <td className="status-cell">
                    <select
                      value={
                        updatingStatus === attendance._id
                          ? "Updating..."
                          : attendance.status
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          attendance._id,
                          e.target.value as Status
                        )
                      }
                      disabled={updatingStatus === attendance._id}
                      className="status-select"
                    >
                      {updatingStatus === attendance._id ? (
                        <option>Updating...</option>
                      ) : (
                        STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))
                      )}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteTask(attendance._id)}>
                      <Trash2 className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
