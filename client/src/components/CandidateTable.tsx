import { useState, useEffect, useCallback } from "react";
import { Search, Download, Trash2, Edit } from "lucide-react";
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
        console.log(`Status updated successfully to ${newStatus}`);

        await fetchCandidates();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
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

      <div className="overflow-x-auto  ">
        <div className="table-container ">
          <table className="candidates-table pb-[100px] ">
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
                      <select
                        value={
                          updatingStatus === candidate._id
                            ? "Updating..."
                            : candidate.status
                        }
                        onChange={(e) =>
                          // @ts-expect-error ignore
                          handleStatusChange(candidate._id, e.target.value)
                        }
                        disabled={updatingStatus === candidate._id}
                        className={`status-select ${getStatusColor(
                          candidate.status
                        )}`}
                      >
                        {updatingStatus === candidate._id ? (
                          <option>Updating...</option>
                        ) : (
                          STATUS_OPTIONS.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className={status.toLowerCase()}
                            >
                              {status}
                            </option>
                          ))
                        )}
                      </select>
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
        </div>
      </div>
    </div>
  );
}
