var size, colour, message;
var order = {
  bracelets: [],
  customer: {},
  options: {},
  value: {}
};

var ui = {
  colorCircles: function() {
    var circles = document.querySelectorAll('.color-picker-circles');
    for (var i = 0; i < circles.length; i++) {
      if (circles[i].innerText === "#RAINBOW") {
        circles[i].style.boxShadow = "#FE78D7 0px 0px 6px 2px inset, #EEA383 0px 0px 6px 4px inset, #B5E47C 0px 0px 6px 6px inset, #489A58 0px 0px 6px 8px inset, #5999B7 0px 0px 6px 10px inset, #917AB2 0px 0px 6px 14px inset, 0 7px 4px -2px rgba(0, 0, 0, 0.2), 0 12px 8.5px 1px rgba(0, 0, 0, 0.14), 0 5px 11px 2px rgba(0, 0, 0, 0.12)";
      } else {
        circles[i].style.backgroundColor = circles[i].innerText;
      }
    }
  },
  iosFlex: function() {
    var infoCard = document.querySelector('.info-card');
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      switch ([Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0)]) {
        case [320, 480]:
          infoCard.style.height = '398px';
          break;
        case [320, 568]:
          infoCard.style.height = '398px';
          break;
        case [375, 667]:
          infoCard.style.height = '298px';
          break;
        case [414, 736]:
          infoCard.style.height = '298px';
          break;
        case [768, 1024]:
          infoCard.style.height = '218px';
          break;
      }
    }
  },
  soldOut: function(colours) {
    for (var i = 0; i < colours.length; i++) {
      var circles = document.querySelectorAll('.color-picker-circles');
      for (var j = 0; j < circles.length; j++) {
        if (circles[j].innerText === colours[i]) {
          circles[j].style.display = 'none';
        }
      }
    }
  }
};
ui.colorCircles();
ui.iosFlex();
// ui.soldOut(['#FFFFFF','#0D1D8C','#7C0E95','#A5B4B7','#309993']);
var ux = {
  handleColour: function(e, c) {
    var circle = document.querySelector('.color-picker-circles.color-picker-circles-selected');
    var preview = document.getElementById('PreviewBracelet');
    var rainbowBracelet = document.getElementById('RainbowBracelet');
    if (c) {
      var circles = document.querySelectorAll('.color-picker-circles');
      for (var i = 0; i < circles.length; i++) {
        if (circles[i].innerText === '#' + c) {
          e = circles[i];
          break;
        }
      }
    }
    if (circle) {
      circle.classList.remove('color-picker-circles-selected');
    }
    e.classList.add('color-picker-circles-selected');
    colour = e.innerText;
    colour = colour.substring(1, colour.length);

    if (colour === "RAINBOW") {
      preview.style.display = 'none';
      rainbowBracelet.style.display = 'block';
    } else {
      rainbowBracelet.style.display = 'none';
      preview.style.display = 'block';
      preview.className = 'bracelet-' + colour;
    }
  },
  addMessage: function(c) {
    function insertAtCaret(areaId, text) {
      var txtarea = document.getElementById(areaId);
      if (!txtarea) {
        return;
      }
      var scrollPos = txtarea.scrollTop;
      var strPos = 0;
      var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false));
      if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
      } else if (br == "ff") {
        strPos = txtarea.selectionStart;
      }
      var front = (txtarea.value).substring(0, strPos);
      var back = (txtarea.value).substring(strPos, txtarea.value.length);
      txtarea.value = front + text + back;
      strPos = strPos + text.length;
      if (br == "ie") {
        txtarea.focus();
        var ieRange = document.selection.createRange();
        ieRange.moveStart('character', -txtarea.value.length);
        ieRange.moveStart('character', strPos);
        ieRange.moveEnd('character', 0);
        ieRange.select();
      } else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
      }
      txtarea.scrollTop = scrollPos;
    }
    document.getElementById('customize_message').parentNode.classList.add('mdc-textfield--focused');
    document.querySelector('label[for=customize_message]').classList.add('mdc-textfield__label--float-above');
    // document.getElementById('customize_message').value = document.getElementById('customize_message').value + c;
		// document.getElementById('customize_message').value = c;
		insertAtCaret('customize_message', c);
  },
  changeQuantity: function(that) {
    setTimeout(
      function() {
        if (Number(that.value) > 500) {
          that.value = 500;
        } else if (Number(that.value) <= 0) {
          that.value = 1;
        }
        var index = that.parentElement.parentElement.parentElement.rowIndex - 1;
        order.bracelets[index].quantity = Number(that.value);
        cart.update();
      }, 1000);
  },
  deleteBracelet: function(e) {
    var index = e.parentElement.rowIndex - 1;
    order.bracelets.splice(index, 1);
    cart.update();
  },
  braceletFromCart: function(e) {
    var index = e.parentElement.rowIndex - 1;
    var bracelet = order.bracelets.splice(index, 1)[0];
    return bracelet;
  },
  loadBracelet: function(bracelet) {
    tempQuantity = bracelet.quantity;
    ux.handleColour('', bracelet.colour);
    document.getElementById('js-select').value = bracelet.size;
    document.getElementById('customize_message').value = bracelet.message;
    window.scrollTo(0, document.body.scrollHeight);
    cart.dialog.close();
  },
  handleShipping: function() {
    var shippingRadio = document.querySelector('.shipping-radio');
    if (shippingRadio.checked === true) {
      order.options.shipping = "Shipping";
    } else {
      order.options.shipping = "Pickup";
    }
    cart.update();
  },
  formatMoney: function(money) {
    return "$" + money.toFixed(2);
  }
};

var colourDictionary = {
  "FFFFFF": 'Snow White',
  "000000": 'Midnight Black',
  "EE8679": 'Peach Pink',
  "D2729B": 'Rose Pink',
  "BAF6FF": 'Ice Blue',
  "309993": 'Sea Teal',
  "A5B4B7": 'Light Grey',
  "EBD552": 'Mustard Yellow',
  "C8ED42": 'Lime Green',
  "4C7437": 'Forest Green',
  "0D1D8C": 'Ocean Blue',
  "101948": 'Navy Blue',
  "562C6D": 'Royal Purple',
  "RAINBOW": 'Rainbow',
  "DD0D19": 'Fiery Red',
  "761121": 'Burgundy',
  "FC7F23": 'Orange',
  "D9EC54": 'Olive Green',
  "5EC278": 'Mint Green',
  "12563B": 'Emerald',
  "7C0E95": 'Royal Pueple',
  "C4A0DA": 'Lilac Purple',
  "9F89C5": 'Lavender'
};
var components = {
  editButton: document.createElement('button'),
  deleteButton: document.createElement('button'),
  quantityTD: document.createElement('td')
};

function upgradeComponents() {
  components.editButton.className = 'mdc-fab fab-mini delete-cart';
  components.editButton.dataset.mdcAutoInit = 'MDCRipple';
  components.editButton.innerHTML = '<span class="material-icons" onclick="ux.loadBracelet(ux.braceletFromCart(this))">edit</span>';

  components.deleteButton.className = 'mdc-fab fab-mini delete-cart';
  components.deleteButton.dataset.mdcAutoInit = 'MDCRipple';
  components.deleteButton.innerHTML = '<span class="material-icons" onclick="ux.deleteBracelet(this)">delete</span>';

  var quantityDiv = document.createElement('div');
  quantityDiv.className = "mdc-textfield";
  quantityDiv.dataset.mdcAutoInit = "MDCTextfield";
  var quantityInput = document.createElement('input');
  quantityInput.className = 'mdc-textfield__input quantity-input';
  quantityInput.type = 'number';
  quantityInput.step = '1';
  quantityInput.min = '1';
  quantityInput.value = '';
  quantityInput.size = '4';
  quantityInput.max = '9999';
  quantityInput.pattern = "[0-9]*";
  quantityInput.inputmode = 'numeric';
  var quantityLabel = document.createElement('label');
  quantityLabel.className = 'mdc-textfield__label';
  quantityDiv.appendChild(quantityInput);
  quantityDiv.appendChild(quantityLabel);
  components.quantityTD.appendChild(quantityDiv);
}
upgradeComponents();
var cart = {
  create: function() {
    order.value.standard = 0;
    order.value.custom = 0;
    var container = document.createElement('div');
    var braceletsE = document.createElement('div');
    braceletsE.id = 'bracelets';
    braceletsE.className = 'mdc-card mdc-layout-grid__cell mdc-layout-grid__cell--span-6 cart-bracelets';
    var subtotalsE = document.createElement('div');
    subtotalsE.id = 'subtotals';
    subtotalsE.className = 'mdc-card mdc-layout-grid__cell mdc-layout-grid__cell--span-6 cart-subtotal';
    var i;
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    var tableHeaderRow = document.createElement('tr');
    var headerContents = ["Stylelet", "Description", "Price", "Quantity", "Total", "", ""];
    for (i = 0; i < 7; i++) {
      var headercell = document.createElement('th');
      headercell.appendChild(document.createTextNode(headerContents[i]));
      if (i >= 5) {
        headercell.className = 'icon-cell';
      } else if (i === 1) {
        headercell.className = 'description-cell';
      } else if (i === 0) {
        headercell.className = 'image-cell';
      } else if (i === 3) {
        headercell.className = 'quantity-cell';
      }
      tableHeaderRow.appendChild(headercell);
    }
    tableBody.appendChild(tableHeaderRow);

    function tdwrap(textnode) {
      var td = document.createElement('td');
      td.appendChild(textnode);
      return td;
    }

    var quant = 0,
      subtotal = 0;
    for (i = 0; i < order.bracelets.length; i++) {
      var row = document.createElement('tr');
      var multiplier;
      if (order.bracelets[i].message !== '' && order.bracelets[i].message !== ' ' && order.bracelets[i].message !== '♥' && order.bracelets[i].message !== '☼') {
        order.bracelets[i].type = "Custom";
      } else {
        order.bracelets[i].type = "Standard";
      }
      if (order.bracelets[i].type === "Custom" && order.bracelets[i].message.length > 7) {
        multiplier = 4.25;
      } else if (order.bracelets[i].type === "Custom") {
        multiplier = 4.00;
      } else {
        multiplier = 3.00;
      }
      quant += order.bracelets[i].quantity;
      subtotal += order.bracelets[i].quantity * multiplier;
      if (order.bracelets[i].type === "Custom") {
        order.value.custom += order.bracelets[i].quantity;
      } else {
        order.value.standard += order.bracelets[i].quantity;
      }
      var image;
      if (order.bracelets[i].colour === "RAINBOW") {
        image = document.getElementById('RainbowBracelet').cloneNode(true);
        image.id = '';
        image.className = 'preview-image';
        image.style.display = 'block';
      } else {
        image = document.getElementById('PreviewBracelet').cloneNode(true);
        image.id = '';
        image.className = 'preview-image bracelet-' + order.bracelets[i].colour;
        image.style.display = 'block';
      }
      var image2 = document.getElementById('MetalTag').cloneNode(true);
      image2.id = '';
      image2.className = 'preview-image';
      image2.style.display = 'block';
      var tdimage = document.createElement('td');
      tdimage.className = 'tdimage';
      tdimage.appendChild(image);
      if (image2) {
        tdimage.appendChild(image2);
      }
      row.appendChild(tdimage);
      var td = document.createElement('td');
      td.innerHTML = '<p>' + order.bracelets[i].type + '<br>Colour: ' + colourDictionary[order.bracelets[i].colour] + '<br>' + 'Size: ' + order.bracelets[i].size + '<br>' + 'Message: <span class="bridgette">' + order.bracelets[i].message + '</span></p>';
      row.appendChild(td);
      row.appendChild(tdwrap(document.createTextNode(ux.formatMoney(multiplier))));
      order.bracelets[i].value = order.bracelets[i].quantity * multiplier;
      var quantityElement = components.quantityTD.cloneNode(true);
      quantityElement.childNodes[0].childNodes[0].value = order.bracelets[i].quantity.toString();
      row.appendChild(quantityElement);
      row.appendChild(tdwrap(document.createTextNode(ux.formatMoney(order.bracelets[i].value))));
      row.appendChild(tdwrap(components.editButton.cloneNode(true)));
      row.appendChild(tdwrap(components.deleteButton.cloneNode(true)));
      tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    if (order.bracelets.length < 3 && window.innerWidth > 840) {
      var cssfixer = document.createElement('div');
      cssfixer.style.position = 'absolute';
      cssfixer.style.top = '0';
      cssfixer.appendChild(table);
      braceletsE.appendChild(cssfixer);
    } else {
      braceletsE.appendChild(table);
    }
    var addButton = document.createElement('button');
    addButton.className = 'mdc-fab mdc-dialog__footer__button--cancel pinnedFab';
    addButton.ariaLabel = 'add';
    addButton.dataset.MdcAutoInit = 'MDCRipple';
    addButton.innerHTML = '<span class="mdc-fab__icon material-icons">add</span>';
    braceletsE.appendChild(addButton);

    var discount = 0;
    var discountT = "";
    if (quant >= 25) {
      discount = subtotal * 0.125 * -1;
      if (discount) {
        discountT = '<br>Bulk Discount: <span class="money">' + ux.formatMoney(discount) + '</span>';
      }
    }
    order.value.discount = discount;
    var shippingoptions = document.createElement('div');
    shippingoptions.innerHTML = '<div class="mdc-form-field"><div class="mdc-radio"><input class="mdc-radio__native-control shipping-radio" type="radio" id="ex2-radio2" checked name="ex2"><div class="mdc-radio__background"><div class="mdc-radio__outer-circle"></div><div class="mdc-radio__inner-circle"></div></div></div><label id="ex2-radio2-label" for="ex2-radio2">Canada Wide Shipping</label></div><div class="mdc-form-field"><div class="mdc-radio"><input class="mdc-radio__native-control shipping-radio" type="radio" id="ex2-radio1" name="ex2"><div class="mdc-radio__background"><div class="mdc-radio__outer-circle"></div><div class="mdc-radio__inner-circle"></div></div></div><label id="ex2-radio1-label" for="ex2-radio1">Pickup at <a href="https://www.google.ca/maps/dir/\'\'/st+rose+junior+high/data=!4m5!4m4!1m0!1m2!1m1!1s0x53a021b956e0ce15:0x32e2a5a594b3f0e2?sa=X&ved=0ahUKEwiU-rn0_6bTAhUm9IMKHXGtDBkQ9RcIfjAN" target="_blank">St. Rose Junior High</a> Between 2:45PM to 3:00PM on Mondays to Fridays, or on Thursdays between 12:10PM to 12:20PM.</label></div>';
    var shippingT, shipping;
    if (order.options.shipping === "Pickup") {
      shippingT = 'Pickup: <span class="money">' + '$0.00' + '</span>';
      shipping = 0;
    } else {
      shippingT = 'Shipping: <span class="money">' + '$0.85' + '</span>';
      shipping = .85;
    }
    order.value.shipping = shipping;
    order.value.subtotal = subtotal;
    order.value.total = subtotal - discount + shipping;
    subtotalsE.innerHTML = '<h2>Subtotal</h2><p>Subtotal: <span class="money">' + ux.formatMoney(subtotal) + '</span>' + discountT + '<br>' + shippingoptions.innerHTML + '<br>' + shippingT + '</p><p>Total: <span class="money">' + ux.formatMoney(order.value.total) + '</span></p><button class="mdc-button mdc-button--raised raleway fs24" onclick="checkout.update();checkout.dialog.show();" data-mdc-auto-init="MDCRipple">CHECKOUT</button>';
    container.appendChild(braceletsE);
    container.appendChild(subtotalsE);

    return container;
  },
  update: function() {
    var cartElement = document.getElementById('cart');
    var cartData = this.create();
    if (order.bracelets.length === 0) {
      cartElement.innerHTML = '<div class="mdc-card mdc-layout-grid__cell mdc-layout-grid__cell--span-12 "><section class="mdc-card__supporting-text"><h1 class="cartisempty">Your cart is empty.</h1><button class="mdc-button mdc-button--raised raleway fs24 cartisemptybutton" onclick="cart.dialog.close()">RETURN TO SHOP</div>';
    } else if (cartElement.hasChildNodes()) {
      cartElement.innerHTML = cartData.innerHTML;
    } else {
      cartElement.appendChild(cartData);
    }

    document.querySelector('.mdc-fab.mdc-dialog__footer__button--cancel.pinnedFab').addEventListener('click', function() {
      console.log(cart.dialog);
      cart.dialog.close();
    }, true);
    var qinputs = document.querySelectorAll('.quantity-input');
    for (var i = 0; i < qinputs.length; i++) {
      qinputs[i].value = order.bracelets[i].quantity;
      qinputs[i].addEventListener('input', function() {
        ux.changeQuantity(this);
      }, true);
    }
    var shippingRadios = document.querySelectorAll('.shipping-radio');
    for (i = 0; i < shippingRadios.length; i++) {
      shippingRadios[i].addEventListener('click', ux.handleShipping, true);
    }
    if (order.options.shipping === "Pickup") {
      document.getElementById('ex2-radio2').checked = false;
      document.getElementById('ex2-radio1').checked = true;
    } else {
      document.getElementById('ex2-radio1').checked = false;
      document.getElementById('ex2-radio2').checked = true;
    }
  }
};
var tempQuantity;
var checkout = {
  update: function() {
    ux.handleShipping();
    var shippingOnlys = document.querySelectorAll('.shipping_only'),
      i;
    if (order.options.shipping === "Pickup") {
      for (i = 0; i < shippingOnlys.length; i++) {
        shippingOnlys[i].style.display = 'none';
      }
    } else {
      for (i = 0; i < shippingOnlys.length; i++) {
        shippingOnlys[i].style.display = 'inline-flex';
      }
    }
    var checkoutReview = document.getElementById('checkout-review');
    var table = document.createElement('table');
    table.class = 'checkout-review-table';

    var standardT, customT, discountT, shippingT;
    if (order.value.standard > 0) {
      standardT = '<tr><td ><p class="leftalign">Standard Stylelet: </p></td><td><p class="money rightalign">×' + order.value.standard + '</p></tr></td>';
    } else {
      standardT = '';
    }
    if (order.value.custom > 0) {
      customT = '<tr><td ><p class="leftalign">Custom Stylelet: </p></td><td><p class="money rightalign">×' + order.value.custom + '</p></tr></td>';
    } else {
      customT = '';
    }
    var subtotalT = '<tr><td ><p class="leftalign">Subtotal: </p></td><td><p class="money rightalign">' + ux.formatMoney(order.value.subtotal) + '</p></tr></td>';
    if (order.value.discount > 0) {
      discountT = '<tr><td ><p class="leftalign">Total: </p></td><td><p class="money rightalign">' + ux.formatMoney(order.value.discount) + '</p></tr></td>';
    } else {
      discountT = '';
    }
    if (order.value.shipping > 0) {
      shippingT = '<tr><td ><p class="leftalign">Shipping: </p></td><td><p class="money rightalign">' + ux.formatMoney(order.value.shipping) + '</p></tr></td>';
    } else {
      shippingT = '<tr><td ><p class="leftalign">Pickup: </p></td><td><p class="money rightalign">' + ux.formatMoney(order.value.shipping) + '</p></tr></td>';
    }
    var totalT = '<tr><td ><p class="leftalign">Total: </p></td><td><p class="money rightalign">' + ux.formatMoney(order.value.total) + '</p></tr></td>';
    table.innerHTML = standardT + customT + subtotalT + discountT + shippingT + totalT;
    checkoutReview.appendChild(table);
  },
  validate: function() {
    function error(text) {
      var errorDisplay = document.getElementById('errorDisplay');
      errorDisplay.innerText = text;
    }
    order.customer.first_name = document.getElementById('first_name').value;
    order.customer.last_name = document.getElementById('last_name').value;
    order.customer.address = document.getElementById('Address').value;
    order.customer.address_info = document.getElementById('Address_INFO').value;
    order.customer.city = document.getElementById('City').value;
    order.customer.postal_code = document.getElementById('Postal_Code').value;
    order.customer.phone_number = document.getElementById('Phone_Number').value;
    order.customer.email = document.getElementById('Email').value;
    order.notes = document.getElementById('multi-line').value;
    if (/.{1,32}/.test(order.customer.first_name) === false) {
      error('Please enter your first name.');
      return;
    } else if (/.{1,32}/.test(order.customer.last_name) === false) {
      error('Please enter your last name.');
      return;
    } else if (order.options.shipping === "Shipping") {
      if (/.{1,48}/.test(order.customer.address) === false) {
        error('Please enter your address.');
        return;
      } else if (/.{1,32}/.test(order.customer.city) === false) {
        error('Please enter your city.');
        return;
      } else if (typeof order.customer.province === 'undefined') {
        error('Please select your province.');
        return;
      } else if (/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]/.test(order.customer.postal_code) === false) {
        error('Please enter your postal code.');
        return;
      }
    }
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(order.customer.email) === false || order.customer.email.length <= 0) {
      error('Please enter your email.');
      return;
    } else {
      submitOrder();
    }
  }
};
/* global mdc*/
function init() {
  var MDCSelect = mdc.select.MDCSelect;
  var root = document.getElementById('js-select');
  var select = MDCSelect.attachTo(root);
  root.addEventListener('MDCSelect:change', function() {
    size = select.value;
  });
  var root2 = document.getElementById('js-select-2');
  var select2 = MDCSelect.attachTo(root2);
  root2.addEventListener('MDCSelect:change', function() {
    order.customer.province = select2.value;
  });
  cart.dialog = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-default'));
  var input = document.getElementById('customize_message');
  checkout.dialog = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-default2'));
  document.querySelector('#cartFab').addEventListener('click', function(evt) {
    message = input.value;
    var errorDisplay = document.querySelector('.customize_error');
    if (!input.checkValidity()) {
      return;
    } else if (typeof colour === 'undefined') {
      errorDisplay.innerText = 'Please select a colour.';
    } else if (typeof size === 'undefined') {
      errorDisplay.innerText = 'Please select a size.';
    } else {
      errorDisplay.innerText = '';
      order.bracelets.push({
        colour: colour,
        message: message,
        quantity: tempQuantity || 1,
        size: size
      });
      for (var i = 0; i < order.bracelets.length; i++) {
        for (var j = 0; j < order.bracelets.length; j++) {
          if (order.bracelets[i] === order.bracelets[j]) {
            continue;
          } else if (order.bracelets[i].colour === order.bracelets[j].colour && order.bracelets[i].message === order.bracelets[j].message && order.bracelets[i].size === order.bracelets[j].size) {
            order.bracelets[i].quantity += order.bracelets[j].quantity;
            order.bracelets.splice(order.bracelets.indexOf(order.bracelets[j]), 1);
          }
        }
      }
      cart.update();
      tempQuantity = undefined;
      cart.dialog.lastFocusedTarget = evt.target;
      cart.dialog.show();
    }
  });
}
init();

/*global firebase*/

var config = {
  apiKey: "AIzaSyApenLAYo1ydfMRiZBDV4RMunxInwntP4g",
  authDomain: "intertwined-93af8.firebaseapp.com",
  databaseURL: "https://intertwined-93af8.firebaseio.com",
  storageBucket: "intertwined-93af8.appspot.com",
  messagingSenderId: "1025896419417"
};
firebase.initializeApp(config);

function generateID() {
  var hex = Math.floor(Math.random() * 65536).toString(16).toUpperCase();
  return hex;
}
var database = firebase.database();

function writeUserData(id, order, date) {
  database.ref('orders-name/' + id).set(true);
  database.ref('orders/' + id).set({
    bracelets: order.bracelets,
    customer: order.customer,
    date: date,
    notes: order.notes,
    value: order.value
  });
}

function submitOrder() {
  var button = document.getElementById('place-order');
  button.innerHTML = '<div class="loader">Loading...</div>';
  var hex = generateID();
  database.ref('orders-name/').once('value').then(function(snapshot) {
    if (snapshot.hasChild(hex)) {
      submitOrder();
    } else {
      var id = hex;
    }
    ga('send', 'event', 'ecommerce', 'order', 'submit', order.value.total);
    writeUserData(id, order, ((new Date()).getTime() / 1000));
    button.style.textTransform = 'none';
    button.innerHTML = 'Thank you for ordering! <br> Your order ID is: ' + id;
    button.onclick = '';
  });
}
window.alert('Hi! Since May 19, 2017, we are no longer offering Stylelets as we have undergone the process of liquidation. \n\nThis website has been restored to provide a demonstration of a customizable order form.\n\n-Steven Tang, VP of Information Technology');
