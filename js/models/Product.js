class Product {
  constructor(
    id,
    name,
    image,
    category,
    price,
    discountPrice = null,
    description = "",
    sku = "",
    rating = { average: 0, count: 0 },
    inventory = { quantity: 0 },
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.category = category;
    this.price = price;
    this.discountPrice = discountPrice;
    this.description = description;
    this.sku = sku;
    this.rating = rating;
    this.inventory = inventory;
  }

  get currentPrice() {
    return this.discountPrice || this.price;
  }

  get hasDiscount() {
    return this.discountPrice && this.discountPrice < this.price;
  }

  get discountPercentage() {
    if (!this.hasDiscount) return 0;
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }

  get inStock() {
    return this.inventory.quantity > 0;
  }
}

export { Product };