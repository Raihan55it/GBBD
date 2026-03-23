import { Helpers } from '../utils/Helpers.js';

class ProductService {
    constructor(products) {
        console.log('ProductService constructor - products:', products?.length || 0);
        this.allProducts = products ? products.map(p => Helpers.enrichProduct(p)) : [];
        console.log('Enriched products:', this.allProducts.length);
        this.filteredProducts = [...this.allProducts];
        this.currentCategory = 'All';
        this.currentSort = 'default';
        this.currentSearch = '';
    }

    getProducts() {
        return this.filteredProducts;
    }

    getAllProducts() {
        return this.allProducts;
    }

    getCategories() {
        const categories = [...new Set(this.allProducts.map(p => p.category))];
        return ['All', ...categories];
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.applyFilters();
        return this.filteredProducts;
    }

    filterBySearch(query) {
        this.currentSearch = query.toLowerCase().trim();
        this.applyFilters();
        return this.filteredProducts;
    }

    sortProducts(sortBy) {
        this.currentSort = sortBy;
        this.applyFilters();
        return this.filteredProducts;
    }

    applyFilters() {
        let products = [...this.allProducts];

        // Apply category filter
        if (this.currentCategory && this.currentCategory !== 'All') {
            products = products.filter(p => p.category === this.currentCategory);
        }

        // Apply search filter
        if (this.currentSearch) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(this.currentSearch) ||
                p.category.toLowerCase().includes(this.currentSearch) ||
                p.description?.toLowerCase().includes(this.currentSearch)
            );
        }

        // Apply sorting
        switch (this.currentSort) {
            case 'price-low':
                products.sort((a, b) => a.currentPrice - b.currentPrice);
                break;
            case 'price-high':
                products.sort((a, b) => b.currentPrice - a.currentPrice);
                break;
            case 'rating':
                products.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
                break;
            case 'name-asc':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Keep original order
                break;
        }

        this.filteredProducts = products;
        return this.filteredProducts;
    }

    getProductById(id) {
        return this.allProducts.find(p => p.id === id);
    }

    getProductsByCategory(category) {
        if (category === 'All') return this.allProducts;
        return this.allProducts.filter(p => p.category === category);
    }

    getRelatedProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];
        
        return this.allProducts
            .filter(p => p.id !== productId && p.category === product.category)
            .slice(0, limit);
    }

    getFeaturedProducts(limit = 8) {
        return [...this.allProducts]
            .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
            .slice(0, limit);
    }

    getOnSaleProducts() {
        return this.allProducts.filter(p => p.hasDiscount);
    }

    getTotalCount() {
        return this.filteredProducts.length;
    }

    resetFilters() {
        this.currentCategory = 'All';
        this.currentSort = 'default';
        this.currentSearch = '';
        this.filteredProducts = [...this.allProducts];
        return this.filteredProducts;
    }
}

export default ProductService;
