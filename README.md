# React Checkout App with coreFORCE Integration

A modern React-based checkout application designed to be embedded into coreFORCE pages. This app integrates seamlessly with coreFORCE's shopping cart system by calling the `getShoppingCartItems()` function to load real cart data.

## 🚀 Features

- **coreFORCE Integration**: Automatically loads cart data from coreFORCE's `getShoppingCartItems()` function
- **Multi-step Checkout**: Cart → Shipping → Payment → Review flow
- **Real-time Data**: Displays actual cart items, prices, promotions, and discounts
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Static Build**: Can be built into static files for easy embedding

## 🛒 Cart Data Integration

The app automatically integrates with coreFORCE's shopping cart data structure and handles complex scenarios like firearms with FFL requirements:

```javascript
// Example coreFORCE response structure with firearms and shipping options
{
  "shopping_cart_items": [
    {
      "shopping_cart_item_id": 1839695,
      "product_id": 91958627,
      "description": "Test Item Variation 0722 Red",
      "quantity": 1,
      "sale_price": "100.00",
      "product_code": "TEST_ITEM_VARIATION_0722_RED",
      "image_url": "/cache/image-full-386986-0755e42dbde8b329cc777d0f5c9c0406.webp",
      "inventory_quantity": 90,
      "savings": "79.05",
      "discount": "17%",
      "shipping_options": {
        "pickup": false,
        "ship_to_store": false,
        "ship_to_home": true,
        "ship_to_ffl": false
      }
    },
    {
      "shopping_cart_item_id": 1839697,
      "product_id": 91957598,
      "description": "RUGER RXM 9MM PISTOL 4\" AMERICAN FLAG O.R. 2-15RD MAGS",
      "quantity": 1,
      "sale_price": "469.28",
      "shipping_options": {
        "pickup": false,
        "ship_to_store": false,
        "ship_to_home": false,
        "ship_to_ffl": true
      }
    }
  ],
  "promotion_code": "OVER100",
  "discount_amount": "0.00",
  "discount_percent": "20.00",
  "estimated_shipping_charge": "41.95",
  "total_savings": "79.05",
  "loyalty_points_awarded": "This purchase will add 10 loyalty points to your account."
}
```

### 🚚 Shipping Options Integration

The app intelligently handles different shipping requirements based on cart items:

- **FFL Required** (`ship_to_ffl: true`): Firearms that must be shipped to licensed FFL dealers
- **Home Delivery** (`ship_to_home: true`): Items that can be shipped to residential addresses
- **Store Pickup** (`pickup: true`): Items available for in-store pickup
- **Ship to Store** (`ship_to_store: true`): Items shipped from warehouse to store for pickup

The shipping page automatically shows only valid shipping options based on the cart contents.

## 🏗️ Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5174
   ```

### Development Mode

In development mode, the app uses mock data that simulates the coreFORCE response structure. You can see this data in `src/services/mockData.ts`.

## 🚀 Production Build

### Build for Production

```bash
npm run build
```

This creates optimized static files in the `dist/` directory.

### Embed in coreFORCE

1. **Copy built files** to your coreFORCE server
2. **Include in your coreFORCE page:**

```html
<!-- Add to page head -->
<link rel="stylesheet" href="path/to/dist/assets/index-[hash].css">

<!-- Add to page body where you want the checkout -->
<div id="react-checkout-root"></div>
<script src="path/to/dist/assets/index-[hash].js"></script>
```

3. **Ensure coreFORCE provides the data function:**

```javascript
// This function should be provided by coreFORCE
window.getShoppingCartItems = function() {
    return {
        "shopping_cart_items": [...],
        "promotion_code": "OVER100",
        "discount_amount": "20.00",
        // ... rest of cart data
    };
};
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Button, Input, Card, etc.
│   └── layout/         # Layout components
├── pages/              # Checkout flow pages
│   ├── CartPage.tsx    # Cart display (coreFORCE integrated)
│   ├── ShippingPage.tsx
│   ├── PaymentPage.tsx
│   └── ReviewPage.tsx
├── services/           # API and data services
│   ├── api.ts         # coreFORCE integration
│   └── mockData.ts    # Development mock data
├── types/              # TypeScript type definitions
│   └── index.ts       # CoreFORCE data types
└── hooks/              # Custom React hooks
```

## 🔧 Configuration

### coreFORCE Data Mapping

The app automatically maps coreFORCE data fields:

| coreFORCE Field | App Display |
|----------------|-------------|
| `description` | Product name |
| `sale_price` | Product price |
| `quantity` | Item quantity |
| `image_url` | Product image |
| `product_code` | SKU display |
| `inventory_quantity` | Stock level |
| `savings` | Savings amount |
| `discount` | Discount percentage |
| `shipping_options` | Shipping restrictions |
| `product_tag_ids` | Product tags |
| `promotion_code` | Promotion display |
| `discount_amount` | Discount calculation |
| `total_savings` | Total savings |
| `loyalty_points_awarded` | Loyalty info |
| `estimated_shipping_charge` | Shipping cost |

### Customization

- **Styling**: Modify Tailwind classes in components
- **Data mapping**: Update `transformCoreFORCEItems()` in `src/services/api.ts`
- **Calculations**: Modify `calculateOrderSummaryFromCoreFORCE()` for tax/shipping logic

## 🧪 Testing

### Demo Integration

Open `demo-integration.html` in your browser to see how the integration works:

```bash
open demo-integration.html
```

This demo shows:
- How coreFORCE data is loaded
- The complete data structure
- Integration instructions

### Browser Console

Check the browser console to see:
- coreFORCE data loading
- Data transformation
- Any integration errors

## 🔍 Troubleshooting

### Common Issues

1. **"getShoppingCartItems not available"**
   - Ensure coreFORCE provides the function
   - Check function name spelling

2. **Cart data not loading**
   - Verify coreFORCE response structure
   - Check browser console for errors

3. **Styling issues**
   - Ensure CSS file is properly loaded
   - Check for CSS conflicts with coreFORCE

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('debug', 'true');
```

## 📄 License

This project is designed for integration with coreFORCE systems.

## 🤝 Support

For integration questions or issues:
1. Check the browser console for error messages
2. Verify coreFORCE data structure matches expected format
3. Ensure all required files are properly loaded
