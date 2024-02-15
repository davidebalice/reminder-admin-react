import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../loading";
import moment from "moment";
import isAllowed from "../../../middlewares/allow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faListCheck,
  faCircleXmark,
  faTrash,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Members = ({
  members,
  handleStatus,
  taskId,
  projectId,
  onUpdateMembers,
  task,
}) => {
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const { userData, demo } = useContext(Context);
  const [data, setData] = useState({
    name: "",
    owner: "",
    task_id: taskId,
    project_id: projectId,
    members: [],
    users: [],
  });

  console.log("members aaaaa");
  console.log(members);

  useEffect(() => {
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + `/api/task/members/${taskId}`,
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
        console.log("response.data.users");
        console.log(response.data.users);
        console.log("response.data.members");
        console.log(response.data.members);
        setLoading(false);
        setData({
          ...data,
          task_id: taskId,
          project_id: projectId,
          members: response.data.members,
          users: response.data.users,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [taskId, projectId]);

  const handleUpdateMembers = (newMembers) => {
    onUpdateMembers(newMembers);
  };

  const addToTask = (member_id) => {
    if (demo) {
      Swal.fire({
        title: "Demo mode",
        text: "Crud operations are not allowed",
        icon: "error",
        cancelButtonText: "Close",
      });
    } else {
      console.log(member_id);
      console.log(taskId);
      axios
        .post(
          process.env.REACT_APP_API_BASE_URL + "/api/add/member/task",
          { member_id, task_id: taskId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          setData({
            ...data,
            task_id: taskId,
            project_id: projectId,
            members: response.data.members,
            users: response.data.users,
          });
          handleUpdateMembers(response.data.members);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const removeToTask = (member_id) => {
    if (demo) {
      Swal.fire({
        title: "Demo mode",
        text: "Crud operations are not allowed",
        icon: "error",
        cancelButtonText: "Close",
      });
    } else {
      console.log(member_id);
      axios
        .post(
          process.env.REACT_APP_API_BASE_URL + "/api/remove/member/task",
          { member_id, task_id: taskId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          setData({
            ...data,
            task_id: taskId,
            project_id: projectId,
            members: response.data.members,
            users: response.data.users,
          });
          handleUpdateMembers(response.data.members);
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
          <div className="card pageContainer">
            <div className="card-body">
              <div className="row justify-content-center">
                <div className="col-md-6 mt-3">
                  <label for="name">
                    <b>Active members</b>
                  </label>
                  <br />
                  {Array.isArray(data.members) && data.members.length > 0 ? (
                    data.members.map((member) => (
                      <div key={member._id} className="membersRow">
                        {userData &&
                        isAllowed(
                          userData.role,
                          userData._id,
                          task.members,
                          task.owner._id
                        ) ? (
                          <div
                            onClick={() => removeToTask(member._id)}
                            className="membersButtonDelete"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="membersButtonDeleteIcon"
                            />
                          </div>
                        ) : (
                          <div className="membersButtonDelete disabledBg">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="membersButtonDeleteIcon"
                            />
                          </div>
                        )}

                        <div className="imgThumbContainer">
                          <img
                            src={`${
                              process.env.REACT_APP_API_BASE_URL
                            }/api/user/img/${member.photo && member.photo}`}
                            class="imgThumb"
                            alt=""
                          />
                          <span className="text-primary bold">
                            {member.name} {member.surname}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No members</div>
                  )}
                </div>
                <div className="col-md-6 mt-3">
                  <label for="brand">
                    <b>Add members to task</b>
                  </label>
                  <br />
                  {Array.isArray(data.users) && data.users.length > 0 ? (
                    data.users.map((user) => (
                      <div key={user._id} className="membersRow">
                        {userData &&
                        isAllowed(
                          userData.role,
                          userData._id,
                          task.members,
                          task.owner._id
                        ) ? (
                          <div
                            onClick={() => addToTask(user._id)}
                            className="membersButtonAdd"
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="membersButtonAddIcon"
                            />
                          </div>
                        ) : (
                          <div className="membersButtonAdd disabledBg">
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="membersButtonAddIcon"
                            />
                          </div>
                        )}

                        <div className="imgThumbContainer">
                          <img
                            src={`${
                              process.env.REACT_APP_API_BASE_URL
                            }/api/user/img/${user.photo && user.photo}`}
                            class="imgThumb"
                            alt=""
                          />
                          <span className="text-primary bold">
                            {user.name} {user.surname}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No users</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Members;

/*

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import { useNavigate, useParams } from "react-router-dom";
import ButtonGroup from "../../components/Projects/ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const Members = () => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const title = "Project members";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const [responseData, setResponseData] = useState(null);
  const [data, setData] = useState({ members: [], users: [] });
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    client: "",
    summary: "",
    description: "",
    owner: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loadMembers = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/project/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        const members = response.data.project.members;
        const users = response.data.users;
        console.log("members");
        console.log(members);
        console.log("users");
        console.log(users);

        const data = {
          members: members,
          users: users,
        };

        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);

        Swal.fire("Error", error, "error");
      });
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const addToProject = (member_id) => {
    console.log(member_id);
    console.log(id);
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + "/api/add/member/project",
        { member_id, project_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        loadMembers();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removeToProject = (member_id) => {
    console.log(member_id);
    console.log(id);
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + "/api/remove/member/project",
        { member_id, project_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        loadMembers();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="page">
        <Breadcrumb title={title} brad={brad} />
        <ButtonGroup projectId={id} selectedTab="members" />
        
        <div className="card pageContainer">
          <div className="card-body">
            <div className="row justify-content-center">
              <div className="col-md-6 mt-3">
                <label for="name">
                  <b>Active members</b>
                </label>
                <br />
                {Array.isArray(data.members) && data.members.length > 0 ? (
                  data.members.map((member) => (
                    <div key={member._id} className="membersRow">
                      <div
                        onClick={() => removeToProject(member._id)}
                        className="membersButtonDelete"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="membersButtonDeleteIcon"
                        />
                      </div>
                      <div className="imgThumbContainer">
                        <img
                          src={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/user/img/${member.photo && member.photo}`}
                          class="imgThumb"
                          alt=""
                        />
                        <span className="text-primary bold">
                          {member.name} {member.surname}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No members</div>
                )}
              </div>
              <div className="col-md-6 mt-3">
                <label for="brand">
                  <b>Add members to project</b>
                </label>
                <br />
                {Array.isArray(data.users) && data.users.length > 0 ? (
                  data.users.map((user) => (
                    <div key={user._id} className="membersRow">
                      <div
                        onClick={() => addToProject(user._id)}
                        className="membersButtonAdd"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="membersButtonAddIcon"
                        />
                      </div>
                      <div className="imgThumbContainer">
                        <img
                          src={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/user/img/${user.photo && user.photo}`}
                          class="imgThumb"
                          alt=""
                        />
                        <span className="text-primary bold">
                          {user.name} {user.surname}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No users</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Members;


*/
