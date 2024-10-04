import { useState, useEffect, useCallback } from "react";
import { Search, Download, Trash2, ChevronDown, Edit } from "lucide-react";
import "../styles/CandidateTable.css";
import axios from "axios";
import CandidateForm from "./forms/NewCandidate";
import { handleDeleteUser } from "../utils/DeleteUser";
import UpdateUserForm from "./forms/UpdateUsers";

type Status = "New" | "Scheduled" | "Selected" | "Rejected";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  status: Status;
  experience?: string;
  resume?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 200;
const STATUS_OPTIONS: Status[] = ["New", "Scheduled", "Selected", "Rejected"];

export default function CandidateTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");
  const [positions, setPositions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
  });
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<
    string | null
  >(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/candidates`;

  const fetchCandidates = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}?page=${pagination.currentPage}&limit=${ITEMS_PER_PAGE}&sort=createdAt`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const { users, currentPage, totalPages } = response.data;
        setCandidates(users);
        setFilteredCandidates(users);
        setPagination({
          currentPage,
          totalPages,
        });

        // Extract unique positions
        const uniquePositions = Array.from(
          new Set(users.map((user: Candidate) => user.position).filter(Boolean))
        );
        setPositions(uniquePositions as string[]);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }, [apiUrl, pagination.currentPage]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    const filterCandidates = () => {
      let filtered = candidates;

      if (statusFilter !== "All") {
        filtered = filtered.filter(
          (candidate) => candidate.status === statusFilter
        );
      }

      if (positionFilter !== "All") {
        filtered = filtered.filter(
          (candidate) => candidate.position === positionFilter
        );
      }

      if (searchTerm) {
        filtered = filtered.filter((candidate) =>
          Object.values(candidate).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      setFilteredCandidates(filtered);
    };
    filterCandidates();
  }, [candidates, statusFilter, positionFilter, searchTerm]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    fetchCandidates();
  }, [fetchCandidates]);

  const getStatusColor = (status: Status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "status-new";
      case "scheduled":
        return "status-scheduled";
      case "selected":
        return "status-selected";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const handleStatusChange = async (userId: string, newStatus: Status) => {
    setUpdatingStatus(userId);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/users/updateUserStatus/${userId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCandidates(
          candidates.map((candidate) =>
            candidate._id === userId
              ? { ...candidate, status: newStatus }
              : candidate
          )
        );

        console.log(`Status updated successfully to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
      setActiveStatusDropdown(null);
    }
  };

  const updateUser = (id: string) => {
    setIsUpdateOpen(!isUpdateOpen);
    setSelectedCandidateId(id);
  };

  return (
    <div className="container">
      {isUpdateOpen && (
        <div className="modal">
          <UpdateUserForm
            userId={selectedCandidateId}
            handleClose={() => {
              setIsUpdateOpen(false);
              fetchCandidates();
            }}
          />
        </div>
      )}
      {isModalOpen && <CandidateForm toggleModal={handleModalClose} />}
      <div className="header">
        <div className="flex flex-wrap gap-4">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="All">All Positions</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="add-btn whitespace-nowrap"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Add Candidate
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[80vh] ">
        <div className="table-container ">
          <table className="candidates-table ">
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Candidates Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Position</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Resume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates?.map((candidate, index) => (
                <tr
                  key={candidate._id}
                  className={getStatusColor(candidate.status) + " cursor"}
                >
                  <td>
                    {(pagination.currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate?.phoneNumber}</td>
                  <td className="whitespace-nowrap">{candidate?.position}</td>
                  <td className="status-cell">
                    <div className="status-dropdown">
                      <button
                        className={`status-button ${getStatusColor(
                          candidate.status
                        )}`}
                        onClick={() =>
                          setActiveStatusDropdown(
                            activeStatusDropdown === candidate._id
                              ? null
                              : candidate._id
                          )
                        }
                        disabled={updatingStatus === candidate._id}
                      >
                        {updatingStatus === candidate._id
                          ? "Updating..."
                          : candidate.status}{" "}
                        <ChevronDown className="icon" />
                      </button>
                      {activeStatusDropdown === candidate._id && (
                        <div className="status-options">
                          {STATUS_OPTIONS.map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleStatusChange(candidate._id, status)
                              }
                              className={`${status.toLowerCase()} ${
                                status === candidate.status ? "active" : ""
                              }`}
                              disabled={updatingStatus === candidate._id}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{candidate?.experience}</td>
                  <td>
                    <a
                      href={candidate?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="icon" />
                    </a>
                  </td>
                  <td>
                    <button onClick={() => updateUser(candidate._id)}>
                      <Edit className="icon" />
                    </button>
                    <button onClick={() => handleDeleteUser(candidate._id)}>
                      <Trash2 className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="flex flex-wrap mt-4">
            * Use <Edit className="icon" /> to update a user (specifically
            moving a candidate to an employee or HR)
          </p>
        </div>
      </div>
    </div>
  );
}
