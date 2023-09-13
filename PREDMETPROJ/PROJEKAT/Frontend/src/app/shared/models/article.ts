export interface NewArticle {
    name: string;
    price: number;
    quantity: number;
    description: string;
    picture: string;
    userId: number;
}

export interface Article{
    id : number;
    name: string;
    price: number;
    quantity: number;
    description: string;
    picture: string;
    userId: number;
    file: File;
}