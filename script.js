// Supabase client initialization (replace with your actual Supabase details)
const SUPABASE_URL = "https://nmtyvrrcvkbcdlhpvcnv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdHl2cnJjdmtiY2RsaHB2Y252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjA5OTAsImV4cCI6MjA2NzA5Njk5MH0.ATxRHHHv3gjTLecOaDDdJJ81k3z3UfuI0kBvvpBPbSU";
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// --- Functions to fetch and display data ---

// Fetch Summary Data (for home.html)
async function fetchSummary() {
  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  const summaryUsers = document.getElementById("summary-users");
  if (summaryUsers) summaryUsers.textContent = userCount || 0;

  const { count: dogCount } = await supabase
    .from("dogs")
    .select("*", { count: "exact", head: true });
  const summaryDogs = document.getElementById("summary-dogs");
  if (summaryDogs) summaryDogs.textContent = dogCount || 0;

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const summaryProducts = document.getElementById("summary-products");
  if (summaryProducts) summaryProducts.textContent = productCount || 0;

  const { count: doctorCount } = await supabase
    .from("doctors")
    .select("*", { count: "exact", head: true });
  const summaryDoctors = document.getElementById("summary-doctors");
  if (summaryDoctors) summaryDoctors.textContent = doctorCount || 0;

  const { count: appointmentCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });
  const summaryAppointments = document.getElementById("summary-appointments");
  if (summaryAppointments)
    summaryAppointments.textContent = appointmentCount || 0;
}

// Fetch Dogs (for dogs.html)
async function fetchDogs() {
  const { data: dogs, error } = await supabase.from("dogs").select("*");
  if (error) {
    console.error("Error fetching dogs:", error);
    return;
  }
  const dogsListDiv = document.getElementById("dogs-list");
  if (!dogsListDiv) return; // Ensure element exists on the current page

  dogsListDiv.innerHTML = ""; // Clear previous content
  if (dogs.length === 0) {
    dogsListDiv.innerHTML += "<p>No dogs available for adoption.</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Breed</th>
        <th>Year</th>
        <th>Price</th>
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
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.year}</td>
      <td>€${dog.price.toFixed(2)}</td>
      <td>${dog.gender}</td>
      <td>${dog.type}</td>
      <td>${dog.vaccine_date || "N/A"}</td>
      <td><img src="${dog.image || "https://via.placeholder.com/50"}" alt="${
      dog.name
    }" width="50"></td>
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
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
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
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>€${product.price.toFixed(2)}</td>
      <td>${product.description || "N/A"}</td>
      <td><img src="${
        product.image || "https://via.placeholder.com/50"
      }" alt="${product.name}" width="50"></td>
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
  const { data: appointments, error } = await supabase.from("appointments")
    .select(`
      id,
      appointment_date,
      reason,
      doctors(name),
      users(username)
    `);
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
        <th>Date</th>
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
      <td>${new Date(appointment.appointment_date).toLocaleString()}</td>
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
      <td>${new Date(user.created_at).toLocaleDateString()}</td>
      <td>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
  });
  usersListDiv.appendChild(table);
}

// Fetch Orders (for orders.html)
async function fetchOrders() {
  const { data: orders, error } = await supabase.from("orders").select(`
      id,
      order_date,
      total_amount,
      users(username)
    `);
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
        <th>Total Amount</th>
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
      <td>${new Date(order.order_date).toLocaleDateString()}</td>
      <td>€${order.total_amount.toFixed(2)}</td>
      <td>${order.users ? order.users.username : "N/A"}</td>
      <td>
        <button onclick="viewOrderDetails(${order.id})">View Details</button>
      </td>
    `;
  });
  ordersListDiv.appendChild(table);
}

// --- Functions to add data (form submissions) ---

// Add Dog
document.addEventListener("DOMContentLoaded", () => {
  const addDogForm = document.getElementById("add-dog-form");
  if (addDogForm) {
    addDogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const dogData = Object.fromEntries(formData.entries());
      dogData.price = parseFloat(dogData.price);
      dogData.year = parseInt(dogData.year);

      const { data, error } = await supabase.from("dogs").insert([dogData]);
      if (error) {
        console.error("Error adding dog:", error);
      } else {
        alert("Dog added successfully!");
        e.target.reset();
        fetchDogs(); // Refresh the list
      }
    });
  }
});

// Add Product
document.addEventListener("DOMContentLoaded", () => {
  const addProductForm = document.getElementById("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const productData = Object.fromEntries(formData.entries());
      productData.price = parseFloat(productData.price);

      const { data, error } = await supabase
        .from("products")
        .insert([productData]);
      if (error) {
        console.error("Error adding product:", error);
      } else {
        alert("Product added successfully!");
        e.target.reset();
        fetchProducts(); // Refresh the list
      }
    });
  }
});

// Add Doctor
document.addEventListener("DOMContentLoaded", () => {
  const addDoctorForm = document.getElementById("add-doctor-form");
  if (addDoctorForm) {
    addDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const doctorData = Object.fromEntries(formData.entries());

      const { data, error } = await supabase
        .from("doctors")
        .insert([doctorData]);
      if (error) {
        console.error("Error adding doctor:", error);
      } else {
        alert("Doctor added successfully!");
        e.target.reset();
        fetchDoctors(); // Refresh the list
      }
    });
  }
});

// --- Functions for Edit/Delete ---

function editDog(id) {
  alert(`Edit dog with ID: ${id}`);
  // Implement actual edit logic here (e.g., populate a form with existing data)
}

async function deleteDog(id) {
  if (confirm("Are you sure you want to delete this dog record?")) {
    const { error } = await supabase.from("dogs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting dog:", error);
    } else {
      alert("Dog deleted successfully!");
      fetchDogs(); // Refresh the list on dogs.html
    }
  }
}

function editProduct(id) {
  alert(`Edit product with ID: ${id}`);
  // Implement actual edit logic here
}

async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the list
    }
  }
}

function editDoctor(id) {
  alert(`Edit doctor with ID: ${id}`);
  // Implement actual edit logic here
}

async function deleteDoctor(id) {
  if (confirm("Are you sure you want to delete this doctor record?")) {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) {
      console.error("Error deleting doctor:", error);
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
    } else {
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the list
    }
  }
}

function viewOrderDetails(id) {
  alert(`View details for order ID: ${id}`);
  // Implement a modal or new page to show full order details, including line items.
}

// Initial data load when each page loads
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
    // Handle root URL or index.html
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
  } else if (currentPage === "users.html") {
    fetchUsers();
  } else if (currentPage === "orders.html") {
    fetchOrders();
  }
  // No specific fetch for account.html as it's static content
});
