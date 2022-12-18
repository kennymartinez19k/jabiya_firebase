import { OrderInfo } from "./order-info.interface";
import { OrderLine } from "./order-line.interface";

export interface CurrentOrder {
    order: OrderInfo,
    order_lines: Array<OrderLine>
}

