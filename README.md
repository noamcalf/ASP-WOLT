# 🍕 ASP-WOLT: Full-Stack Web & Recommendation System

## 📖 Overview
**ASP-WOLT** is a multi-tier Client-Server application designed for restaurant data management and collaborative filtering product recommendations. The system is divided into two decoupled components to optimize fault tolerance and separate computing concerns:

1. **Web Server (Node.js & Express):** Functions as the primary API Gateway. It exposes a RESTful HTTP interface utilizing JSON formatting for the CRUD operations of users, restaurants, products, and orders.
2. **Telemetry & Recommendation Engine (C++):** A high-performance background server connected via persistent **TCP Sockets** (Port 6060). It records system telemetry and executes the collaborative filtering algorithms.

The architecture implements cross-server fault tolerance, allowing the Node.js server to handle C++ connection drops without crashing or disrupting the client-facing HTTP service.

*The project was developed as part of the academic curriculum at Bar-Ilan University.*

---

## 💻 Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)

> **Note:** The architecture relies on multi-port binding. By default, the C++ telemetry service operates on port `6060` via TCP, while the client-facing REST API is exposed on port `3000` via HTTP. The Node.js application is designed to fall back to these defaults automatically, though users can optionally override the target port by passing it as a runtime argument.

---

## 🛠️ Installation & Build

The application requires orchestrating both backend services simultaneously. Follow these steps to initialize, build, and execute the environment using **two separate terminal windows**.

### Terminal 1: Core Infrastructure (C++ Telemetry Engine)

**1. Clone and enter the repository:**
```bash
git clone https://github.com/noamcalf/ASP-WOLT.git
cd ASP-WOLT
```

**2. Build the infrastructure using Docker Compose:**
```bash
docker-compose up --build
```
![Docker Build Image (1)](./images/Docker_build_1)
![Docker Build Image (2)](./images/Docker_build_2)

### Terminal 2: API Gateway & Web Server Setup (Node.js)

**1. Enter the Node.js server directory:**
```bash
cd ASP-WOLT/nodejs_server
```

**2. Install project dependencies:**
```bash
npm install
```

**3. Start the Node.js Web Server:**
```bash
npm start
```
*(The API Gateway will initialize locally and begin listening for client HTTP requests on port 3000, while dynamically bridging persistent TCP telemetry signals to the containerized C++ engine).*

![Nodejs Downloand and Server Running Image]!(./images/Download_nodejs_and_start)

---

## 🚀 Usage & Execution Examples

Once the application infrastructure is initialized, the system exposes its client-facing API gateway on port `3000`. You can interact with the system using standard HTTP clients (such as Postman or `curl` via the terminal). 

*(To verify curl availability, execute ```bash curl --version ``` in a terminal. If curl is not detected, install it using the platform package manager—for example, ```bash brew install curl ``` on macOS, ```bash sudo apt install curl ``` on Ubuntu/Debian, or ```bash winget install cURL.cURL ``` on Windows.)

Below is the complete API specification based on the system requirements using 'curl':

---

### 1. Restaurants Management (`/api/restaurants`)

* **Get All Restaurants (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/restaurants`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/restaurants
    ```
  * **Expected Response:** `200 OK` with a JSON array containing all active restaurants in the system in JSON format.

* **Create a Restaurant (POST):**
  * **Endpoint:** `POST http://localhost:3000/api/restaurants`
  * **Example Request:**
    ```bash
    curl -X POST http://localhost:3000/api/restaurants \
      -H "Content-Type: application/json" \
      -d '{"name": "Pizza Palace", "cuisine": "Italian", "address": {"city": "Tel Aviv", "street": "Rothschild" "houseNumber": "10"}}'
    ```
  * **Expected Response:** `201 Created` with an **empty response body**. The dynamic URL of the newly created resource is returned within the `Location` response header (e.g., `Location: /api/restaurants/1`).

* **Get Specific Restaurant Details (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/restaurants/:id`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/restaurants/res123
    ```
  * **Expected Response:** `200 Ok` containing the specific restaurant object in JSON format.

* **Update Restaurant Details (PATCH):**
  * **Endpoint:** `PATCH http://localhost:3000/api/restaurants/:id`
  * **Example Request:**
    ```bash
    curl -X PATCH http://localhost:3000/api/restaurants/res123 \
      -H "Content-Type: application/json" \
      -d '{"name": "Updated Pizza Palace"}'
    ```
  * **Expected Response:** `204 No Content`.

* **Delete a Restaurant (DELETE):**
  * **Endpoint:** `DELETE http://localhost:3000/api/restaurants/:id`
  * **Example Request:**
    ```bash
    curl -X DELETE http://localhost:3000/api/restaurants/res123
    ```
  * **Expected Response:** `204 No Content`.

---

### 2. Menu & Products Management (`/api/restaurants/:id/products`)

* **Get Restaurant Menu (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/restaurants/:id/products`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/restaurants/res123/products
    ```
  * **Expected Response:** `200 OK` with the complete list of products (menu) for the specified restaurant.

* **Add Product to Menu (POST):**
  * **Endpoint:** `POST http://localhost:3000/api/restaurants/:id/products`
  * **Example Request:**
    ```bash
    curl -X POST http://localhost:3000/api/restaurants/res123/products \
      -H "Content-Type: application/json" \
      -d '{"name": "Margherita Pizza", "price": 45, "description": "Classic cheese pizza"}'
    ```
  * **Expected Response:** `201 Created` with an **empty response body**. The dynamic URL of the newly created resource is returned within the `Location` response header (e.g., `Location: /api/restaurants/1/products/11`).

* **Get Product Details (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/restaurants/:id/products/:pId`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/restaurants/res123/products/pld99
    ```
  * **Expected Response:** `200 OK` with the specific product data in JSON format.

* **Update Product Details (PATCH):**
  * **Endpoint:** `PATCH http://localhost:3000/api/restaurants/:id/products/:pId`
  * **Example Request:**
    ```bash
    curl -X PATCH http://localhost:3000/api/restaurants/res123/products/pld99 \
      -H "Content-Type: application/json" \
      -d '{"price": 49}'
    ```
  * **Expected Response:** `204 No Content`.

* **Delete Product from Menu (DELETE):**
  * **Endpoint:** `DELETE http://localhost:3000/api/restaurants/:id/products/:pId`
  * **Example Request:**
    ```bash
    curl -X DELETE http://localhost:3000/api/restaurants/res123/products/pld99
    ```
  * **Expected Response:** `204 No Content`.

---

### 3. Orders Management (`/api/orders`)

* **Create a New Order (POST):**
  * **Endpoint:** `POST http://localhost:3000/api/orders`
  * **Example Request:**
    ```bash
    curl -X POST http://localhost:3000/api/orders \
      -H "Content-Type: application/json" \
      -d '{"restaurantId": "res123", "items": [{"productId": "pld99", "quantity": 2}]}'
    ```
  * **Expected Response:** `201 Created`.

* **Get Active User Orders History (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/orders`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/orders
    ```
  * **Expected Response:** `200 OK` returning the authenticated/current user's order history in JSON format.

* **Get Specific Order Details (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/orders/:id`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/orders/ord555
    ```
  * **Expected Response:** `200 OK` returning the order's details in JSON format.

* **Update Order Details (PATCH):**
  * **Endpoint:** `PATCH http://localhost:3000/api/orders/:id`
  * **Example Request:**
    ```bash
    curl -X PATCH http://localhost:3000/api/orders/ord555 \
      -H "Content-Type: application/json" \
      -d '{"status": "delivered"}'
    ```
  * **Expected Response:** `204 No Content`.

* **Cancel/Delete an Order (DELETE):**
  * **Endpoint:** `DELETE http://localhost:3000/api/orders/:id`
  * **Example Request:**
    ```bash
    curl -X DELETE http://localhost:3000/api/orders/ord555
    ```
  * **Expected Response:** `204 No Content`.

* **Get recommendations by product (GET):**
  * **Endpoint:** `GET http://localhost:3000/api/orders/:id/recommendations/:productId`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/orders/ord555/recommendations/pld99
    ```
  * **Expected Response:** `200 OK` containing a JSON array of recommended product IDs generated by the collaborative filtering engine.
---

### 4. Global System Search (`/api/search`)

* **Query Search (GET):**
  * **Description:** Searches across restaurants or products matching the search phrase within their title, name, or description strings.
  * **Endpoint:** `GET http://localhost:3000/api/search/:query`
  * **Example Request:**
    ```bash
    curl -X GET http://localhost:3000/api/search/pizza
    ```
  * **Expected Response:** `200 OK` with an array of filtered restaurant and product entities matching the query term.

---

### Full Execution Flow Example:
The following screenshot demonstrates a complete real-world user interaction lifecycle executed against the API Gateway, showing structured data manipulation, successful cross-layer telemetry dispatches, and robust validation handling.

![Full Execution Flow Image](./images/example.png)

---

## 📌 Version Control & Branch Management

Code isolation and submission tracking for this project are strictly managed using dedicated Git branches for each milestone:

* **Assignment 2 Codebase:** Securely maintained and stored within the `ex2-submition` branch.
* **Assignment 3 Codebase:** Securely maintained and stored within the `ex3-submition` branch.

> **Branch Protection Policy:** Both branches are governed by strict **Lock** rules on GitHub. This safety mechanism enforces read-only immutability, preventing accidental overwrites, retroactive deletions, or forced pushes after final submission to guarantee codebase integrity.