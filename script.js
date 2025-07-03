// Supabase client initialization (REPLACE WITH YOUR ACTUAL SUPABASE DETAILS)
const SUPABASE_URL = "https://nmtyvrrcvkbcdlhpvcnv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdHl2cnJjdmtiY2RsaHB2Y252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjA5OTAsImV4cCI6MjA2NzA5Njk5MH0.ATxRHHHv3gjTLecOaDDdJJ81k3z3UfuI0kBvvpBPbSUeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdHl2cnJjdmtiY2RsaHB2Y252Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTUyMDk5MCwiZXhwIjoyMDY3MDk2OTkwfQ.Pav2Tk4Glp9GbHUt7WUgzSB9dapPDYVA5MzlYYkz86w";
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Global Helper Functions ---

// Function to format date for display
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Function to format datetime for display
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Function to toggle form visibility
function toggleFormVisibility(formContainerId) {
  const container = document.getElementById(formContainerId);
  if (container) {
    container.classList.toggle("hidden");
  }
}

// --- Fetch and Display Functions for each section ---

// Fetch Summary Data (for home.html)
async function fetchSummary() {
  // Check if elements exist before trying to update them
  const summaryUsers = document.getElementById("summary-users");
  const summaryDogs = document.getElementById("summary-dogs");
  const summaryProducts = document.getElementById("summary-products");
  const summaryDoctors = document.getElementById("summary-doctors");
  const summaryAppointments = document.getElementById("summary-appointments");
  const summaryOrders = document.getElementById("summary-orders");

  if (summaryUsers) {
    const { count: userCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    summaryUsers.textContent = userCount || 0;
  }
  if (summaryDogs) {
    const { count: dogCount } = await supabase
      .from("dogs")
      .select("*", { count: "exact", head: true });
    summaryDogs.textContent = dogCount || 0;
  }
  if (summaryProducts) {
    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    summaryProducts.textContent = productCount || 0;
  }
  if (summaryDoctors) {
    const { count: doctorCount } = await supabase
      .from("doctors")
      .select("*", { count: "exact", head: true });
    summaryDoctors.textContent = doctorCount || 0;
  }
  if (summaryAppointments) {
    const { count: appointmentCount } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true });
    summaryAppointments.textContent = appointmentCount || 0;
  }
  if (summaryOrders) {
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });
    summaryOrders.textContent = orderCount || 0;
  }
}

// Fetch Dogs (for dogs.html)
async function fetchDogs() {
  const { data: dogs, error } = await supabase.from("dogs").select("*");
  if (error) {
    console.error("Error fetching dogs:", error);
    return;
  }
  const dogsListDiv = document.getElementById("dogs-list");
  if (!dogsListDiv) return;

  dogsListDiv.innerHTML = "";
  if (dogs.length === 0) {
    dogsListDiv.innerHTML += "<p>No dogs available for adoption.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Breed</th>
        <th>Year</th>
        <th>Price (€)</th>
        <th>Gender</th>
        <th>Type</th>
        <th>Vaccine Date</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  dogs.forEach((dog) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${dog.id}</td>
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.year}</td>
      <td>€${dog.price ? dog.price.toFixed(2) : "0.00"}</td>
      <td>${dog.gender}</td>
      <td>${dog.type}</td>
      <td>${formatDate(dog.vaccine_date)}</td>
      <td><img src="${
        dog.image || "https://via.placeholder.com/60?text=No+Image"
      }" alt="${dog.name}" width="60" height="60"></td>
      <td>
        <button onclick="editDog(${dog.id})">Edit</button>
        <button onclick="deleteDog(${dog.id})">Delete</button>
      </td>
    `;
  });
  dogsListDiv.appendChild(table);
}

// Fetch Products (for shop.html)
async function fetchProducts() {
  const { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  const productsListDiv = document.getElementById("products-list");
  if (!productsListDiv) return;

  productsListDiv.innerHTML = "";
  if (products.length === 0) {
    productsListDiv.innerHTML += "<p>No products available.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Category</th>
        <th>Price (€)</th>
        <th>Description</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  products.forEach((product) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>€${product.price ? product.price.toFixed(2) : "0.00"}</td>
      <td>${product.description || "N/A"}</td>
      <td><img src="${
        product.image || "https://via.placeholder.com/60?text=No+Image"
      }" alt="${product.name}" width="60" height="60"></td>
      <td>
        <button onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    `;
  });
  productsListDiv.appendChild(table);
}

// Fetch Doctors (for medical.html)
async function fetchDoctors() {
  const { data: doctors, error } = await supabase.from("doctors").select("*");
  if (error) {
    console.error("Error fetching doctors:", error);
    return;
  }
  const doctorsListDiv = document.getElementById("doctors-list");
  if (!doctorsListDiv) return;

  doctorsListDiv.innerHTML = "";
  if (doctors.length === 0) {
    doctorsListDiv.innerHTML += "<p>No doctors registered.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Specialty</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  doctors.forEach((doctor) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${doctor.id}</td>
      <td>${doctor.name}</td>
      <td>${doctor.specialty}</td>
      <td>${doctor.phone || "N/A"}</td>
      <td>${doctor.email || "N/A"}</td>
      <td>
        <button onclick="editDoctor(${doctor.id})">Edit</button>
        <button onclick="deleteDoctor(${doctor.id})">Delete</button>
      </td>
    `;
  });
  doctorsListDiv.appendChild(table);
}

// Fetch Appointments (for medical.html)
async function fetchAppointments() {
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      reason,
      doctors(name),
      users(username)
    `
    )
    .order("appointment_date", { ascending: true }); // Order by date
  if (error) {
    console.error("Error fetching appointments:", error);
    return;
  }
  const appointmentsListDiv = document.getElementById("appointments-list");
  if (!appointmentsListDiv) return;

  appointmentsListDiv.innerHTML = "";
  if (appointments.length === 0) {
    appointmentsListDiv.innerHTML += "<p>No upcoming appointments.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Date & Time</th>
        <th>Reason</th>
        <th>Doctor</th>
        <th>User</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  appointments.forEach((appointment) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${appointment.id}</td>
      <td>${formatDateTime(appointment.appointment_date)}</td>
      <td>${appointment.reason}</td>
      <td>${appointment.doctors ? appointment.doctors.name : "N/A"}</td>
      <td>${appointment.users ? appointment.users.username : "N/A"}</td>
      <td>
        <button onclick="deleteAppointment(${appointment.id})">Delete</button>
      </td>
    `;
  });
  appointmentsListDiv.appendChild(table);
}

// Fetch Users (for users.html)
async function fetchUsers() {
  const { data: users, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }
  const usersListDiv = document.getElementById("users-list");
  if (!usersListDiv) return;

  usersListDiv.innerHTML = "";
  if (users.length === 0) {
    usersListDiv.innerHTML += "<p>No users registered.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Joined At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  users.forEach((user) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username || "N/A"}</td>
      <td>${user.email || "N/A"}</td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
  });
  usersListDiv.appendChild(table);
}

// Fetch Orders (for orders.html)
async function fetchOrders() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_date,
      total_amount,
      order_type,
      users(username)
    `
    )
    .order("order_date", { ascending: false }); // Latest orders first
  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }
  const ordersListDiv = document.getElementById("orders-list");
  if (!ordersListDiv) return;

  ordersListDiv.innerHTML = "";
  if (orders.length === 0) {
    ordersListDiv.innerHTML += "<p>No orders found.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Date</th>
        <th>Type</th>
        <th>Total Amount (€)</th>
        <th>User</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  orders.forEach((order) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${formatDate(order.order_date)}</td>
      <td>${order.order_type || "N/A"}</td>
      <td>€${order.total_amount ? order.total_amount.toFixed(2) : "0.00"}</td>
      <td>${order.users ? order.users.username : "N/A"}</td>
      <td>
        <button onclick="viewOrderDetails(${order.id})">View Details</button>
      </td>
    `;
  });
  ordersListDiv.appendChild(table);
}

// --- Functions to add data (form submissions) ---

document.addEventListener("DOMContentLoaded", () => {
  // Add Dog Form
  const addDogForm = document.getElementById("add-dog-form");
  if (addDogForm) {
    addDogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const dogData = Object.fromEntries(formData.entries());
      dogData.price = parseFloat(dogData.price);
      dogData.year = parseInt(dogData.year);

      const { data, error } = await supabase
        .from("dogs")
        .insert([dogData])
        .select();
      if (error) {
        console.error("Error adding dog:", error);
        alert(`Failed to add dog: ${error.message}`);
      } else {
        alert("Dog added successfully!");
        e.target.reset();
        fetchDogs(); // Refresh the list
        toggleFormVisibility("add-dog-form-container"); // Hide form after submission
      }
    });
  }

  // Add Product Form
  const addProductForm = document.getElementById("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const productData = Object.fromEntries(formData.entries());
      productData.price = parseFloat(productData.price);

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();
      if (error) {
        console.error("Error adding product:", error);
        alert(`Failed to add product: ${error.message}`);
      } else {
        alert("Product added successfully!");
        e.target.reset();
        fetchProducts(); // Refresh the list
        toggleFormVisibility("add-product-form-container"); // Hide form after submission
      }
    });
  }

  // Add Doctor Form
  const addDoctorForm = document.getElementById("add-doctor-form");
  if (addDoctorForm) {
    addDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const doctorData = Object.fromEntries(formData.entries());

      const { data, error } = await supabase
        .from("doctors")
        .insert([doctorData])
        .select();
      if (error) {
        console.error("Error adding doctor:", error);
        alert(`Failed to add doctor: ${error.message}`);
      } else {
        alert("Doctor added successfully!");
        e.target.reset();
        fetchDoctors(); // Refresh the list
        toggleFormVisibility("add-doctor-form-container"); // Hide form after submission
      }
    });
  }
});

// --- Functions for Edit/Delete (Placeholders) ---

function editDog(id) {
  alert(`Edit dog with ID: ${id}. (Implement full edit UI here)`);
  // Example: Populate a form with data fetched for this ID, then save updates.
}

async function deleteDog(id) {
  if (confirm("Are you sure you want to delete this dog record?")) {
    const { error } = await supabase.from("dogs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting dog:", error);
      alert(`Failed to delete dog: ${error.message}`);
    } else {
      alert("Dog deleted successfully!");
      fetchDogs(); // Refresh the list
    }
  }
}

function editProduct(id) {
  alert(`Edit product with ID: ${id}. (Implement full edit UI here)`);
}

async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
    } else {
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the list
    }
  }
}

function editDoctor(id) {
  alert(`Edit doctor with ID: ${id}. (Implement full edit UI here)`);
}

async function deleteDoctor(id) {
  if (confirm("Are you sure you want to delete this doctor record?")) {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) {
      console.error("Error deleting doctor:", error);
      alert(`Failed to delete doctor: ${error.message}`);
    } else {
      alert("Doctor deleted successfully!");
      fetchDoctors(); // Refresh the list
    }
  }
}

async function deleteAppointment(id) {
  if (confirm("Are you sure you want to delete this appointment?")) {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      console.error("Error deleting appointment:", error);
      alert(`Failed to delete appointment: ${error.message}`);
    } else {
      alert("Appointment deleted successfully!");
      fetchAppointments(); // Refresh the list
    }
  }
}

async function deleteUser(id) {
  if (
    confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    )
  ) {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.message}`);
    } else {
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the list
    }
  }
}

function viewOrderDetails(id) {
  alert(
    `View details for order ID: ${id}. (Implement a modal or new page to show full order details.)`
  );
}

// --- Initial Data Load & Navigation ---

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop(); // Gets filename like 'home.html' or 'dogs.html'

  // Remove active-nav from all links first
  document.querySelectorAll("nav a").forEach((link) => {
    link.classList.remove("active-nav");
  });

  // Add active-nav to the current page's link
  const currentNavLink = document.querySelector(`nav a[href="${currentPage}"]`);
  if (currentNavLink) {
    currentNavLink.classList.add("active-nav");
  } else if (currentPage === "" || currentPage === "index.html") {
    // Handle root URL or index.html if user opens that directly
    document
      .querySelector('nav a[href="home.html"]')
      .classList.add("active-nav");
  }

  // Call appropriate fetch functions based on the current page
  if (currentPage === "" || currentPage === "home.html") {
    fetchSummary();
  } else if (currentPage === "dogs.html") {
    fetchDogs();
  } else if (currentPage === "shop.html") {
    fetchProducts();
  } else if (currentPage === "medical.html") {
    fetchDoctors();
    fetchAppointments();
  }
  // No specific fetch for account.html as it's static content (for now)
  else if (currentPage === "users.html") {
    fetchUsers();
  } else if (currentPage === "orders.html") {
    fetchOrders();
  }
});
