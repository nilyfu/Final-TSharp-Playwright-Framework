export class ProductData {
    productName: string;
    category: string;
    price: string;
    quantity: string
    

    constructor(data: any) {
        this.productName = data.productName;
        this.category = data.category;
        this.price = data.price;
        this.quantity = data.quantity;
    }
}