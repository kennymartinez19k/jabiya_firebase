import { InTax } from "./in-tax.interface";
import { OrderLineChange } from "./order-line-change.interface";
import { ProductCategoryId } from "./product-category-id.interface";

export interface OrderLine {

    productId: number,
    productName: string,
    price_before_tax: number,
    price: number,
    oldPrice: number,
    quantity: number,
    image_url: string,
    image_hash: string,
    is_discount: boolean,
    free_qty: number,
    minimum_order_qty: number,
    available_threshold: number,


    line_id: number | undefined,
    isRewardLine: boolean | undefined,
    productImage: string | undefined,
    productPriceSubtotal: any | undefined,
    productPriceTax: number | undefined,
    productPriceTotal: number | undefined,
    qtyAvailableToday: number | undefined,
    currencySymbol: string | undefined,
    currencyUnitLabel: string | undefined,
    currencySubUnitLabel: string | undefined,
    order_line_changes: Array<OrderLineChange> | undefined,
    taxes: Array<InTax> | undefined,
    productCategories: Array<ProductCategoryId> | undefined
}
