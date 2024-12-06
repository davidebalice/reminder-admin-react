import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/UserContext";
import isAllowed from "../../middlewares/allow";
import Breadcrumb from "../../components/breadcrumb/index";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import Loading from "../../components/loading";
import DetailModal from "../../components/Modal/DetailModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faEnvelope,
  faCirclePlus,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

const Reminders = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [client, setClient] = useState([]);
  const [reload, setReload] = useState(1);
  const token = localStorage.getItem("authToken");
  const { userData, demo } = useContext(Context);
  const [modalData, setModalData] = useState({
    show: false,
    text: "",
    text2: "",
  });

  const openDetailModal = (text,text2) => {
    setModalData({ show: true, text,text2 });
  };

  const closeDetailModal = () => {
    setModalData(false, null, null);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/reminders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setLoading(false);
        setData(response.data.reminders);
        setClient(response.data.client);
      })
      .catch((error) => {
        console.error("Error during api call:", error);
      });
  }, [token, reload]);

  const title = "Reminders";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];

  function deleteReminder(id) {
    Swal.fire({
      title: "Confirm delete?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (demo) {
          Swal.fire({
            title: "Demo mode",
            text: "Crud operations are not allowed",
            icon: "error",
            cancelButtonText: "Close",
          });
        } else {
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_URL}/api/reminder/delete/${id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then((response) => {
              if (response.data.status === "success") {
                setReload((prevCount) => prevCount + 1);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    });
  }

  return (
    <>
      <DetailModal
        show={modalData.show}
        closeDetailModal={closeDetailModal}
        modalData={modalData}
      />
      <div className="page">
        <Breadcrumb title={title} brad={brad} />
        {loading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            <div className="row">
              <div className="col-12">
                <div className="card pageContainer">
                  <div className="card-body">
                    <Link to={`/reminder/add/`}>
                      <div className="addButton col-sm-4 col-md-4 col-lg-3">
                        <FontAwesomeIcon
                          icon={faCirclePlus}
                          className="addButtonIcon"
                        />
                        <div className="card-body d-flex px-1">
                          Add reminder
                        </div>
                      </div>
                    </Link>
                    <Table className="tableRow" bordered hover>
                      <thead>
                        <tr>
                          <th>Deadline</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Category</th>
                          <th>Last email send</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.length === 0 && (
                          <p className="my-5">Reminder not found</p>
                        )}
                        {data.map((item) => {
                          return (
                            <tr>
                              <td>
                                <b>{item.formattedDeadline}</b>
                              </td>
                              <td>{item._doc.title}</td>
                              <td>
                                {item._doc.completed ? "Completed" : "Open"}
                              </td>
                              <td>{item._doc.category_id.name}</td>
                              <td>{item.formattedLastEmailSend}</td>
                              <td
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Link>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip className="tooltip">
                                        {" "}
                                        Detail of reminder
                                      </Tooltip>
                                    }
                                  >
                                    <button
                                      className=" btn btn-primary btn-sm ms-1 btnTask"
                                      onClick={() =>
                                        openDetailModal(
                                          item._doc.title,
                                          item._doc.description
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faListCheck}
                                        className="taskIcon taskIcon3"
                                      />
                                      Detail of Reminder
                                    </button>
                                  </OverlayTrigger>
                                </Link>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  {isAllowed(
                                    userData.role,
                                    userData._id,
                                    item._doc.members,
                                    item._doc.owner
                                  ) ? (
                                    <Link
                                      to={`/reminder/edit/${item._doc._id}`}
                                    >
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip className="tooltip">
                                            Edit
                                          </Tooltip>
                                        }
                                      >
                                        <button
                                          onClick={() => null}
                                          className="btn btn-primary btn-sm ms-1 taskButton"
                                        >
                                          <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            className="taskIcon"
                                          />
                                        </button>
                                      </OverlayTrigger>
                                    </Link>
                                  ) : (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip className="tooltip">
                                          Edit not allowed
                                        </Tooltip>
                                      }
                                    >
                                      <button
                                        onClick={() => null}
                                        className="btn btn-primary btn-sm ms-1 taskButton taskButtonDisabled"
                                      >
                                        <FontAwesomeIcon
                                          icon={faPenToSquare}
                                          className="taskIcon"
                                        />
                                      </button>
                                    </OverlayTrigger>
                                  )}

                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip className="tooltip">
                                        Send email to client
                                      </Tooltip>
                                    }
                                  >
                                    <button
                                      onClick={() => openDetailModal()}
                                      className="btn btn-primary btn-sm ms-1 taskButton"
                                    >
                                      <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="taskIcon"
                                      />
                                    </button>
                                  </OverlayTrigger>

                                  {isAllowed(
                                    userData.role,
                                    userData._id,
                                    item.members,
                                    item.owner
                                  ) ? (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip className="tooltip">
                                          Delete reminder
                                        </Tooltip>
                                      }
                                    >
                                      <button
                                        onClick={() =>
                                          deleteReminder(item._doc._id)
                                        }
                                        className="btn btn-danger btn-sm ms-1 taskButton"
                                      >
                                        {" "}
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="taskIcon taskIcon2"
                                        />
                                      </button>
                                    </OverlayTrigger>
                                  ) : (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip className="tooltip">
                                          Delete reminder not allowed
                                        </Tooltip>
                                      }
                                    >
                                      <button className="btn btn-danger btn-sm ms-1 taskButton taskButtonDisabled">
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="taskIcon taskIcon2"
                                        />
                                      </button>
                                    </OverlayTrigger>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Reminders;
