import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/CandidateForm.css";
import axios from "axios";

export default function CandidateForm({
  toggleModal,
}: {
  toggleModal: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    role: "",
    status: "New",
    experience: 0,
    resume: "",
  });
  const [declaration, setDeclaration] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/createuser`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Data Being Submitted:", formData); // Log this for verification

    try {
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Candidate created successfully:", response.data);
        toggleModal();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error creating candidate:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add New Candidate</h2>
          <button onClick={toggleModal} className="close-button">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="name" className="input-label">
                Full Name*
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
              <label htmlFor="phone" className="input-label">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="position" className="input-label">
                Department*
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
              <label htmlFor="experience" className="input-label">
                Experience*
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
            <div className="input-group">
              <label htmlFor="resume" className="input-label">
                Resume Link*
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  id="resume"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
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
              <br />
              I hereby declare that the above information is true to the best of
              my knowledge and belief
              <br />
            </label>
          </div>
          <br />
          <div className="flex justify-center">
            <button type="submit" className="submit-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
