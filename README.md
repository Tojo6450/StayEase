# TripZ 🏠

StayEase is a full-stack web application designed as a rental platform, allowing users to browse, list, and manage property rentals. It features user authentication, listing management, reviews, and a shopping cart system. This project demonstrates the integration of a Node.js/Express backend API with a React frontend.

* **Live Frontend (Vercel):** [https://trip-z-xi.vercel.app]
* **Live Backend API (Render):** [https://stayease-kly1.onrender.com]

---

## Features ✨

* **User Authentication:** Secure signup and login using Passport.js.
* **Listing Management:**
    * Browse all listings with filtering by category and search functionality.
    * View detailed information for each listing, including location map (Mapbox).
    * Authenticated users can create, edit, and delete their own listings.
    * Image uploads handled via Cloudinary.
* **Review System:** Logged-in users can leave ratings and comments on listings. Authors can delete their own reviews.
* **Shopping Cart:** Users can add/remove listings to/from their cart.
* **Simple Order Placement:** Users can "place an order" which clears their cart (placeholder for payment integration).
* **Responsive UI:** Frontend designed to work on various screen sizes.

---

## Architecture 🏗️

This project follows a decoupled architecture:

1.  **Backend (API):**
    * **Framework:** Node.js with Express.js
    * **Database:** MongoDB with Mongoose ODM
    * **Authentication:** Passport.js (Local Strategy, Sessions)
    * **Image Storage:** Cloudinary
    * **Geocoding:** Mapbox SDK
    * **Deployment:** Render
2.  **Frontend (Client):**
    * **Framework:** React with Vite
    * **Routing:** React Router DOM
    * **State Management:** React Context API (for Auth and Cart)
    * **Styling:** Bootstrap CSS & Icons / Tailwind CSS *(Update as applicable)*
    * **API Communication:** Axios
    * **Notifications:** React Toastify
    * **Mapping:** Mapbox GL JS
    * **Deployment:** Vercel

The React frontend communicates with the Express backend via REST API calls to fetch data, authenticate users, and perform actions. Session-based authentication is handled using cookies.

---

## Architectural Diagram 🗺️

Here's a visual representation of the StayEase application's architecture rendered using Mermaid:

```mermaid
graph LR
    User["User Browser"] --> FE["Frontend - Vercel (React/Vite)"];

    subgraph "Frontend (Client Side)"
        FE --> Axios["HTTP/S Requests (Axios)"];
        FE --> MapboxJS["Mapbox GL JS (Client-Side Map)"];
    end

    Axios --> BE["Backend - Render (Node/Express API)"];

    subgraph "Backend (Server Side)"
        BE --> Auth["Authentication (Passport/Sessions)"];
        BE --> Controllers["API Logic (Controllers)"];
        BE --> Mongoose["Mongoose ODM"];
        BE --> MapboxSDK["Mapbox SDK (Geocoding)"];
        BE --> CloudinaryAPI["Image Uploads"];
    end

    Mongoose --> MongoDB["MongoDB"];
    CloudinaryAPI --> Cloudinary["Cloudinary"];
    MapboxSDK --> MapboxAPI["Mapbox API"];

    %% Optional Styling
    style FE fill:#3448c5,stroke:#333,stroke-width:1px,color:#000; %% Sky blue background, black text
    style BE fill:#3448c5,stroke:#333,stroke-width:1px,color:#000; %% Green background, black text
    style MongoDB fill:#4DB33D,stroke:#333,stroke-width:1px,color:#000;
    style Cloudinary fill:#3448C5,stroke:#333,stroke-width:1px,color:#fff;
    style MapboxJS fill:#4264FB,stroke:#333,stroke-width:1px,color:#fff;
    style MapboxSDK fill:#4264FB,stroke:#333,stroke-width:1px,color:#fff;
    style MapboxAPI fill:#4264FB,stroke:#333,stroke-width:1px,color:#fff;
