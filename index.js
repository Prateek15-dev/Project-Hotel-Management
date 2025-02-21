function displayUsername() {
    const username = localStorage.getItem("loggedInUser") || "Welcome!";
    document.getElementById("welcome-text").textContent = `Welcome! ${username === "Welcome!" ? "" : username}`;
}

function logout() {
    // Ask for confirmation before logging out
    let confirmLogout = confirm("Are you sure you want to log out?");
    
    // If user confirms, proceed with logout
    if (confirmLogout) {
        localStorage.removeItem("loggedInUser"); // Remove user data from localStorage
        window.location.href = "index.html"; // Redirect to the home page
        document.getElementById("welcome-text").textContent = `Welcome!`; // Reset welcome text
    }
}
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

window.onload = displayUsername;

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (username === "admin" && password === "admin123") {
        localStorage.setItem("loggedInUser", "Admin");
        window.location.href = "dashboard.html";
    } else if (users[username] && users[username] === password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials! Please try again or sign up.");
    }
}

function signUp() {
    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;
    
    if (newUsername && newPassword) {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        
        if (users[newUsername]) {
            alert("Username already exists! Try another.");
        } else {
            users[newUsername] = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
            alert("Sign-up successful! You can now log in.");
            showLogin();
        }
    } else {
        alert("Please enter valid details.");
    }
}

function showSignUp() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("signup-container").style.display = "block";
}

function showLogin() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("signup-container").style.display = "none";
}

function filterRooms() {
    let selectedType = document.getElementById("roomType").value;
    let maxPrice = parseInt(document.getElementById("priceRange").value);
    let breakfastChecked = document.getElementById("breakfast").checked;
    let petsChecked = document.getElementById("pets").checked;
    let rooms = document.querySelectorAll(".room-card");

    rooms.forEach(room => {
        let roomPrice = parseInt(room.getAttribute("data-price"));
        let hasBreakfast = room.getAttribute("data-breakfast") === "true";
        let allowsPets = room.getAttribute("data-pets") === "true";

        let typeMatch = selectedType === "all" || room.classList.contains(selectedType);
        let priceMatch = roomPrice <= maxPrice;
        let breakfastMatch = !breakfastChecked || hasBreakfast;
        let petsMatch = !petsChecked || allowsPets;

        if (typeMatch && priceMatch && breakfastMatch && petsMatch) {
            room.style.display = "block";
        } else {
            room.style.display = "none";
        }
    });
}

document.getElementById("roomType").addEventListener("change", filterRooms);
document.getElementById("priceRange").addEventListener("input", function () {
    document.getElementById("priceValue").innerText = this.value;
    filterRooms();
});
document.getElementById("breakfast").addEventListener("change", filterRooms);
document.getElementById("pets").addEventListener("change", filterRooms);

//admin css
function viewUsers() {
    window.location.href = 'view-users.html';
}

function viewRooms() {
    window.location.href = 'view-rooms.html';
}

function viewOrders() {
    window.location.href = 'view-orders.html';
}

function generateReports() {
    window.location.href = 'reports.html';
}
//orders
function deleteOrder(button) {
    const row = button.closest('tr');
    row.remove();
    alert('Order deleted successfully!');
}

// Function to add a new order
document.getElementById('addOrderForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const customerName = document.getElementById('customerName').value;
    const room = document.getElementById('room').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const status = document.getElementById('status').value;

    // Generate a new order ID (random for simplicity)
    const newOrderId = Math.floor(Math.random() * 1000) + 1;

    // Add a new row to the table
    const tableBody = document.querySelector('#ordersTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${newOrderId}</td>
        <td>${customerName}</td>
        <td>${room}</td>
        <td>${checkIn}</td>
        <td>${checkOut}</td>
        <td><span class="badge ${status === 'Pending' ? 'bg-warning' : 'bg-success'}">${status}</span></td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteOrder(this)">Delete</button>
        </td>
    `;
    tableBody.appendChild(newRow);

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
    modal.hide();

    // Reset the form
    document.getElementById('addOrderForm').reset();

    alert('New order added successfully!');
});
//rooms 
let rooms = [
    { id: 1, type: "Deluxe", price: 200, status: "Available" }
];

function openAddRoomModal() {
    document.getElementById('modalTitle').innerText = 'Add Room';
    document.getElementById('roomId').value = '';
    document.getElementById('roomType').value = '';
    document.getElementById('roomPrice').value = '';
    document.getElementById('roomStatus').value = 'Available';
    document.getElementById('roomModal').style.display = 'block';
}

function openEditRoomModal(id) {
    const room = rooms.find(r => r.id === id);
    document.getElementById('modalTitle').innerText = 'Edit Room';
    document.getElementById('roomId').value = room.id;
    document.getElementById('roomType').value = room.type;
    document.getElementById('roomPrice').value = room.price;
    document.getElementById('roomStatus').value = room.status;
    document.getElementById('roomModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('roomModal').style.display = 'none';
}

function saveRoom(event) {
    event.preventDefault();
    const id = document.getElementById('roomId').value;
    const type = document.getElementById('roomType').value;
    const price = document.getElementById('roomPrice').value;
    const status = document.getElementById('roomStatus').value;

    if (id) {
        const room = rooms.find(r => r.id === parseInt(id));
        room.type = type;
        room.price = price;
        room.status = status;
    } else {
        const newRoom = { id: rooms.length + 1, type, price, status };
        rooms.push(newRoom);
    }

    renderRooms();
    closeModal();
}

function deleteRoom(id) {
    rooms = rooms.filter(r => r.id !== id);
    renderRooms();
}

function renderRooms() {
    const tableBody = document.getElementById('roomTable');
    tableBody.innerHTML = rooms.map(room => `
        <tr>
            <td>${room.id}</td>
            <td>${room.type}</td>
            <td>$${room.price}</td>
            <td>${room.status}</td>
            <td>
                <button class="btn edit-btn" onclick="openEditRoomModal(${room.id})">Edit</button>
                <button class="btn delete-btn" onclick="deleteRoom(${room.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}
function updateRoomCategory() {
    const roomType = document.getElementById("roomType").value;
    const roomCategorySelect = document.getElementById("roomCategory");
    
    // Clear the existing options
    roomCategorySelect.innerHTML = '<option value="">Select Room Category</option>';

    // Add options based on the selected room type
    if (roomType === "Single") {
        roomCategorySelect.innerHTML += `
            <option value="Basic">Basic</option>
            <option value="Economy">Economy</option>
            <option value="Standard">Standard</option>
        `;
    } else if(roomType === "Double" || roomType === "Family") {
        roomCategorySelect.innerHTML += `
        <option value="Basic">Basic</option>
            <option value="Economy">Economy</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
        `;
    } else{
        roomCategorySelect.innerHTML += `
            <option value="Deluxe">Deluxe</option>
        `;
    }
}

function saveRoom(event) {
    event.preventDefault();
    
    // Collect data and save the room details here
    const roomType = document.getElementById("roomType").value;
    const roomCategory = document.getElementById("roomCategory").value;
    const roomPrice = document.getElementById("roomPrice").value;
    const roomStatus = document.getElementById("roomStatus").value;

    console.log(`Room Type: ${roomType}, Room Category: ${roomCategory}, Price: ${roomPrice}, Status: ${roomStatus}`);
    
    // You can add logic to save this data (e.g., send it to a server)
    
    // Close the modal
    closeModal();
}

function closeModal() {
    document.getElementById("roomModal").style.display = 'none';
}

//user
let users = [
    { id: 1, name: "John Doe", email: "johndoe@example.com" }
];

function openAddUserModal() {
    document.getElementById('modalTitle').innerText = 'Add User';
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userModal').style.display = 'block';
}

function openEditUserModal(id) {
    const user = users.find(u => u.id === id);
    document.getElementById('modalTitle').innerText = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function saveUser(event) {
    event.preventDefault();
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    if (id) {
        // Edit user
        const user = users.find(u => u.id === parseInt(id));
        user.name = name;
        user.email = email;
    } else {
        // Add new user
        const newUser = { id: users.length + 1, name, email };
        users.push(newUser);
    }

    renderUsers();
    closeModal();
}

function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    renderUsers();
}

function renderUsers() {
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn edit-btn" onclick="openEditUserModal(${user.id})">Edit</button>
                <button class="btn delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}