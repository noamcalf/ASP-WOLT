# Management Operations (CRUD)

The system provides comprehensive management capabilities (CRUD) for restaurant owners on one hand, and ordering capabilities for customers on the other. 
The application supports these operations across different clients (Mobile devices via Expo Go or Web Browsers).

---

## 🏬 Restaurant Management - For Owners

When logging into the system with an `owner` account, the user lands on the `OwnerDashboard`.
This screen aggregates all the restaurants owned by this specific user.

### Creating a New Restaurant:
1. In the Owner Dashboard, click the `Create Restaurant` button.
2. Fill in the restaurant details (Name, Description, Category, Base Delivery Time, Location coordinates).
3. Upload a cover image for the restaurant.
4. Click save - The restaurant will be created and appear in your list immediately.

*[Insert Screenshot: Create Restaurant Form]*

### Editing and Deleting a Restaurant:
1. Enter a specific restaurant from your list.
2. At the top of the menu manager screen, you will see `Edit` and `Delete` buttons.
3. Clicking `Edit` will open a form allowing you to update all restaurant details.
4. Clicking `Delete` will display a warning dialog (Native Alert on Mobile, `window.confirm` on Web). Only upon confirmation will the restaurant and all its associated products be permanently deleted from the database.

*[Insert Screenshot: Edit Restaurant Form / Delete Warning]*

---

## 🍔 Menu Management - For Owners

Inside the management screen of a specific restaurant (`OwnerMenuManagerScreen`), the owner can manage their entire menu catalog.

### Creating and Editing a Dish (Product):
1. Clicking on `+ Add Item` opens a form to create a new product for this restaurant.
2. You can fill in the Name, Price, detailed Description, and upload a dish image.
3. Once the dish exists in the list, dedicated `Edit` and `Delete` buttons will appear next to it.
4. These operations are executed in real-time and the menu updates instantly without requiring a page refresh.

*[Insert Screenshot: Menu Management with Edit/Delete buttons]*
*[Insert Screenshot: Create/Edit Menu Item Form]*

---

## 🛒 Placing Orders - For Customers

When logging into the system with a `customer` account, users can make purchases. The checkout process also involves our C++ recommendation engine which generates smart algorithms.

### Order Flow Demonstration:
1. On the `Dashboard` screen, the customer searches for a restaurant or selects one from the "Promoted" section or the Recommendations Carousel.
2. The customer enters the restaurant page and adds dishes to their Cart by clicking the '+' button next to each item.
3. The customer navigates to the Cart page and clicks `Proceed to Checkout`.
4. On the `Checkout` screen, the customer reviews the order summary, views their geographical location relative to the restaurant, and clicks `Place Order`.

*[Insert Screenshot: The Customer Dashboard]*
*[Insert Screenshot: Adding Items to Cart]*
*[Insert Screenshot: Checkout Screen]*

### C++ Engine Intervention:
Following a successful order placement, the client sends a request to the Node.js server. The server updates the MongoDB database, and then dispatches a background signal (TCP Socket) to the C++ microservice. The C++ server processes the order details and recalculates the "Recommendation" weights for the restaurants (e.g., boosting the score of the restaurant that was just ordered from). The next time the user returns to the Dashboard, this restaurant will be bumped up in the Recommendation lists.
