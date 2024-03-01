import { Modal, Button } from "react-bootstrap";

const DetailModal = ({ show, modalData, closeDetailModal }) => {
  return (
    <>
      <Modal show={show} className="photoModal" size="lg" centered>
        <Modal.Header className="photoModalHeader">
          <Modal.Title style={{ fontSize: "14px" }}></Modal.Title>
          <Button variant="secondary" onClick={closeDetailModal}>
            Close
          </Button>
        </Modal.Header>
        <Modal.Body className="photoModalBody">
          <b>{modalData.text}</b>
          <br />
          {modalData.text2}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailModal;
