document.addEventListener('DOMContentLoaded', function () {
    const cachedData = localStorage.getItem('tireProducts');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        displayTireProducts(parsedData);
        populateFilterOptions(parsedData);
        applyUrlFilters();
    } else {
        fetchAndCacheData();
    }

    document.getElementById('baseFilter').addEventListener('change', filterAndDisplayProducts);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
});

function fetchAndCacheData() {
    fetch('response.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('tireProducts', JSON.stringify(data));
            displayTireProducts(data);
            populateFilterOptions(data);
            applyUrlFilters();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayTireProducts(data) {
    const tireListContainer = document.getElementById('tireList');
    tireListContainer.innerHTML = '';

    data.forEach(tire => {
        const tireProductHTML = `
            <div class="tire-product">
                <p class="brand" style="color: #FFFFFF; text-align: right;">${tire.Brand}</p>
                <img style="width:300px;height:300px;" src="${tire.url || 'tyresampleimage.jpg'}" >
                <h4>${tire.name}</h4>
                <p>${tire.countryyear}</p>
                <p>${tire.yearsInNumber} years warranty</p>
                <p>${tire.SubBase}</p>
                <p>${tire.Offer}</p>
                <p class="price"> From <span style="color: var(--color-black);">${tire.price} AED</span></p>
                <a href="${tire.whatsapp}" class="btn btn-primary" target="_blank"><i class="fa-brands fa-whatsapp" style="color: #ffffff;"></i> Know More</a>
            </div>
        `;
        tireListContainer.innerHTML += tireProductHTML;
    });
}

function populateFilterOptions(data) {
    const baseFilter = document.getElementById('baseFilter');

    const uniqueBases = [...new Set(data.map(tire => tire.Base))];

    uniqueBases.forEach(base => {
        const option = document.createElement('option');
        option.text = base;
        baseFilter.add(option);
    });
}

function filterAndDisplayProducts() {
    const cachedData = localStorage.getItem('tireProducts');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const selectedBase = document.getElementById('baseFilter').value;

        const filteredData = parsedData.filter(tire => !selectedBase || tire.Base === selectedBase);

        displayTireProducts(filteredData);
        updateUrlFilters();
    }
}

function clearFilters() {
    document.getElementById('baseFilter').value = '';
    filterAndDisplayProducts();
    updateUrlFilters();
}

function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const baseFilter = urlParams.get('base');

    if (baseFilter) {
        document.getElementById('baseFilter').value = baseFilter;
    }

    filterAndDisplayProducts();
}

function updateUrlFilters() {
    const selectedBase = document.getElementById('baseFilter').value;

    const urlParams = new URLSearchParams(window.location.search);
    if (selectedBase) {
        urlParams.set('base', selectedBase);
    } else {
        urlParams.delete('base');
    }

    // Replace the current URL without triggering a page reload
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
}
