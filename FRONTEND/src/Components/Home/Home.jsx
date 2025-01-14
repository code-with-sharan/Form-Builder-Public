import React, { useContext } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import Button from "react-bootstrap/esm/Button";
import { StoreContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();
  const openFormsInNewTab = () => {
    // we used window.open to open the path in new tab.
    window.open("/form", "_blank");
  };

  return (
    <>
      <Navbar />
      <section className="home_top_section">
        <section className="firstSection_Home">
          <div className="firstSection_Home_heading_para">
            <h1>Build Forms with Ease</h1>
            <p>
              Our powerful form builder makes it simple to create
              professional-looking forms for your business.
            </p>
            <Button
              onClick={
                !token
                  ? () => navigate("/login_signup")
                  : () => openFormsInNewTab()
              }
              className="btn-dark"
            >
              Create form
            </Button>
          </div>
        </section>

        <section className="secondSection_Home">
          <div className="review_div">
            <div className="review_heading_para">
              <h2>What Our Users Say</h2>
              <p>
                Hear from our satisfied customers and see how Form Builder has
                transformed their data collection process.
              </p>
            </div>
            <div className="review_grids">
              <div className="review">
                <p>
                  "Form Builder has revolutionized the way we collect data. The
                  intuitive interface and powerful features have saved us so
                  much time and effort."
                </p>
                <cite>- Jane Doe, Marketing Manager</cite>
              </div>
              <div className="review">
                <p>
                  "I was hesitant to try a new form builder, but Form Builder
                  has exceeded all my expectations. The real-time collaboration
                  feature is a game-changer."
                </p>
                <cite>- John Smith, Project Manager</cite>
              </div>
              <div className="review">
                <p>
                  "Form Builder has streamlined our data collection process and
                  provided us with valuable insights. I highly recommend it to
                  any business looking to improve their forms."
                </p>
                <cite>- Sarah Lee, Operations Director</cite>
              </div>
            </div>
          </div>
        </section>

        <section className="thirdSection_Home">
          <div className="heading_and_features">
            <div className="thirdSection_heading_para">
              <h2>Powerful Features</h2>
              <p>
                Discover how our form builder can streamline your data
                collection.
              </p>
            </div>
            <div className="div_all_features">
              <div className="feature">
                <svg
                  data-id="12"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                </svg>
                <h3>Customizable Forms</h3>
                <p>
                  Drag and drop form fields to create custom forms for your
                  business.
                </p>
              </div>
              <div className="feature">
                <svg
                  data-id="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                  <path d="M3 12A9 3 0 0 0 21 12"></path>
                </svg>
                <h3>Data Collection</h3>
                <p>Collect and store form submissions in a secure database.</p>
              </div>
              <div className="feature">
                <svg
                  data-id="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <rect width="8" height="8" x="3" y="3" rx="2"></rect>
                  <path d="M7 11v4a2 2 0 0 0 2 2h4"></path>
                  <rect width="8" height="8" x="13" y="13" rx="2"></rect>
                </svg>
                <h3>Workflow Automation</h3>
                <p>
                  Automate your business processes with form-triggered
                  workflows.
                </p>
              </div>
              <div className="feature">
                <svg
                  data-id="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <h3>Analytics</h3>
                <p>
                  Gain insights into your form data with advanced analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Home;
