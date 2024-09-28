document.addEventListener('DOMContentLoaded', function() {

    const params = new URLSearchParams(window.location.search);
    const selectedItem = params.get('item');
    const selectedImage = params.get('image');
    const selectedCost = params.get('cost');
    let selectedQuantity = params.get('quantity');
    const ProductId = params.get('id');

    const displayContainer = document.getElementById('displayContainer');
    const displayImage = document.getElementById('displayImage');
    const displayName = document.getElementById('displayName');
    const displayCost = document.getElementById('displayCost');
    const displayQuantity = document.getElementById('displayQuantity');

    // Ensure that all elements exist
    if (displayContainer && displayImage && displayName && displayCost && displayQuantity) {
        // Display image
        if (selectedImage) {
            displayImage.src = decodeURIComponent(selectedImage);
            displayImage.alt = selectedItem || "Product Image";
        }

        // Display name
        displayName.textContent = selectedItem || "Product Name Not Available";

        const addToCartButton = document.querySelector('.btn.btn-outline-info.ml-3.mb-5');

        // Set the ProductId in the data attribute
        if (addToCartButton && ProductId) {
            addToCartButton.setAttribute('data-product-id', ProductId);
        }

        // Display cost
        if (selectedCost) {
            displayCost.textContent = selectedCost;
            displayCost.setAttribute('data-initial-cost', selectedCost.replace(/[^0-9.]/g, '')); // Update data-initial-cost
        }

        // Display quantity
        if (selectedQuantity) {
            displayQuantity.textContent = selectedQuantity;
            displayQuantity.previousElementSibling.value = selectedQuantity; // Set input value
        } else {
            selectedQuantity = 1; // Default quantity if not provided
            displayQuantity.textContent = selectedQuantity;
            displayQuantity.previousElementSibling.value = selectedQuantity; // Set input value
        }

        // Initialize the cost display correctly
        updateProductCost1(displayQuantity.previousElementSibling, parseInt(selectedQuantity, 10));

        displayContainer.style.display = "block";
    }

    // Existing Functionality: Plus Sign
    function PlusSign(button) {
        var input = button.previousElementSibling;
        var currentValue = parseInt(input.value, 10);
        var newValue = currentValue + 1;
        input.value = newValue;
        updateFinalQuantity(input, newValue);
        updateProductCost(input, newValue);
    }

    // Existing Functionality: Minus Sign
    function MinusSign(button) {
        var input = button.nextElementSibling;
        var currentValue = parseInt(input.value, 10);
        var newValue = currentValue > 1 ? currentValue - 1 : 1;
        input.value = newValue;
        updateFinalQuantity(input, newValue);
        updateProductCost(input, newValue);
    }

    // Existing Functionality: Update Final Quantity
    function updateFinalQuantity(input, newValue) {
        var container = input.closest('.Container');
        if (container) {
            var finalQuantitySpan = container.querySelector('.final-quantity');
            finalQuantitySpan.textContent = newValue;
        }
    }

    // Existing Functionality: Update Product Cost
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

    function PlusSign1(button) {
        var input = button.previousElementSibling;
        var currentValue = parseInt(input.value, 10);
        var newValue = currentValue + 1;
        input.value = newValue;
        updateFinalQuantity1(input, newValue);
        updateProductCost1(input, newValue);
    }
    
    function MinusSign1(button) {
        var input = button.nextElementSibling;
        var currentValue = parseInt(input.value, 10);
        var newValue = currentValue > 1 ? currentValue - 1 : 1;
        input.value = newValue;
        updateFinalQuantity1(input, newValue);
        updateProductCost1(input, newValue);
    }
    
    function updateFinalQuantity1(input, newValue) {
        var container = input.closest('.container').querySelector('#displayContainer');
        if (container) {
            var finalQuantitySpan = container.querySelector('.final-quantity');
            if (finalQuantitySpan) {
                finalQuantitySpan.textContent = newValue;
            }
        }
    }
    
    function updateProductCost1(input, quantity) {
        var container = input.closest('.container').querySelector('#displayContainer');
        if (container) {
            var costElement = container.querySelector('.product-cost');
            var unitCost = parseFloat(costElement.getAttribute('data-initial-cost'));
            if (!isNaN(unitCost)) {
                var newCost = unitCost * quantity;
                costElement.textContent = "$" + newCost.toFixed(2); // Ensure the cost is formatted to 2 decimal places
            }
        }
    }

    // Combined Functionality: Add to Cart with Animation
    function handleAddToCart(button) {
        const productCard = button.closest('.Container');

        if (productCard) {
            const productImage = productCard.querySelector('.product-image');
            const cartIcon = document.getElementById('cart-image-icon');
            const ProductId = button.getAttribute('data-product-id'); // Correctly get ProductId

            if (productImage && cartIcon) {
                // Clone the image for the animation
                const imageClone = productImage.cloneNode(true);
                imageClone.style.position = 'absolute';
                imageClone.style.zIndex = '1000';
                imageClone.style.width = productImage.offsetWidth + 'px';
                imageClone.style.height = productImage.offsetHeight + 'px';
                imageClone.style.transition = 'all 0.8s ease-in-out';
                imageClone.classList.add('image-clone'); // Add class for additional styles

                // Append the cloned image to the body
                document.body.appendChild(imageClone);

                // Get the product image and cart icon positions
                requestAnimationFrame(() => {
                    const imageRect = productImage.getBoundingClientRect();
                    imageClone.style.top = imageRect.top + 'px';
                    imageClone.style.left = imageRect.left + 'px';

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

                    // Updated Add to Cart Logic
                    var productName = productCard.querySelector('.product-heading').textContent.trim();
                    var productImageSrc = productCard.querySelector('.product-image').src;
                    var quantity = parseInt(productCard.querySelector('.quantity-input').value, 10);
                    var unitCost = parseFloat(productCard.querySelector('.product-cost').getAttribute('data-unit-cost').replace(/[^0-9.-]+/g, ""));

                    // Correct cost calculation with proper floating-point handling
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
                });
            }
        }
    }

    // Expose functions to global scope
    window.PlusSign = PlusSign;
    window.MinusSign = MinusSign;
    window.PlusSign1 = PlusSign1;
    window.MinusSign1 = MinusSign1;
    window.handleAddToCart = handleAddToCart;

});
