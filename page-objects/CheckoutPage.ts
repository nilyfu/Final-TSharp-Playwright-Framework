import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../data-object/user-data';
import { ProductData } from '../data-object/product-data';
import { CartPage } from './CartPage';



export class CheckoutPage extends BasePage {
    
    protected readonly cartPage: CartPage;

    constructor(page: Page) {
        super(page);
        this.cartPage = new CartPage(page);
    }

    fullNameTxt() { return this.page.locator(`//input[@data-testid='checkout-name']`) };
    phoneTxt() { return this.page.locator(`//input[@data-testid='checkout-phone']`) };
    addressTxt() { return this.page.locator(`//input[@data-testid='checkout-address']`) };
    checkoutBtn() { return this.page.locator(`button.btn-checkout`) };
    totalPrice() { return this.page.locator(`p.success-total`) };
    checkoutInfo() {return this.page.locator(`div.checkout-success`)};
    getSuccessHeader() {return this.checkoutInfo().locator('h2')};
    getFullName() { return this.checkoutInfo().locator('p', { hasText: 'Người nhận' }).locator('strong')};

    



    codPaymentRadio() {
        return this.page.locator('input[name="paymentMethod"][value="cash"]');
    }

    async InputCheckoutInfo(userInfo: UserData) {
        await this.typeText(this.fullNameTxt(),userInfo.fullname);
        await this.typeText(this.phoneTxt(), userInfo.phone);
        await this.typeText(this.addressTxt(), userInfo.address);
    }

    async SelectCODPaymentOption()
    {
        await this.codPaymentRadio().check({ force: true });
    }

    async ClickCheckoutBtn()
    {
        await this.clickElement(this.checkoutBtn());
        await this.page.waitForLoadState('load');
    }


   async VerifyCheckoutSuccessfullywithUserInfo(userInfo: UserData, product: ProductData[])
   {

    //verify Success Message
    await expect(this.getSuccessHeader()).toHaveText('Đặt hàng thành công!');

    //verify User checkout Information
    await expect(this.getFullName()).toHaveText(userInfo.fullname);
    const actualAddress = this.checkoutInfo().locator('p', { hasText: userInfo.address });
    await expect(actualAddress).toBeVisible();

    //verify total price
    const expectedPriceNumber = await this.cartPage.calculateTotalPrice(product);
    const expectedPriceStr = this.extractDigits(String(expectedPriceNumber));
    const actualPriceText = await this.totalPrice().innerText();
    const actualPriceStr = this.extractDigits(actualPriceText);

    expect(actualPriceStr, `Expected total price to be ${expectedPriceStr} but got ${actualPriceStr}`)
        .toBe(expectedPriceStr);


   }

}