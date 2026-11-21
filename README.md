# Bus Tech — Admin Dashboard

The web dashboard of **Bus Tech**, an automated bus scheduling and operations platform that won
**Smart India Hackathon 2024**. Transport administrators use it to manage the bus fleet, routes
and staff, and to assign duties.

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![React](https://img.shields.io/badge/React-20232a?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

## Part of the Bus Tech platform

| Repository | Role |
| --- | --- |
| [Bus-tech-bus](https://github.com/naksh1414/Bus-tech-bus) | Bus fleet, capacity and route assignment |
| [Bus-tech-seat](https://github.com/naksh1414/Bus-tech-seat) | Seat inventory and booking status |
| [Bus-tech-user](https://github.com/naksh1414/Bus-tech-user) | Users, authentication and roles |
| **Bus-tech-Admin** (this repo) | Admin dashboard |

## Features

| Page | What it does |
| --- | --- |
| **Dashboard** (`/admin/dashboard`) | Overview with charts and key stats |
| **Buses** (`/admin/bus`) | View and manage the fleet |
| **Routes** (`/admin/route`) | Bus routes, built from the stop and route data in `data/` |
| **Staff** (`/admin/staff`) | Add staff and assign duties to drivers and conductors |
| **Tables** (`/admin/tables`) | Tabular views of operational data |
| **Maps** (`/admin/maps`) | Map view of stops and routes |

Route and stop data (`data/bus_routes.csv`, `data/bus_stops.csv` and related files) seed the
routes and map views.

## Tech

Next.js (pages router), React, Tailwind CSS, Chart.js for charts, Axios for API calls.
The UI is built on the open-source
[Notus NextJS](https://github.com/creativetimofficial/notus-nextjs) template (MIT) by Creative Tim.

## Run it locally

Requires Node.js 18+.

```bash
git clone https://github.com/naksh1414/Bus-tech-Admin.git
cd Bus-tech-Admin
npm install
npm run dev
```

Open `http://localhost:3000/admin/dashboard`.

The staff and duty pages call a backend API at `http://localhost:3030`, so start that service
first for those pages to load data.

```bash
npm run build && npm start   # production build
```

## Structure

```
pages/        # routes: admin/*, auth/*
components/   # cards, navbars, sidebar, modals (AddStaff, AssignDuty), dropdowns
layouts/      # Admin and Auth page layouts
data/         # bus route and stop datasets
styles/       # Tailwind setup
```

## Author

Nakshatra Manglik · [nakshatramanglik14@gmail.com](mailto:nakshatramanglik14@gmail.com) ·
[GitHub](https://github.com/naksh1414)
