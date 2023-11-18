import React, { useState } from "react";
import { Link } from "react-router-dom";

import ImageLight from "../assets/img/forgot-password-office.jpeg";
import ImageDark from "../assets/img/forgot-password-office-dark.jpeg";
import { Label, Input, Button } from "@windmill/react-ui";
import { AuthServices } from "../services/api-client";
import toast from "react-hot-toast";
import Loading from "../components/new/Loading";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = async () => {
    if (!email) return toast.error("Email cannot be empty");
    if (!email.match(/\S+@\S+\.\S+/)) return toast.error("Invalid email");
    try {
      setIsLoading(true);
      const forgotPasswordResponse = await AuthServices.forgotPassword(email);
      if (forgotPasswordResponse.data.message === "Invalid User") {
        toast.error("User not found");
      } else {
        toast.success("Check your email for reset link");
        setEmail("");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data ? error.response.data : error.message);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    forgotPassword();
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

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
            <form className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Forgot password
              </h1>

              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="something@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Label>

              <Button
                block
                className="mt-4"
                onClick={handleClick}
                type="submit"
              >
                Recover password
              </Button>
              <hr className="my-8" />

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                  to="/login"
                >
                  Login instead
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
