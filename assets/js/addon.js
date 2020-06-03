jQuery(document).ready(function() {
  createAdditionalHTMLs();

  window.giftStylingId = "product-addon-gift-styling";
  window.giftStylingContainer = ".addon-preferred-styling";

  window.popups = {};
  window.selectedItemsRemoveKey = {};
  window.selectedItems = [];
  var _addon_popup = jQuery(".addon-popup");
  window.addon_popup_settings = {
    current: "",
    open: false
  };
  jQuery("form.cart .product-addon").each(function(b, a) {
    var unique_id = jQuery(a)
      .hide()
      .attr("class")
      .trim()
      .split(" ")[1];
    if (unique_id == window.giftStylingId) {
      jQuery(a).css("display", "block");
      jQuery(window.giftStylingContainer).append(a);
      jQuery('<div class="addon-img"></div>').insertBefore(
        ".product-addon-gift-styling label input"
      );
      return;
    }
    window.popups[unique_id] = {
      html: a,
      unique_id: unique_id
    };
    var _add_items_button_wrapper = jQuery(
      '<div class="addon_add_items_button_wrapper"></div>'
    );
    var _add_items_button_cancel = jQuery(
      "<div onclick=\"popups['" +
        unique_id +
        '\'].cancelAddItems();" class="button addon_add_items_button cancel">Cancel</div>'
    );
    var _add_items_button = jQuery(
      "<div onclick=\"popups['" +
        unique_id +
        '\'].addItems();" class="button addon_add_items_button add">Add Items</div>'
    );

    _add_items_button_wrapper
      .append(_add_items_button_cancel)
      .append(_add_items_button);
    jQuery(a).append(_add_items_button_wrapper);

    jQuery(a)
      .find("p.form-row")
      .each(function(index, el) {
        var _addon_item = jQuery(el);
        var _addon_input = _addon_item.find("input");
        var _price = _addon_input.data("price");
        _addon_input.data("currentQty") || _addon_input.data("currentQty", 0);
        _addon_input.hide();
        function addQty() {
          var curVal = parseInt(_addon_input.val());
          var newVal = (curVal ? curVal : 0) + 1;
          _addon_input.val(newVal);
          _addon_item.find(".qty-display").html(newVal);

          renderHtml(newVal);
        }
        function minusQty() {
          var curVal = parseInt(_addon_input.val());
          curVal = curVal ? curVal : 0;
          var newVal = curVal < 1 ? 0 : curVal - 1;

          renderHtml(newVal);
        }

        function renderHtml(newVal) {
          _addon_input.val(newVal);
          _addon_item.find(".qty-display").html(newVal);
          _addon_item
            .find(".qty-addon-total")
            .html("$" + calculateTotal(newVal * _price));
        }
        var qtyWrapper = jQuery('<div class="qty-addon-control"></div>');
        jQuery(qtyWrapper).appendTo(_addon_item);

        if (_addon_input.attr("type") != "radio") {
          jQuery('<div class="minus"></div>')
            .click(minusQty)
            .appendTo(qtyWrapper);
          jQuery('<div class="add""></div>')
            .click(addQty)
            .appendTo(qtyWrapper);
          jQuery('<div class="qty-display">0</div>').appendTo(_addon_item);
        } else {
          jQuery('<div class="qty-display"></div>').appendTo(_addon_item);
          _addon_input.css("display", "inline-block").on("click", function(e) {
            jQuery(a)
              .find(".qty-addon-total")
              .html("$" + calculateTotal(0));
            var newPrice = parseInt(_addon_input.data("price") || 0);
            _addon_item
              .find(".qty-addon-total")
              .html("$" + calculateTotal(newPrice));
          });
        }

        jQuery(
          '<div class="qty-addon-total">$' + calculateTotal(0) + "</div>"
        ).appendTo(_addon_item);
        // jQuery('<img src="https://gb-unit-stg.blz.onl/wp-content/uploads/2016/08/Boxed-Treats-672x598.jpg" style="width: 50px; height: 50px;"/>').prependTo(_addon_item)
      });

    var _title = jQuery(a)
      .find("h3.addon-name")
      .html();
    jQuery(
      "<div onclick=\"popups['" +
        unique_id +
        '\'].openModal(this);" class="addon-grids-item" id="btn-for-' +
        unique_id +
        '"><div class="inner-img"><h4>' +
        _title +
        "</h4></div></div>"
    ).appendTo(".addon-grids");
    window.popups[unique_id].addItems = function() {
      jQuery(".addon-grids-item").removeClass("active");
      jQuery(this.html)
        .hide()
        .insertAfter("form.cart .addon-popup");
      getGrandTotalAndChangeWooPriceToGrandTotal();
      jQuery(this.html)
        .find("input")
        .first()
        .trigger("change");
      window.addon_popup_settings.current = "";
      setCurrentQuantities();
      renderListHtml();
      scrollToForm();
    };
    window.popups[unique_id].cancelAddItems = function() {
      jQuery(".addon-grids-item").removeClass("active");
      resetCurrentQuantities();
      jQuery(this.html)
        .hide()
        .insertAfter("form.cart .addon-popup");
      window.addon_popup_settings.current = "";
      scrollToForm();
    };
    window.popups[unique_id].openModal = function(button) {
      jQuery(".addon-grids-item").removeClass("active");
      jQuery(button).addClass("active");

      if (window.addon_popup_settings.current == this.unique_id) {
        return false;
      } else {
        if (window.addon_popup_settings.current != "") {
          jQuery(window.popups[window.addon_popup_settings.current].html)
            .hide()
            .insertAfter("form.cart .addon-popup");
        }
        window.addon_popup_settings.current = this.unique_id;
        window.addon_popup_settings.open = true;

        _addon_popup.append(this.html);
        if (jQuery(this.html).find(".container").length == 0) {
          jQuery("<div class='container'><div>").insertAfter(
            ".addon-popup .product-addon h3.addon-name"
          );
          jQuery(".addon-popup .product-addon p.form-row").appendTo(
            ".addon-popup .product-addon .container"
          );
        }
        jQuery(this.html).show();
        scrollToAddonList();
      }
    };

    function scrollToForm() {
      document
        .querySelector(".product_title.entry-title")
        .scrollIntoView({ behavior: "smooth" });
    }
    function scrollToAddonList() {
      document
        .querySelector(".addon-popup")
        .scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function() {
        window.scrollBy(0, -120);
      }, 500);
    }
    function setCurrentQuantities() {
      jQuery(a)
        .find("p.form-row")
        .each(function(index, el) {
          var _addon_item = jQuery(el);
          var _addon_input = _addon_item.find("input");
          var qtyToInt = parseInt(_addon_input.val());
          var qty = qtyToInt ? (qtyToInt == 0 ? "" : qtyToInt) : "";
          console.log("setCurrentQuantities", qty);
          _addon_input.data("currentQty", qty);

          addSelectedAddon(_addon_item, qty);
        });
    }
    function resetCurrentQuantities() {
      jQuery(a)
        .find("p.form-row")
        .each(function(index, el) {
          var _addon_item = jQuery(el);
          var _addon_input = _addon_item.find("input");
          var qty = _addon_input.data("currentQty");
          var _price = _addon_input.data("price");
          _addon_input.val(qty);
          _addon_item.find(".qty-display").html(qty);
          _addon_item
            .find(".qty-addon-total")
            .html("$" + calculateTotal(qty * _price));
        });
    }
  });

  var width;
  jQuery(window).resize(function() {
    width = jQuery(window).width();
    console.log("resized to " + width);

    if (width < 768) {
      jQuery(".woocommerce-tabs.wc-tabs-wrapper").appendTo(
        ".summary.entry-summary"
      );
    } else {
      jQuery(".woocommerce-tabs.wc-tabs-wrapper").appendTo(
        ".woocommerce-product-gallery"
      );
    }
  });
});

function createAdditionalHTMLs() {
  jQuery('<div class="addon-grids"></div>').insertAfter("form.cart .qty-row");
  jQuery('<div class="addon-popup"></div>').insertAfter(
    "form.cart .addon-grids"
  );
  jQuery(
    '<h3 class="addon-grid-title">Add more items to customize your gift</h3>'
  ).insertBefore("form.cart .addon-grids");

  jQuery('<div class="addon-list-view"></div>').insertBefore(
    "#product-addons-total"
  );

  jQuery(
    '<h3 class="addon-grid-title preferred-styling">Select your preferred gift styling:</h3>'
  ).insertAfter("form.cart .qty-row");
  jQuery('<div class="addon-preferred-styling"></div>').insertAfter(
    "form.cart h3.preferred-styling"
  );
}

function addSelectedAddon(_addon_item, qty) {
  var rawId = _addon_item.find("input").attr("name");
  if (qty > 0) {
    var newElem = _addon_item.clone();
    var _id = "list_id_" + rawId;

    newElem.attr("id", _id);
    newElem.find(".qty-addon-control, input, .addon-alert").remove();
    newElem.attr("class", "list-addon-detail");
    var _remove_btn = jQuery(
      "<a onclick=\"window.selectedItemsRemoveKey['" +
        rawId +
        '\']()" class="remove-list-addon-item">x</a>'
    );

    window.selectedItemsRemoveKey[rawId] = function() {
      var _addon_item = jQuery('input[name="' + rawId + '"]').parent();
      var _addon_input = _addon_item.find("input");
      var qty = 0;
      var _price = _addon_input.data("price");
      _addon_input.data("currentQty", qty);
      _addon_input.val("");
      _addon_item.find(".qty-display").html(qty);
      _addon_item
        .find(".qty-addon-total")
        .html("$" + calculateTotal(qty * _price));

      getGrandTotalAndChangeWooPriceToGrandTotal();
      _addon_input.trigger("change");
      newElem.remove();
      removeAddonItemOnList();
    };
    newElem.append(_remove_btn);

    removeAddonItemOnList();

    window.selectedItems.push(newElem);

    function removeAddonItemOnList() {
      window.selectedItems = window.selectedItems.filter(function(a) {
        return a.attr("id") != _id;
      });
    }
  } else {
    if (typeof window.selectedItemsRemoveKey[rawId] != "undefined") {
      window.selectedItemsRemoveKey[rawId]();
    }
  }
}

function renderListHtml() {
  var _list_html = jQuery(".addon-list-view");
  _list_html.html("");
  if (window.selectedItems.length > 0) {
    _list_html.append(window.selectedItems);
  }
}

function calculateTotal(value) {
  return parseFloat(Math.round(value * 100) / 100).toFixed(2);
}

function getGrandTotalAndChangeWooPriceToGrandTotal() {
  setTimeout(function() {
    jQuery(".price .woocommerce-Price-amount").html(
      jQuery("body")
        .find(".cart")
        .find("#product-addons-total > dl > dd:nth-child(4) > strong > span")
        .html()
    );
  }, 500);
}
