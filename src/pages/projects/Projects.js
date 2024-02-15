import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../../context/UserContext";
import isAllowed from "../../middlewares/allow";
import Breadcrumb from "../../components/breadcrumb";
import Loading from "../../components/loading";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faListCheck,
  faNoteSticky,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("authToken");
  const { userData, demo } = useContext(Context);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setData(response.data.projects);
        setLoading(false);
        console.log(response.data.projects);
      })
      .catch((error) => {
        console.error("Error during api call:", error);
      });
  }, [token]);

  const title = "Projects";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  return (
    <>
      <div className="page">
        <Breadcrumb title={title} brad={brad} />

        {loading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            <div className="row">
              <Link to={`/add/project/`}>
                <div className="addButton col-sm-4 col-md-4 col-lg-3">
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className="addButtonIcon"
                  />
                  <div className="card-body d-flex px-1">Add project</div>
                </div>
              </Link>
            </div>

            <div className="row">
              {data.map((data, i) => (
                <div
                  className="col-sm-4 col-md-4 col-lg-4 col-xl-3 "
                  key={`project${i}`}
                >
                  <div className="porjectCard">
                    <div>
                      <div
                        className="projectCardCover"
                        style={{
                          backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/project/cover/${data.imageCover}`,
                        }}
                      ></div>

                      <div className="projectMembersContainer">
                        <Link to={`/project/members/${data._id}`}>
                          <p className="projectCardButtonTitle text-black">
                            Created by
                          </p>
                          {data.owner.slice(0, 3).map((owner, i) => (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip className="tooltip">
                                  {`${owner.name} ${owner.surname}`}
                                </Tooltip>
                              }
                            >
                              <img
                                src={`${
                                  process.env.REACT_APP_API_BASE_URL
                                }/api/user/img/${owner && owner.photo}`}
                                class="projectUserImg"
                                alt=""
                              />
                            </OverlayTrigger>
                          ))}
                        </Link>

                        <Link to={`/project/members/${data._id}`}>
                          <p className="projectCardButtonTitle text-black">
                            Members: {data.members.length}
                          </p>
                          <div>
                            {data.members
                              .filter((member) => member._id !== data.owner._id)
                              .slice(0, 3)
                              .map((member, i) => (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip className="tooltip">
                                      {`${member.name} ${member.surname}`}
                                    </Tooltip>
                                  }
                                >
                                  <img
                                    src={`${
                                      process.env.REACT_APP_API_BASE_URL
                                    }/api/user/img/${member && member.photo}`}
                                    className={`projectUserImg ${
                                      i === 0 ? "" : "projectUserImg2"
                                    }`}
                                    style={{
                                      zIndex:
                                        i === 1 ? "4" : i === 2 ? "3" : "",
                                    }}
                                    alt=""
                                  ></img>
                                </OverlayTrigger>
                              ))}
                          </div>
                        </Link>
                      </div>

                      <div className="projectCardTitle">
                        <p>{data.name}</p>
                        <div className="projectCardLastUpdate">
                          last update
                          <br />
                          <b>{data.lastUpdate}</b>
                        </div>
                      </div>
                    </div>

                    <div className="projectCardButtonContainer">
                      <Link to={`/project/${data._id}`}>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip className="tooltip">
                              Details of project
                            </Tooltip>
                          }
                        >
                          <button className="btn btn-primary btn-sm projectCardButton">
                            <FontAwesomeIcon
                              icon={faNoteSticky}
                              className="projectCardIcon"
                            />
                            <p className="projectCardButtonTitle">Detail</p>
                          </button>
                        </OverlayTrigger>
                      </Link>
                      {isAllowed(
                        userData.role,
                        userData._id,
                        data.members,
                        data.owner._id
                      ) ? (
                        <Link to={`/edit/project/${data._id}`}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                Edit project
                              </Tooltip>
                            }
                          >
                            <button className="btn btn-primary btn-sm projectCardButton">
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="projectCardIcon"
                              />
                              <p className="projectCardButtonTitle">Edit</p>
                            </button>
                          </OverlayTrigger>
                        </Link>
                      ) : (
                        <Link to={null}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                Edit project not allowed
                              </Tooltip>
                            }
                          >
                            <button className="btn btn-primary btn-sm projectCardButton ">
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="projectCardIcon disabledColor"
                              />
                              <p className="projectCardButtonTitle disabledColor">
                                Edit
                              </p>
                            </button>
                          </OverlayTrigger>
                        </Link>
                      )}
                      <Link to={`/project/tasks/${data._id}`}>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip className="tooltip">Tasks</Tooltip>}
                        >
                          <button className="btn btn-primary btn-sm projectCardButton">
                            <div className="text-black">
                              <FontAwesomeIcon
                                icon={faListCheck}
                                className="projectCardIcon"
                              />{" "}
                              ( <b className="text-primary">{data.numTasks}</b>{" "}
                              )
                            </div>

                            <p className="projectCardButtonTitle">Tasks</p>
                          </button>
                        </OverlayTrigger>
                      </Link>
                      {isAllowed(
                        userData.role,
                        userData._id,
                        data.members,
                        data.owner._id
                      ) ? (
                        <Link to={`/project/delete/${data._id}`}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                Delete project
                              </Tooltip>
                            }
                          >
                            <button className="btn btn-primary btn-sm projectCardButton bg-red">
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="projectCardIcon"
                              />
                              <p className="projectCardButtonTitle">Delete</p>
                            </button>
                          </OverlayTrigger>
                        </Link>
                      ) : (
                        <Link to={null}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className="tooltip">
                                Delete project not allowed
                              </Tooltip>
                            }
                          >
                            <button className="btn btn-primary btn-sm projectCardButton bg-red">
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="projectCardIcon disabledColor"
                              />
                              <p className="projectCardButtonTitle disabledColor">Delete</p>
                            </button>
                          </OverlayTrigger>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Projects;
