import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/CandidateTable.css";
import LeaveRequestForm from "./forms/LeaveForm";
import LeaveCalendar from "./TodayLeave";

type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface Leave {
  _id: string;
  user: {
    name: string;
  } | null;
  date: string;
  reason: string;
  documents: string;
  status: LeaveStatus;
}

type DateFilter = "weekly" | "monthly" | "yearly";

const STATUS_OPTIONS: LeaveStatus[] = ["Pending", "Approved", "Rejected"];

export default function LeaveTable() {
  const [leaveList, setLeaveList] = useState<Leave[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const apiUrl = `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/leave`;

  const fetchLeaveList = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}?filter=${dateFilter}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLeaveList(response.data.leaves);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  }, [apiUrl, dateFilter]);

  useEffect(() => {
    fetchLeaveList();
  }, [fetchLeaveList]);

  console.log(leaveList);

  const handleStatusChange = async (
    leaveId: string,
    newStatus: LeaveStatus
  ) => {
    setUpdatingStatus(leaveId);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/leave/update-status/${leaveId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await fetchLeaveList();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
      <div className="container">
        <div className="header">
          <select
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
          <div>
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="add-btn whitespace-nowrap"
            >
              Add New Leave
            </button>
          </div>
        </div>

        {isModalOpen && (
          <LeaveRequestForm
            toggleModal={() => setIsModalOpen(false)}
            onLeaveAdded={fetchLeaveList}
          />
        )}

        <div className="overflow-x-auto">
          <div className="table-container">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Sr no.</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Document</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveList.map((leave, index) => (
                  <tr key={leave._id}>
                    <td>{index + 1}</td>
                    <td>{leave.user?.name || "Unknown User"}</td>
                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      {leave.documents ? (
                        <a
                          href={leave.documents}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Document
                        </a>
                      ) : (
                        "No document"
                      )}
                    </td>
                    <td className="status-cell">
                      <select
                        value={
                          updatingStatus === leave._id
                            ? "Updating..."
                            : leave.status
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            leave._id,
                            e.target.value as LeaveStatus
                          )
                        }
                        disabled={updatingStatus === leave._id}
                        className={`status-select ${
                          leave.status === "Approved"
                            ? "bg-green-100"
                            : leave.status === "Rejected"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {updatingStatus === leave._id ? (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-[70px]">
        <LeaveCalendar />
      </div>
    </div>
  );
}
