import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import Spacer from "../../components/spacer/index";
import isAllowed from "../../middlewares/allow";
import NotPermission from "../Auth/notPermission";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";

const getCurrentDate = () => {
  const currentDate = new Date();
  return currentDate.toISOString().split("T")[0];
};

const EditReminder = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { userData, demo } = useContext(Context);
  const title = "Edit reminder";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const { id } = useParams();
  const [responseData, setResponseData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    completed: "",
    description: "",
    deadline: getCurrentDate(),
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/reminder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setFormData({
          ...response.data.reminder[0],
        });
        setCategoriesData(response.data.categories);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire("Error", error, "error");
      });
  }, []);

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
          `${process.env.REACT_APP_API_BASE_URL}/api/update/reminder/${id}`,
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
          console.log("response.data");
          console.log(response.data);
          setResponseData(response.data.message);

          Swal.fire({
            title: "Taks updated",
            text: "",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Back to reminders",
            cancelButtonText: "Close",
          }).then((result) => {
            if (result.isConfirmed) {
              if (response.data.status === "success") {
                navigate(`/reminders/`);
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      {userData &&
      formData &&
      isAllowed(
        userData.role,
        userData._id,
        formData.members,
        formData.owner
      ) ? (
        <div className="page">
          <Breadcrumb title={title} brad={brad} />
          <div class="row">
            <Link to={`/reminders/`}>
              <div class="backButton col-sm-4 col-md-4 col-lg-3">
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="backButtonIcon"
                />
                <div class="card-body d-flex px-1">Back</div>
              </div>
            </Link>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="row justify-content-start formContainer">
                <div className="col-md-6 mt-3">
                  <label for="name">
                    <b>Name of reminder</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInput}
                  />
                </div>
                <div className="col-md-6 mt-3">
                  <label for="status">
                    <b>Status</b>
                  </label>
                  <select
                    className="form-control"
                    name="completed"
                    value={formData.completed}
                    required
                    onChange={handleInput}
                  >
                    <option
                      value={true}
                      defaultValue={formData.completed === true}
                    >
                      Completed
                    </option>
                    <option
                      value={false}
                      defaultValue={formData.completed === false}
                    >
                      Open
                    </option>
                  </select>
                </div>
                <div className="col-md-6 mt-3">
                  <label for="label">
                    <b>Category</b>
                  </label>
                  <select
                    className="form-control"
                    name="category_id"
                    value={formData.category_id._id}
                    required
                    onChange={handleInput}
                  >
                    <option value=""> - Select category - </option>
                    {categoriesData &&
                      categoriesData.map((category) => (
                        <option
                          value={category._id}
                          key={category._id}
                          selected={category._id === formData.category_id._id}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-6 mt-3">
                  <label for="deadline">
                    <b>Deadline date</b>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    required
                    value={formatDate(formData.deadline)}
                    onChange={handleInput}
                  />
                </div>

                <div className="col-md-6 mt-3"></div>

                <Spacer height={20} />

                <div className="col-md-12">
                  <label for="brand">
                    <b>Description</b>
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInput}
                  ></textarea>
                </div>
              </div>

              <button
                onClick={submitForm}
                className="btn btn-sm saveButton mt-3"
              >
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  className="saveButtonIcon"
                />{" "}
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <NotPermission />
      )}
    </>
  );
};

export default EditReminder;
