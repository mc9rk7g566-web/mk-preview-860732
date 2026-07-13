/* Kookboek-pagina: laadt de officiële Shopify Buy Button SDK zodra de config is ingevuld.
   Zonder config blijft de "binnenkort"-demo staan. Checkout en backend draaien op Shopify. */
(function () {
  "use strict";

  var cfg = window.SHOPIFY_CONFIG || {};
  var mount = document.getElementById("koop-kookboek");
  var demo = document.getElementById("shop-demo");
  if (!mount || !cfg.domain || !cfg.storefrontToken || !cfg.productId) return;

  var s = document.createElement("script");
  s.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  s.onload = function () {
    var client = ShopifyBuy.buildClient({
      domain: cfg.domain,
      storefrontAccessToken: cfg.storefrontToken
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      if (demo) demo.style.display = "none";
      ui.createComponent("product", {
        id: cfg.productId,
        node: mount,
        moneyFormat: "%E2%82%AC{{amount_with_comma_separator}}",
        options: {
          product: {
            contents: { img: false, title: false, price: true },
            text: { button: "In winkelwagen" },
            styles: {
              price: { "font-family": "Montserrat, sans-serif", "font-size": "1.3rem", color: "#f4ede4" },
              button: {
                "font-family": "Montserrat, sans-serif",
                "font-weight": "600",
                "background-color": "#b31b2b",
                "border-radius": "999px",
                "padding-top": "15px",
                "padding-bottom": "15px",
                "padding-left": "30px",
                "padding-right": "30px",
                ":hover": { "background-color": "#7b0d1e" },
                ":focus": { "background-color": "#7b0d1e" }
              }
            }
          },
          cart: {
            text: { title: "Winkelwagen", total: "Subtotaal", button: "Afrekenen", notice: "" },
            styles: {
              button: {
                "font-family": "Montserrat, sans-serif",
                "font-weight": "600",
                "background-color": "#b31b2b",
                "border-radius": "999px",
                ":hover": { "background-color": "#7b0d1e" },
                ":focus": { "background-color": "#7b0d1e" }
              }
            }
          },
          toggle: {
            styles: {
              toggle: {
                "background-color": "#b31b2b",
                ":hover": { "background-color": "#7b0d1e" },
                ":focus": { "background-color": "#7b0d1e" }
              }
            }
          }
        }
      });
    });
  };
  document.head.appendChild(s);
})();
