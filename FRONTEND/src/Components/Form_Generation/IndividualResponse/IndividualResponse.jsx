import React, { useContext, useEffect, useState } from "react";
import "./IndividualResponse.css";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { StoreContext } from "../../../Context/Context";
import axios from "axios";

const IndividualResponse = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { userId } = useParams();
  const [qnA, setQnA] = useState({
    formTitle: "",
    formDescription: "",
    email: "",
    submTime: "",
    qnaData: [],
  });

  const { BackendURL } = useContext(StoreContext);

  useEffect(() => {
    const getQnAdata = async () => {
      let newUrl = BackendURL; // backend url
      newUrl += "/api/form/getQnAdata";

      const response = await axios.post(newUrl, {
        formId,
        userId,
      });
      if (response.data.success) {
        const { formTitle, formDescription, submTime, qnaArr, email } =
          response.data;
        setQnA({
          formTitle: formTitle,
          formDescription: formDescription,
          email: email,
          submTime: submTime,
          qnaData: qnaArr,
        });
      } else {
        console.error("Error fetching QnA data");
      }
    };

    getQnAdata();
  }, [userId]);

  // console.log(qnA)
  return (
    <>
      <section className="individual_response_secion">
        <div className="individual_response_outer_div">
          <div className="individual_response_header_div">
            <div className="individual_response_header_div_h1_p">
              <h1>Form Response</h1>
              <p>Submitted on {qnA.submTime}</p>
            </div>
            <div className="individual_response_header_div_back_btn">
              <Button
                onClick={() => navigate(`/form/${formId}/allSubmissions`)}
                variant="secondary"
              >
                {" "}
                Back to responses
              </Button>
            </div>
          </div>

          <div className="individual_response_inner_div">
            <div className="individual_response_QnA_div">
              <div className="individual_response_QnA_div_title_res_name">
                <div className="individual_response_QnA_div_title_res_name_title">
                  <p className="ind_res_title_heading">Form Title</p>
                  <p className="ind_res_title" style={{overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"}}>{qnA.formTitle}</p>
                </div>
                <div className="individual_response_QnA_div_title_res_name_title">
                  <p className="ind_res_title_heading">Respondent</p>
                  <p className="ind_res_title">{qnA.email}</p>
                </div>
              </div>

              <div className="individual_response_QnA_div_QnA">
                <hr className="ind_res_hr1" />
                <h2 className="individual_response_QnA_div_QnA_ResponseHeading">
                  Your Response
                </h2>
                <div className="individual_response_QnA_div_QnA_Question">
                  {qnA.qnaData.map((ques, index) => (
                    <div
                      key={index}
                      className="individual_response_QnA_div_QnA_Question_inner"
                    >
                      <h3>{`${index + 1}. ` + ques.question}</h3>
                      <p>{ques.answer + " "}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IndividualResponse;
