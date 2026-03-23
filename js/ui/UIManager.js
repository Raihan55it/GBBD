class UIManager {
  constructor(productManager, bannerClass, orderSectionClass, categoryClass, searchInputId, scrollBtnId, filterItem, searchIcon) {
    this.ProductManager = productManager;
    this.banner = document.querySelector(bannerClass);
    this.orderSection = document.querySelector(orderSectionClass);
    this.scrollBtn = document.getElementById(scrollBtnId);
    this.setupFilterItem(filterItem, searchIcon);
    this.setupCategoryButtons(categoryClass);
    this.setupSearch(searchInputId);
    this.setupScrollButtons();
  }

  setupFilterItem(filterItem, searchIcon) {
    if (filterItem && searchIcon) {
      const filterElement = document.querySelector(filterItem);
      const searchElement = document.querySelector(searchIcon);

      if (filterElement) {
        filterElement.addEventListener("click", () => {
          console.log("Filter clicked");
        });
      }
    }
  }

  setupCategoryButtons(categoryClass) {
    document.querySelectorAll(categoryClass).forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        if (this.banner) this.banner.style.display = "none";
        if (this.orderSection) this.orderSection.style.display = "none";
        if (category === "All") {
          this.ProductManager.displayProducts();
        } else {
          const filterdProducts = this.ProductManager.filterByCategory(category);
          this.ProductManager.displayProducts(filterdProducts);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  setupSearch(searchInputId) {
    const searchInput = document.getElementById(searchInputId);
    if (!searchInput) return;
    
    searchInput.addEventListener(
      "input",
      this.debounce(() => {
        if (searchInput.value.trim() !== "") {
          if (this.banner) this.banner.style.display = "none";
        }
        const query = searchInput.value.toLocaleLowerCase();
        const filterdProducts = this.ProductManager.searchProducts(query);
        this.ProductManager.displayProducts(filterdProducts);
      }, 300),
    );
  }

  setupScrollButtons() {
    if (!this.scrollBtn) return;
    
    window.onscroll = () => {
      this.scrollBtn.style.display = window.scrollY > 20 ? "block" : "none";
    };
    this.scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  showLoadingState(container) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    `;
  }

  hideLoadingState(container) {
    const loadingContainer = container.querySelector('.loading-container');
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  showErrorMessage(container, message) {
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
        <button onclick="location.reload()" class="retry-btn">Retry</button>
      </div>
    `;
  }

  updatePageTitle(title) {
    document.title = `${title} - BD eBazar`;
  }

  updateMetaDescription(description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = description;
    }
  }

  setActiveCategory(categoryName) {
    document.querySelectorAll(".pro-cat-li li").forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-category") === categoryName) {
        button.classList.add("active");
      }
    });
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("active");
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }
  }

  setupMobileMenuToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const mobileMenu = document.querySelector(".mobile-menu");
      const menuToggle = document.querySelector(".menu-toggle");
      
      if (mobileMenu && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach((element) => {
      element.addEventListener("mouseenter", (e) => {
        this.showTooltip(e.target, e.target.getAttribute("data-tooltip"));
      });
      
      element.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + "px";
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
  }

  hideTooltip() {
    const tooltip = document.querySelector(".tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }
}

export { UIManager };