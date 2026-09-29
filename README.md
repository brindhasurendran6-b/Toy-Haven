# Toy Haven - Simple Editable Website

Toy Haven is a second, visually different version of the Toy Haven assignment. It keeps the required six-page e-commerce functionality but uses a simpler blue/yellow/mint visual style.

## Open in VS Code
1. Extract the ZIP.
2. Open the `toy-haven` folder in VS Code.
3. Open `index.html` in a browser, or use Live Server if installed.

## Easiest file to edit
Open `js/products-data.js`.

Each product has:
- `id` = unique number
- `name` = product name
- `category` = category used by filters
- `price` = product price
- `description` = text shown in the modal
- `image` = image path inside `assets`

To add a product, copy an object, give it a new ID, and add an image file to `assets`.

## Main files
- `index.html` - Home page
- `products.html` - Search, filters and product modal
- `cart.html` - Cart and totals
- `checkout.html` - Validation and order history
- `wishlist.html` - Interested / Owned / Not Interested
- `support.html` - Feedback and FAQ accordion
- `css/style.css` - All design and responsive rules
- `js/products-data.js` - Product data
- `js/app.js` - JavaScript functionality
- `manifest.json` + `sw.js` - PWA setup

## Viva explanation
Say: "I separated product data from functionality. `products-data.js` stores the product objects, while `app.js` reads those objects and updates the DOM. I use localStorage for the cart, collection, newsletter, feedback and order history. The same JavaScript functions are reused across pages. CSS Grid, Flexbox and media queries make the site responsive."

## Requirements covered
- Six functional pages
- Product cards with image, name, category and price
- Search and category filtering
- Product modal
- Add to cart and persistent cart
- Quantity controls and totals
- Checkout validation and order history
- Wishlist/collection statuses
- Feedback validation and localStorage
- FAQ accordion
- Responsive navigation and hamburger menu
- CSS hover effects, animations and scroll reveal
- Favicon and PWA manifest/service worker
- Semantic HTML and accessible labels/buttons

## Testing before submission
Use the W3C HTML validator, W3C CSS validator, WAVE, Lighthouse Desktop/Mobile, and browser device emulation. Then deploy the folder to GitHub Pages as required by the brief.
