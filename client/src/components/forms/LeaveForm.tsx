import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/CandidateForm.css";
import axios from "axios";

export default function AddNewLeaveForm({
  toggleModal,
}: {
  toggleModal: () => void;
}) {
  const [formData, setFormData] = useState({
    email: "",
    date: "",
    reason: "",
    documents: "",
    status: "Pending", // Default status
  });
  const [declaration, setDeclaration] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/leaves/create`;

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
        console.log("Leave request created successfully:", response.data);
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error creating leave request:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add New Leave Request</h2>
          <button onClick={toggleModal} className="close-button">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
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
              />
            </div>
            <div className="input-group">
              <label htmlFor="date" className="input-label">
                Leave Date*
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
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
              />
            </div>
            <div className="input-group">
              <label htmlFor="documents" className="input-label">
                Supporting Documents (URL)
              </label>
              <input
                type="url"
                id="documents"
                name="documents"
                value={formData.documents}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="declaration"
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="checkbox"
            />
            <label htmlFor="declaration" className="checkbox-label">
              I hereby declare that the above information is true and correct.
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="submit-button"
              disabled={!declaration}
            >
              Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
