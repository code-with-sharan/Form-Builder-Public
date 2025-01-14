import React,{ useContext } from 'react'
import "./Navbar.css"
import { StoreContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { assets } from '../../assets/assets';

const Navbar = () => {
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <nav className="main_nav navbar navbar-expand-lg ">
      <div className="nav-containerr container-fluid">
        <div className="LogoAndName">
          <img className="icon-logo" onClick={()=> navigate('/')} src={assets.logo} alt="" />
          <a className="brand_name navbar-brand" href="/">
            Form Builder
          </a>
        </div>
        {token ? (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p className='navbar-profile-dropdown-para'>Logout</p>
              </li>
            </ul>
          </div>
        ) : (
          <div className="login-signup-btns">
            <button
              onClick={() => navigate("/login_signup#login")}
              className="login-btn"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login_signup#signup")}
              className="btn btn-dark signup-btn"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar