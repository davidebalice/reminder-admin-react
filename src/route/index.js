import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/Auth/login";
import Register from "../pages/Auth/register";
import ForgotPassword from "../pages/Auth/forgotPassword";
import Reminders from "../pages/reminders/Reminders";
import Reminder from "../pages/reminders/Reminder";
import AddReminder from "../pages/reminders/AddReminder";
import EditReminder from "../pages/reminders/EditReminder";
import Categories from "../pages/categories/Categories";
import Category from "../pages/categories/Category";
import AddCategory from "../pages/categories/AddCategory";
import EditCategory from "../pages/categories/EditCategory";
import Users from "../pages/users/Users";
import AddUser from "../pages/users/AddUser";
import EditUser from "../pages/users/EditUser";
import PhotoUser from "../pages/users/PhotoUser";
import Profile from "../pages/profile/Profile";

export function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reminders" element={<Reminders />} />
        <Route path="/reminder/:id" element={<Reminder />} />
        <Route path="/reminder/add/" element={<AddReminder />} />
        <Route path="/reminder/edit/:id" element={<EditReminder />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/category/add/" element={<AddCategory />} />
        <Route path="/category/edit/:id" element={<EditCategory />} />

        <Route path="/users" element={<Users />} />
        <Route path="/add/user/" element={<AddUser />} />
        <Route path="/edit/user/:id" element={<EditUser />} />
        <Route path="/photo/user/:id" element={<PhotoUser />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
