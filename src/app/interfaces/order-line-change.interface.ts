export interface OrderLineChange {
    id: number,
    order_id: number,
    order_line_id: number,
    detail_before_change: string,
    units_before_change: number,
    total_price_before_change: number,
    create_date: string,

}

