# Environment Setup

The WOLT-ASP project consists of three main components:
1. **Node.js Server (Backend):** Manages the API for the clients and interacts with the MongoDB database.
2. **Recommendation Engine (C++):** A microservice written in C++ running on a separate TCP server that calculates restaurant and dish recommendations.
3. **Client Application (Frontend):** Built with React Native / Expo, capable of running on Web, iOS, and Android.

---

## 🚀 Running the Backend Environment

For testing convenience and quick setup, all environment variables (including secrets like `JWT_SECRET` and the MongoDB connection URI) have been pre-configured as defaults inside the `docker-compose.yml` file. 
This means you **do not need** to manually configure a `.env` file to evaluate the project. 
*(Note: In a real production environment, these secrets would be separated into a secure `.env` file, as demonstrated in the included `.env.example` file).*

**To run the entire system (Node, MongoDB, C++) together:**
1. Open a terminal in the root directory of the project.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Wait until you see that the servers have started (MongoDB is ready, Node server is listening on port 3000, and the C++ server is listening on port 8080).
4. The compilation of the C++ engine and the Node.js server setup happen automatically as part of the Docker build process! No additional compilation commands are required.

*[Insert Screenshot: Terminal showing docker-compose up running successfully]*

---

## 📱 Running the Application (Frontend)

Once the backend servers are running, you can run the client application in two different ways:

### Option 1: Quick Web Run (No Configuration Required) - Recommended 💻
In this mode, the application automatically detects it is running on your computer and directs API calls to `localhost:3000`.
1. Open a new terminal window.
2. Navigate to the client directory: `cd expo-frontend`
3. Install dependencies: `npm install`
4. Run in the browser: `npm run web` (or `npx expo start --web`)

*[Insert Screenshot: App running in the web browser]*

### Option 2: Physical Device (Via Expo Go App) 📱
A physical phone does not recognize your computer's `localhost`. Therefore, if you wish to run the app on your personal phone:
1. Open the `expo-frontend` directory.
2. Create a new file named `.env`.
3. Add the following line to the file (Replace the IP with your computer's local IP address, e.g., `192.168.1.15`):
   ```env
   EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:3000
   ```
4. Run `npm start` and scan the QR code using the Expo Go app.

*[Insert Screenshot: App running on a physical phone/simulator]*
