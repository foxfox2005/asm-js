document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    fetchProductDetails(productId);
  } else {
    console.error("No product ID provided");
  }

  function fetchProductDetails(id) {
    fetch("../resources/product.json")
      .then((response) => response.json())
      .then((data) => {
        const product = data.products.find((p) => p.id === parseInt(id));
        if (product) {
          renderProductDetails(product);
        } else {
          console.error("Product not found");
        }
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }

  function renderProductDetails(product) {
    document.querySelector(".product-detail__title").textContent = product.name;
    renderMainImage(product.image);
    document.querySelector(
      ".product-detail__price"
    ).textContent = `$${product.price}`;
    document.querySelector(".product-detail__description").textContent =
      product.description;

    renderRating(product.rating);
    renderSizeOptions(product.sizes);
    renderColorOptions(product.colors);
    renderThumbnails(product.thumbnails || [product.image]);
  }

  function renderMainImage(imageUrl) {
    const mainImageElement = document.querySelector(
      ".product-detail__main-image"
    );
    mainImageElement.innerHTML = `<img src="${imageUrl}" alt="Product Main Image">`;
  }

  function renderRating(rating) {
    const ratingElement = document.querySelector(".product-detail__rating");
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    let starsHTML = "★".repeat(fullStars);
    if (halfStar) starsHTML += "½";
    starsHTML += "☆".repeat(5 - Math.ceil(rating));

    ratingElement.innerHTML = `
      <span class="stars">${starsHTML}</span>
      <span class="rating-value">${rating}/5</span>
    `;
  }

  function renderSizeOptions(sizes) {
    const sizeOptionsElement = document.querySelector(
      ".product-detail__size-options"
    );
    sizeOptionsElement.innerHTML = `
      <h3>Select Size</h3>
      ${sizes
        .map(
          (size) =>
            `<button class="size-option" data-size="${size}">${size}</button>`
        )
        .join("")}
    `;

    // Add event listeners to size buttons
    sizeOptionsElement.querySelectorAll(".size-option").forEach((button) => {
      button.addEventListener("click", function () {
        sizeOptionsElement
          .querySelectorAll(".size-option")
          .forEach((btn) => btn.classList.remove("selected"));
        this.classList.add("selected");
      });
    });
  }

  function renderColorOptions(colors) {
    const colorOptionsElement = document.querySelector(
      ".product-detail__color-options"
    );
    colorOptionsElement.innerHTML = `
      <h3>Select Color</h3>
      ${colors
        .map(
          (color) => `
        <button class="color-option" data-color="${color}" style="background-color: ${color};" title="${color}"></button>
      `
        )
        .join("")}
    `;

    // Add event listeners to color buttons
    colorOptionsElement.querySelectorAll(".color-option").forEach((button) => {
      button.addEventListener("click", function () {
        colorOptionsElement
          .querySelectorAll(".color-option")
          .forEach((btn) => btn.classList.remove("selected"));
        this.classList.add("selected");
      });
    });
  }

  // Add to Cart functionality
  document
    .querySelector(".product-detail__add-to-cart")
    .addEventListener("click", addToCart);

  function addToCart() {
    const product = {
      id: productId,
      name: document.querySelector(".product-detail__title").textContent,
      price: parseFloat(
        document
          .querySelector(".product-detail__price")
          .textContent.replace("$", "")
      ),
      image: document.querySelector(".product-detail__main-image img").src,
      size: document.querySelector(".size-option.selected")?.dataset.size,
      color: document.querySelector(".color-option.selected")?.dataset.color,
      quantity: parseInt(
        document.querySelector(".product-detail__quantity input").value
      ),
    };

    if (!product.size || !product.color) {
      alert("Please select size and color before adding to cart.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
    );

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += product.quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
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
  function setupQuantityControls() {
    const minusBtn = document.querySelector(".quantity-btn.minus");
    const plusBtn = document.querySelector(".quantity-btn.plus");
    const quantityInput = document.getElementById("productQuantity");

    minusBtn.addEventListener("click", () => {
      if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });

    plusBtn.addEventListener("click", () => {
      if (quantityInput.value < 99) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
      }
    });

    quantityInput.addEventListener("change", () => {
      if (quantityInput.value < 1) quantityInput.value = 1;
      if (quantityInput.value > 99) quantityInput.value = 99;
    });
  }

  document.addEventListener("DOMContentLoaded", setupQuantityControls);
});