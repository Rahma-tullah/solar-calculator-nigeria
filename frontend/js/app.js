const API_BASE_URL = "http://localhost:5000/api";
let currentCalculationId = null;

// Authentication state management
let currentUser = null;
let authToken = null;

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();

  // Login form handler
  document.getElementById("loginForm").addEventListener("submit", handleLogin);

  // Signup form handler
  document
    .getElementById("signupForm")
    .addEventListener("submit", handleSignup);
});

// Check if user is logged in
function checkAuthStatus() {
  authToken = localStorage.getItem("authToken");
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (authToken && currentUser) {
    showUserMenu();
  } else {
    showAuthButtons();
  }
}

// Show/hide UI based on auth state
function showUserMenu() {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("userMenu").style.display = "block";
  document.getElementById("userName").textContent =
    currentUser.full_name || currentUser.email;

  // Show My Calculations tab
  document.getElementById("myCalculationsTab").style.display = "block";
}

function showAuthButtons() {
  document.getElementById("authButtons").style.display = "block";
  document.getElementById("userMenu").style.display = "none";

  // Hide My Calculations tab
  document.getElementById("myCalculationsTab").style.display = "none";
}
// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function switchModal(closeId, openId) {
  closeModal(closeId);
  openModal(openId);
}

// Toggle installer fields in signup
function toggleSignupType() {
  const accountType = document.querySelector(
    'input[name="accountType"]:checked',
  ).value;
  const installerFields = document.getElementById("installerFields");

  if (accountType === "installer") {
    installerFields.style.display = "block";
    // Make installer fields required
    document.getElementById("installerName").required = true;
    document.getElementById("installerState").required = true;
    document.getElementById("installerCity").required = true;
  } else {
    installerFields.style.display = "none";
    // Make installer fields optional
    document.getElementById("installerName").required = false;
    document.getElementById("installerState").required = false;
    document.getElementById("installerCity").required = false;
  }
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      // Save token and user info
      authToken = result.data.token;
      currentUser = result.data.user;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Update UI
      showUserMenu();
      closeModal("loginModal");
      alert("Login successful! Welcome back.");

      // Clear form
      document.getElementById("loginForm").reset();
    } else {
      alert("Login failed: " + result.message);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Handle signup
async function handleSignup(e) {
  e.preventDefault();

  const accountType = document.querySelector(
    'input[name="accountType"]:checked',
  ).value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const full_name = document.getElementById("signupName").value;
  const phone_number = document.getElementById("signupPhone").value;

  let endpoint = "/auth/signup";
  let data = { email, password, full_name, phone_number };

  if (accountType === "installer") {
    endpoint = "/auth/signup/installer";
    data = {
      ...data,
      installer_name: document.getElementById("installerName").value,
      state: document.getElementById("installerState").value,
      city: document.getElementById("installerCity").value,
      full_address: document.getElementById("installerAddress").value,
      services_offered: document.getElementById("installerServices").value,
      description: document.getElementById("installerDescription").value,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      // Save token and user info
      authToken = result.data.token;
      currentUser = result.data.user;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Update UI
      showUserMenu();
      closeModal("signupModal");
      alert("Account created successfully! Welcome.");

      // Clear form
      document.getElementById("signupForm").reset();
      toggleSignupType();
    } else {
      alert("Signup failed: " + result.message);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Logout
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  authToken = null;
  currentUser = null;
  showAuthButtons();
  alert("Logged out successfully");
}

// Helper function to get auth headers
function getAuthHeaders() {
  if (authToken) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
  }
  return { "Content-Type": "application/json" };
}
// Tab switching

function switchTab(tabName, clickedElement) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Use the passed element instead of relying on global event
  if (clickedElement) {
    clickedElement.classList.add("active");
  }

  document.getElementById(tabName).classList.add("active");

  if (tabName === "installers") {
    loadInstallers();
  } else if (tabName === "myCalculations") {
    loadMyCalculations();
  }
}

// Load user's past calculations
async function loadMyCalculations() {
  console.log("loadMyCalculations called");
  console.log("authToken:", authToken);
  console.log("API_BASE_URL:", API_BASE_URL);

  const calculationsList = document.getElementById("calculationsList");

  if (!authToken) {
    calculationsList.innerHTML =
      "<p>Please login to view your calculations.</p>";
    return;
  }

  calculationsList.innerHTML =
    '<div class="loading">Loading your calculations...</div>';

  try {
    console.log("Fetching from:", `${API_BASE_URL}/calculations/user/me`);

    const response = await fetch(`${API_BASE_URL}/calculations/user/me`, {
      headers: getAuthHeaders(),
    });

    console.log("Response received:", response);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const result = await response.json();

    console.log("Result:", result);
    console.log("Result success:", result.success);
    console.log(
      "Result data length:",
      result.data ? result.data.length : "no data",
    );

    if (result.success && result.data.length > 0) {
      console.log("Creating calculation cards...");
      calculationsList.innerHTML = result.data
        .map(
          (calc) => `
                <div class="calculation-card">
                    <div class="calculation-header">
                        <h3>📍 ${calc.city}, ${calc.state}</h3>
                        <span class="calculation-date">${new Date(calc.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="calculation-details">
                        <p><strong>System Size:</strong> ${calc.recommended_system_size_kw} kW</p>
                        <p><strong>Estimated Cost:</strong> ₦${parseFloat(calc.estimated_total_cost).toLocaleString()}</p>
                        <p><strong>System Type:</strong> ${calc.system_type}</p>
                        <p><strong>Equipment:</strong> ${calc.equipment_list}</p>
                    </div>
                    <button onclick="viewCalculationDetails(${calc.calculation_id})" style="margin-top: 10px;">View Full Details</button>
                </div>
            `,
        )
        .join("");
      console.log("Cards created successfully");
    } else {
      console.log("No calculations or not successful");
      calculationsList.innerHTML =
        "<p>No calculations yet. Use the calculator to get started!</p>";
    }
  } catch (error) {
    console.error("ERROR caught:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    calculationsList.innerHTML =
      '<div class="error">Error loading calculations: ' +
      error.message +
      "</div>";
  }
}

// View full calculation details
function viewCalculationDetails(calculationId) {
  // Switch to calculator tab and load that specific calculation
  fetch(`${API_BASE_URL}/calculations/${calculationId}`)
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        currentCalculationId = result.data.calculation_id;
        displayResults(result.data);

        document.querySelectorAll(".tab")[0].click();
        document.querySelectorAll(".tab")[0].classList.add("active");
        document.querySelectorAll(".tab")[2].classList.remove("active");

        // Scroll to results
        document
          .getElementById("calculatorResults")
          .scrollIntoView({ behavior: "smooth" });
      }
    })
    .catch((error) => alert("Error loading calculation: " + error.message));
}
// Calculator Form Submission
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("calculatorForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = document.getElementById("calculateBtn");
      btn.disabled = true;
      btn.textContent = "Calculating...";

      const formData = {
        state: document.getElementById("state").value,
        city: document.getElementById("city").value,
        monthly_nepa_bill: parseFloat(
          document.getElementById("nepa_bill").value,
        ),
        monthly_fuel_cost: parseFloat(
          document.getElementById("fuel_cost").value,
        ),
        equipment_list: document.getElementById("equipment_list").value,
        system_type: document.getElementById("system_type").value,
        budget: parseFloat(document.getElementById("budget").value),
        payment_preference: document.getElementById("payment_preference").value,
        has_space: document.getElementById("has_space").value === "true",
      };

      try {
        const response = await fetch(`${API_BASE_URL}/calculations`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          currentCalculationId = result.data.calculation_id;
          displayResults(result.data);
        } else {
          showError("Calculation failed: " + result.message);
        }
      } catch (error) {
        showError("Error connecting to server: " + error.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "Calculate";
      }
    });
});

// Display Results
function displayResults(data) {
  const resultsDiv = document.getElementById("calculatorResults");

  let html = `
        <h3>Your Solar Energy Results</h3>
        
        <p><strong>Location:</strong> ${data.city}, ${data.state}</p>
        <p><strong>Sunlight Quality:</strong> ${data.sunlight_quality}</p>
        
        <h3 style="margin-top: 20px;">Recommended System</h3>
        <p><strong>System Size:</strong> ${
          data.recommended_system_size_kw
        } kW</p>
        <p><strong>Power Requirement:</strong> ${
          data.total_power_requirement_watts
        } Watts</p>
        <p><strong>System Type:</strong> ${data.system_type}</p>
        
        <h3 style="margin-top: 20px;">Cost Analysis</h3>
        <p><strong>Estimated Total Cost:</strong> ₦${parseFloat(
          data.estimated_total_cost,
        ).toLocaleString()}</p>
        <p><strong>Budget Comparison:</strong> ${data.budget_comparison}</p>
        
        <p><strong>Current Monthly Grid+Fuel Cost:</strong> ₦${parseFloat(
          data.current_monthly_grid_fuel_cost,
        ).toLocaleString()}</p>
    `;

  if (data.payment_preference === "installment") {
    html += `
            <h3 style="margin-top: 20px;">Installment Plan</h3>
            <p><strong>Monthly Payment:</strong> ₦${parseFloat(
              data.monthly_installment_amount,
            ).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${
              data.installment_duration_months
            } months</p>
            <p><strong>Total Paid:</strong> ₦${parseFloat(
              data.total_paid_for_solar,
            ).toLocaleString()}</p>
            
            <p style="margin-top: 10px;"><em>Over ${
              data.installment_duration_months
            } months, you'll pay ₦${parseFloat(
              data.total_paid_for_solar,
            ).toLocaleString()} for solar vs ₦${parseFloat(
              data.total_grid_fuel_cost_over_same_period,
            ).toLocaleString()} for grid+fuel.</em></p>
        `;
  }

  html += `
        <div style="margin-top: 20px;">
            <button onclick="emailResults()">📧 Email Results</button>
            <button onclick="findInstallers()" style="margin-left: 10px;">🔍 Find Installers</button>
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;"><strong>Disclaimer:</strong> Prices may vary according to market conditions. The estimated total cost does not include installer workmanship fees.</p>
    `;

  resultsDiv.innerHTML = html;
  resultsDiv.classList.add("show");
}

// Email Results
async function emailResults() {
  if (!currentCalculationId) {
    alert("Please calculate first!");
    return;
  }

  const email = prompt("Enter your email address:");
  const name = prompt("Enter your name (optional):");

  if (!email) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/calculations/${currentCalculationId}/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient_email: email,
          recipient_name: name || "",
        }),
      },
    );

    const result = await response.json();

    if (result.success) {
      alert("✅ Results sent to " + email);
    } else {
      alert("❌ Failed to send email: " + result.message);
    }
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
}

// Find Installers
function findInstallers() {
  switchTab("installers");
  document.querySelectorAll(".tab")[1].classList.add("active");
  document.querySelectorAll(".tab")[0].classList.remove("active");
}

// Load Installers
async function loadInstallers() {
  const installersList = document.getElementById("installersList");
  installersList.innerHTML = '<div class="loading">Loading installers...</div>';

  const filterState = document.getElementById("filterState").value;
  const url = filterState
    ? `${API_BASE_URL}/installers?state=${filterState}`
    : `${API_BASE_URL}/installers`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      installersList.innerHTML = result.data
        .map(
          (installer) => `
                <div class="installer-card">
                    <h3>${installer.installer_name}</h3>
                    <p><strong>Location:</strong> ${installer.city}, ${
                      installer.state
                    }</p>
                    <p><strong>Phone:</strong> ${installer.phone_number}</p>
                    <p><strong>Email:</strong> ${installer.email}</p>
                    ${
                      installer.years_in_business
                        ? `<p><strong>Experience:</strong> ${installer.years_in_business} years</p>`
                        : ""
                    }
                    ${
                      installer.services_offered
                        ? `<p><strong>Services:</strong> ${installer.services_offered}</p>`
                        : ""
                    }
                    ${
                      installer.description
                        ? `<p><em>${installer.description}</em></p>`
                        : ""
                    }
                </div>
            `,
        )
        .join("");
    } else {
      installersList.innerHTML = "<p>No installers found.</p>";
    }
  } catch (error) {
    installersList.innerHTML =
      '<div class="error">Error loading installers: ' +
      error.message +
      "</div>";
  }
}

// Chatbot Functions
function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.classList.toggle("open");
}

function handleChatKeypress(event) {
  if (event.key === "Enter") {
    sendChatMessage();
  }
}

async function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  const messagesDiv = document.getElementById("chatMessages");

  // Add user message
  messagesDiv.innerHTML += `<div class="chat-message user">${message}</div>`;
  input.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // Add loading
  messagesDiv.innerHTML += `<div class="chat-message bot" id="loading">Thinking...</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();

    document.getElementById("loading").remove();

    if (result.success) {
      messagesDiv.innerHTML += `<div class="chat-message bot">${result.message}</div>`;
    } else {
      messagesDiv.innerHTML += `<div class="chat-message bot">Sorry, I couldn't process that. Please try again.</div>`;
    }
  } catch (error) {
    document.getElementById("loading").remove();
    messagesDiv.innerHTML += `<div class="chat-message bot">Error: ${error.message}</div>`;
  }

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showError(message) {
  const resultsDiv = document.getElementById("calculatorResults");
  resultsDiv.innerHTML = `<div class="error">${message}</div>`;
  resultsDiv.classList.add("show");
}
