# Reminder Admin (React)

The admin panel of a reminder app, built with React.
Create reminders with a deadline and get notification emails 30, 15, 7, 3, 2 and 1 day before the expiration date (emails are sent by a Node.js backend with a cron job). Reminders can also be managed from a mobile app.

**Live demo:** <https://reminder-admin.davidebalice.dev>

![Screenshot](https://www.aroundweb.it/screenshot/reminder.jpg)

Related repositories:

- Backend (Node.js API): <https://github.com/davidebalice/node-reminder>
- Mobile app (React Native): <https://github.com/davidebalice/react-native-reminder-app>

## Features

- Login, registration and password recovery (with Google reCAPTCHA)
- Dashboard
- Reminders: list with status (open / completed), add, edit and delete; each reminder has a title, category, deadline and description
- Categories: list, add, edit, delete
- Users: list, add, edit, delete, profile photo and email sending to a user
- User profile
- Demo mode that blocks write operations

## Tech stack

- [React 18](https://react.dev/)
- [Create React App](https://create-react-app.dev/) (`react-scripts`)
- [React Router 6](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/) / [Bootstrap 5](https://getbootstrap.com/)
- [Axios](https://axios-http.com/)
- [React Data Table Component](https://react-data-table-component.netlify.app/)
- [SweetAlert2](https://sweetalert2.github.io/), [React Toastify](https://fkhadra.github.io/react-toastify/), Font Awesome, Boxicons
- [Moment.js](https://momentjs.com/)
- [react-google-recaptcha](https://github.com/dozoisch/react-google-recaptcha)

## Getting started

### Requirements

- Node.js 18 or later
- npm
- A running instance of the [node-reminder](https://github.com/davidebalice/node-reminder) API

### Installation

```bash
git clone https://github.com/davidebalice/reminder-admin-react.git
cd reminder-admin-react
npm install
```

### Configuration

Settings are read from `.env` (development) and `.env.production` (production build):

| Variable                 | Description                         |
| ------------------------ | ----------------------------------- |
| `REACT_APP_API_BASE_URL` | Base URL of the reminder API        |
| `REACT_APP_SITE_KEY`     | Google reCAPTCHA site key           |

### Available scripts

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm start`     | Start the development server on port 3000     |
| `npm run build` | Create a production build in `build/`         |
| `npm test`      | Run the test runner                           |

The included `.htaccess` rewrites all requests to `index.html`, so client-side routes work when the build is served by Apache.

## Project structure

```
src/
├── pages/          # Dashboard, reminders, categories, users, profile, auth pages
├── components/     # Data table, modals, pagination, breadcrumb, loading
├── layouts/        # Sidebar layout and footer
├── context/        # Logged-in user context
├── middlewares/    # Auth and permission helpers
└── route/          # Application routes
```

## Author

**Davide Balice** – [davidebalice.dev](https://www.davidebalice.dev)
