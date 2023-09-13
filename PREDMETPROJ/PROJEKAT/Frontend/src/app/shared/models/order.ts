import { CountdownConfig } from "ngx-countdown";
import { ActiveItem, CreateItem, GetItem, HistoryItem } from "./item";

export interface AllOrder {
    id: number,
    item: GetItem,
    comment: string,
    address: string,
    creationTime: Date,
    deliveryTime: Date,
    price: number,
    status: string
}

export interface PaymentPrice{
    article: number,
    delivery: number
}

export interface OrderHistory {
    id: number,
    item: HistoryItem,
    comment: string,
    address: string,
    creationTime: Date,
    deliveryTime: Date,
    price: number,
    status: string
}

export interface ActiveOrder {
    id: number,
    item: ActiveItem,
    comment: string,
    address: string,
    creationTime: Date,
    deliveryTime: Date,
    price: number,
    status: string,
    stopwatch: number,
    config: CountdownConfig,
    showCountdown: boolean;
}

export interface CreateOrder{
    comment: string,
    address: string,
    userId: number,
    sellerId: number,
    item: CreateItem,
}

export interface CancelOrder{
    orderId: number,
    userId: number
}