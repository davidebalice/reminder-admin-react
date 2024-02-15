import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import { useNavigate, useParams } from "react-router-dom";
import ButtonGroup from "../../components/Projects/ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../context/UserContext";

const Members = () => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const title = "Project members";
  const { userData, demo } = useContext(Context);
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
    if (demo) {
      Swal.fire({
        title: "Demo mode",
        text: "Crud operations are not allowed",
        icon: "error",
        cancelButtonText: "Close",
      });
    } else {
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
          //loadMembers();
          const data = {
            members: response.data.members,
            users: response.data.users,
          };
          setData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const removeToProject = (member_id) => {
    if (demo) {
      Swal.fire({
        title: "Demo mode",
        text: "Crud operations are not allowed",
        icon: "error",
        cancelButtonText: "Close",
      });
    } else {
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
          //loadMembers();
          const data = {
            members: response.data.members,
            users: response.data.users,
          };
          setData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
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
