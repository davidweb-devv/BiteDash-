const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeBtn = document.querySelector("#themeBtn");

// Hamburger Menu Toggle & X Animation
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", open);
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Theme Toggle
if (themeBtn) themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    themeBtn.innerHTML = body.classList.contains("dark") ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// Menu Filters
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".food-card");

filters.forEach(filter => filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;

    cards.forEach(card => {
        const matches = category === "all" || card.dataset.category === category;
        
        if (matches) {
            card.style.display = "block";
            // Tiny delay to allow display change before triggering fade/scale in
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            }, 10);
        } else {
            // Fade out and scale down first
            card.style.opacity = "0";
            card.style.transform = "scale(0.92)";
            // Hide completely after the transition finishes
            setTimeout(() => {
                if (card.style.opacity === "0") {
                    card.style.display = "none";
                }
            }, 300);
        }
    });
}));


// Cart Functionality
let cart = JSON.parse(localStorage.getItem("bitedash-cart") || "[]");
const cartPanel = document.querySelector("#cartPanel"), overlay = document.querySelector("#overlay"), cartItems = document.querySelector("#cartItems"), cartTotal = document.querySelector("#cartTotal"), cartCount = document.querySelector("#cartCount"), toast = document.querySelector("#toast");
const money = v => "₦" + v.toLocaleString("en-NG");

function renderCart() {
    if (!cartCount) return;
    cartCount.textContent = cart.length;
    if (!cart.length) { cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>'; cartTotal.textContent = "₦0"; return; }
    cartItems.innerHTML = cart.map((item, index) => `<div class="cart-row"><div><strong>${item.name}</strong><small>${money(item.price)}</small></div><button class="remove" data-index="${index}">Remove</button></div>`).join("");
    cartTotal.textContent = money(cart.reduce((s, i) => s + i.price, 0));
    document.querySelectorAll(".remove").forEach(btn => btn.addEventListener("click", () => { cart.splice(Number(btn.dataset.index), 1); saveCart(); }));
}
function saveCart() { localStorage.setItem("bitedash-cart", JSON.stringify(cart)); renderCart(); }
function openCart() { cartPanel.classList.add("open"); overlay.classList.add("show"); }
function closeCart() { cartPanel.classList.remove("open"); overlay.classList.remove("show"); }
document.querySelector("#cartBtn")?.addEventListener("click", openCart);
document.querySelector("#closeCart")?.addEventListener("click", closeCart);
overlay?.addEventListener("click", closeCart);
document.querySelectorAll(".add-btn").forEach(button => button.addEventListener("click", () => { cart.push({ name: button.dataset.name, price: Number(button.dataset.price) }); saveCart(); toast?.classList.add("show"); setTimeout(() => toast?.classList.remove("show"), 1400); }));
document.querySelector("#checkout")?.addEventListener("click", () => { if (!cart.length) return alert("Your cart is empty."); alert("Demo checkout: connect this button to your backend/payment provider."); });

// Reviews Carousel
const reviews = [
    { name: "Emy Hawkins", text: "The food arrived quickly and everything tasted fresh. I will definitely order again." },
    { name: "Daniel James", text: "The ordering experience was simple, the portions were great, and delivery was fast." },
    { name: "Amaka Rose", text: "I loved the presentation and the food was still warm when it arrived." }
];
let reviewIndex = 0;
function showReview(i) {
    const text = document.querySelector("#reviewText"), name = document.querySelector("#reviewName");
    if (text && name) { text.textContent = `“${reviews[i].text}”`; name.textContent = reviews[i].name; }
}
document.querySelector("#nextReview")?.addEventListener("click", () => { reviewIndex = (reviewIndex + 1) % reviews.length; showReview(reviewIndex); });
document.querySelector("#prevReview")?.addEventListener("click", () => { reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length; showReview(reviewIndex); });
document.querySelector("#contactForm")?.addEventListener("submit", e => { e.preventDefault(); alert("Thanks! This demo form is ready to connect to a real email/API service."); e.target.reset(); });

// Smooth page fade-in on load
document.addEventListener("DOMContentLoaded", () => {
    // Small timeout ensures the browser registers the initial 0 opacity before fading to 1
    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });
});

// Smooth page fade-out when clicking any internal link or button link
document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");
    // Target any relative internal .html link, ignoring anchors (#) or external links
    if (href && href.endsWith(".html") && !href.startsWith("http") && !href.startsWith("#")) {
        link.addEventListener("click", e => {
            e.preventDefault();
            document.body.style.opacity = "0";
            setTimeout(() => {
                window.location.href = href;
            }, 350); // Matches the CSS transition duration
        });
    }
});

renderCart();
