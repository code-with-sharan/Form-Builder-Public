import React, { useContext, useState } from "react";
import "./Forgot_Password.css";
import Button from "react-bootstrap/esm/Button";
import { StoreContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify'

const Forgot_Password = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { BackendURL } = useContext(StoreContext); // Backend url

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const getNewPass = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newUrl = BackendURL; // backend url
    newUrl += "/api/user/forgot_password";

    const response = await axios.post(newUrl, { data });
    if (response.data.success) {
      setLoading(false);
      navigate("/");
      toast.success(response.data.message);
    } else {
      setLoading(false);
      toast.error(response.data.message);
    }
  };

  return (
    <>
      <div className="fp_outerDiv">
        <div className="fp-div">
          <div className="fp_heading_para">
            <h1>Forgot your password?</h1>
            <p>
              Enter your email address below and we'll send you a link to reset
              your password.
            </p>
          </div>
          <form className="fp_form" onSubmit={getNewPass}>
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              placeholder="Enter your email"
            />
            <Button type="submit" variant="dark" disabled={loading}>
              {loading ? "Sending reset link..." : "Reset Password"}
            </Button>{" "}
          </form>
          <div className="fp_option_for_signin">
            <p>Remember your password?</p>
            <a onClick={() => navigate("/login_signup#signup")}>Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot_Password;
