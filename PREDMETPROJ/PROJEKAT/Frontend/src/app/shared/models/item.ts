export interface GetItem{
    id: number,
    quantity: number,
    articleName: string,
}

export interface HistoryItem{
    id: number,
    quantity: number,
    articleName: string,
}

export interface ActiveItem{
    id: number,
    quantity: number,
    articleName: string,
}

export interface CreateItem{
    quantity: number,
    articleId: number,
}