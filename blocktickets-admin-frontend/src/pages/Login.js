import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../components/new/Loading";
import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { GithubIcon, TwitterIcon } from "../icons";
import { Label, Input, Button } from "@windmill/react-ui";
import { AuthServices } from "../services/api-client";
import toast from "react-hot-toast";

function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const loginResponse = await AuthServices.login(inputs);
      if (loginResponse.status === 200) {
        sessionStorage.setItem("token", loginResponse.data.data.accessToken);
        sessionStorage.setItem(
          "userDetails",
          JSON.stringify(loginResponse.data.data.user)
        );
        history.push("/app");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error?.response?.data ? error?.response?.data?.error : error?.message
      );
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login();
  };
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <form onSubmit={handleLogin}>
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
                  Login
                </h1>
                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1"
                    id="email"
                    type="email"
                    placeholder="john@doe.com"
                    onChange={handleInputsChange}
                  />
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    id="password"
                    type="password"
                    placeholder="***************"
                    onChange={handleInputsChange}
                  />
                </Label>

                <Button
                  type="submit"
                  className="mt-4"
                  block
                  onClick={handleLogin}
                >
                  Log in
                </Button>

                <hr className="my-8" />

                {/* <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button className="mt-4" block layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button> */}

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </p>
                {/* <p className="mt-1">
                <Link
                  className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                  to="/create-account"
                >
                  Create account
                </Link>
              </p> */}
              </div>
            </main>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
