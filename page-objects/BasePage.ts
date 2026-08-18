import { Page, Locator, expect } from "@playwright/test";
import { Constants } from "../core/utils/constant";


export class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    h1TitleText(title: string) { return this.page.locator(`//h1[contains(text(),'${title}')]`); }
    h2TitleText(title: string) { return this.page.locator(`//h1[contains(text(),'${title}')]`); }
    h1Title() { return this.page.locator('//h1') };
    btn(btnName: String) { return this.page.locator(`//button[text()='${btnName}']`) };
    cartBtn() { return this.page.locator('//button[@class="cart-btn"]') };
    itemName(itemName: string) { return this.page.locator(`//h3[text()='${itemName}']`) };


    async VerifyItemIsVisible(item: string) {
        await expect(this.itemName(item), `There is no item "${item}" in the list`).toBeVisible();
    }

    async VerifyItemIsNOTVisible(item: string) {
        await expect(this.itemName(item), `There is an item "${item}" in the list`).toHaveCount(0);
    }

    async NavigateTo(url: string): Promise<void> {
        try {
            await this.page.goto(url, {
                waitUntil: 'commit',
                timeout: 30000
            });
        } catch (error) {
            console.error(`Failed to navigate to: ${url}`, error);
            throw error;

        }

    }

    async hoverOnElement(element: string | Locator) {
        if (typeof element === 'string') {
            await this.page.hover(element);
        } else {
            await element.hover();
        }
    }
    async waitForElement(locator: Locator): Promise<void> {
        await locator.waitFor({
            state: 'visible',
            timeout: Constants.TIMEOUT
        });
    }

    async clickElement(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.click();
    }

    async typeText(locator: Locator, text: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.clear();
        await locator.fill(text);
    }

    async getElementText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return await locator.textContent() || '';
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            await this.waitForElement(locator);
            return await locator.isVisible();
        } catch (error) {
            return false;
        }
    }

    async waitUntilVisible(element: Locator, timeout?: number, message?: string) {
        await expect(element, message).toBeVisible({ timeout });
    }

    async waitUntilHidden(element: Locator, timeout?: number, message?: string) {
        await expect(element, message).toBeHidden({ timeout });
    }

    async getElementAttribute(locator: Locator, attributeName: string): Promise<string | null> {
        await this.waitForElement(locator);
        return await locator.getAttribute(attributeName);
    }

    async VerifyPageTitle(expectedTitle: string): Promise<boolean> {
        const actualTitle = await this.h1Title().textContent();
        return actualTitle?.trim() === expectedTitle.trim();
    }


    async countElements(locator: Locator): Promise<number> {
        return await locator.count();
    }

    extractDigits(text: string): string {
        return text.replace(/\D/g, '');
    }
}
