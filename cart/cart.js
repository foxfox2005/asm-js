document.addEventListener("DOMContentLoaded", function () {
  renderCart();
  setupCheckoutButton();
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsElement = document.getElementById("cartItems");
  const subtotalElement = document.getElementById("cartSubtotal");
  const totalElement = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItemsElement.innerHTML = "<p>Your cart is empty.</p>";
    subtotalElement.textContent = "$0.00";
    totalElement.textContent = "$0.00";
    return;
  }

  let subtotal = 0;
  cartItemsElement.innerHTML = cart
    .map((item, index) => {
      subtotal += item.price * item.quantity;
      return `
        <div class="cart__item">
          <img src="${item.image}" alt="${item.name}" class="cart__item-image">
          <div class="cart__item-details">
            <h3 class="cart__item-name">${item.name}</h3>
            <p>Size: ${item.size}</p>
            <p>Color: ${item.color}</p>
            <div class="cart__item-quantity">
              <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
              <input type="number" value="${item.quantity}" min="1" max="99" onchange="updateQuantity(${index}, this.value)">
              <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <p class="cart__item-price">$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button class="cart__item-remove" onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
    })
    .join("");

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  totalElement.textContent = `$${subtotal.toFixed(2)}`;
}

function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (typeof change === "number") {
    cart[index].quantity += change;
  } else {
    cart[index].quantity = parseInt(change);
  }
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  if (cart[index].quantity > 99) cart[index].quantity = 99;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? "block" : "none";
  }
}

function setupCheckoutButton() {
  const checkoutButton = document.querySelector(".cart__checkout");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", handleCheckout);
  }
}

function handleCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  window.location.href = "checkout.html";
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
}