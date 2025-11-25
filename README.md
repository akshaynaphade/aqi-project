# 🌍 Air Quality Index (AQI) Search Engine

[cite_start]A full-stack web application designed to search for real-time Air Quality Index (**AQI**) data for cities worldwide[cite: **128**]. [cite_start]This project serves as a performance-optimized search engine that visualizes environmental metrics and forecast trends using a rich user interface[cite: **134**].

## 🏗️ Project Architecture

[cite_start]The application follows a strict separation of concerns with a RESTful architecture, comprised of two distinct components[cite: **131**]:

1. [cite_start]**Web Service **API** (Backend):** Built with Node.js (Express.js)[cite: 1]. It serves RESTful APIs and handles external communication with the **AQICN** vendor.
2. [cite_start]**Caching Layer:** Implements node-cache for server-side in-memory caching[cite: 1]. [cite_start]This ensures speedier results for repeating queries, handling **TTL** (Time-To-Live) and cache expiry efficiently to improve performance[cite: **132**, **133**].
3. [cite_start]**Frontend (UI Layer):** Built with React.js (Vite) and Tailwind **CSS**[cite: 1]. [cite_start]It renders rich information including pollutant details (**PM2**.5, **PM10**, Ozone), health recommendations, and interactive charts[cite: **135**].

## 🚀 How to Run Locally

[cite_start]The entire code is designed to run locally via the provided framework[cite: **136**]. You will need two separate terminals: one for the Server and one for the Client.

### Prerequisites

- Node.js installed on your machine.
- [cite_start]A free **API** Token from **AQICN** ([https://aqicn.org/api/](https://aqicn.org/api/))[cite: **129**].

---

### Step 1: Start the Backend Server (Terminal 1)

## Navigate to the server directory:

    cd server

## Install dependencies:

    npm install

## Configure API Key:

    Create a file named .env inside the server folder and add your token:
    **PORT**=**5000**
    AQI_API_TOKEN=your_actual_api_token_here

## Start the service:

    node src/app.js

    *Output: Server running locally on port **5000***

### Step 2: Start the Frontend Client (Terminal 2)

## Open a new terminal and navigate to the client directory:

    cd client

## Install dependencies:

    npm install

## Start the UI:

    npm run dev

## Open the local link provided (usually [http://localhost:5173](http://localhost:5173)) in your browser to start searching.

---

## 📡 API Documentation

[cite_start]The backend exposes a **REST** **API** endpoint that follows standard guidelines[cite: **136**].

- Endpoint: **GET** /api/aqi/:city
- Description: Fetches air quality data for a specific city. The service checks the local cache first; if data is missing or expired, it fetches fresh data from the vendor **API**.

**Example **JSON** Response:**
{
    *source*: *cache*, 
    *data*: {
    *city*: *Pune*,
    *aqi*: 75,
    *pollutants*: {
    *pm25*: 12.5,
    *pm10*: 30,
    *o3*: 40
    },
    *location*: [18.52, 73.85],
    *time*: ***2025**-11-25 10:00:00*
    }
}

## ✨ Key Features

- [cite_start]Real-time Search: Users can search for a city by name to get instant info and show info about the city[cite: **128**].
- [cite_start]Performance: Uses server-side caching to minimize external **API** calls and improve response time for repeating queries[cite: **132**].
- [cite_start]Rich UI Attributes: Displays interesting attributes including pollutant breakdown, health recommendations, and map coordinates[cite: **134**].
- Interactive Tools: Includes features to export data as **CSV**, set alerts, and view historical trends via charts.

## 📂 Project Structure

[cite_start]The code is structured for extensibility and good coding practices[cite: **136**].

aqi-project/ ├── server/                 # **REST** **API** Service │   ├── src/ │   │   ├── controllers/    # Business logic & Caching checks │   │   ├── services/       # External Vendor **API** integration │   │   ├── routes/         # **API** Endpoint definitions │   │   └── utils/          # Cache configuration │   └── .env                # **API** Secrets (Ignored by Git) ├── client/                 # React Frontend │   ├── src/ │   │   ├── components/     # Dashboard & Chart Components │   │   └── index.css       # Tailwind Styling