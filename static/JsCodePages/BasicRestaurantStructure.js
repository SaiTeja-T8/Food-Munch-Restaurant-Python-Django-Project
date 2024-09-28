document.addEventListener('DOMContentLoaded', function() {
    const ProductsListUrl = document.getElementById('urlContainer').getAttribute('data-products-list-url');
    const SearchInput = document.getElementById('SearchInput');
    const SearchResultsContainer = document.getElementById('SearchResults');
    const AllProducts = document.querySelectorAll('#AllProducts .ProductItem');

    SearchInput.addEventListener('input', function() {
        const Query = this.value.trim().toUpperCase();
        SearchResultsContainer.innerHTML = '';

        if (Query.length > 0) {
            let ResultsFound = false;

            AllProducts.forEach(function(product) {
                const ProductName = product.querySelector('.ProductName').textContent;
                const ProductImage = product.querySelector('.ProductImage').src;
                const productCost = product.querySelector('.ProductCost').textContent;
                const ProductId = product.querySelector('.ProductId').textContent;

                if (ProductName.toUpperCase().includes(Query)) {
                    const ResultItem = document.createElement('div');
                    ResultItem.className = 'search-result-item';
                    ResultItem.style.padding = '10px';
                    ResultItem.style.display = 'flex';
                    ResultItem.style.alignItems = 'center';

                    const ImgElement = document.createElement('img');
                    ImgElement.src = ProductImage;
                    ImgElement.style.width = '65px';
                    ImgElement.style.height = '65px';
                    ImgElement.style.marginRight = '10px';
                    ImgElement.style.borderRadius = "10px";

                    const InfoContainer = document.createElement('div');
                    
                    const link = document.createElement('a');
                    // Include ProductId in the URL
                    link.href = `${ProductsListUrl}?item=${encodeURIComponent(ProductName)}&image=${encodeURIComponent(ProductImage)}&cost=${encodeURIComponent(productCost)}&id=${encodeURIComponent(ProductId)}`;
                    link.textContent = ProductName;
                    link.style.textDecoration = 'none';
                    link.style.fontFamily = 'Roboto';
                    link.style.color = '#0000CD';
                    link.style.fontSize = '20px';
                    link.style.fontWeight = 'bold';
                    link.addEventListener('mouseover', function() {
                        link.style.textDecoration = 'underline';
                    });
                    link.addEventListener('mouseout', function() {
                        link.style.textDecoration = 'none';
                    });

                    const CostElement = document.createElement('div');
                    CostElement.textContent = productCost;
                    CostElement.style.color = 'green';
                    CostElement.style.fontFamily = 'Roboto';
                    CostElement.style.fontSize = '17px';
                    CostElement.style.marginTop = '5px';
                    CostElement.style.fontWeight = "bold";

                    InfoContainer.appendChild(link);
                    InfoContainer.appendChild(CostElement);

                    ResultItem.appendChild(ImgElement);
                    ResultItem.appendChild(InfoContainer);

                    SearchResultsContainer.appendChild(ResultItem);
                    ResultsFound = true;
                }
            });

            SearchResultsContainer.style.display = ResultsFound ? 'block' : 'none';
        } 
    });

});

function food_munch_fresh_healthy_organic_section(button){
    const VideoUrl=button.getAttribute('data-video-url');
    window.location.replace(VideoUrl);
}
