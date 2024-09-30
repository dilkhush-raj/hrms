import React, { useState } from "react";
import { X } from "lucide-react";
import "../../styles/CandidateForm.css";
import axios from "axios";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  dateOfJoining: string;
}

interface EmployeeFormProps {
  toggleModal: () => void;
  employee: Employee;
}

export default function EmployeeForm({
  toggleModal,
  employee,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    _id: employee._id,
    name: employee.name,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    role: "employee",
    isActive: true,
    position: employee.position,
    experience: 1,
    tasks: [],
    joiningDate: "",
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

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/updateUser/${employee._id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(apiUrl, formData, {
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
          <h2 className="modal-title">Update Employee Information</h2>
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
              <label htmlFor="phoneNumber" className="input-label">
                Phone Number*
              </label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
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
