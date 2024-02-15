import { useState, useContext, useEffect } from "react";
import { Context } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import Spacer from "../../components/spacer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const AddReminder = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { userData, demo } = useContext(Context);
  const title = "Add reminder";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const { id } = useParams();
  const [categoriesData, setCategoriesData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    category_id: "",
    description: "",
    deadline: "",
    user_id: "",
  });

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/api/add/reminder", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setCategoriesData(response.data.categories);
        console.log(response.data.categories);
      })
      .catch((error) => {
        console.error("Error during api call:", error);
      });
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
          process.env.REACT_APP_API_BASE_URL + "/api/add/reminder",
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

          if (response.data.message === "success") {
            navigate(`/reminders/`);
          }
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
        <div className="card pageContainer">
          <div className="card-body formContainer">
            <Link to={`/reminders/`}>
              <div class="backButton col-sm-4 col-md-4 col-lg-3">
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="backButtonIcon"
                />
                Back
              </div>
            </Link>
            <div className="row justify-content-center">
              <div className="col-md-6 mt-3">
                <label for="name">
                  <b>Name of reminder</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  required
                  value={formData.name}
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
                  value={formData.status}
                  required
                  onChange={handleInput}
                >
                  <option value="false">Completed</option>
                  <option value="true">Open</option>
                </select>
              </div>

              <div className="col-md-6 mt-3">
                <label for="label">
                  <b>Category</b>
                </label>
                <select
                  className="form-control"
                  name="category_id"
                  value={formData.label}
                  required
                  onChange={handleInput}
                >
                  <option value=""> - Select category - </option>
                  {categoriesData &&
                    categoriesData.map((category) => (
                      <option value={category._id} key={category._id}>
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
                  value={formData.deadline}
                  onChange={handleInput}
                />
              </div>

              <div className="col-md-6 mt-3"></div>

              <Spacer height={30} />

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
              className="btn btn-primary btn-sm addButtonSm mt-5"
            >
              <FontAwesomeIcon icon={faCirclePlus} className="addButtonIcon" />
              Add reminder
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReminder;
