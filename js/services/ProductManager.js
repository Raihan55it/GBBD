import { Product } from '../models/Product.js';

class ProductManager {
  constructor(products, containerId) {
    this.products = products.map(
      (p) =>
        new Product(
          p.id,
          p.name,
          p.image,
          p.category,
          p.price,
          p.discountPrice,
          p.description,
          p.sku,
          p.rating,
          p.inventory,
        ),
    );
    this.container = document.getElementById(containerId);
  }

  displayProducts(filterdProducts = this.products) {
    console.log("DisplayProducts called");
    console.log("Container:", this.container);
    console.log("Products to display:", filterdProducts);
    
    if (!this.container) {
      console.error("Container not found!");
      return;
    }
    
    this.container.innerHTML = "";
    filterdProducts.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("card-pro");

      const cardImg = document.createElement("img");
      cardImg.classList.add("card-img");
      cardImg.src = product.image;
      cardImg.alt = product.name;

      const productName = document.createElement("h3");
      productName.innerText = product.name;

      const priceContainer = document.createElement("div");
      priceContainer.classList.add("price-container");

      // Determine current price and discount
      const hasDiscount =
        product.discountPrice && product.discountPrice < product.price;
      const currentPrice = hasDiscount ? product.discountPrice : product.price;

      const priceElement = document.createElement("span");
      priceElement.classList.add("current-price");
      priceElement.innerText = `৳${currentPrice}`;

      if (hasDiscount) {
        const originalPrice = document.createElement("span");
        originalPrice.classList.add("original-price");
        originalPrice.innerText = `৳${product.price}`;

        const discountPercentage = Math.round(
          ((product.price - currentPrice) / product.price) * 100,
        );
        const discountBadge = document.createElement("span");
        discountBadge.classList.add("discount-badge");
        discountBadge.innerText = `${discountPercentage}% OFF`;

        priceContainer.append(originalPrice, priceElement, discountBadge);
      } else {
        priceContainer.append(priceElement);
      }

      const ratingContainer = document.createElement("div");
      ratingContainer.classList.add("rating-container");

      const stars = document.createElement("span");
      stars.classList.add("stars");
      const rating =
        product.rating && product.rating.average ? product.rating.average : 4.0; // Default rating if not provided
      stars.innerHTML =
        "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));

      const ratingCount = document.createElement("span");
      ratingCount.classList.add("rating-count");
      const count =
        product.rating && product.rating.count ? product.rating.count : 0; // Default count if not provided
      ratingCount.innerText = `(${count})`;

      ratingContainer.append(stars, ratingCount);

      const stockStatus = document.createElement("div");
      stockStatus.classList.add("stock-status");
      const inStock =
        (product.inventory && product.inventory.quantity
          ? product.inventory.quantity
          : 0) > 0;
      stockStatus.innerText = inStock ? "In Stock" : "Out of Stock";
      stockStatus.style.color = inStock ? "#28a745" : "#dc3545";

      const desDiv = document.createElement("div");
      desDiv.classList.add("des-div");

      const btnDiv = document.createElement("div");
      btnDiv.classList.add("btn-div");

      const addCart = document.createElement("button");
      addCart.innerText = "ADD to Cart";
      addCart.classList.add("add-cart");
      const inStock2 =
        (product.inventory && product.inventory.quantity
          ? product.inventory.quantity
          : 0) > 0;
      addCart.disabled = !inStock2;
      addCart.addEventListener("click", () => window.cart.addItem(product));

      const orderNowBtn = document.createElement("button");
      orderNowBtn.classList.add("order-now-btn");
      orderNowBtn.innerText = "Order Now";
      orderNowBtn.disabled = !inStock;
      orderNowBtn.addEventListener("click", () => window.viewProductDetails(product));

      btnDiv.append(addCart, orderNowBtn);
      desDiv.append(
        productName,
        priceContainer,
        ratingContainer,
        stockStatus,
        btnDiv,
      );
      card.append(cardImg, desDiv);
      this.container.append(card);
    });
  }

  filterByCategory(category) {
    if (category === "All") {
      return this.products;
    }
    return this.products.filter((p) => p.category === category);
  }

  searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }

  getProductsByCategory(category) {
    if (category === "All") {
      return this.products;
    }
    return this.products.filter((p) => p.category === category);
  }

  getFeaturedProducts(limit = 8) {
    return this.products
      .filter((p) => p.rating && p.rating.average >= 4.5)
      .slice(0, limit);
  }
}

export { ProductManager };