
export interface OrderInfo {
    id: number;
    name: string,
    client: string,
    deliveryDate: string,
    create_date: string,
    quantityBoxToReturn: number,
    has_invoice: boolean,
    amount_untaxed: any,
    amount_untaxed_to_show: any
    amount_tax: number,
    amount_tax_to_show: any,
    amount_total: number,
    amount_total_to_show: any,
    currencySymbol: string,
    currencyUnitLabel: string,
    currencySubUnitLabel: string,
    total_discount: number,
    total_discount_for_show: any,
    delivery_charges: number,
    minimun_quantity_products: number
    isValidMinProduct: boolean
}

