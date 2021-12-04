var cart = {
  //PROPERTIES
  hPdt : null, // HTML products list
  hItems : null, // HTML current cart
  items : {}, // Current items in cart
  iURL : "images/", // Product image URL folder

  // LOCALSTORAGE CART
  // SAVE CURRENT CART INTO LOCALSTORAGE
  save : () => {
    localStorage.setItem("cart", JSON.stringify(cart.items));
  },

  // LOAD CART FROM LOCALSTORAGE
  load : () => {
    cart.items = localStorage.getItem("cart");
    if (cart.items == null) { cart.items = {}; }
    else { cart.items = JSON.parse(cart.items); }
  },

  // EMPTY ENTIRE CART
  nuke : () => {
    if (confirm("Empty cart?")) {
      cart.items = {};
      localStorage.removeItem("cart");
      cart.list();
    }
  },

  // INITIALIZE
  init : () => {
    // GET HTML ELEMENTS
    cart.hPdt = document.getElementById("cart-products");
    cart.hItems = document.getElementById("cart-items");

    // DRAW PRODUCTS LIST
    cart.hPdt.innerHTML = "";
    let p, item, part;
    for (let id in products) {
      // WRAPPER
      p = products[id];
      item = document.createElement("div");
      item.className = "p-item";
      cart.hPdt.appendChild(item);

      // PRODUCT IMAGE
      part = document.createElement("img");
      part.src = cart.iURL + p.img;
      part.className = "p-img";
      item.appendChild(part);

      // PRODUCT NAME
      part = document.createElement("div");
      part.innerHTML = p.name;
      part.className = "p-name";
      item.appendChild(part);

      // PRODUCT DESCRIPTION
      part = document.createElement("div");
      part.innerHTML = p.desc;
      part.className = "p-desc";
      item.appendChild(part);

      // PRODUCT PRICE
      part = document.createElement("div");
      part.innerHTML = "₹" + p.price;
      part.className = "p-price";
      item.appendChild(part);

      // ADD TO CART
      part = document.createElement("input");
      part.type = "button";
      part.value = "Add to Cart";
      part.className = "cart p-add";
      part.onclick = () => { cart.add(id); };
      item.appendChild(part);
    }

    // LOAD CART FROM PREVIOUS SESSION
    cart.load();

    // LIST CURRENT CART ITEMS
    cart.list();
  },

  // LIST CURRENT CART ITEMS (IN HTML)
  list : () => {
    // RESET
    cart.hItems.innerHTML = "";
    let item, part, pdt;
    let empty = true;
    for (let key in cart.items) {
      if(cart.items.hasOwnProperty(key)) { empty = false; break; }
    }

    // CART IS EMPTY
    if (empty) {
      item = document.createElement("div");
      item.innerHTML = "Cart is empty";
      cart.hItems.appendChild(item);
    }

    // CART IS NOT EMPTY - LIST ITEMS
    else {
      let p, total = 0, subtotal = 0;
      for (let id in cart.items) {
        // ITEM
        p = products[id];
        item = document.createElement("div");
        item.className = "c-item";
        cart.hItems.appendChild(item);

        // NAME
        part = document.createElement("div");
        part.innerHTML = p.name;
        part.className = "c-name";
        item.appendChild(part);

        // QUANTITY
        part = document.createElement("input");
        part.type = "number";
        part.min = 0;
        part.value = cart.items[id];
        part.className = "c-qty";
        part.onchange = function () { cart.change(id, this.value); };
        item.appendChild(part);
        
        // REMOVE
        part = document.createElement("input");
        part.type = "button";
        part.value = "X";
        part.className = "c-del cart";
        part.onclick = () => { cart.remove(id); };
        item.appendChild(part);

        // SUBTOTAL
        subtotal = cart.items[id] * p.price;
        total += subtotal;
      }

      // TOTAL AMOUNT
      item = document.createElement("div");
      item.className = "c-total";
      item.id = "c-total";
      item.innerHTML ="TOTAL: ₹" + total;
      cart.hItems.appendChild(item);

      // CLEAR BUTTONS
      item = document.createElement("input");
      item.type = "button";
      item.value = "Clear Cart";
      item.onclick = cart.nuke;
      item.className = "c-empty cart";
      cart.hItems.appendChild(item);

      // CHECKOUT BUTTONS
      item = document.createElement("input");
      item.type = "button";
      item.value = "Checkout";
      item.onclick = cart.checkout;
      item.className = "c-checkout cart";
      cart.hItems.appendChild(item);
    }
  },

  // ADD ITEM INTO CART
  add : (id) => {
    if (cart.items[id] == undefined) { cart.items[id] = 1; }
    else { cart.items[id]++; }
    cart.save(); cart.list();
  },

  // CHANGE QUANTITY
  change : (pid, qty) => {
    // REMOVE ITEM
    if (qty <= 0) {
      delete cart.items[pid];
      cart.save(); cart.list();
    }

    // UPDATE TOTAL ONLY
    else {
      cart.items[pid] = qty;
      var total = 0;
      for (let id in cart.items) {
        total += cart.items[id] * products[id].price;
        document.getElementById("c-total").innerHTML ="TOTAL: $" + total;
      }
    }
  },

  // REMOVE ITEM FROM CART
  remove : (id) => {
    delete cart.items[id];
    cart.save();
    cart.list();
  },

  // CHECKOUT
  //checkout : () => {
    // SEND DATA TO SERVER
    // CHECKS
    // SEND AN EMAIL
    // RECORD TO DATABASE
    // PAYMENT
    // WHATEVER IS REQUIRED
    //alert("TO DO");

    /*
    var data = new FormData();
    data.append("cart", JSON.stringify(cart.items));
    data.append("products", JSON.stringify(products));

    fetch("SERVER-SCRIPT", { method:"POST", body:data })
    .then(res=>res.text()).then((res) => {
      console.log(res);
    })
    .catch((err) => { console.error(err); });
    */
  //}
};
window.addEventListener("DOMContentLoaded", cart.init);
