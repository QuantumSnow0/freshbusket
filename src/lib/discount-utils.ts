import { Product } from "@/types";

/**
 * Calculate the discounted price for a product
 */
export function calculateDiscountedPrice(product: Product): {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
} {
  const originalPrice = product.price;

  if (
    !product.discount_type ||
    !product.discount_value ||
    product.discount_value <= 0
  ) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountPercentage: 0,
    };
  }

  let discountAmount = 0;
  let discountedPrice = originalPrice;

  if (product.discount_type === "percentage") {
    // Ensure percentage is between 0 and 100
    const percentage = Math.min(100, Math.max(0, product.discount_value));
    discountAmount = (originalPrice * percentage) / 100;
    discountedPrice = originalPrice - discountAmount;
  } else if (product.discount_type === "fixed") {
    // Fixed amount discount
    discountAmount = Math.min(originalPrice, product.discount_value);
    discountedPrice = originalPrice - discountAmount;
  }

  // Ensure discounted price doesn't go below 0
  discountedPrice = Math.max(0, discountedPrice);

  // Calculate actual discount percentage for display
  const discountPercentage =
    originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;

  return {
    originalPrice,
    discountedPrice,
    discountAmount,
    discountPercentage,
  };
}

/**
 * Check if a product has an active discount
 */
export function hasDiscount(product: Product): boolean {
  return !!(
    product.discount_type &&
    product.discount_value &&
    product.discount_value > 0
  );
}

/**
 * Format discount percentage for display
 */
export function formatDiscountPercentage(percentage: number): string {
  return `${Math.round(percentage)}% OFF`;
}

/**
 * Calculate total savings for multiple items
 */
export function calculateTotalSavings(
  items: Array<{ product: Product; quantity: number }>
): number {
  return items.reduce((total, item) => {
    const { discountAmount } = calculateDiscountedPrice(item.product);
    return total + discountAmount * item.quantity;
  }, 0);
}
