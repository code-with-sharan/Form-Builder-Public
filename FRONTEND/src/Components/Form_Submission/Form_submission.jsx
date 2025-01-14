import React, { useContext, useEffect, useState } from "react";
import "./Form_submission.css";
import axios from "axios";
import { StoreContext } from "../../Context/Context";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Form_submission = () => {
  const { formId } = useParams();
  const { BackendURL } = useContext(StoreContext);
  const navigate = useNavigate();
  // state for storing data from backend
  const [quesData, setQuesData] = useState({
    formTitle: "",
    fromDescription: "",
    questionsArray: [],
  });
  // backend data storage state ends here

  // state for storing answers:
  const [data, setData] = useState({
    email: "",
    answer: [],
  });

  const handleOptionChange = (ques_id, value) => {
    setData((prevData) => {
      const updatedAnswers = prevData.answer.filter(
        // The filter method is an array method that creates a new array with all elements that pass the test implemented by the provided function.
        (ans) => ans.ques_id !== ques_id
      ); // The filter method removes the old answer and add the new answer in the array. Resulting, array now contains the updated answer.
      return {
        email: prevData.email,
        answer: [...updatedAnswers, { ques_id, answer: value }], // Add the new answer
      };
    });
  };

  useEffect(() => {
    const getQuesDataFromBackend = async () => {
      let newUrl = BackendURL; // backend url
      newUrl += "/api/form/getQuesData";
      const response = await axios.post(newUrl, { formId });
      try {
        if (response.data.success) {
          setQuesData({
            formTitle: response.data.formTitle,
            fromDescription: response.data.formDescription,
            questionsArray: response.data.questionArr,
          });
        } else {
          console.log("Error!...!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getQuesDataFromBackend();
  }, [formId]);

  const dynamicInputFields = (qn, index) => {
    switch (qn.ans_type) {
      case "Short_answer":
        return (
          <>
            <div className="form_subm_dynamic_short_ans">
              <input
                type="text"
                required
                placeholder="Your Answer"
                value={
                  (data.answer.find((ans) => ans.ques_id === qn.ques_id) || {}) // find method returns the first element in the array that satisfies the provided testing function.
                    .answer || ""
                }
                /* data.answer.find((ans) => ans.ques_id === qn.ques_id): Looks for an answer in the data.answer array corresponding to the current question's ID (qn.ques_id).
              || {}: If no answer is found, defaults to an empty object.
              .answer || "": Tries to access the answer property of the found object. If no answer is found, or if the found object is {}, it defaults to an empty string. 
              
              This logic ensures that each input field correctly displays the current answer (if it exists) or remains empty if no answer has been provided yet.
              "Ye line answer array ke andar ek object dhoondhti hai jo ques_id ke sath match karta ho. Agar object mil jati hai, to value us object ka answer hota hai. Agar object nahi milti, to ek empty object create hota hai aur uski value empty string hoti hai."*/
                onChange={(e) => handleOptionChange(qn.ques_id, e.target.value)}
              />
            </div>
          </>
        );

      case "Paragraph":
        return (
          <>
            <div className="form_subm_dynamic_short_ans">
              <textarea
                cols="40"
                placeholder="Your Answer"
                value={
                  (data.answer.find((ans) => ans.ques_id === qn.ques_id) || {})
                    .answer || ""
                }
                required
                onChange={(e) => handleOptionChange(qn.ques_id, e.target.value)}
              ></textarea>
            </div>
          </>
        );

      case "Multiple_choice":
        return (
          <div className="form_subm_options_wrapper">
            {qn.mcq_options.map((option, optionIndex) => (
              <div key={optionIndex} className="form_subm_dynamic_mcq">
                <input
                  required
                  id={`form_subm_mcq_id-${optionIndex}`}
                  type="radio"
                  name={qn.ques_id}
                  value={option.option_text}
                  checked={
                    // It is used to indicate whether a checkbox or radio button is selected (i.e., checked) or not.
                    (
                      data.answer.find((ans) => ans.ques_id === qn.ques_id) ||
                      {}
                    ).answer === option.option_text // specifying the value of answer
                  }
                  onChange={() =>
                    handleOptionChange(qn.ques_id, option.option_text)
                  }
                />
                <label htmlFor={`form_subm_mcq_id-${optionIndex}`}>
                  {option.option_text}
                </label>
              </div>
            ))}
          </div>
        );

      case "Checkboxes":
        return (
          <div className="form_subm_options_wrapper">
            {qn.checkbox_options.map((option, optionIndex) => (
              <div key={optionIndex} className="form_subm_dynamic_mcq">
                <input
                  id={`form_subm_chexkbox_id-${optionIndex}`}
                  type="checkbox"
                  name={qn.ques_id}
                  value={option.option_text}
                  checked={(
                    data.answer.find((ans) => ans.ques_id === qn.ques_id) || {
                      answer: [],
                    }
                  ).answer.includes(option.option_text)}
                  // The 'includes' method is used to determine if the current multiple-choice option (option.option_text) is one of the selected answers (answer array). If it is included in the answer array, the checked attribute is set to "true", making the radio button selected. If not, the radio button remains unselected.
                  onChange={(e) =>
                    handleOptionChange(
                      qn.ques_id,
                      e.target.checked
                        ? [
                            // if the checkbox is checked
                            ...(
                              data.answer.find(
                                (ans) => ans.ques_id === qn.ques_id
                              ) || { answer: [] }
                            ).answer,
                            option.option_text,
                          ]
                        : // if the checkbox is Unchecked
                          (
                            data.answer.find(
                              (ans) => ans.ques_id === qn.ques_id
                            ) || { answer: [] }
                          ).answer.filter((item) => item !== option.option_text)
                    )
                  }
                />
                <label htmlFor={`form_subm_chexkbox_id-${optionIndex}`}>
                  {option.option_text}
                </label>
              </div>
            ))}
          </div>
        );

      case "Date":
        return (
          <>
            <div className="form_subm_dynamic_date">
              <input
                required
                type="date"
                id="date"
                value={
                  (data.answer.find((ans) => ans.ques_id === qn.ques_id) || {})
                    .answer || ""
                }
                onChange={(e) => handleOptionChange(qn.ques_id, e.target.value)}
              />
            </div>
          </>
        );

      case "Linear_scale":
        const scaleOptions = Array.from(
          // Array.from creates an empty array
          { length: qn.linear_scale_value.to - qn.linear_scale_value.from + 1 }, // This object defines the length of the array.
          (_, i) => qn.linear_scale_value.from + i // This is the mapping function that determines what each element in the array will be.
        );

        return (
          <>
            {scaleOptions.map((value, optionIndex) => (
              <div key={optionIndex} className="form_subm_dynamic_linear_btns">
                <input
                  required
                  type="radio"
                  id={`linear-${qn.ques_id}-${value}`}
                  name={`linear-${qn.ques_id}`}
                  value={value}
                  checked={
                    (
                      data.answer.find((ans) => ans.ques_id === qn.ques_id) ||
                      {}
                    ).answer === value
                  }
                  onChange={() => handleOptionChange(qn.ques_id, value)}
                />
                <label htmlFor={`linear-${qn.ques_id}-${value}`}>{value}</label>
              </div>
            ))}
          </>
        );
    }
  };

  const submitFormResponse = async (e) => {
    e.preventDefault();
    let newUrl = BackendURL; // backend url
    newUrl += "/api/form/submitResponse";
    const token = localStorage.getItem("token")

    const response = await axios.post(newUrl, {
      formId,
      data,
      email: data.email,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message)
      navigate(`/form`)
    } else if (response.data.message === "You have already submitted the form") {
      toast.error(response.data.message)
    } else {
      toast.error(response.data.message)
    }
  };

  return (
    <>
      <section className="form_submission_section">
        <form onSubmit={submitFormResponse}>
          <div className="form_submission_outer_div">
            <div className="form_submission_title_and_desc">
              <h2 style={{lineHeight: "1"}}>{quesData.formTitle}</h2>
              <p>{quesData.fromDescription}</p>
              <div className="form_submission_input_email">
                <label htmlFor="form_submission_email">Email*</label>
                <input
                  required
                  type="text"
                  value={data.email}
                  onChange={(e) => setData((prevData) => ({ ...prevData, email: e.target.value }))}
                  id="form_submission_email"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="questions_heading">
              <h2 className="questions_heading_h2">Questions</h2>
              <p>
                Please answer all the questions below carefully. Your responses
                are important to us.
              </p>
            </div>

            <div className="form_submission_question_container_outer_div">
              {quesData.questionsArray.map((qn, index) => (
                <div
                  key={index}
                  className="form_submission_question_container form_submission_question_container_2"
                >
                  <p>{qn.question_text}</p>
                  <div className="form_submission_dynamc_answer_div">
                    {dynamicInputFields(qn, index)}
                  </div>
                </div>
              ))}
            </div>

            <div className="response_submit_btn">
              <Button type="submit" variant="dark">
                Submit response
              </Button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Form_submission;
