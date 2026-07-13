/* Shopify-koppeling — vul deze drie waarden in en de kookboek-pagina verkoopt echt.
   Waar ze vandaan komen: zie SHOPIFY-KOPPELING.md in de repo-root.
   LET OP: alleen de Storefront-token (publiek by design). NOOIT een Admin-API-key hier. */
window.SHOPIFY_CONFIG = {
  domain: "",          // bv. "maarten-in-de-keuken.myshopify.com"
  storefrontToken: "", // Storefront access token uit het Buy Button-kanaal
  productId: ""        // numeriek product-id uit de Buy Button-embedcode
};
