import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import EditModal from "../../Modal/EditModal";
import Table from "react-bootstrap/Table";
import Loading from "../../loading";
import isAllowed from "../../../middlewares/allow";
import moment from "moment";
import Divider from "../../divider";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faListCheck,
  faCircleXmark,
  faTrash,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Activities = ({
  activities,
  handleStatus,
  taskId,
  projectId,
  onUpdateActivities,
  updateActivities,
  task,
}) => {
  const token = localStorage.getItem("authToken");
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ show: false, text: "", id: "" });
  const { userData, demo } = useContext(Context);
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    task_id: taskId,
    project_id: projectId,
  });

  useEffect(() => {
    setFormData({
      ...formData,
      task_id: taskId,
      project_id: projectId,
    });
    setLoading(false);
  }, [taskId, projectId]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateActivities = (newActivities) => {
    onUpdateActivities(newActivities);
  };

  const handleNotPermission = (e) => {
    Swal.fire({
      title: "User not allowed",
      text: "",
      icon: "warning",
    });
  };

  const openEditModal = (text, id) => {
    setEditData({ show: true, text, id });
  };

  const closeEditModal = () => {
    setEditData(false, null, null);
  };

  const removeActivity = (id) => {
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
              process.env.REACT_APP_API_BASE_URL + "/api/delete/activity/",
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
              console.log("response.data.activities");
              console.log(response.data.activities);
              handleUpdateActivities(response.data.activities);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log('demo2');
    console.log(typeof demo);
    console.log(demo);
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
          process.env.REACT_APP_API_BASE_URL + "/api/add/activity/",
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
          console.log("response.data.activities");
          console.log(response.data.activities);

          setFormData({
            ...formData,
            name: "",
          });
          setAdd(false);
          handleUpdateActivities(response.data.activities);
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
          <EditModal
            show={editData.show}
            closeEditModal={closeEditModal}
            editData={editData}
            updateUrl="/api/update/activity"
            onUpdateActivities={handleUpdateActivities}
            type="activities"
          />
          <div>
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
                  {add ? "Close" : "Add activity"}
                </div>
              </div>
            ) : (
              <div className="addButton col-sm-4 col-md-4 col-lg-3 disabledBg">
                <FontAwesomeIcon
                  icon={add ? faCircleXmark : faCirclePlus}
                  className="addButtonIcon "
                />
                <div className="card-body d-flex px-1">
                  {add ? "Close" : "Add activity"}
                </div>
              </div>
            )}

            {add && (
              <form>
                <label for="name">
                  <b>Add activity to task</b>
                </label>

                <textarea
                  type="text"
                  className="form-control"
                  name="name"
                  required
                  value={formData && formData.name}
                  onChange={handleInput}
                ></textarea>
                <button
                  onClick={submitForm}
                  className="btn addButtonSm btn-sm mt-3"
                >
                  <FontAwesomeIcon icon={faPlus} className="addButtonIconSm" />
                  Add activity
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
          </div>

          <Table className="tableRow" hover bordered>
            <thead>
              <tr>
                <th className="text-center">Complete</th>
                <th style={{ width: "60%" }}>Activity</th>
                <th>Creation</th>
                <th>Update</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {activities &&
              Array.isArray(activities) &&
              activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity._id}>
                    <td className="text-center">
                      {userData &&
                      formData &&
                      isAllowed(
                        userData.role,
                        userData._id,
                        task.members,
                        task.owner._id
                      ) ? (
                        <input
                          type="checkbox"
                          checked={activity.status === "Done"}
                          onChange={(event) =>
                            handleStatus(event, activity._id)
                          }
                          className="activityCheckbox"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={activity.status === "Done"}
                          className="activityCheckbox"
                          readonly
                          onChange={(event) => handleNotPermission(event)}
                        />
                      )}
                    </td>

                    <td className="cell">
                      <p
                        className={
                          activity.status === "Done"
                            ? "activityName cutText"
                            : "activityName"
                        }
                      >
                        {activity && activity.name}
                      </p>
                    </td>

                    <td>
                      <i>
                        {activity.createdAt !== null &&
                          moment(activity.createdAt).format("DD/MM/YYYY")}
                      </i>
                      <br />
                      {activity.owner.name && activity.owner.surname ? (
                        <div className="text-primary bold mt-1">
                          {activity.owner.name} {activity.owner.surname}
                        </div>
                      ) : null}
                      <div className="header_img mt-2">
                        <img
                          src={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/user/img/${activity && activity.owner.photo}`}
                          class="userImg"
                          alt=""
                        />
                      </div>
                    </td>

                    <td>
                      <i>
                        {activity.lastUpdate !== null &&
                          moment(activity.lastUpdate).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                      </i>
                      <br />
                      {activity.lastUpdateUser &&
                      activity.lastUpdateUser.name &&
                      activity.lastUpdateUser.surname ? (
                        <div className="text-primary bold mt-1">
                          {activity.lastUpdateUser.name}{" "}
                          {activity.lastUpdateUser.surname}
                        </div>
                      ) : null}
                      <div className="header_img mt-2">
                        <img
                          src={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/user/img/${
                            activity && activity.lastUpdateUser.photo
                          }`}
                          class="userImg"
                          alt=""
                        />
                      </div>
                    </td>

                    <td>
                      <div className="activityButton">
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
                                Edit activity
                              </Tooltip>
                            }
                          >
                            <div
                              onClick={() =>
                                openEditModal(activity.name, activity._id)
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
                                Edit activity is not allowed
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
                                Delete activity
                              </Tooltip>
                            }
                          >
                            <div onClick={() => removeActivity(activity._id)}>
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
                                Delete activity is not allowed
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
                    No activities
                    <br />
                    <br />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default Activities;
