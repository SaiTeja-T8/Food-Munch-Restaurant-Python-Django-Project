let Count = 1000;
let UniqueId = null;
UniqueId = setInterval(function() {
    Count = Count - 1;
    if (Count === 0) {
        document.getElementById("payment_image").style.display = "none";
        document.getElementById("payment_heading").textContent = "Payment Successful!. Order Placed";
        document.getElementById("payment_heading").style.color = "green";
        document.getElementById("button_redirect").style.display = "";
        clearInterval(UniqueId);
    } else if (Count > 0) {
        document.getElementById("button_redirect").style.display = "none";
    }
}, 1);
