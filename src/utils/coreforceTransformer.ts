import { CartItem, OrderSummary, CoreFORCEShoppingCartResponse } from '../types'

/**
 * Transforms coreFORCE shopping cart data to the format expected by the React app
 */
export function transformCoreFORCECartData(coreforceData: CoreFORCEShoppingCartResponse) {
  console.log('🔄 Transforming coreFORCE cart data:', coreforceData)

  // Transform cart items
  const items: CartItem[] = coreforceData.shopping_cart_items.map((item, index) => {
    // Use image URL as-is (relative paths will work in the same domain)
    let imageUrl = item.image_url

    return {
      id: item.shopping_cart_item_id.toString(),
      name: item.description,
      price: parseFloat(item.sale_price),
      quantity: item.quantity,
      image: imageUrl,
      description: item.description,
      // CoreFORCE-specific properties
      productId: item.product_id,
      productCode: item.product_code,
      unitPrice: parseFloat(item.unit_price),
      baseCost: parseFloat(item.base_cost),
      inventoryQuantity: item.inventory_quantity,
      timeSubmitted: item.time_submitted,
      savings: item.savings,
      discount: item.discount,
      originalSalePrice: item.original_sale_price,
      listPrice: item.list_price,
      upcCode: item.upc_code,
      manufacturerSku: item.manufacturer_sku,
      model: item.model,
      productTagIds: item.product_tag_ids,
      shippingOptions: item.shipping_options,
      otherClasses: item.other_classes
    }
  })

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = parseFloat(coreforceData.estimated_shipping_charge) || 0
  const discount = coreforceData.discount_amount ? parseFloat(coreforceData.discount_amount) : null
  const discountPercent = parseFloat(coreforceData.discount_percent) || 0
  const totalSavings = parseFloat(coreforceData.total_savings) || 0
  
  // Estimate tax (you may want to calculate this based on your business logic)
  const estimatedTax = subtotal * 0.08 // 8% tax rate as example
  
  const total = subtotal + shipping + estimatedTax - (discount || 0)

  // Transform order summary
  const summary: OrderSummary = {
    subtotal,
    shipping,
    tax: estimatedTax,
    total,
    currency: 'USD',
    discount,
    discountPercent,
    promotionCode: coreforceData.promotion_code,
    promotionDescription: coreforceData.promotion_code_description,
    loyaltyPoints: coreforceData.loyalty_points_awarded,
    totalSavings
  }

  const transformedData = {
    items,
    summary,
    rawData: coreforceData
  }

  console.log('✅ Transformed cart data:', transformedData)
  return transformedData
}

/**
 * Validates coreFORCE cart data structure
 */
export function validateCoreFORCECartData(data: any): data is CoreFORCEShoppingCartResponse {
  return (
    data &&
    Array.isArray(data.shopping_cart_items) &&
    typeof data.estimated_shipping_charge === 'string' &&
    typeof data.total_savings === 'string'
  )
} 