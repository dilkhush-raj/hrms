import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/AttendanceForm.css"; // You'll need to create this CSS file
import axios from "axios";

export default function CreateAttendanceForm({
  toggleModal,
}: {
  toggleModal: () => void;
}) {
  const [formData, setFormData] = useState({
    task: "",
    status: "Present", // Default status
    id: "", // This could be the employee ID or a unique identifier
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/attendance/create`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Attendance record created successfully:", response.data);
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error creating attendance record:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Create Attendance Record</h2>
          <button onClick={toggleModal} className="close-button">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="id" className="input-label">
                Employee ID*
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="status" className="input-label">
                Attendance Status*
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>
            <div className="input-group full-width">
              <label htmlFor="task" className="input-label">
                Task/Notes
              </label>
              <textarea
                id="task"
                name="task"
                value={formData.task}
                // @ts-expect-error fkjl
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="submit-button">
              Submit Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
