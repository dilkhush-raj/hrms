import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/CandidateForm.css";
import axios from "axios";

interface TaskFormProps {
  toggleModal: () => void;
  onTaskAdded: () => Promise<void>;
}

export default function TaskForm({ toggleModal, onTaskAdded }: TaskFormProps) {
  const [formData, setFormData] = useState({
    task: "",
    status: "present",
    email: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    "present",
    "absent",
    "medical-leave",
    "work-from-home",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/task/createAttendence`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status) {
        await onTaskAdded();
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message ||
            "Failed to create task. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add New Task</h2>
          <button onClick={toggleModal} className="close-button">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="task" className="input-label">
                Task Description*
              </label>
              <input
                type="text"
                id="task"
                name="task"
                value={formData.task}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <label htmlFor="status" className="input-label">
                Status*
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isSubmitting}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                User Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <label htmlFor="date" className="input-label">
                Date*
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <br />
          <div className="flex justify-center">
            <button
              type="submit"
              className={`submit-button ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
