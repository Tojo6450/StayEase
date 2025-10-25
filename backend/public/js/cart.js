// toggle-switch
let taxSwitch = document.getElementById("switchCheckDefault");
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline"
        info.style.color = "#6c757d"
      }
      else info.style.display = "none";
    }
  });

  
document.querySelectorAll('.cart-icon-btn').forEach(button => {
    button.addEventListener('click', () => {
        const listingId = button.dataset.id;

        if (button.querySelector('.bi-check-lg')) {
            // Already in cart, remove it
            fetch(`/cart/${listingId}`, {
                method: 'DELETE',
            })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    button.innerHTML = '<i class="bi bi-plus-lg"></i>';
                    updateCartCount();
                    refreshCartPopup();
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Error removing from cart.');
            });

        } else {
            // Not in cart, add it
            fetch('/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId })
            })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data && data.success) {
                    button.innerHTML = '<i class="bi bi-check-lg"></i>';
                    updateCartCount();
                    refreshCartPopup();
                } else if (data) {
                    alert("Failed to add item.");
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Error adding to cart.");
            });
        }
    });
});

// Cart icon click => show popup
document.getElementById('cart-icon').addEventListener('click', function () {
    document.getElementById('cart-popup').style.display = 'block';
    refreshCartPopup();
});

// Refresh cart popup contents
function refreshCartPopup() {
    fetch('/cart')
        .then(res => res.json())
        .then(data => {
            const cartItems = data.items;
            const cartList = document.getElementById('cart-items');
            cartList.innerHTML = '';

            if (!cartItems || cartItems.length === 0) {
                cartList.innerHTML = '<li>No items in cart</li>';
                return;
            }

            cartItems.forEach(item => {
                if (item.listing) {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = `/listings/${item.listing._id}`;
                    link.textContent = item.listing.title;
                    li.appendChild(link);
                    cartList.appendChild(li);
                }
            });
        });
}

// Close popup when clicked outside
document.addEventListener('click', function (e) {
    const popup = document.getElementById('cart-popup');
    const cartIcon = document.getElementById('cart-icon');
    if (!popup.contains(e.target) && !cartIcon.contains(e.target)) {
        popup.style.display = 'none';
    }
});

// Update cart count (badge)
function updateCartCount() {
    fetch('/cart')
        .then(res => res.json())
        .then(data => {
            document.getElementById('cart-count').innerText = data.items.length;
        });
}

// Initialize cart count and button states on page load
function initializeCartState() {
    fetch('/cart')
        .then(res => res.json())
        .then(data => {
            const cartItems = data.items.map(item => item.listing._id);
            document.querySelectorAll('.cart-icon-btn').forEach(button => {
                const listingId = button.dataset.id;
                if (cartItems.includes(listingId)) {
                    button.innerHTML = '<i class="bi bi-check-lg"></i>';
                } else {
                    button.innerHTML = '<i class="bi bi-plus-lg"></i>';
                }
            });
            updateCartCount();
        });
}

initializeCartState();
