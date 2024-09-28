document.addEventListener('DOMContentLoaded', function() {
    const addressField = document.getElementById('address');
    const cityField = document.getElementById('city');
    const cardNameField = document.getElementById('cardName');
    const cvvField = document.getElementById('cvv');

    // Address field validation - allow alphabets, numbers, ",", "/", and "-"
    addressField.addEventListener('input', function () {
        let validAddress = this.value.replace(/[^a-zA-Z0-9 ,\/\-]/g, '');
        this.value = validAddress;
    });

    // City field validation - only allow alphabets
    cityField.addEventListener('input', function () {
        let validCity = this.value.replace(/[^a-zA-Z ]/g, '');
        this.value = validCity;
    });

    // Name on Card validation - only allow alphabets
    cardNameField.addEventListener('input', function () {
        let validCardName = this.value.replace(/[^a-zA-Z ]/g, '');
        this.value = validCardName;
    });

    // CVV field validation - only allow numbers
    cvvField.addEventListener('input', function () {
        let validCvv = this.value.replace(/[^0-9]/g, '');
        this.value = validCvv;
    });
    
    // Function to populate State Dropdown
    function populateStateDropdownInsideDOM() {
        const states = ['Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli','Daman and Diu','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','New Delhi','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttarakhand','Uttar Pradesh','West Bengal'];
        const stateSelect = document.getElementById('state');
        
        if (stateSelect) {
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.text = state;
                stateSelect.appendChild(option);
            });
        }
    }

    // Mobile number validation
    function setupMobileValidationInsideDOM() {
        const mobileInput = document.getElementById('mobile');
        if (mobileInput) {
            mobileInput.addEventListener('input', function() {
                const mobile = this.value.replace(/\D/g, ''); // Remove non-numeric characters
                this.value = mobile;
                if (mobile.length === 10) {
                    this.style.borderColor = 'green';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                } else {
                    this.style.borderColor = 'red';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                }
            });
        }
    }

    // Zip code validation
    function setupZipValidationInsideDOM() {
        const zipInput = document.getElementById('zip');
        if (zipInput) {
            zipInput.addEventListener('input', function() {
                const zip = this.value.replace(/\D/g, ''); // Remove non-numeric characters
                this.value = zip;
                if (zip.length === 6) {
                    this.style.borderColor = 'green';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                } else {
                    this.style.borderColor = 'red';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                }
            });
        }
    }

    // Payment method selection and visibility handling
    function handlePaymentSelectionInsideDOM(paymentType) {
        const cardFields = document.getElementById('cardPaymentFields');
        const phonePeText = document.getElementById('phonePeText');
        const payPalText = document.getElementById('payPalText');

        // Hide all sections initially
        cardFields.style.display = 'none';
        phonePeText.style.display = 'none';
        payPalText.style.display = 'none';

        // Show relevant section based on selected payment method
        if (paymentType === 'card') {
            cardFields.style.display = 'block';
        } else if (paymentType === 'phonePe') {
            phonePeText.style.display = 'block';
        } else if (paymentType === 'payPal') {
            payPalText.style.display = 'block';
        }
    }

    // Card name validation
    function setupCardNameValidationInsideDOM() {
        const cardNameInput = document.getElementById('cardName');
        if (cardNameInput) {
            cardNameInput.addEventListener('input', function() {
                const cardName = this.value.toLowerCase();
                if (cardName.includes('visa') || cardName.includes('mastercard')) {
                    this.style.borderColor = 'green';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                } else {
                    this.style.borderColor = 'red';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                }
            });
        }
    }

    // Card number formatting and validation
    function setupCardNumberValidationInsideDOM() {
        const cardNumInput = document.getElementById('cardNum');
        if (cardNumInput) {
            cardNumInput.addEventListener('input', function() {
                let cardNumber = this.value.replace(/\D/g, ''); // Remove non-digits
                cardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber; // Add space after every 4 digits
                this.value = cardNumber;

                if (cardNumber.replace(/\s/g, '').length === 16) {
                    this.style.borderColor = 'green';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                } else {
                    this.style.borderColor = 'red';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                }
            });
        }
    }

    // Expiry Date formatting and validation
    function setupExpiryDateValidationInsideDOM() {
        const expiryDateInput = document.getElementById('expirydate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', function() {
                let expiryDate = this.value.replace(/\D/g, ''); // Remove non-numeric characters
                if (expiryDate.length >= 2) {
                    expiryDate = expiryDate.substring(0, 2) + '/' + expiryDate.substring(2); // Add a slash after the first 2 digits
                }
                this.value = expiryDate;

                if (expiryDate.length === 7) { // Expecting "mm/yyyy" format
                    this.style.borderColor = 'green';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                } else {
                    this.style.borderColor = 'red';
                    this.style.borderWidth = '2px';  // Ensure the border is visible
                }
            });
        }
    }

    // Payment type event listener
    function setupPaymentTypeListenerInsideDOM() {
        const paymentTypeSelect = document.getElementById('paymentType');
        if (paymentTypeSelect) {
            paymentTypeSelect.addEventListener('change', function() {
                handlePaymentSelectionInsideDOM(this.value);
            });
        }
    }

    // Function to get URL parameters
    function getUrlParams() {
        let params = {};
        let queryString = window.location.search.substring(1);
        let queries = queryString.split("&");

        for (let i = 0; i < queries.length; i++) {
            let pair = queries[i].split("=");
            let paramName = decodeURIComponent(pair[0]);
            let paramValue = decodeURIComponent(pair[1]);

            params[paramName] = paramValue;
        }
        return params;
    }

    // Function to store product data in a list
    function storeProductData() {
        let productParams = getUrlParams();

        // Creating an array to store product data
        let productList = [];

        // Creating a product object to store data
        let product = {
            name: productParams.ProductName,
            cost: parseFloat(productParams.ProductCost),
            image: productParams.ProductImage,
            quantity: parseInt(productParams.ProductQuantity)
        };

        // Adding the product object to the product list
        productList.push(product);

        // Accessing product list (example)
        return productList;
    }

    // Function to inject styles into the HTML document
    function injectStyles() {
        let styles = `
            .product-card {
                border: 1px solid #ccc;
                padding: 10px;
                margin: 10px;
                display:inline-block;
                width: 200px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius:16px;
                transition: transform 0.3s ease;
            }
            .product-card:hover {
                transform: scale(1.05);
            }
            .product-card img {
                width: 100%;
                height: auto;
                border-radius: 8px 8px 0 0;
            }
            .product-card h3, .product-card p {
                margin: 5px 0;
                font-family: Arial, sans-serif;
                text-align: center;
            }
        `;

        let styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;

        document.head.appendChild(styleSheet);  // Inject the styles into the <head>
    }

    // Function to display product data in HTML
    function displayProductData() {
        let productList = storeProductData();
        let productContainer = document.getElementById('product-container');

        productList.forEach(product => {
            // Create HTML elements to display product data
            let productCard = document.createElement('div');
            productCard.classList.add('product-card');

            let productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.name;
            productImage.style.borderRadius="16px";

            let productName = document.createElement('h3');
            productName.textContent = product.name;
            productName.style.color="#D83F87";
            productName.style.fontWeight="bold";
            productName.style.fontSize="18px";

            let productCost = document.createElement('p');
            productCost.textContent = 'Cost : $' + product.cost.toFixed(2);
            productCost.style.color="#C70039";
            productCost.style.fontWeight="bold";

            let productQuantity = document.createElement('p');
            productQuantity.textContent = 'Quantity : ' + product.quantity;
            productQuantity.style.color="green";
            productQuantity.style.fontWeight="bold";

            // Append elements to the product card
            productCard.appendChild(productImage);
            productCard.appendChild(productName);
            productCard.appendChild(productCost);
            productCard.appendChild(productQuantity);

            // Append the product card to the container
            productContainer.appendChild(productCard);
        });
    }


    // Run all functions when DOM content is loaded
    populateStateDropdownInsideDOM();
    setupMobileValidationInsideDOM();
    setupZipValidationInsideDOM();
    setupPaymentTypeListenerInsideDOM();
    setupCardNameValidationInsideDOM();
    setupCardNumberValidationInsideDOM();
    setupExpiryDateValidationInsideDOM();
    storeProductData(); // Calling the function to store data
    injectStyles();       // Inject CSS styles
    displayProductData(); // Display product data
});

