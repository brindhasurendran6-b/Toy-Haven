/* =========================================================
   TOY HAVEN JAVASCRIPT

   1. Shared helpers and localStorage
   2. Home page
   3. Products: search, filters and modal
   4. Cart: quantity and totals
   5. Checkout: validation and order history
   6. Collection/Wishlist: statuses
   7. Support: feedback and FAQ
   8. Navigation, animation and PWA
   ========================================================= */

const CART_KEY = "toyHavenCart";
const WISHLIST_KEY = "toyHavenWishlist";
const ORDERS_KEY = "toyHavenOrders";
const FEEDBACK_KEY = "toyHavenFeedback";
const NEWSLETTER_KEY = "toyHavenNewsletter";

/* Shared helpers */
function money(value) {
    return `£${Number(value).toFixed(2)}`;
}

function getStore(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch {
        return fallback;
    }
}

function setStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function productById(id) {
    return PRODUCTS.find(product => product.id === Number(id));
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

/* Cart */
function getCart() {
    return getStore(CART_KEY, []);
}

function saveCart(cart) {
    setStore(CART_KEY, cart);
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = total;
    });
}

function addToCart(id) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    saveCart(cart);
    showToast("Added to cart");
}

function removeFromCart(id) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== id);

    saveCart(newCart);
    renderCart();
    showToast("Removed from cart");
}

function cartTotal() {
    const cart = getCart();

    return cart.reduce((sum, item) => {
        const product = productById(item.id);
        if (!product) return sum;

        return sum + product.price * item.quantity;
    }, 0);
}

/* Product card */
function productCard(product) {
    return `
        <article class="product-card reveal">
            <button class="product-image" data-view="${product.id}"
                aria-label="View ${product.name}">
                <img src="${product.image}" alt="${product.name}">
            </button>

            <div class="product-info">
                <span class="tag">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="price">${money(product.price)}</p>

                <div class="card-actions">
                    <button class="btn small" data-add="${product.id}">
                        Add to Cart
                    </button>

                    <button class="heart-btn" data-wish="${product.id}"
                        aria-label="Add ${product.name} to collection">
                        ♡
                    </button>
                </div>
            </div>
        </article>
    `;
}

/* Hero slider */
function initHeroSlider() {
    const title = document.getElementById("hero-title");
    const text = document.getElementById("hero-text");
    const dots = document.getElementById("hero-dots");

    if (!title || !text || !dots) return;

    const slides = [
        ["BUILD IT. PLAY IT. KEEP IT.",
         "Discover clever toys, collectible figures, family games and tiny cars."],
        ["MAKE ROOM FOR IMAGINATION.",
         "Build a rocket, meet a robot or start a new adventure."],
        ["SMALL TOYS. BIG STORIES.",
         "Find an easy-to-love gift for collectors, kids and game fans."],
        ["YOUR NEXT FAVOURITE IS HERE.",
         "Browse the Haven shelf and choose something fun."]
    ];

    let active = 0;
    dots.innerHTML = "";

    slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.className = index === 0 ? "active" : "";
        dot.textContent = String(index + 1).padStart(2, "0");

        dot.addEventListener("click", () => {
            active = index;
            updateSlide();
        });

        dots.appendChild(dot);
    });

    const previous = document.createElement("button");
    previous.className = "hero-arrow hero-prev";
    previous.textContent = "←";
    previous.setAttribute("aria-label", "Previous slide");

    const next = document.createElement("button");
    next.className = "hero-arrow hero-next";
    next.textContent = "→";
    next.setAttribute("aria-label", "Next slide");

    const hero = document.querySelector(".hero");

    if (hero) {
        hero.appendChild(previous);
        hero.appendChild(next);
    }

    previous.addEventListener("click", () => {
        active = (active - 1 + slides.length) % slides.length;
        updateSlide();
    });

    next.addEventListener("click", () => {
        active = (active + 1) % slides.length;
        updateSlide();
    });

    function updateSlide() {
        title.textContent = slides[active][0];
        text.textContent = slides[active][1];

        dots.querySelectorAll("button").forEach((dot, index) => {
            dot.classList.toggle("active", index === active);
        });
    }

    setInterval(() => {
        active = (active + 1) % slides.length;
        updateSlide();
    }, 5000);
}

/* Home */
function renderFeatured() {
    const featured = document.getElementById("featured-product");
    if (!featured) return;

    const index = new Date().getDate() % PRODUCTS.length;
    featured.innerHTML = productCard(PRODUCTS[index]);
}

function renderHome() {
    const grid = document.getElementById("home-product-grid");

    renderFeatured();
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map(productCard).join("");
}

/* Products */
function renderProducts() {
    const grid = document.getElementById("product-grid");
    const search = document.getElementById("product-search");

    if (!grid) return;

    const filters = document.getElementById("category-filters");
    const activeCategory = filters?.dataset.category || "All";
    const term = (search?.value || "").toLowerCase().trim();

    const list = PRODUCTS.filter(product => {
        const categoryMatch =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchMatch =
            product.name.toLowerCase().includes(term);

        return categoryMatch && searchMatch;
    });

    if (list.length) {
        grid.innerHTML = list.map(productCard).join("");
    } else {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>
        `;
    }

    const count = document.getElementById("product-count");
    if (count) count.textContent = `(${list.length})`;
}

function initProducts() {
    const filters = document.getElementById("category-filters");
    const search = document.getElementById("product-search");

    if (!filters) return;

    const categories = [
        "All",
        ...new Set(PRODUCTS.map(product => product.category))
    ];

    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");

    let activeCategory =
        categories.includes(requestedCategory)
            ? requestedCategory
            : "All";

    filters.dataset.category = activeCategory;

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.className =
            category === activeCategory ? "active" : "";

        button.addEventListener("click", () => {
            activeCategory = category;
            filters.dataset.category = activeCategory;

            filters.querySelectorAll("button").forEach(button => {
                button.classList.remove("active");
            });

            button.classList.add("active");
            renderProducts();
        });

        filters.appendChild(button);
    });

    search?.addEventListener("input", renderProducts);
    renderProducts();
}

/* Product modal */
function openProductModal(id) {
    const product = productById(id);
    const modal = document.getElementById("product-modal");
    const content = document.getElementById("modal-content");

    if (!product || !modal || !content) return;

    const collection = getStore(WISHLIST_KEY, {});
    const status = collection[id] || "Interested";

    content.innerHTML = `
        <div class="modal-product">
            <img src="${product.image}" alt="${product.name}">

            <div>
                <span class="tag">${product.category}</span>
                <h2 id="modal-title">${product.name}</h2>
                <p>${product.description}</p>
                <strong class="modal-price">${money(product.price)}</strong>

                <label>
                    Collection Status
                    <select data-modal-status="${product.id}">
                        <option value="Interested"
                            ${status === "Interested" ? "selected" : ""}>
                            Interested
                        </option>
                        <option value="Owned"
                            ${status === "Owned" ? "selected" : ""}>
                            Owned
                        </option>
                        <option value="Not Interested"
                            ${status === "Not Interested" ? "selected" : ""}>
                            Not Interested
                        </option>
                    </select>
                </label>

                <button class="btn" data-add="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    const modal = document.getElementById("product-modal");
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

/* Collection */
function getWishlist() {
    return getStore(WISHLIST_KEY, {});
}

function saveWishlist(data) {
    setStore(WISHLIST_KEY, data);
}

function toggleWishlist(id) {
    const list = getWishlist();

    if (list[id]) {
        delete list[id];
        showToast("Removed from collection");
    } else {
        list[id] = "Interested";
        showToast("Saved to collection");
    }

    saveWishlist(list);
}

function removeFromWishlist(id) {
    const list = getWishlist();

    delete list[id];
    saveWishlist(list);
    renderWishlist();

    showToast("Removed from collection");
}

function renderWishlist() {
    const container = document.getElementById("wishlist-list");
    if (!container) return;

    const list = getWishlist();
    const ids = Object.keys(list);

    if (!ids.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Your collection is empty</h2>
                <p>Open the Shop page and save a product.</p>
                <a class="btn" href="products.html">Go to Shop</a>
            </div>
        `;
        return;
    }

    container.innerHTML = ids.map(id => {
        const product = productById(id);
        if (!product) return "";

        return `
            <article class="collection-card">
                <img src="${product.image}" alt="${product.name}">

                <div>
                    <span class="tag">${product.category}</span>
                    <h2>${product.name}</h2>
                    <p>${money(product.price)}</p>

                    <label>
                        Status
                        <select data-status="${product.id}">
                            <option value="Interested"
                                ${list[id] === "Interested" ? "selected" : ""}>
                                Interested
                            </option>
                            <option value="Owned"
                                ${list[id] === "Owned" ? "selected" : ""}>
                                Owned
                            </option>
                            <option value="Not Interested"
                                ${list[id] === "Not Interested" ? "selected" : ""}>
                                Not Interested
                            </option>
                        </select>
                    </label>

                    <div class="card-actions">
                        <button class="btn small" data-add="${product.id}">
                            Add to Cart
                        </button>

                        <button class="btn small btn-dark"
                            data-remove-wish="${product.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function initWishlistStatus() {
    document.addEventListener("change", event => {
        const select = event.target.closest("[data-status]");
        if (!select) return;

        const list = getWishlist();
        list[select.dataset.status] = select.value;

        saveWishlist(list);
        showToast("Collection updated");
    });
}

/* Cart page */
function renderCart() {
    const list = document.getElementById("cart-list");
    const summary = document.getElementById("cart-summary");

    if (!list || !summary) return;

    const cart = getCart();

    if (!cart.length) {
        list.innerHTML = `
            <div class="empty-state">
                <h2>Your basket is empty</h2>
                <p>Add something from the Shop page.</p>
                <a class="btn" href="products.html">Shop now</a>
            </div>
        `;

        summary.innerHTML = "";
        return;
    }

    list.innerHTML = cart.map(item => {
        const product = productById(item.id);
        if (!product) return "";

        return `
            <article class="cart-item">
                <img src="${product.image}" alt="${product.name}">

                <div class="cart-details">
                    <h2>${product.name}</h2>
                    <p>${money(product.price)} each</p>

                    <div class="quantity">
                        <button data-qty="${product.id}" data-change="-1">
                            −
                        </button>

                        <strong>${item.quantity}</strong>

                        <button data-qty="${product.id}" data-change="1">
                            +
                        </button>
                    </div>

                    <button class="btn small btn-dark"
                        data-remove-cart="${product.id}">
                        Remove
                    </button>
                </div>

                <strong>
                    ${money(product.price * item.quantity)}
                </strong>
            </article>
        `;
    }).join("");

    summary.innerHTML = `
        <h2>Order summary</h2>

        <div class="summary-row">
            <span>Items</span>
            <strong>${cart.reduce((sum, item) => sum + item.quantity, 0)}</strong>
        </div>

        <div class="summary-row total">
            <span>Total</span>
            <strong>${money(cartTotal())}</strong>
        </div>

        <button class="btn btn-dark" data-clear-cart>
            Clear cart
        </button>

        <a class="btn" href="checkout.html">
            Proceed to checkout
        </a>
    `;
}

function changeQuantity(id, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    const newCart = cart.filter(item => item.quantity > 0);

    saveCart(newCart);
    renderCart();
}

/* Validation */
function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(name, email, text, type) {
    if (name.length < 2) return false;
    if (!validEmail(email)) return false;
    if (text.length < 5) return false;

    if (type === "checkout" && text.length < 8) {
        return false;
    }

    return true;
}

/* Checkout */
function renderCheckout() {
    const summary =
        document.getElementById("checkout-summary");

    if (!summary) return;

    const cart = getCart();

    if (!cart.length) {
        summary.innerHTML = `
            <div class="empty-state">
                <h2>No items to checkout</h2>
                <a class="btn" href="products.html">Shop first</a>
            </div>
        `;
        return;
    }

    summary.innerHTML = `
        <h2>Your order</h2>

        ${cart.map(item => {
            const product = productById(item.id);
            if (!product) return "";

            return `
                <div class="summary-row">
                    <span>${product.name} × ${item.quantity}</span>
                    <strong>${money(product.price * item.quantity)}</strong>
                </div>
            `;
        }).join("")}

        <div class="summary-row total">
            <span>Total</span>
            <strong>${money(cartTotal())}</strong>
        </div>
    `;
}

function initCheckout() {
    const form =
        document.getElementById("checkout-form");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name =
            document.getElementById("checkout-name").value.trim();

        const email =
            document.getElementById("checkout-email").value.trim();

        const address =
            document.getElementById("checkout-address").value.trim();

        const message =
            document.getElementById("checkout-message");

        if (!validateForm(name, email, address, "checkout")) {
            message.textContent =
                "Please enter a valid name, email and delivery address.";

            message.className =
                "form-message error";

            return;
        }

        const cart = getCart();

        if (!cart.length) {
            message.textContent = "Your cart is empty.";
            message.className = "form-message error";
            return;
        }

        const payment =
            new FormData(form).get("payment");

        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            name: name,
            email: email,
            address: address,
            payment: payment,
            items: cart,
            total: cartTotal()
        };

        const orders =
            getStore(ORDERS_KEY, []);

        orders.push(order);
        setStore(ORDERS_KEY, orders);

        localStorage.removeItem(CART_KEY);
        updateCartCount();

        form.reset();
        renderCheckout();

        message.textContent = "";

        const box =
            document.getElementById("success-box");

        box.innerHTML = `
            <div>
                <span>✓</span>
                <h2>Order confirmed!</h2>
                <p>
                    Thanks ${name}. Your order has been saved
                    in order history.
                </p>
                <a class="btn" href="index.html">
                    Back to home
                </a>
            </div>
        `;

        box.classList.add("show");
        box.setAttribute("aria-hidden", "false");
    });
}

/* Support */
function initSupport() {
    const form =
        document.getElementById("feedback-form");

    const faq =
        document.getElementById("faq-list");

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const name =
                document.getElementById("feedback-name").value.trim();

            const email =
                document.getElementById("feedback-email").value.trim();

            const message =
                document.getElementById("feedback-message").value.trim();

            const status =
                document.getElementById("feedback-status");

            if (!validateForm(name, email, message, "feedback")) {
                status.textContent =
                    "Please complete all fields with valid information.";

                status.className =
                    "form-message error";

                return;
            }

            const feedback =
                getStore(FEEDBACK_KEY, []);

            feedback.push({
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            });

            setStore(FEEDBACK_KEY, feedback);

            form.reset();

            status.textContent =
                "Thanks! Your feedback was saved.";

            status.className =
                "form-message success";
        });
    }

    if (faq) {
        const questions = [
            ["How do I add a product to my basket?",
             "Open Shop and press Add to Cart. The basket count updates automatically."],
            ["Does my basket stay after I close the browser?",
             "Yes. The project stores basket data in localStorage."],
            ["Can I track collection status?",
             "Yes. Save a product, then choose Interested, Owned or Not Interested."],
            ["Is payment real?",
             "No. Checkout is a front-end simulation for the assignment."]
        ];

        faq.innerHTML = questions.map((question, index) => `
            <div class="faq-item">
                <button aria-expanded="false" data-faq="${index}">
                    ${question[0]}
                    <span>+</span>
                </button>

                <div class="faq-answer">
                    ${question[1]}
                </div>
            </div>
        `).join("");

        faq.addEventListener("click", event => {
            const button =
                event.target.closest("[data-faq]");

            if (!button) return;

            const item = button.parentElement;
            const open = item.classList.toggle("open");

            button.setAttribute("aria-expanded", open);
            button.querySelector("span").textContent =
                open ? "−" : "+";
        });
    }
}

/* Newsletter */
function initNewsletter() {
    const form =
        document.getElementById("newsletter-form");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email =
            document.getElementById("newsletter-email")
                .value.trim();

        const message =
            document.getElementById("newsletter-message");

        if (!validEmail(email)) {
            message.textContent =
                "Please enter a valid email.";

            message.className =
                "form-message error";

            return;
        }

        setStore(NEWSLETTER_KEY, email);

        message.textContent =
            "You're on the list!";

        message.className =
            "form-message success";

        form.reset();
    });
}

/* Global clicks */
function initGlobalClicks() {
    document.addEventListener("click", event => {

        const add =
            event.target.closest("[data-add]");

        if (add) {
            addToCart(Number(add.dataset.add));
            return;
        }

        const wish =
            event.target.closest("[data-wish]");

        if (wish) {
            toggleWishlist(Number(wish.dataset.wish));
            renderWishlist();
            return;
        }

        const removeWish =
            event.target.closest("[data-remove-wish]");

        if (removeWish) {
            removeFromWishlist(
                Number(removeWish.dataset.removeWish)
            );
            return;
        }

        const view =
            event.target.closest("[data-view]");

        if (view) {
            openProductModal(Number(view.dataset.view));
            return;
        }

        const quantity =
            event.target.closest("[data-qty]");

        if (quantity) {
            changeQuantity(
                Number(quantity.dataset.qty),
                Number(quantity.dataset.change)
            );
            return;
        }

        const removeCart =
            event.target.closest("[data-remove-cart]");

        if (removeCart) {
            removeFromCart(
                Number(removeCart.dataset.removeCart)
            );
            return;
        }

        if (event.target.closest("[data-clear-cart]")) {
            localStorage.removeItem(CART_KEY);
            updateCartCount();
            renderCart();
            showToast("Cart cleared");
            return;
        }

        if (
            event.target.closest(".modal-close") ||
            event.target.id === "product-modal"
        ) {
            closeModal();
        }
    });

    document.addEventListener("change", event => {
        const modalStatus =
            event.target.closest("[data-modal-status]");

        if (!modalStatus) return;

        const list = getWishlist();

        list[modalStatus.dataset.modalStatus] =
            modalStatus.value;

        saveWishlist(list);
        showToast("Collection updated");
    });
}

/* Mobile navigation */
function initNavigation() {
    const toggle =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".site-nav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");

        toggle.setAttribute(
            "aria-expanded",
            open
        );
    });
}

/* Reveal animation */
function initReveal() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal").forEach(element => {
            element.classList.add("visible");
        });
        return;
    }

    const observer =
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(element => {
        observer.observe(element);
    });
}

/* PWA */
function registerPWA() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("sw.js")
            .catch(() => {});
    }
}

/* Start application */
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    initNavigation();
    initGlobalClicks();
    initWishlistStatus();
    initHeroSlider();
    renderHome();
    initProducts();
    renderWishlist();
    renderCart();
    renderCheckout();
    initCheckout();
    initSupport();
    initNewsletter();
    initReveal();
    registerPWA();
});