import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLConstants } from '../env/url';
import { ProductData } from '../data-object/product-data';



export class CartPage extends BasePage {


    shopBtn() { return this.page.locator(`button.shop-btn`) };
    checkoutBtn() { return this.page.locator(`button.checkout-btn`) };
    cartSummary() { return this.page.locator(`div.cart-summary`) };

    getCartItemInfo(productName: string) {
        return this.page.locator('div.cart-item').filter({ hasText: productName });
    }

    getItemName(productName: string) {
        return this.getCartItemInfo(productName).locator('h3.item-name');
    }

    getItemCategory(productName: string) {
        return this.getCartItemInfo(productName).locator('p.item-category');
    }

    getItemUnitPrice(productName: string) {
        return this.getCartItemInfo(productName).locator('p.item-unit-price');
    }

    getItemQuantity(productName: string) {
        return this.getCartItemInfo(productName).locator('span.qty-value');
    }

    getRemoveBtn(productName: string) {
        return this.getCartItemInfo(productName).locator('button.remove-btn');
    }

    cartItem() {
        return this.page.locator('div.cart-item');
    }

    totalQuantity() {
        return this.page.locator('.cart-summary .summary-row').first().locator('span').first();
    }

    totalPrice() {
        return this.page.locator('.cart-summary .summary-row').first().locator('span').nth(1);
    }

    async NavigateToCartPage() {
        await this.NavigateTo(URLConstants.BASE_URL + URLConstants.CART_URL);
    }

    async GetQuantityOfProduct(productName: string): Promise<number> {
        await this.NavigateToCartPage();

        const quantityLocator = this.getItemQuantity(productName);
        if (await quantityLocator.isVisible().catch(() => false)) {
            const rawText = await quantityLocator.inputValue().catch(async () => {
                return await quantityLocator.innerText();
            });
            const quantity = parseInt(rawText.trim(), 10);
            return isNaN(quantity) ? 0 : quantity;
        }
        return 0;
    }

    async DeleteProductBeforeAdd(productname: string) {
        await this.NavigateToCartPage();
        const _product = Number(await this.getItemName(productname).count());
        if (_product > 0) {
            await this.ClickDeleteProduct(productname);
        }
    }

    async DeleteAllProductInCart() {
        await this.NavigateToCartPage();
        const removeButtons = this.cartItem().locator('button.remove-btn');
        while (await removeButtons.count() > 0) {
            const firstRemoveBtn = removeButtons.first();
            await firstRemoveBtn.click();
            await this.page.waitForLoadState('domcontentloaded').catch(() => { });
        }
        console.log('All products have been deleted from the cart.');
    }

    async ClickDeleteProduct(product: string) {
        await this.clickElement(this.getRemoveBtn(product));
    }

    async ClickShopButton() {
        await this.clickElement(this.shopBtn());
        await this.page.waitForLoadState('load');
    }
    async VerifyInfomationOfProduct(product: ProductData) {
        // check name of proudct 
        const itemContainer = this.getCartItemInfo(product.productName);
        await expect(itemContainer).toBeVisible();
        await expect(this.getItemName(product.productName)).toHaveText(product.productName);

        // check price of product
        const priceText = await this.getItemUnitPrice(product.productName).innerText();
        const actualPrice = this.extractDigits(priceText);
        const expectedPrice = this.extractDigits(product.price);
        expect(actualPrice, `Expected price for "${product.productName}" to be ${expectedPrice} but got ${actualPrice}`)
            .toContain(expectedPrice);
    }

    async VerifyQuantityOfProduct(product: ProductData) {
        const quantityLocator = this.getItemQuantity(product.productName);
        const isInput = await quantityLocator.evaluate(el => el.tagName === 'INPUT').catch(() => false);
        const expectedQtyStr = String(product.quantity);

        if (isInput) {
            await expect(quantityLocator).toHaveValue(expectedQtyStr);
        } else {
            await expect(quantityLocator).toHaveText(expectedQtyStr);
        }
    }

    async VerifyTheProductAddToCartSuccessfully(product: ProductData) {
        await this.VerifyInfomationOfProduct(product);
        await this.VerifyQuantityOfProduct(product);
    }


    async VerifyAllProductsInCart(data: ProductData[]) {
        await this.NavigateToCartPage();
        let totalQuantity = 0;
        let totalPrice = 0;
        for (const product of data) {
            await this.VerifyTheProductAddToCartSuccessfully(product);
            totalQuantity = totalQuantity + Number(product.quantity);
        }
        totalPrice = await this.calculateTotalPrice(data);
        await this.VerifyCartSummary(totalQuantity,totalPrice);

    }

    async calculateTotalPrice(data: ProductData[]): Promise<number> {
        return data.reduce((total, product) => {
            return total + Number(product.price) * Number(product.quantity);
        }, 0);
    }

    async VerifyCartSummary(expectedQuantity: number, expectedTotalPrice: number) {
        //verify quantity
        const quantityText = await this.totalQuantity().innerText();
        const actualQuantity = Number(this.extractDigits(quantityText));
        expect(actualQuantity, `Expected total quantity to be ${expectedQuantity} but got ${actualQuantity}`)
            .toBe(expectedQuantity);
         //verify total price
        const priceText = await this.totalPrice().innerText();
        const actualPrice = this.extractDigits(priceText);
        const expectedPrice = this.extractDigits(String(expectedTotalPrice));

        expect(actualPrice, `Expected total price to be ${expectedPrice} but got ${actualPrice}`)
            .toBe(expectedPrice);
    }

    async ClickOnCheckoutBtn()
    {
        await this.clickElement(this.checkoutBtn());
        await this.page.waitForLoadState('load');
    }

}