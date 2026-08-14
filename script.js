let cart = [];


// ===============================
// CART
// ===============================

function addToCart(name, price) {

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();

    // Small visual feedback
    const count = document.getElementById("cartCount");

    count.style.transform = "scale(1.4)";

    setTimeout(() => {
        count.style.transform = "scale(1)";
    }, 200);
}


function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString();

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
            </div>
        `;

        return;
    }


    cartItems.innerHTML = cart.map((item, index) => {

        const itemTotal = item.price * item.quantity;

        return `
            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>
                    <p>Rs. ${itemTotal.toLocaleString()}</p>
                </div>

                <div class="qty">

                    <button onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <strong>${item.quantity}</strong>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


function openCart() {

    document.getElementById("cartOverlay")
        .classList.add("open");

    document.body.style.overflow = "hidden";
}


function closeCart(event) {

    if (event && event.target !== event.currentTarget) {
        return;
    }

    document.getElementById("cartOverlay")
        .classList.remove("open");

    document.body.style.overflow = "";
}


// ===============================
// MENU FILTER
// ===============================

function filterMenu(category, button) {

    document.querySelectorAll(".category")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");


    document.querySelectorAll(".food-card")
        .forEach(card => {

            if (
                category === "all" ||
                card.dataset.category === category
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });
}


// ===============================
// CHECKOUT
// ===============================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add something first.");

        return;
    }

    closeCart();

    let total = calculateTotal();

    document.getElementById("finalTotal")
        .textContent = total.toLocaleString();

    document.getElementById("orderOverlay")
        .classList.add("open");

    document.body.style.overflow = "hidden";
}


function closeOrder() {

    document.getElementById("orderOverlay")
        .classList.remove("open");

    document.body.style.overflow = "";
}


function calculateTotal() {

    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}


// ===============================
// DELIVERY / PICKUP
// ===============================

document.getElementById("orderType")
    .addEventListener("change", function () {

        const addressField =
            document.getElementById("addressField");

        const address =
            document.getElementById("customerAddress");

        if (this.value === "pickup") {

            addressField.style.display = "none";
            address.required = false;

        } else {

            addressField.style.display = "grid";
            address.required = true;

        }

    });


// ===============================
// WHATSAPP ORDER
// ===============================

document.getElementById("orderForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }


        const name =
            document.getElementById("customerName").value.trim();

        const phone =
            document.getElementById("customerPhone").value.trim();

        const type =
            document.getElementById("orderType").value;

        const address =
            document.getElementById("customerAddress").value.trim();

        const notes =
            document.getElementById("orderNotes").value.trim();


        let message = "🍗 *NEW BIRYANI ORDER*%0A";
        message += "====================%0A%0A";

        message += `👤 *Customer:* ${name}%0A`;
        message += `📞 *Phone:* ${phone}%0A`;
        message += `📦 *Order Type:* ${type === "delivery" ? "Delivery" : "Pickup"}%0A`;


        if (type === "delivery") {
            message += `📍 *Address:* ${address}%0A`;
        }


        message += "%0A🍛 *ORDER ITEMS*%0A";


        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            message +=
                `• ${item.name} × ${item.quantity} = Rs. ${itemTotal}%0A`;

        });


        const total = calculateTotal();

        message += `%0A💰 *TOTAL: Rs. ${total}*%0A`;


        if (notes) {
            message += `%0A📝 *Notes:* ${notes}%0A`;
        }


        message += "%0AThank you! ❤️";


        /*
            IMPORTANT:
            Replace this number with the restaurant's
            actual WhatsApp number.

            Format:
            Pakistan:
            923166653527

            Do NOT put + or spaces.
        */

       const restaurantNumber = "923166653527";

const whatsappURL =
    `https://wa.me/${restaurantNumber}?text=${encodeURIComponent(message)}`;

window.open(whatsappURL, "_blank");

    });


// ===============================
// ESC KEY
// ===============================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeCart();
        closeOrder();

    }

});
