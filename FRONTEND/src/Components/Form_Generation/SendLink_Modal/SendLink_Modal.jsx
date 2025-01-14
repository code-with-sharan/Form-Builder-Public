import React, { useContext } from "react";
import "./SendLink_Modal.css";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { StoreContext } from "../../../Context/Context";

const SendLink_Modal = ({ formId, isVisible, setIsVisible }) => {
    const { FrontendURL } = useContext(StoreContext);
    let responseUrl= `${FrontendURL}/form/${formId}/response`
    const handleCopyOnClick = () => {
        navigator.clipboard.writeText(responseUrl)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    }
  return (
    <>
      <Modal
        show={true}
        onHide={() => setIsVisible(!isVisible)}
        size="md"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="modal_header" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Send Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="heading_input">
            <h5>Link</h5>
            <input
              type="text"
              value={responseUrl}
              onClick={(e)=> e.target.select()}
              readOnly
            />
          </div>
          <div className="cancel_copy_btns">
            <Button variant="dark" onClick={handleCopyOnClick}>Copy</Button>
            <Button variant="light" onClick={() => setIsVisible(!isVisible)}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SendLink_Modal;
