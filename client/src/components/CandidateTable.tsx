import { useState, useEffect } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import "../styles/CandidateTable.css";
import axios from "axios";
import CandidateForm from "./forms/NewCandidate";
import { handleDeleteUser } from "../utils/DeleteUser";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: string;
  experience?: string;
  resume?: string;
}

export default function CandidateTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/candidates`;

  // Fetch candidates from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const candidates = response.data.users;
          setCandidates(candidates);
          setFilteredCandidates(candidates);
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [apiUrl]);

  useEffect(() => {
    filterCandidates();
  }, [candidates, statusFilter, searchTerm]);

  const filterCandidates = () => {
    let filtered = candidates;
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (candidate) => candidate.status === statusFilter
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

  const getStatusColor = (status: string) => {
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
  return (
    <div className="container">
      {isModalOpen && (
        <CandidateForm toggleModal={() => setIsModalOpen(!isModalOpen)} />
      )}
      <div className="header">
        <div className="flex">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
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
        <button
          className="add-btn"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          Add Candidate
        </button>
      </div>
      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
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
                <td>{index + 1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate?.phoneNumber}</td>
                <td>{candidate.status}</td>
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
  );
}
