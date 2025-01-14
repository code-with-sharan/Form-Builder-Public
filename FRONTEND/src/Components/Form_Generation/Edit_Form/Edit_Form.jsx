import React, { useState, useContext, useEffect } from "react";
import "./Edit_Form.css";
import { Button } from "react-bootstrap";
import { StoreContext } from "../../../Context/Context";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SendLink_Modal from "../SendLink_Modal/SendLink_Modal";
import Question_Responses_slider from "../Question_Responses_slider/Question_Responses_slider";
import { toast } from "react-toastify";

const Edit_Form = ({ quesOrRes, setQuesOrRes }) => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { BackendURL } = useContext(StoreContext);

  // state for storing data, fetched from backend.
  const [fromHeaders, setFormHeaders] = useState({
    formTitle: "Untitled",
    formDescription: "",
  });

  // state for storing data, fetched from backend.
  const [question, setQuestion] = useState([
    {
      question_text: "",
      ans_type: "", // change the selected option to change the value.
      mcq_options: [{ option_text: "" }],
      checkbox_options: [{ option_text: "" }],
      linear_scale_value: {
        from: 1,
        to: 5,
      },
    },
  ]);

  // state for showing send link modal
  const [isVisible, setIsVisible] = useState(false);

  // Fetch the form data when the component mounts. In tis function, we fetch data from backend and store data in states.
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        let newUrl = `${BackendURL}/api/form/getQuesData`; // backend url
        const response = await axios.post(newUrl, { formId });
        if (response.data.success) {
          // Update the state with fetched form data
          const { formTitle, formDescription, questionArr } = response.data;
          setFormHeaders({
            formTitle: formTitle || "",
            formDescription: formDescription || "",
          });
          setQuestion(questionArr); // Default to existing state if no questions fetched from backend.
        } else {
          console.error("Failed to fetch form data");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [formId]);

  const onChangeHandler = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;

    const newQuestion = [...question];
    newQuestion[index] = { ...newQuestion[index], [name]: value };

    setQuestion(newQuestion);
  };

  // Muliple choice option handling starts here

  const handleMcqChange = (index, optionIndex, event) => {
    const newQuestion = [...question]; // created shallow array copy of question array
    const newMcq = [...newQuestion[index].mcq_options]; // created shallow array copy of mcq_options array
    newMcq[optionIndex].option_text = event.target.value; // got the mcq value at the selected index of mcqs
    newQuestion[index] = { ...newQuestion[index], mcq_options: newMcq }; // update the mcq value in newQuestion array
    setQuestion(newQuestion);
  };

  const handleCheckboxChange = (index, optionIndex, event) => {
    const newQuestion = [...question];
    const newCheckbox = [...newQuestion[index].checkbox_options];
    newCheckbox[optionIndex].option_text = event.target.value;
    newQuestion[index] = {
      ...newQuestion[index],
      checkbox_options: newCheckbox,
    };
    setQuestion(newQuestion);
  };

  const addMcq = (index) => {
    const newQuestion = [...question]; // created shallow copy of question array
    newQuestion[index].mcq_options.push({ option_text: "" });
    setQuestion(newQuestion);
  };

  const addCheckbox = (index) => {
    const newQuestion = [...question];
    newQuestion[index].checkbox_options.push({ option_text: "" });
    setQuestion(newQuestion);
  };

  const deleteMcqOption = (index, optionIndex) => {
    const newQuestion = [...question];
    newQuestion[index].mcq_options = newQuestion[index].mcq_options.filter(
      (_, i) => i !== optionIndex
    ); // filter method creates a new array based on the condition. We are updating the mcq array in newQuestion array.
    setQuestion(newQuestion);
  };

  const deleteCheckboxOption = (index, optionIndex) => {
    const newQuestion = [...question];
    newQuestion[index].checkbox_options = newQuestion[
      index
    ].checkbox_options.filter((_, i) => i !== optionIndex);
    setQuestion(newQuestion);
  };

  // Muliple choice option handling ends here

  // Linear scale handling starts here

  const linearFrom = (event, index) => {
    const newValue = parseInt(event.target.value);
    const newQuestion = [...question];
    newQuestion[index].linear_scale_value.from = newValue;
    setQuestion(newQuestion);
  };

  const linearTo = (event, index) => {
    const newValue = parseInt(event.target.value);
    const newQuestion = [...question];
    newQuestion[index].linear_scale_value.to = newValue;
    setQuestion(newQuestion);
  };

  // Linear scale handling ends here

  const handleQuestionInputs = (qn, index) => {
    // console.log("Handling", {qn})
    switch (qn.ans_type) {
      case "Short_answer":
        return (
          <>
            <div className="dynamic_answer_short_ans">
              <input disabled type="text" placeholder="Short-answer text" />
            </div>
          </>
        );

      case "Paragraph":
        return (
          <>
            <textarea
            className="dynamic_answer_long_ans"
              disabled
              cols="34"
              placeholder="Long-answer text"
            ></textarea>
          </>
        );

      case "Multiple_choice":
        return (
          <>
            {qn.mcq_options.map((option, optionIndex) => (
              <div key={optionIndex} className="dynamic_answer_multipleChoice">
                <div className="dynamic_answer_multipleChoice_inputs">
                  <input type="radio" disabled name="multiple_choice" />
                  <input
                    required
                    type="text"
                    value={option.option_text}
                    onChange={(e) => handleMcqChange(index, optionIndex, e)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  onClick={() => deleteMcqOption(index, optionIndex)}
                >
                  <path
                    fill="#5f6368"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  ></path>
                  <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
              </div>
            ))}

            {/* For adding mcq: */}
            <div
              onClick={() => addMcq(index)}
              className="dynamic_answer_multipleChoice_inputs addMcq"
            >
              <input type="radio" disabled />
              <input type="text" value="Click to add option" readOnly />
            </div>
          </>
        );

      case "Checkboxes":
        return (
          <>
            {qn.checkbox_options.map((option, optionIndex) => (
              <div key={optionIndex} className="dynamic_answer_multipleChoice">
                <div className="dynamic_answer_multipleChoice_inputs">
                  <input type="checkbox" disabled name="checkbox" />
                  <input
                    required
                    type="text"
                    value={option.option_text}
                    onChange={(e) =>
                      handleCheckboxChange(index, optionIndex, e)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  onClick={() => deleteCheckboxOption(index, optionIndex)}
                >
                  <path
                    fill="#5f6368"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  ></path>
                  <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
              </div>
            ))}

            {/* Foe adding checkboxes: */}
            <div
              onClick={() => addCheckbox(index)}
              className="dynamic_answer_multipleChoice_inputs addMcq"
            >
              <input type="checkbox" disabled />
              <input type="text" value="Add option" readOnly />
            </div>
          </>
        );

      case "Date":
        return (
          <>
            <div className="dynamic_answer_short_ans">
              <input type="date" id="date" disabled />
            </div>
          </>
        );

      case "Linear_scale":
        return (
          <>
            <div className="scale_from_to">
              <select
                className="select_from"
                onChange={(e) => linearFrom(e, index)}
                value={qn.linear_scale_value.from}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
              <p>to</p>
              <select
                className="select_to"
                onChange={(e) => linearTo(e, index)}
                value={qn.linear_scale_value.to}
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </>
        );
    }
  };

  const createNewQuestion = () => {
    const newQuestion = {
      question_text: "",
      ans_type: "Short_answer",
      mcq_options: [{ option_text: "" }],
      checkbox_options: [{ option_text: "" }],
      linear_scale_value: {
        from: 1,
        to: 5,
      },
    };

    setQuestion([...question, newQuestion]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = question.filter((_, i) => i !== index); // filter method creates a new array here, excluding the element at the specified index, which we wants to delete.
    setQuestion(newQuestions); // changing the state with new array.
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    let newUrl = BackendURL; // backend url
    newUrl += "/api/form/saveForm";

    const token = localStorage.getItem("token");

    const response = await axios.post(newUrl, {
      question,
      fromHeaders,
      formId,
    }, { headers: { Authorization: `Bearer ${token}` } });
    if (response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)
    }
  };

  const checkIfFormSavedAtleastOnce = async () => {
    let newUrl = BackendURL; // backend url
    newUrl += "/api/form/checkIfFormSaved";

    const response = await axios.post(newUrl, { formId });
    if (response.data.success) {
      if (response.data.isFormSavedAtleastOnce) {
        setIsVisible(!isVisible);
      } else {
        toast.warn("Please save your form before sending it.")
      }
    } else {
      console.log("Error occured!!!");
    }
  };

  const sendLinkButtonPressed = () => {
    checkIfFormSavedAtleastOnce();
  };

  return (
    <>
      {quesOrRes && (
        <>
          <Question_Responses_slider
            formId={formId}
            quesOrRes={quesOrRes}
            setQuesOrRes={setQuesOrRes}
          />

          <section className="edit_form_section">
            <form onSubmit={onSubmitHandler}>
              {/* Create custom navbar here */}
              <div className="edit_form_div">
                <div className="from_heading_and_description">
                  <div className="from_heading_and_description_h1_p">
                    <h1>Edit Form</h1>
                    <p>
                      Update the details of your form and add new questions.
                    </p>
                  </div>
                  <div className="from_heading_and_description_label_input_outer">
                    <div className="from_heading_and_description_label_input">
                      <label htmlFor="formTitle">Form title</label>
                      <input
                        name="formTitle"
                        id="formTitle"
                        value={fromHeaders.formTitle}
                        onChange={(event) =>
                          setFormHeaders((data) => ({
                            ...data,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        placeholder="Enter form title"
                      />
                    </div>
                    <div className="from_heading_and_description_label_input">
                      <label htmlFor="formdesc">Form Description</label>
                      <textarea
                        id="formdesc"
                        type="text"
                        name="formDescription"
                        value={fromHeaders.formDescription}
                        onChange={(event) =>
                          setFormHeaders((data) => ({
                            ...data,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        placeholder="Enter form Description"
                      />
                    </div>
                  </div>
                </div>

                <div className="questions_heading_outer">
                  <div className="questions_heading">
                    <h2>Questions</h2>
                    <p>Add new questions to your form.</p>
                  </div>

                  <div className="questions_heading_2">
                    {!question.length && ( // If no question is in the form.
                      <>
                        <div className="questions_heading_2_btn2">
                          <Button
                            onClick={() => navigate("/form")}
                            variant="light"
                          >
                            Back to forms
                          </Button>
                        </div>
                        <div className="questions_heading_2_btn1">
                          <Button onClick={createNewQuestion} variant="dark">
                            Add Question
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {question.map((qn, index) => (
                  <div key={index} className="question_container_">
                    <div className="ques_and_ans_type">
                      <div className="ques_text_and_input_type">
                        <div className="ques_text_and_input_type_input_label">
                          <label htmlFor="ques_text">Question text</label>
                          <input
                            required
                            id="ques_text"
                            type="text"
                            placeholder="Question"
                            value={qn.question_text}
                            name="question_text"
                            onChange={(e) => onChangeHandler(e, index)}
                          />
                        </div>
                        <div className="ques_text_and_input_type_select_label">
                          <label htmlFor="answer_input">Question Type</label>
                          <select
                            onChange={(e) => onChangeHandler(e, index)}
                            value={qn.ans_type}
                            id="answer_input"
                            name="ans_type"
                          >
                            <option name="Short_answer" value="Short_answer">
                              Short answer
                            </option>
                            <option name="Paragraph" value="Paragraph">
                              Paragraph
                            </option>
                            <option
                              name="Multiple_choice"
                              value="Multiple_choice"
                            >
                              Multiple choice
                            </option>
                            <option name="Checkboxes" value="Checkboxes">
                              Checkboxes
                            </option>
                            <option name="Linear_scale" value="Linear_scale">
                              Linear scale
                            </option>
                            <option name="Date" value="Date">
                              Date
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="AnswertypesPlusButtons">
                        <div className="dynamic_answer_input_box">
                          {handleQuestionInputs(qn, index)}
                        </div>

                        <div className="edit_form_create_add_del_btns">
                          <div className="edit_form_create_add_del_btn">
                            <Button
                              onClick={() => deleteQuestion(index)}
                              variant="danger"
                            >
                              Delete
                            </Button>
                          </div>
                          <div className="edit_form_create_add_del_btn">
                            <Button onClick={createNewQuestion} variant="dark">
                              Create
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {question.length ? (
                  <div className="edit_form_submit_send_btns">
                    <div className="edit_form_submit_send_btn">
                      <Button onClick={() => navigate("/form")} variant="dark">
                        Back to forms
                      </Button>
                    </div>

                    <div className="edit_form_submit_send_btn">
                      <Button
                        onClick={sendLinkButtonPressed}
                        variant="light"
                        type="button"
                      >
                        Send link
                      </Button>

                      <Button variant="dark" type="submit">
                        Save form
                      </Button>
                    </div>
                    {isVisible && (
                      <SendLink_Modal
                        formId={formId}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                      />
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </form>
          </section>
        </>
      )}
    </>
  );
};

export default Edit_Form;
