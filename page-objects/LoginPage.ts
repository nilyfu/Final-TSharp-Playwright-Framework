import { URLConstants } from "../env/url";
import { UserLoginData } from "../data-object/user-login-data";
import { BasePage } from "./BasePage";
import { readCSVFile } from "../core/utils/csvReader";

export class LoginPage extends BasePage {

    usernameInput() { return this.page.locator('#username'); }
    passwordInput() { return this.page.locator('#password'); }
    loginButton() { return this.page.locator(`//button[@type='submit']`); }
    loginTitle() { return this.page.locator(`//h2[@class='login-title']`)}
    usernameLabel() {return this.page.locator(`//a[@class='header-profile-link']`);}
    private data = readCSVFile('userLogin.csv');
    private user = new UserLoginData(this.data[0]);

    async NavigateToLoginPage()
    {
        await this.NavigateTo(URLConstants.BASE_URL + URLConstants.LOGIN_URL);
    }

    async Login(user: UserLoginData) {
        await this.NavigateToLoginPage();
        await this.waitForElement(this.loginTitle());
        await this.typeText(this.usernameInput(), user.username);
        await this.typeText(this.passwordInput(), user.password);
        await this.clickElement(this.loginButton());
        await this.waitForElement(this.usernameLabel());
    }
}


