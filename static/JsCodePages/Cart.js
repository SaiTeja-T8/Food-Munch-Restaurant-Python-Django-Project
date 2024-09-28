document.addEventListener('DOMContentLoaded', (event) => {
    const checkoutButton = document.getElementById('CheckoutButton');
    
    function AdjustQuantity(button, action, event) {
        event.preventDefault();  // Preventing page refresh
    
        const Row = button.closest('.item-row');
        const QuantityInput = Row.querySelector('.quantity-input');
        const CostElement = Row.querySelector('[id^="cost-"]');  // Total Cost element
        const TotalElement = Row.querySelector('[id^="total-"]');  // Quantity section
    
        let Quantity = parseInt(QuantityInput.value);
        const UnitCost = parseFloat(CostElement.getAttribute('data-unit-cost'));  // Corrected attribute name
    
        if (action === 'increase') {
            Quantity += 1;
        } else if (action === 'decrease' && Quantity > 1) {
            Quantity -= 1;
        }
    
        QuantityInput.value = Quantity;
        TotalElement.textContent = Quantity;  // Display the updated quantity
    
        // Updating the Total Cost
        const TotalCost = Quantity * UnitCost;
        CostElement.textContent = `$${TotalCost.toFixed(2)}`;  // Display the updated cost
    }
    

    // Attach click event listeners to all plus and minus buttons
    document.querySelectorAll('.btn-danger, .btn-success').forEach(button => {
        button.addEventListener('click', function (event) {
            const action = this.classList.contains('btn-danger') ? 'decrease' : 'increase';
            AdjustQuantity(this, action);
        });
    });
    
    // Attach event listeners using event delegation
    document.querySelectorAll('.btn-danger, .btn-success').forEach(button => {
        button.addEventListener('click', function (event) {
            const action = this.classList.contains('btn-danger') ? 'decrease' : 'increase';
            AdjustQuantity(this, action, event);  // Pass the event to prevent page refresh
        });
    });

    
    // Function to filter items based on search input
    function filterItems() {
        const searchValue = document.getElementById('search-input').value.toLowerCase();
        const items = document.querySelectorAll('.item-row');
        let itemsFound = false;
    
        items.forEach(item => {
            const productName = item.dataset.productName.toLowerCase();
            if (productName.includes(searchValue)) {
                item.style.display = '';
                itemsFound = true;  // At least one item is found
            } else {
                item.style.display = 'none';
            }
        });
    
        const checkoutButton = document.getElementById('CheckoutButton');
    
        // Check if the "No products found" message already exists
        let noResultsMessage = document.getElementById('no-results-message');
        
        if (!itemsFound) {
            // If message doesn't exist, create it
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.id = 'no-results-message';
                noResultsMessage.style.color = 'red';
                noResultsMessage.style.fontSize = '28px';
                noResultsMessage.style.textAlign = "center";  // Center align the message
                noResultsMessage.style.marginTop = "25px";
                noResultsMessage.style.fontWeight = "bold";
                noResultsMessage.textContent = 'No products found for your search results';
                document.body.appendChild(noResultsMessage);  // Append to body or desired container
            }
            noResultsMessage.style.display = 'block';  // Show the message
    
            // Hide the checkout button if no items are found
            checkoutButton.style.display = 'none';
        } else {
            // Hide the "No products found" message when items are found
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }
    
            // Show the checkout button if at least one item is found
            checkoutButton.style.display = 'block';
        }
    }       


    // Function to handle item deletion with quantity confirmation
    function handleDelete(itemId, currentQuantity) {
        const quantityToDelete = prompt("Enter quantity to delete:", "1");
        if (quantityToDelete === null) return;

        const quantityToDeleteNumber = parseInt(quantityToDelete, 10);
        if (isNaN(quantityToDeleteNumber) || quantityToDeleteNumber < 1 || quantityToDeleteNumber > currentQuantity) {
            alert("Invalid quantity. Please enter a number between 1 and " + currentQuantity);
            return;
        }

        const row = document.querySelector(`.item-row[data-product-name="${itemId}"]`);
        if (!row) return;

        const quantityInput = row.querySelector('.quantity-input');
        const newQuantity = currentQuantity - quantityToDeleteNumber;

        if (newQuantity <= 0) {
            row.remove(); // Remove item from cart if quantity is 0 or less
        } else {
            quantityInput.value = newQuantity;
            row.querySelector('[id^="total-"]').textContent = newQuantity;
            row.querySelector('[id^="cost-"]').textContent = (newQuantity * parseFloat(row.querySelector('[id^="cost-"]').getAttribute('data-cost'))).toFixed(2);
        }

        updateCartValue();
    }

    // Function to update cart value and manage checkout button visibility
    function updateCartValue() {
        const cartValueContainer = document.getElementById('cart-value-container');
        const cartItemCount = parseInt(cartValueContainer.getAttribute('data-cart-items-value'), 10);
        const checkoutButton = document.getElementById('CheckoutButton');
        const exploreProductsText = document.getElementById('ExploreProductsText');
        exploreProductsText.style.color="green";
        exploreProductsText.style.fontWeight="bold";
        exploreProductsText.style.fontSize="28px";
        const exploreProductsButton = document.getElementById('ExploreProducts');

        if (isNaN(cartItemCount) || cartItemCount <= 0) {
            exploreProductsText.style.display = 'block';
            exploreProductsButton.style.display = 'block';
            checkoutButton.style.display = 'none';
        } else {
            exploreProductsText.style.display = 'none';
            exploreProductsButton.style.display = 'none';
            checkoutButton.style.display = 'block';
        }
    }

    // Applying styles for delete button 

    var DeleteIcon=document.querySelectorAll(".DeleteIconFunc");

    DeleteIcon.forEach(function(button) {
        button.style.border = "none";
        button.style.borderWidth = "0px";
        button.style.backgroundColor = "white";
        button.style.outline = "none";
    });


    // ADDING ANIMATION LOGIC TO CHECK OUT BUTTON

    checkoutButton.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default form submission
    
        // Get the button's position
        const buttonRect = checkoutButton.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
        // Create falling items
        const items = document.querySelectorAll('.item-row');
        items.forEach((item, index) => {
            const itemClone = item.cloneNode(true);
            itemClone.classList.add('falling-item');
            document.body.appendChild(itemClone);
    
            const itemRect = item.getBoundingClientRect();
            itemClone.style.position = 'absolute';
            itemClone.style.left = `${itemRect.left + window.scrollX}px`;
            itemClone.style.top = `${itemRect.top + window.scrollY}px`;
            itemClone.style.transition = 'transform 0.5s, opacity 0.5s';
    
            // Animate falling to the button
            setTimeout(() => {
                itemClone.style.transform = `translate(${buttonCenterX - itemRect.left}px, ${buttonCenterY - itemRect.top}px)`;
                itemClone.style.opacity = '0';
    
                // Remove the clone after animation
                itemClone.addEventListener('transitionend', () => {
                    itemClone.remove();
                });
            }, index * 100); // Stagger animation
        });
    
        // Change button to truck with wheels
        setTimeout(() => {
            checkoutButton.innerHTML = '<span class="truck-button"><div class="wheel wheel-left"></div><div class="wheel wheel-right"></div></span>';
            
            // Animate to the right
            checkoutButton.style.transition = 'transform 1s';
            checkoutButton.style.transform = 'translateX(100%)'; // Move to the right
    
            // Change back to "Check Out" after the truck moves
            setTimeout(() => {
                checkoutButton.style.transform = 'translateX(0)'; // Reset position for text
                checkoutButton.innerHTML = '<span>Check Out</span>'; // Reset button text
    
                // Submit the form after the animation
                document.getElementById('checkoutForm').submit(); // Submit the form
            }, 1000); // Change text after truck moves
        }, items.length * 100 + 500); // Wait for falling items to finish
    });    
       


    // Add event listener for search input
    document.getElementById('search-input').addEventListener('input', filterItems);

    // Ensure initial cart value is updated correctly
    updateCartValue();
});
