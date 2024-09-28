document.addEventListener('DOMContentLoaded', function() {
    const SearchInput = document.getElementById('search-products');
    const ProductList = document.getElementById('product-list');
    const NoProductsMessage = document.getElementById('no-products-message');
    const Products = Array.from(document.querySelectorAll('#product-list .col-12')); // Convert NodeList to Array for easier handling

    SearchInput.addEventListener('input', function() {
        const Filter = this.value.toLowerCase();
        let VisibleProducts = 0;

        // Clearing the container
        ProductList.innerHTML = '';

        // If the search input is empty, show all products
        if (Filter === '') {
            Products.forEach(product => {
                ProductList.appendChild(product);
                VisibleProducts++;
            });
        } else {
            // Filtering and displaying products that match the search term
            Products.forEach(product => {
                const title = product.querySelector('.em-items-list').getAttribute('data-title').toLowerCase();
                if (title.includes(Filter)) {
                    ProductList.appendChild(product);
                    VisibleProducts++;
                }
            });
        }

        // Show "No products found" if no products are visible
        if (VisibleProducts === 0) {
            NoProductsMessage.style.display = 'block';
        } else {
            NoProductsMessage.style.display = 'none';
        }
    });
});
