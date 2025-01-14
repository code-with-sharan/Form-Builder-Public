import React, { useContext, useEffect, useState } from "react";
import "./Form_Page.css";
import Button from "react-bootstrap/esm/Button";
import { StoreContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Form_Page = () => {
  const navigate = useNavigate();
  const { BackendURL } = useContext(StoreContext);

  const [titleDescription, setTitleDescription] = useState([]);

  const createNewFormInstance = async () => {
    let newUrl = BackendURL; // backend url
    newUrl += "/api/form/createNew";
    const token = localStorage.getItem("token");

    const response = await axios.post(newUrl, {}, { headers: { Authorization: `Bearer ${token}` } });
    if (response.data.success) {
      navigate(`/form/${response.data.data}/edit`);
    } else {
      toast.error(response.data.message)
    }
  };

  useEffect(() => {
    const getFormTitleDescription = async () => {
      let newUrl = BackendURL; 
      newUrl += "/api/form/getAllFormsData";
      const token = localStorage.getItem("token");

      const response = await axios.post(newUrl, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setTitleDescription(response.data.data);
      } else if (response.data.message === "No forms found"){
        setTitleDescription([]);
      } else {
        toast.error(response.data.message)
      }
    };

    getFormTitleDescription();
  }, []);

  const deleteForm = async (formId) => {
    let newUrl = BackendURL; // backend url
    newUrl += "/api/form/deleteForm";

    const response = await axios.post(newUrl, { formId });
    if (response.data.success) {
      // Update the local state to remove the deleted form
      setTitleDescription((prevForms) =>
        prevForms.filter((form) => form.formId !== formId)
      );

      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)
    }
  };

  return (
    <>
      {/* Create a tab to create a Blank form */}
      <div className="form_page_container">
        <div className="blankForm_div">
          <div className="blankForm_div_heading_para">
            <h1>Form Builder</h1>
            <p>Create and manage your forms with ease.</p>
          </div>
          <div className="blankForm_div_btn">
            <Button onClick={() => navigate("/")} variant="light">
              Back to Home
            </Button>
            <Button
              onClick={() => createNewFormInstance()}
              className="btn-dark"
            >
              Create New Blank Form
            </Button>
          </div>
        </div>

        <h2 className="your_forms">Your forms:</h2>
        <div className="recent_forms_outer_div">
          <div className="recent_forms">
            {titleDescription.length > 0 ? (
              titleDescription.map((form) => (
                <>
                  <div className="recent_forms_form">
                    <div className="recent_forms_form_heading_para">
                      <h3 style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical"
                      }}>
                        {form.title ? form.title : "Untitled form"}
                      </h3>
                      <p style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}>
                        {form.description
                          ? form.description
                          : "No description provided"}
                      </p>
                    </div>
                    <div className="allForms_edit_del_btns">
                      <Button
                        onClick={() => deleteForm(form.formId)}
                        variant="danger"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => navigate(`/form/${form.formId}/edit`)}
                        variant="dark"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <p>No forms available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Form_Page;
