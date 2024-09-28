document.addEventListener("DOMContentLoaded", function() {

    function PlusSign(button) {
        var input = button.previousElementSibling;
        var currentValue = parseInt(input.value, 10);
        var newValue = currentValue + 1;
        input.value = newValue;
        updateFinalQuantity(input, newValue);
        updateProductCost(input, newValue);
    }

    function MinusSign(button) {
        var input = button.nextElementSibling;
        var currentValue = parseInt(input.value, 10);
        var newValue = currentValue > 1 ? currentValue - 1 : 1;
        input.value = newValue;
        updateFinalQuantity(input, newValue);
        updateProductCost(input, newValue);
    }

    function updateFinalQuantity(input, newValue) {
        var container = input.closest('.Container');
        if (container) {
            var finalQuantitySpan = container.querySelector('.final-quantity');
            finalQuantitySpan.textContent = newValue;
        }
    }

    function updateProductCost(input, quantity) {
        var container = input.closest('.Container');
        if (container) {
            var costElement = container.querySelector('.product-cost');
            var unitCost = parseFloat(costElement.getAttribute('data-unit-cost').replace(/[^0-9.-]+/g, "")); // Remove non-numeric characters
            var newCost = unitCost * quantity;
            costElement.textContent = "$" + newCost.toFixed(2); // Display cost with 2 decimal places and dollar symbol
            costElement.style.fontFamily = "'Roboto'";
            costElement.style.fontSize = "18px";
            costElement.style.color = "black";
            costElement.style.fontWeight = "bold";
        }
    }

    // Combined Functionality: Add to Cart with Animation
    function handleAddToCart(button) {
        const productCard = button.closest('.Container');
        const productImage = productCard.querySelector('.product-image');
        const cartIcon = document.getElementById('cart-icon');

        if (productCard && productImage && cartIcon) {
            // Clone the image for the animation
            const imageClone = productImage.cloneNode(true);
            imageClone.style.position = 'absolute';
            imageClone.style.zIndex = '1000';
            imageClone.style.width = productImage.offsetWidth + 'px';
            imageClone.style.height = productImage.offsetHeight + 'px';
            imageClone.style.transition = 'all 0.8s ease-in-out';

            // Get the product image position
            const imageRect = productImage.getBoundingClientRect();
            imageClone.style.top = imageRect.top + 'px';
            imageClone.style.left = imageRect.left + 'px';

            // Append the cloned image to the body
            document.body.appendChild(imageClone);

            // Get the cart icon position
            const cartRect = cartIcon.getBoundingClientRect();

            // Set the destination position for the image clone (cart icon position)
            setTimeout(() => {
                imageClone.style.top = cartRect.top + 'px';
                imageClone.style.left = cartRect.left + 'px';
                imageClone.style.width = '50px'; // Adjust size for effect
                imageClone.style.height = '50px'; // Adjust size for effect
                imageClone.style.opacity = '0.5'; // Fade out effect
            }, 50);

            // Remove the image clone after animation
            imageClone.addEventListener('transitionend', () => {
                imageClone.remove();
            });

            // Existing Add to Cart Logic
            var productName = productCard.querySelector('.product-heading').textContent.trim();
            var productImageSrc = productCard.querySelector('.product-image').src;
            var quantity = parseInt(productCard.querySelector('.quantity-input').value, 10);
            var unitCost = parseFloat(productCard.querySelector('.product-cost').getAttribute('data-unit-cost').replace(/[^0-9.-]+/g, ""));
            var updatedCost = (unitCost * quantity).toFixed(2);
            var productId = button.getAttribute('data-product-id');
            var baseUrl = button.getAttribute('data-url');

            var url = baseUrl + "?ProductName=" + encodeURIComponent(productName) +
                      "&ProductImage=" + encodeURIComponent(productImageSrc) +
                      "&ProductCost=" + encodeURIComponent(updatedCost) +
                      "&ProductQuantity=" + encodeURIComponent(quantity) +
                      "&ProductId=" + encodeURIComponent(productId);

            // Redirect after a delay to allow the animation to complete
            setTimeout(() => {
                window.location.href = url;
            }, 800); // 800ms matches the animation duration
        }
    }


    // Expose functions to global scope
    window.PlusSign = PlusSign;
    window.MinusSign = MinusSign;
    window.handleAddToCart = handleAddToCart;

    //Filtering Search Results based on User's input

    const SearchInput = document.getElementById('search-input');
    const Products = document.querySelectorAll('.Container');
    const NoProductsMessage = document.getElementById('no-products-message');

    SearchInput.addEventListener('keyup', function() {
        const SearchTerm = SearchInput.value.toLowerCase();
        let HasVisibleProducts = false;

        Products.forEach(function(product) {
            const productName = product.querySelector('.product-heading').textContent.toLowerCase();
            if (productName.includes(SearchTerm)) {
                product.style.display = '';
                HasVisibleProducts = true;
            } else {
                product.style.display = 'none';
            }
        });

        // Show the "No products found" message if no products are visible
        if (HasVisibleProducts) {
            NoProductsMessage.style.display = 'none';
        } else {
            NoProductsMessage.style.display = 'block';
        }
    });

});




