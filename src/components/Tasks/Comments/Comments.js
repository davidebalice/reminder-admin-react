import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import EditModal from "../../../components/Modal/EditModal";
import Loading from "../../../components/loading";
import Table from "react-bootstrap/Table";
import Divider from "../../divider/";
import isAllowed from "../../../middlewares/allow";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleXmark,
  faCalendar,
  faTrash,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Comments = ({
  comments,
  taskId,
  projectId,
  onUpdateComments,
  updateComments,
  task,
}) => {
  const token = localStorage.getItem("authToken");
  const [add, setAdd] = useState(false);
  const { userData, demo } = useContext(Context);
  const [editData, setEditData] = useState({ show: false, text: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    comment: "",
    owner: "",
    task_id: taskId,
    project_id: projectId,
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      task_id: taskId,
      project_id: projectId,
    });
    setLoading(false);
  }, [taskId, projectId]);

  function handleUpdateComments(newComments) {
    onUpdateComments(newComments);
  }

  function removeComment(id) {
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
              process.env.REACT_APP_API_BASE_URL + "/api/delete/comment/",
              { id: id, task_id: taskId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then((response) => {
              console.log("response.data.comments");
              console.log(response.data.comments);

              handleUpdateComments(response.data.comments);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    });
  }

  const openEditModal = (text, id) => {
    setEditData({ show: true, text, id });
  };

  const closeEditModal = () => {
    setEditData(false, null, null);
  };

  const submitForm = (e) => {
    e.preventDefault();
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
          process.env.REACT_APP_API_BASE_URL + "/api/add/comment/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          console.log("response.data.comments");
          console.log(response.data.comments);

          setFormData({
            ...formData,
            comment: "",
          });

          handleUpdateComments(response.data.comments);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {userData &&
          formData &&
          isAllowed(
            userData.role,
            userData._id,
            task.members,
            task.owner._id
          ) ? (
            <div
              className="addButton col-sm-4 col-md-4 col-lg-3"
              onClick={() => setAdd(!add)}
            >
              <FontAwesomeIcon
                icon={add ? faCircleXmark : faCirclePlus}
                className="addButtonIcon"
              />
              <div className="card-body d-flex px-1">
                {add ? "Close" : "Add comment"}
              </div>
            </div>
          ) : (
            <div className="addButton col-sm-4 col-md-4 col-lg-3 disabledBg">
              <FontAwesomeIcon
                icon={add ? faCircleXmark : faCirclePlus}
                className="addButtonIcon"
              />
              <div className="card-body d-flex px-1">
                {add ? "Close" : "Add comment"}
              </div>
            </div>
          )}

          {add && (
            <form>
              <label for="name">
                <b>Add comment to task</b>
              </label>

              <textarea
                type="text"
                className="form-control"
                name="comment"
                required
                value={formData.comment}
                onChange={handleInput}
              ></textarea>
              <button
                onClick={submitForm}
                className="btn addButtonSm btn-sm mt-3"
              >
                <FontAwesomeIcon icon={faPlus} className="addButtonIconSm" />
                Add comment
              </button>
              <Divider
                className="divider"
                marginTop={60}
                marginBottom={60}
                borderSize={1}
                borderType={"solid"}
                borderColor={"#ddd"}
              >
                {" "}
              </Divider>
            </form>
          )}

          <Table bordered>
            <thead>
              <tr>
                <th style={{ width: "80%" }}>Comment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment) => (
                  <tr key={comment._id}>
                    <td className="commentRow">
                      <div className="commentContainer">
                        <div className="imgThumbContainer">
                          <img
                            src={`${
                              process.env.REACT_APP_API_BASE_URL
                            }/api/user/img/${
                              comment.owner.photo && comment.owner.photo
                            }`}
                            class="imgThumb"
                            alt=""
                          />{" "}
                          <span className="text-primary bold">
                            {comment.owner.name} {comment.owner.surname}
                          </span>
                        </div>

                        <div className="dataContainer">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="text-primary dataIcon"
                          />
                          <span>
                            {moment(comment.createdAt).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </span>
                        </div>
                      </div>

                      <p>{comment.comment}</p>
                    </td>

                    <td>
                      <div className="activityButton">
                        {userData &&
                        formData &&
                        isAllowed(
                          userData.role,
                          userData._id,
                          null,
                          task.owner._id
                        ) ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                {" "}
                                Edit comment
                              </Tooltip>
                            }
                          >
                            <div
                              onClick={() =>
                                openEditModal(comment.comment, comment._id)
                              }
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="activityButtonEdit"
                              />
                            </div>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                {" "}
                                Edit comment not allowed
                              </Tooltip>
                            }
                          >
                            <div>
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="activityButtonEdit disabledColor"
                              />
                            </div>
                          </OverlayTrigger>
                        )}

                        {userData &&
                        formData &&
                        isAllowed(
                          userData.role,
                          userData._id,
                          task.members,
                          task.owner._id
                        ) ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                {" "}
                                Delete comment
                              </Tooltip>
                            }
                          >
                            <div onClick={() => removeComment(comment._id)}>
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="activityButtonDelete"
                              />
                            </div>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                {" "}
                                Delete comment not allowed
                              </Tooltip>
                            }
                          >
                            <div>
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="activityButtonDelete disabledColor"
                              />
                            </div>
                          </OverlayTrigger>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan="7" className="text-center p-5">
                    <br />
                    No comments
                    <br />
                    <br />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <EditModal
            show={editData.show}
            closeEditModal={closeEditModal}
            editData={editData}
            updateUrl="/api/update/comment"
            onUpdateActivities={handleUpdateComments}
            type="comments"
          />
        </>
      )}
    </>
  );
};

export default Comments;
