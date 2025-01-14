import React from "react";
import "./Footer.css";

const Footer = ({copyrightClass}) => {
  return (
    <>
      <div className="footer_div">
        <hr className="footer_hr" />
        <div className="footer">
          <div className="copyright_div">
            <p className={`${copyrightClass}`}>© 2024 Form Builder.</p>
            <p className={`${copyrightClass}`}> All rights reserved.</p>
          </div>
          <div className="tc_privacy">
            <p>Terms of Service</p>
            <p className="privacy">Privacy</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;