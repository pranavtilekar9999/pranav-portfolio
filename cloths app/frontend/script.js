// ================= BASE URL =================
const BASE_URL = "https://cloths-app.onrender.com";

// ================= CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Load cart items
function loadCart() {
  const cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  cartDiv.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    cartDiv.innerHTML += `
      <div>
        ${item.name} - ₹${item.price}
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  // Show total
  const totalDiv = document.getElementById("totalPrice");
  if (totalDiv) {
    totalDiv.innerText = "Total: ₹" + total;
  }
}

// ================= LOGIN =================
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Login failed");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error connecting server");
  });
}

// ================= REGISTER =================
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    alert("Registered successfully");
    window.location.href = "login.html";
  })
  .catch(err => {
    console.error(err);
    alert("Error connecting server");
  });
}

// ================= PLACE ORDER =================
function placeOrder() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  fetch(`${BASE_URL}/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ items: cart })
  })
  .then(res => res.json())
  .then(data => {
    alert("Order placed successfully");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  })
  .catch(err => {
    console.error(err);
    alert("Order failed");
  });
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  alert("Logged out");
  window.location.href = "login.html";
}

// ================= AUTO LOAD CART =================
window.onload = function () {
  loadCart();
};