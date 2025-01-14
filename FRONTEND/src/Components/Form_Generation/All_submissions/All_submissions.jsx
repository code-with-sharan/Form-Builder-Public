import React, { useContext, useEffect, useState } from "react";
import "./All_submissions.css";
import Question_Responses_slider from "../Question_Responses_slider/Question_Responses_slider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../../Context/Context";
import { Button } from "react-bootstrap";

const All_submissions = ({ quesOrRes, setQuesOrRes }) => {
  const { formId } = useParams();
  const [userData, setUserData] = useState([
    {
      email: "",
      timeAndDate: "",
      userId: "",
    },
  ]);
  const { BackendURL } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserEmailAndSubmTime = async (e) => {
      // e.preventDefault()
      let newUrl = BackendURL; // backend url
      newUrl += "/api/form/getUserEmailAndSubmTime";

      const response = await axios.post(newUrl, {
        formId,
      });
      if (response.data.success) {
        // alert("userData fetched");
        setUserData(response.data.userData);
      } else {
        console.log("Error fetching user data");
      }
    };

    getUserEmailAndSubmTime();
  }, []);

  return (
    <>
      <Question_Responses_slider
        formId={formId}
        quesOrRes={quesOrRes}
        setQuesOrRes={setQuesOrRes}
      />

      <section className="All_submissions_section">
        <div className="All_submissions_div">
          <div className="All_submissions_h1_p">
            <h1>Form Responses</h1>
            <p>View and manage all the responses for your form.</p>
          </div>

          {userData.length ? (
            <div className="All_submissions_user_data">
              <div className="All_submissions_userData_headings">
                <p>Email</p>
                <p>Submitted</p>
                <p>Actions</p>
              </div>

              <hr className="All_submissions_userData_headings_hr" />

              {userData.map((data, index) => (
                <>
                  <div className="All_submissions_userData_data">
                    <p className="All_submissions_userData_data_email">{data.email}</p>
                    <p>{data.timeAndDate}</p>
                    <Button
                      onClick={() =>
                        navigate(
                          `/form/${formId}/${data.userId}/individualResponse`
                        )
                      }
                      variant="light"
                    >
                      view
                    </Button>
                  </div>
                  <hr />
                </>
              ))}
            </div>
          ) : (
            <>
              <div className="All_submissions_useCase">
                <div className="All_submissions_userData_headings">
                  <p>Email</p>
                  <p>Submitted</p>
                  <p>Actions</p>
                </div>
                <p className="All_submissions_No_response_Para">
                  Be the first to fill out this form!
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default All_submissions;
