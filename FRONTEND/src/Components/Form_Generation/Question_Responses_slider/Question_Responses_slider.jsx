import React from "react";
import "./Question_Responses_slider.css";
import { useNavigate } from "react-router-dom";

const Question_Responses_slider = ({ formId, quesOrRes, setQuesOrRes }) => {
  const navigate = useNavigate();

  const goToAllResponsePage = () => {
    setQuesOrRes(false);
    navigate(`/form/${formId}/allSubmissions`);
  };

  const goToEditFormPage = () => {
    setQuesOrRes(true);
    navigate(`/form/${formId}/edit`);
  };

  return (
    <>
      <div className="Question_Responses_slider">
        <div className="Question_Responses_slider_para" >
          <p className={quesOrRes? "Slider_text_active_ques" : ""} onClick={goToEditFormPage}>Questions</p>{" "}
        </div>
        <div className="Question_Responses_slider_para">
          <p className={!quesOrRes? "Slider_text_active_res" : ""} onClick={goToAllResponsePage}>Responses</p>{" "}
        </div>
      </div>

    </>
  );
};

export default Question_Responses_slider;
