/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner";
import "../../styles/UpdateUserForm.css";
import { X } from "lucide-react";

const UpdateUserForm = ({
  userId,
  handleClose,
}: {
  userId: string | null;
  handleClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "candidate",
    position: "",
    status: "New",
    experience: 0,
    resume: "",
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/users/user/${userId}`
        );
        const userData = response.data;

        // Populate form with fetched data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          role: userData.role || "candidate",
          position: userData.position || "",
          status: userData.status || "New",
          experience: userData.experience || 0,
          resume: userData.resume || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/users/update/${userId}`,
        formData
      );
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setUpdating(false);
      handleClose();
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Update User</h2>
          <button onClick={handleClose} className="close-button">
            <X className="w-6 h-6 text-white" />
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
              <label htmlFor="phoneNumber" className="input-label">
                Phone Number*
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
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
              >
                <option value="candidate">Candidate</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
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
              >
                <option value="New">New</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="experience" className="input-label">
                Experience (years)*
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="resume" className="input-label">
                Resume Link*
              </label>
              <input
                type="text"
                id="resume"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <button type="submit" className="submit-button" disabled={updating}>
              {updating ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserForm;
