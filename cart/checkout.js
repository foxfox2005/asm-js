document.addEventListener("DOMContentLoaded", function () {
  loadOrderSummary();
  setupCheckoutForm();
});

function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderItemsElement = document.getElementById("orderItems");
  const orderTotalElement = document.getElementById("orderTotal");

  let total = 0;
  const orderItemsHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      return `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    })
    .join("");

  orderItemsElement.innerHTML = orderItemsHTML;
  orderTotalElement.textContent = `$${total.toFixed(2)}`;
}

function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      fullName: document.getElementById("fullName").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      paymentMethod: document.getElementById("paymentMethod").value,
    };

    processPayment(formData);
  });
}

function processPayment(formData) {
  // Simulated API call
  simulatePaymentAPI(formData)
    .then((response) => {
      alert("Payment successful! Your order has been placed.");
      localStorage.removeItem("cart");
      window.location.href = "../index.html"; // Redirect to home page
    })
    .catch((error) => {
      alert(`Payment failed: ${error.message}`);
    });
}

function simulatePaymentAPI(formData) {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve({
          status: "success",
          message: "Payment processed successfully",
        });
      } else {
        reject(new Error("Payment declined"));
      }
    }, 2000);
  });
}
