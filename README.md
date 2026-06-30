# 🍕 ASP-WOLT: Full-Stack React-native Application & Recommendation System

## 📖 Overview
**WOLT-ASP** is a complete, multi-tier Full-Stack Cross-Platform Application designed for restaurant data management, food ordering, and collaborative filtering product recommendations. The system is built on a robust, persistent 3-tier architecture:

1. **Frontend (Expo Cross-Platform):** A modern, responsive application built with React Native and managed by Expo. Following a **"Write Once, Run Everywhere"** approach, it fully supports simultaneous deployment on Web, iOS, and Android. Features a polished UI inspired by Wolt, including dynamic cart management, a global Dark Mode theme, native image-picking capabilities, and cross-platform session persistence.
2. **Web Server & API Gateway (Node.js & Express):** Serves as the core backend controller, providing RESTful HTTP APIs and managing secure JWT-based authentication. It coordinates data persistence and enforces chronological middleware routing (Parsing ➔ Routes ➔ Global Error Handlers).
3. **Persistent Database Layer (MongoDB & Mongoose):** A production-ready data layer replacing legacy in-memory arrays. Enforces strict schema validations for nested data structures.

### 🧠 Advanced Feature: C++ Microservice

**Telemetry & Recommendation Engine (C++):** A high-performance background microservice connected via persistent **TCP Sockets** (Port 8080). It records system telemetry and executes collaborative filtering algorithms to provide real-time recommendations.
The architecture implements cross-server fault tolerance, allowing the Node.js server to handle C++ connection drops without crashing or disrupting the client-facing service.

*The project was developed as part of the Advanced Software Programming (ASP) curriculum at Bar-Ilan University (Assignment 5).*

---

## 🔄 Our Workflow & Methodology

We treated this project as a real-world production application, strictly adhering to **Agile/Scrum** methodologies and maintaining high code quality standards.

* **Task Management (Jira):** The project was divided into Epics (e.g., Epic 1: MongoDB Migration, Epic 2: React Native Migration). Every feature, bug fix, or refactor was tracked using Jira tickets (e.g., `WOLT-238`) - each ticket represent a unique task.

* **Branching Strategy:** We utilized a strict GitHub flow. No code was committed directly to the `main` branch. Every task had its own dedicated branch containing the Jira issue key.

* **Code Reviews:** A Pull Request (PR) architecture was enforced. The teammate who did *not* write the code acted as the reviewer. Tasks were only moved to "Done" after successful peer review and merge.

* **Test-Driven Development (TDD):** Backend routing, error handling middleware, and validation schemas were developed alongside comprehensive integration test suites using supertest(NodeJS) and Gtest(C++) to ensure API reliability.

* **Sprint Execution & Status Meetings:** We conducted structured status meetings at key milestones within each Sprint. Led by a designated Scrum Master, these syncs were used to evaluate sprint objectives, document architectural insights, and proactively mitigate risks (blockers) to ensure continuous, unblocked delivery.

---

## 💻 Prerequisites
Before you begin, ensure you have the following installed on your machine:
* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**
* **[Git](https://git-scm.com/)**

*(No Node.js or C++ compilers are required locally, as everything is containerized!)*

---

## 🛠️ Installation & Execution

We have optimized the execution flow using a **Multi-Stage Docker Build**. A single command compiles the React frontend, sets up the Node.js API, compiles the C++ engine, and links them all together.

**1. Clone the repository:**
```bash
git clone https://github.com/noamcalf/ASP-WOLT.git
cd ASP-WOLT
```
![Git clone](./images/gitclone.jpeg)

**2. Build and start the infrastructure using Docker Compose:**
```bash
docker-compose up --build
```
![Buil1](./images/build1.jpeg)
![Buil2](./images/build2.jpeg)
![Buil3](./images/build3.jpeg)

*(Docker will handle downloading the images, compiling the React App into static files, compiling the C++ code, and launching the services).*

**3. Access the Application:**
Once the terminal shows both servers are running, simply open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**
---

## 📌 Version Control & Branch Management

To comply with the assignment requirements and ensure proper, isolated grading environments, we have strictly managed our codebase using dedicated Git branches:

* **Assignment 2:** Locked in the `ex2-submition` branch.
* **Assignment 3:** Locked in the `ex3-submition` branch.
* **Assignment 4:** All Full-Stack and React developments are organized in the `ex4-submission` branch.
* **Assignment 5:** All Full-Stack and React-native developments are organized in the `ex5-submission` branch.

This explicit separation ensures that the ongoing work does not mix with or overwrite the finalized submissions of previous assignments.