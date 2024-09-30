import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const apiUrl = `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/auth/login`;

  // @ts-expect-error afs
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(apiUrl, data, {
        withCredentials: true, // This is crucial for sending and receiving cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setApiMessage("Login successful!");
        navigate("/dashboard");
      } else {
        setApiMessage(`Login failed: ${response.data.error}`);
      }
    } catch (error) {
      setApiMessage(
        // @ts-expect-error afs
        `Login failed: ${error.response.data.error || error.message}`
      );
    }
  };

  return (
    <div className="login-container poppins-regular">
      <div className="login-box">
        <div className="logo-container">
          <img src="/logo.png" alt="logo" className="logo" />
        </div>
        <h2 className="login-title">Login to HR Management System</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="input-field"
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="input-field"
                placeholder="Password"
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="icon" />
                ) : (
                  <EyeIcon className="icon" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {apiMessage && (
          <p
            className={`api-message ${
              apiMessage.includes("successful")
                ? "success-message"
                : "error-message"
            }`}
          >
            {apiMessage}
          </p>
        )}
        <p className="register-link">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="register-link-anchor">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
