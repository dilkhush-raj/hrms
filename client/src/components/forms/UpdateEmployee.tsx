import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import "../../styles/CandidateForm.css";

export default function EmployeeForm() {
  const [formData, setFormData] = useState({
    _id: "66f9aa89b40a2f07399187ae",
    name: "prateek",
    email: "test@1267gmail.com",
    role: "employee",
    isActive: true,
    emailVerified: false,
    position: "tech lead",
    status: "New",
    experience: 1,
    resume: "jksbajkbnkjabskjsbh",
    tasks: [],
    joiningDate: "2024-09-29T18:22:18.771+00:00",
    department: "backend developer",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // @ts-expect-error checked
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Update Employee Information</h2>
          <button className="close-button">
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
            <div className="input-group">
              <label htmlFor="resume" className="input-label">
                Resume
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  id="resume"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  className="input-field"
                />
                <button type="button" className="upload-button">
                  <Upload className="w-5 h-5 text-purple-600" />
                </button>
              </div>
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
              >
                <option value="New">New</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="joiningDate" className="input-label">
                Joining Date*
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate.split("T")[0]}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Active Status</label>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="checkbox"
              />
              <label htmlFor="isActive" className="checkbox-label">
                Is Active
              </label>
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="submit-button">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
