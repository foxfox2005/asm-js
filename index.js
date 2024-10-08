let products = [];

async function loadProducts() {
  try {
    const response = await fetch("./resources/product.json");
    const data = await response.json();
    products = data.products;
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderProducts() {
  const newArrivalsGrid = document.getElementById("new-arrivals-grid");
  const topSellingGrid = document.getElementById("top-selling-grid");

  const newArrivalsHTML = products.slice(0, 4).map(createProductCard).join("");
  newArrivalsGrid.innerHTML = newArrivalsHTML;

  const topSellingHTML = products.slice(-4).map(createProductCard).join("");
  topSellingGrid.innerHTML = topSellingHTML;

  addProductClickListeners();
}

function createProductCard(product) {
  return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${
    product.name
  }" class="product-card__image">
            <div class="product-card__info">
                <h3 class="product-card__title">${product.name}</h3>
                <div class="product-card__rating">
                    <span class="product-card__rating-stars">${"★".repeat(
                      Math.floor(product.rating)
                    )}${"☆".repeat(5 - Math.floor(product.rating))}</span>
                    <span class="product-card__rating-number">${
                      product.rating
                    }/5</span>
                </div>
                <div class="product-card__price">
                    <span class="product-card__price-current">$${
                      product.price
                    }</span>
                    ${
                      product.discount
                        ? `
                        <span class="product-card__price-original">$${product.originalPrice}</span>
                        <span class="product-card__discount">-${product.discount}%</span>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `;
}

function addProductClickListeners() {
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      window.location.href = `product/product.html?id=${productId}`;
    });
  });
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

function setupSlideshow() {
  const slideshowContainer = document.querySelector(".hero__slideshow");
  const images = ["./public/rectangle-2@2x.png", "./public/1.png"];

  images.forEach((img, index) => {
    const slide = document.createElement("div");
    slide.className = `hero__slide ${index === 0 ? "active" : ""}`;
    slide.style.backgroundImage = `url(${img})`;
    slideshowContainer.appendChild(slide);
  });

  let currentSlide = 0;
  setInterval(() => {
    const slides = document.querySelectorAll(".hero__slide");
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000); // Change slide every 5 seconds
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartCount();
  setupSlideshow();
});

document.addEventListener("DOMContentLoaded", loadProducts);
