/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // @ts-expect-error kfdlf
  const onSubmit = async (data) => {
    try {
      const apiUrl = "/api/login";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setApiMessage("Login successful!");
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setApiMessage(`Login failed: ${errorData.error}`);
      }
    } catch (error) {
      setApiMessage(`Login failed: ${error}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-6">
          Login to HR Management System
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Login
          </button>
        </form>
        {apiMessage && (
          <p
            className={`mt-4 text-sm ${
              apiMessage.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {apiMessage}
          </p>
        )}
        <p className="mt-4 text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
