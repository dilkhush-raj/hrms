import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and a special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/auth/register`;
  // @ts-expect-error kfdlf
  const onSubmit = async (data) => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setApiMessage("Registration successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setApiMessage(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      setApiMessage(`Registration failed: ${error}`);
    }
  };

  return (
    <>
      <div className="register-container poppins-regular">
        <div className="register-box">
          <div className="logo-container">
            <img src="/logo.png" alt="logo" className="logo" />
          </div>
          <h2 className="register-title">Welcome to HR Management System</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            <div className="input-group">
              <label htmlFor="name" className="input-label">
                Full name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="input-field"
                placeholder="Full name"
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>
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
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="input-field"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="icon" />
                  ) : (
                    <EyeIcon className="icon" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button type="submit" className="submit-button">
              Register
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
          <p className="login-link">
            Already have an account?
            <Link to="/login" className="login-link-anchor">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
