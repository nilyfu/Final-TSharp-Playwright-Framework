import { URLConstants } from "../env/url";
import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class ProfilePage extends BasePage {

    fullNameTxt() { return this.page.locator(`//input[@data-testid='profile-name']`) };
    saveBtn(){ return this.page.locator(`//button[@data-testid='save-profile']`) };



    async NavigateToProfilePage()
    {
        await this.NavigateTo(URLConstants.BASE_URL + URLConstants.PROFILE_URL);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async VerifyFullname(fullName: string)
        {
        const actualFullname= (await this.fullNameTxt().inputValue()).trim();
        expect(actualFullname).toContain(fullName);
    }

    async UpdateRandomFullname(newName: string)
    {
    await this.typeText(this.fullNameTxt(), newName);
    await this.clickElement(this.saveBtn());
    await this.page.waitForTimeout(1000); // Wait for the update to complete
    }

    getRandomFullname(): string {
        const randomSuffix = Math.floor(Math.random() * 10000);
        const newFullName = `niduong${randomSuffix}`;
        return newFullName;
    }




}


