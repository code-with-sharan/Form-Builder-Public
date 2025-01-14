import React, { useContext, useState } from "react";
import "./Reset_Password.css";
import Button from "react-bootstrap/esm/Button";
import { StoreContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Reset_Password = () => {
  const [data, setData] = useState({
    new_pass: "",
    confirm_new_pass: "",
  });
  const [loading, setLoading] = useState(false);
  const { BackendURL } = useContext(StoreContext); // Backend url
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const resetPass = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    const token = window.location.pathname.split("/")[2];
    const newUrl = `${BackendURL}/api/user/reset_password/${token}`;

    if (data.new_pass !== data.confirm_new_pass) {
      alert("Passwords do not match!");
      return;
    }

    const response = await axios.post(newUrl, { password: data.new_pass });

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
      <div className="reset_outer_div">
        <div className="reset_div">
          <div className="reset_heading_para">
            <h1>Reset Password</h1>
            <p>Enter a new password for your account.</p>
          </div>
          <form className="reset_form" onSubmit={resetPass}>
            <div className="reset_form_div">
              <label htmlFor="new_pass">New Password</label>
              <input
                required
                id="new_pass"
                name="new_pass"
                value={data.new_pass}
                onChange={onChangeHandler}
                type="text"
                placeholder="Enter a new password"
              />
            </div>
            <div className="reset_form_div">
              <label htmlFor="conf_new_pass">Confirm Password</label>
              <input
                required
                id="conf_new_pass"
                name="confirm_new_pass"
                value={data.confirm_new_pass}
                onChange={onChangeHandler}
                type="text"
                placeholder="Confirm your new password"
              />
            </div>
            <Button type="submit" variant="dark" disabled={loading}>
              {loading ? "Updating password..." : "Update Password"}
            </Button>{" "}
          </form>
        </div>
      </div>
    </>
  );
};

export default Reset_Password;
