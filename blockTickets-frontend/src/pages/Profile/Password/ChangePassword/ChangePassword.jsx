import React from "react";
import "./change-password.css";
import "../password.css";

// background designs
import passwordLogo from "../../../../images/lock-dark.svg";

const ChangePassword = () => {
    return <div className="profile-password-container">
        <div className="profile-password">
            <h2>Change Password</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                feugiat, sapien in rhoncus suscipit, metus mi accumsan dui,
                vel vulputate metus mauris vitae tellus. Aenean porttitor
                condimentum eros sed tempus.
            </p>

            <div>
                <div className="p-input-element">
                    <span className="p-icon-p">
                        <img src={passwordLogo} alt="" />
                    </span>
                    <div>
                        <label for="password">Old Password</label>
                    </div>
                    <input
                        type="password"
                        id="password"
                        placeholder="Old Password"

                    />
                    <br />
                </div>
                <div className="p-input-element">
                    <span className="p-icon-p">
                        <img src={passwordLogo} alt="" />
                    </span>
                    <div>
                        <label for="password">New Password</label>
                    </div>
                    <input
                        type="password"
                        id="password"
                        placeholder="New Password"
                    // value={user.password}
                    // onChange={(e) => handle(e)}
                    />
                    <br />
                </div>
                <div className="p-input-element">
                    <span className="p-icon-p">
                        <img src={passwordLogo} alt="" />
                    </span>
                    <div>
                        <label for="password">Confirm Password</label>
                    </div>
                    <input
                        type="password"
                        id="password"
                        placeholder="Confirm Password"
                    // value={user.password}
                    // onChange={(e) => handle(e)}
                    />
                    <br />
                </div>
            </div>

            <div className="profile-password-buttons">
                <button className="confirm-email">Reset Password</button>
                <button className="cancel-email">Cancel</button>
            </div>
        </div>
    </div>;
};

export default ChangePassword;
