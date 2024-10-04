import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import "../../styles/CandidateForm.css";
import axios from "axios";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  joiningDate: string;
  role: string;
  experience: number;
}

interface EmployeeFormProps {
  toggleModal: () => void;
  employee: Employee;
  onUpdateSuccess?: () => void;
}

export default function EmployeeForm({
  toggleModal,
  employee,
  onUpdateSuccess,
}: EmployeeFormProps) {
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };
  const [formData, setFormData] = useState({
    _id: employee._id,
    name: employee.name,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    position: employee.position,
    department: employee.department || "",
    joiningDate: formatDate(employee.joiningDate),
    role: employee.role || "employee",
    experience: employee.experience || 0,
  });

  const [submissionState, setSubmissionState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/update-employees/${employee._id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionState("submitting");
    setErrorMessage("");

    try {
      const response = await axios.put(apiUrl, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSubmissionState("success");
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          onUpdateSuccess();
        }
        setTimeout(() => {
          toggleModal();
        }, 500);
      }
    } catch (error) {
      setSubmissionState("error");
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data.message || "Error updating employee"
        );
        console.error("Error updating employee:", error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred");
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Update Employee Information</h2>
          <button onClick={toggleModal} className="close-button">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="name" className="input-label">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phoneNumber" className="input-label">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="position" className="input-label">
                Position*
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="department" className="input-label">
                Department*
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="joiningDate" className="input-label">
                Date Joined*
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="role" className="input-label">
                Role*
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="experience" className="input-label">
                Experience (Years)*
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            {submissionState === "error" && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            {submissionState === "success" && (
              <p className="text-green-500 mb-2">
                Employee updated successfully!
              </p>
            )}
            <button
              type="submit"
              className={`submit-button flex items-center justify-center ${
                submissionState === "submitting"
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              disabled={submissionState === "submitting"}
            >
              {submissionState === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : submissionState === "success" ? (
                "Updated!"
              ) : (
                "Update Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
