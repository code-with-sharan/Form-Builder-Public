import React, { useContext, useEffect, useState } from "react";
import "./Login_Signup.css";
import Button from "react-bootstrap/Button";
import { StoreContext } from "../../../Context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Login_Signup = () => {
  const navigate = useNavigate();
  const { BackendURL, setToken } = useContext(StoreContext);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  // when login button is clicked and loading is true, signup button should also be disabled and vise versa
  const [disableSignup, setDisableSignup] = useState(false);
  const [disableLogin, setDisableLogin] = useState(false);

  useEffect(() => {
    setDisableSignup(loadingLogin); // When login is loading, disable signup button
    setDisableLogin(loadingSignup); // When signup is loading, disable login button
  }, [loadingLogin, loadingSignup]);

  const location = useLocation(); // Use location to get the URL hash

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
      }
    }
  }, [location]); // Trigger this when location (URL) changes

  const onChangeHandleLogin = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginData((data) => ({ ...data, [name]: value }));
  };

  const onChangeHandleSignup = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSignupData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitSignup = async (e) => {
    e.preventDefault();
    setLoadingSignup(true);
    let newUrl = BackendURL;
    newUrl += "/api/user/register";

    const response = await axios.post(newUrl, { signupData });
    if (response.data.success) {
      setLoadingSignup(false);
      navigate(`/verify_otp/${response.data.email}`);
      toast.success(response.data.message);
    } else {
      setLoadingSignup(false);
      toast.error(response.data.message);
    }
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    let newUrl = BackendURL;
    newUrl += "/api/user/login";

    const response = await axios.post(newUrl, { loginData });
    if (response.data.success) {
      setLoadingLogin(false);
      if (
        response.data.message ===
        "Email is not verified, Please check your email for OTP"
      ) {
        navigate(`/verify_otp/${response.data.email}`);
        toast.success(response.data.message);
      } else {
        setLoadingLogin(false);
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        navigate("/");
        toast.success(response.data.message);
      }
    } else {
      setLoadingLogin(false);
      toast.error(response.data.message);
    }
  };

  return (
    <>
      <div className="login_signup_container">
        <div className="login_container" id="login">
          <div className="login-content">
            <div className="login_text">
              <h1>Welcome to Form Builder</h1>
              <p>Create beautiful forms for your business.</p>
            </div>
            <form onSubmit={onSubmitLogin}>
              <div className="form-container">
                <div className="form_div">
                  <label htmlFor="login_email_id">Email</label>
                  <input
                    type="email"
                    id="login_email_id"
                    name="email"
                    value={loginData.email}
                    onChange={onChangeHandleLogin}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="form_div">
                  <div className="pass_forgot_pass">
                    <label htmlFor="login_passsword">Password</label>
                    <a href="/forgot_password">Forgot Password?</a>
                  </div>
                  <input
                    type="password"
                    id="login_passsword"
                    name="password"
                    value={loginData.password}
                    onChange={onChangeHandleLogin}
                    required
                  />
                </div>
                <Button variant="light" type="Submit" disabled={disableLogin}>
                  {loadingLogin ? "Logging in..." : "Login"}
                </Button>{" "}
              </div>
            </form>
          </div>
        </div>

        <div className="signup_container" id="signup">
          <div className="signup-content">
            <div className="signup_text">
              <h1>Sign Up</h1>
              <p>Create your Form Builder account.</p>
            </div>
            <form onSubmit={onSubmitSignup}>
              <div className="form-container signin_form-container">
                <div className="signup_form_div">
                  <label htmlFor="signup_name">Name</label>
                  <input
                    type="text"
                    id="signup_name"
                    name="name"
                    value={signupData.name}
                    onChange={onChangeHandleSignup}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="signup_form_div">
                  <label htmlFor="signup_email_id">Email</label>
                  <input
                    type="email"
                    id="signup_email_id"
                    name="email"
                    value={signupData.email}
                    onChange={onChangeHandleSignup}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="signup_form_div">
                  <label htmlFor="signup_pass">Password</label>
                  <input
                    id="signup_pass"
                    name="password"
                    value={signupData.password}
                    onChange={onChangeHandleSignup}
                    type="password"
                    required
                  />
                </div>
                <Button variant="dark" type="Submit" disabled={disableSignup}>
                  {loadingSignup ? "Requesting OTP..." : "Request OTP"}
                </Button>{" "}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login_Signup;
