import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/CandidateForm.css";
import axios from "axios";

interface LeaveRequestFormProps {
  toggleModal: () => void;
  onLeaveAdded: () => Promise<void>;
}

export default function LeaveRequestForm({
  toggleModal,
  onLeaveAdded,
}: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    leaveDate: "",
    reason: "",
    documentLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const apiUrl = `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/leave/create`;

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

      if (response.status === 201) {
        await onLeaveAdded();
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message ||
            "Failed to submit leave request. Please try again."
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
          <h2 className="modal-title">Request Leave</h2>
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
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <label htmlFor="leaveDate" className="input-label">
                Leave Date*
              </label>
              <input
                type="date"
                id="leaveDate"
                name="leaveDate"
                value={formData.leaveDate}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group full-width">
              <label htmlFor="reason" className="input-label">
                Reason for Leave*
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="input-field"
                required
                disabled={isSubmitting}
                rows={4}
              />
            </div>
            <div className="input-group">
              <label htmlFor="documentLink" className="input-label">
                Document Link
              </label>
              <input
                type="url"
                id="documentLink"
                name="documentLink"
                value={formData.documentLink}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/document"
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
              {isSubmitting ? "Submitting..." : "Submit Leave Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
