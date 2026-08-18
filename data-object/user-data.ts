export class UserData {
    fullname: string;
    phone: string;
    address: string;

    constructor(data: any) {
        this.fullname = data.fullname;
        this.phone = data.phone;
        this.address = data.address;
    }
}