# Authentication & Registration

The WOLT-ASP system provides a full and secure authentication mechanism based on JSON Web Tokens (JWT). The application supports two types of users: **Customers** and **Owners** (Restaurant Managers).

---

## 📝 Registration Flow

When a new user launches the application, they are directed to the Registration Screen.
On this screen, the user enters their personal details, selects whether they are a customer or a restaurant owner, and can optionally upload a profile picture directly from their device's gallery.

**Demo Steps for Evaluation:**
1. Open the application and click on "Don't have an account? Sign up".
2. Fill in the user details (Name, Email, Password).
3. Select a profile picture (the app will request gallery/camera permissions if necessary).
4. Choose the user type (e.g., `customer`).
5. Click on "Create Account".

*[Insert Screenshot: Registration Screen filled with details]*
*[Insert Screenshot: Success message / Routing back to Login]*

### Behind the Scenes:
The data is sent using `FormData` (to support binary image uploads) to the `POST /api/users/` endpoint. The Node.js server parses the request, saves the image to the local filesystem, hashes the password securely, and saves the new user document into the MongoDB database.

---

## 🔐 Login Flow

After account creation (or for existing users), the login process takes place.

**Demo Steps for Evaluation:**
1. On the Home Screen (Login Screen), enter the email and password of the user you just created.
2. Click on "Login".
3. If the credentials are correct, the system will identify the user type and route them to the appropriate screen:
   - **Customer:** Redirected to the `Dashboard` (Main feed for discovering food).
   - **Owner:** Redirected to the `OwnerDashboard` (Restaurant management screen).

*[Insert Screenshot: Login Screen]*
*[Insert Screenshot: The Dashboard the user was redirected to]*

### Behind the Scenes:
The login request is sent to `POST /api/users/login`. The server verifies the password and issues a signed `JWT Token`. The Frontend saves this token in `AsyncStorage` (local device memory) and automatically attaches it (using our custom `apiClient` interceptor) to every future server request inside the `Authorization` header.
