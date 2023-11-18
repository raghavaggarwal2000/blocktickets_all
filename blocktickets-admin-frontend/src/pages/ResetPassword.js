import React, { useState } from "react";
import { Link } from "react-router-dom";

import ImageLight from "../assets/img/forgot-password-office.jpeg";
import ImageDark from "../assets/img/forgot-password-office-dark.jpeg";
import { Label, Input, Button } from "@windmill/react-ui";
import { AuthServices } from "../services/api-client";
import toast from "react-hot-toast";
import useQuery from "../hooks/useQuery";
import { useHistory } from "react-router-dom";

const ResetPassword = () => {
  const query = useQuery();
  const history = useHistory();

  const token = query.get("token");
  const email = query.get("email");

  const [inputs, setInputs] = useState({
    password: "",
    confirmPassword: "",
  });

  const resetPassword = async () => {
    try {
      const resetPasswordResponse = await AuthServices.resetPassword({
        token,
        email,
        password: inputs.password,
      });
      if (resetPasswordResponse.status === 200) {
        toast.success("Password reset successfull");
        setInputs({
          password: "",
          confirmPassword: "",
        });
        history.push("/login");
      }
    } catch (error) {
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    if (!inputs.password || !inputs.confirmPassword)
      return toast.error("Passwords cannot be empty");
    if (inputs.password !== inputs.confirmPassword)
      return toast.error("Password dont match");
    if (inputs.password.length < 6)
      return toast.error("Password must be atleast 6 characters");
    resetPassword();
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Reset password
              </h1>

              <Label className="mt-4">
                <span>New Password</span>
                <Input
                  name="password"
                  className="mt-1"
                  placeholder="*******"
                  type="password"
                  onChange={handleChange}
                  value={inputs.password}
                />
              </Label>
              <Label className="mt-4">
                <span>Confirm New Password</span>
                <Input
                  name="confirmPassword"
                  className="mt-1"
                  placeholder="*******"
                  type="password"
                  onChange={handleChange}
                  value={inputs.confirmPassword}
                />
              </Label>

              <Button block className="mt-4" onClick={handleReset}>
                Reset password
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
