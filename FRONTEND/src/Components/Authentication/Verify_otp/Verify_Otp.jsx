import React, { useContext, useState } from "react";
import "./Verify_Otp.css";
import Button from "react-bootstrap/Button";
import { StoreContext } from "../../../Context/Context";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Verify_Otp = () => {
  const { BackendURL, setToken } = useContext(StoreContext);
  const { email } = useParams();
  const navigate = useNavigate()
  const [data, setData] = useState({
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newUrl = BackendURL;
    newUrl += "/api/user/verify_otp/:email";

    const response = await axios.post(newUrl, { data, email });
    if (response.data.success) {
      setLoading(false);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate('/')
      toast.success(response.data.message);
    } else {
      setLoading(false);
      toast.error(response.data.message);
    }
  };

  return (
    <>
      <section className="verifyOtp_section">
        <form onSubmit={onSubmitVerifyOtp}>
          <div className="verifyOtp_div_container">
            <div className="verifyOtp_text_center">
              <h1>Verify OTP</h1>
              <p>
                Please enter the one-time password (OTP) sent to your registered
                mobile number to verify your identity.
              </p>
            </div>

            <div className="verifyOtp_label_input">
              <input
                id="otp_verify_otp"
                type="text"
                name="otp"
                value={data.otp}
                onChange={onChangeHandler}
                placeholder="Enter OTP"
              />
            </div>
            <Button type="Submit" variant="dark" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Verify_Otp;
