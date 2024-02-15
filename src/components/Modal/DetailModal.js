import { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { Context } from "../../context/UserContext";

const DetailModal = ({ show, modalData, closeDetailModal }) => {
  const { userData, demo } = useContext(Context);
  return (
    <>
      <Modal show={show} className="photoModal" size="lg" centered>
        <Modal.Header className="photoModalHeader">
          <Modal.Title style={{ fontSize: "14px" }}></Modal.Title>
          <Button variant="secondary" onClick={closeDetailModal}>
            Close
          </Button>
        </Modal.Header>
        <Modal.Body className="photoModalHeader">{modalData.text}</Modal.Body>
      </Modal>
    </>
  );
};

export default DetailModal;
