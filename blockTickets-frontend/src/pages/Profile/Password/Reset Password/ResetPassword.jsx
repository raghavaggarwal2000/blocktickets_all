import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reset-password.css";
import "../password.css";
import { resetPassword } from "../../../../api/api-client";
import { UserServices } from "../../../../api/supplier";
import { toast } from "react-toastify";
import FullLoading from "../../../../Loading/FullLoading";

const ResetPassword = () => {
  let navigate = useNavigate();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [npassword, setNpassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetType, setResetType] = useState("");

  const sendNewPasswordRequest = async (accessToken, userEmail, password) => {
    setLoading(true);
    try {
      const res = await resetPassword(accessToken, userEmail, password);
      if (res && res.data && res.data.status === 200) {
        setSuccessMessage(res.data.message);
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage("Some error occurred while resetting password");
      setLoading(false);
    }
  };

  const handleResetSubmit = async () => {
    if (
      !npassword ||
      !cpassword ||
      (npassword !== cpassword && npassword.length > 0 && cpassword.length > 0)
    ) {
      setErrorMessage("Password does not match...");
      return;
    }
    if (npassword.length < 6 && cpassword.length < 6) {
      setErrorMessage("Password should be at least 6 characters");
      return;
    }
    console.log("token: ", token);
    await sendNewPasswordRequest(token, email, npassword);
  };

  const changePassword = async () => {
    try {
      if (
        !npassword ||
        !cpassword ||
        (npassword !== cpassword &&
          npassword.length > 0 &&
          cpassword.length > 0)
      ) {
        return toast.error("New password doesn't match");
      }
      setLoading(true);
      console.log("here");

      const update = await UserServices.updateUserPassword({
        email,
        oldPassword: currentPassword,
        newPassword: cpassword,
      });
      console.log(update);
      toast.success("Paswword updated successfully");
      const newObj = JSON.stringify({
        ...JSON.parse(sessionStorage.getItem("user-data")),
        should_reset: false,
      });
      sessionStorage.setItem("user-data", newObj);
      setTimeout(() => {
        navigate(
          sessionStorage.getItem("token")
            ? "/"
            : `/login?location=${btoa("sign-up-popup")}`
        );
      }, 1500);
      setLoading(false);
    } catch (err) {
      console.log("err", err?.response?.data?.msg);
      toast.error(
        err?.response?.data?.msg
          ? err?.response?.data?.msg
          : "Something went wrong"
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    setEmail(params.get("email"));
    setToken(params.get("token"));
    if (params.get("apply-token")) {
      setResetType(params.get("apply-token"));
    }
  }, []);
  return (
    <div className="profile-password-container bg-black">
      {loading && <FullLoading />}

      <div className="profile-password">
        <h2>Reset Password</h2>

        <div>
          {resetType && (
            <div className="p-input-element">
              <div>
                <label for="password">Temporary password</label>
              </div>
              <input
                type="password"
                id="currentPassword"
                placeholder="Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <br />
              <br />
            </div>
          )}
          <div className="p-input-element">
            <div>
              <label for="password">Password</label>
            </div>
            <input
              type="password"
              id="npassword"
              placeholder="Password"
              value={npassword}
              onChange={(e) => setNpassword(e.target.value)}
            />
            <br />
          </div>
          <br />

          <div className="p-input-element">
            <div>
              <label for="password">Confirm password</label>
            </div>
            <input
              type="password"
              id="cpassword"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            <br />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </div>

        <div className="profile-password-buttons">
          <button
            className="px-3 py-3 text-xl rounded-lg bg-orange text-white hover:opacity-75"
            onClick={resetType ? changePassword : handleResetSubmit}
          >
            Reset Password
          </button>
          <button className="cancel-email hover:text-orange">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
