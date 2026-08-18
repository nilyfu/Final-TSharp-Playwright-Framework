import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLConstants } from '../env/url';
import { CartPage } from './CartPage';
import { ProductData } from '../data-object/product-data';

export class HomePage extends BasePage {

    protected readonly cartPage: CartPage;

    constructor(page: Page) {
        super(page);
        this.cartPage = new CartPage(page);
    }

    getProductCard(productName: string) {
        return this.page.locator('div.product-card').filter({ hasText: productName });
    }

    getAddToCartBtn(productName: string) {
        return this.getProductCard(productName).locator('button.add-to-cart');
    }

    listProduct() {
        return this.page.locator(`//div[@class='product-grid']/div`)
    };



    async NavigateToHomePage() {
        const path = URLConstants.BASE_URL + URLConstants.HOME_URL;
        try {
            await Promise.all([
                this.page.waitForURL(path, { waitUntil: 'domcontentloaded' }),
                this.page.evaluate((newUrl) => {
                    window.location.href = newUrl;
                }, path).catch(() => { })
            ]);
        } catch (finalError) {

            await this.page.waitForURL(path, { timeout: 5000 });
        }

        expect(this.page.url()).toContain(path);
    }

    async isAttached(locator: Locator): Promise<boolean> {
        return (await locator.count()) > 0;
    }

    async waitForListProduct() {
        expect(await this.listProduct().count() > 0);
    }

    async ClickAddProductBtn(productName: string) {
        const button = this.getAddToCartBtn(productName);
        await button.scrollIntoViewIfNeeded();
        await expect(button).toBeVisible({ timeout: 5000 });
        // Click
        await button.click({ delay: 50 });
    }

    async AddProductToCart(productName: string) {
        await this.ClickAddProductBtn(productName);
    }

    async AddMultipleProductsToCart(products: ProductData[]) {
        for (const product of products) {
            const qty = Number(product.quantity) || 1;
            console.log(`Adding ${qty} unit(s) of product: ${product.productName}`);

            for (let i = 0; i < qty; i++) {
                await this.ClickAddProductBtn(product.productName);
                await this.page.waitForTimeout(300);
            }
        }
    }

}

