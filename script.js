document.addEventListener('DOMContentLoaded', () => {
    // This function will get a specific query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const orderId = getQueryParam('order_id');

    if (orderId) {
        // Replace this with your actual AppSheet API endpoint or Google Apps Script URL
        const api_url = `https://script.google.com/macros/s/AKfycbwDdPPhEUGkhj06pkHRZMfecEElNzefW2XnK8vsf_M_QipO58B-5cSVeIlauRmKzfbf/exec/?id=${orderId}`;

        fetch(api_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Assuming data is an array of objects matching your spreadsheet rows
                if (data && data.length > 0) {
                    const orderData = data[0]; // Get the first result
                    populateInvoice(orderData);
                } else {
                    document.body.innerHTML = '<h1>Order not found.</h1>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.body.innerHTML = '<h1>Error loading data. Please try again.</h1>';
            });
    } else {
        document.body.innerHTML = '<h1>No Order ID provided in the URL.</h1>';
    }

    function populateInvoice(order) {
        // Populate the static information
        document.getElementById('nota-number').textContent = order['ID ORDER'];
        document.getElementById('invoice-date').textContent = order['TANGGAL ORDER'];
        document.getElementById('customer-name').textContent = order['NAMA CUSTOMER'];
        document.getElementById('customer-address').textContent = order['ALAMAT'];
        document.getElementById('customer-phone').textContent = order['NO WHATSAPP'];
        document.getElementById('sub-total').textContent = `Rp. ${order['TOTAL']}`;
        document.getElementById('discount').textContent = `Rp. ${order['DISCOUNT']}`;
        document.getElementById('total-price').textContent = `Rp. ${order['TOTAL SETELAH DISCOUNT']}`;

        // Populate the item list (this part might need adjustment based on your data structure)
        const itemList = document.getElementById('item-list');
        // Example for one item, you may need a loop if there can be multiple items
        const itemRow = document.createElement('tr');
        itemRow.innerHTML = `
            <td>${order['ARTIKEL UTAMA']}</td>
            <td>${order['QTY']}</td>
            <td>Rp. ${order['HARGA']}</td>
            <td>Rp. ${order['TOTAL']}</td>
        `;
        itemList.appendChild(itemRow);
    }
});
