import { test as base, expect } from '@playwright/test';
import { BasePage } from '../../page-objects/BasePage';
import { LoginPage } from '../../page-objects/LoginPage';
import { HomePage } from '../../page-objects/HomePage';
import { CartPage } from '../../page-objects/CartPage';
import * as allure from 'allure-js-commons';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { readCSVFile } from '../utils/csvReader';
import { UserLoginData } from '../../data-object/user-login-data';
import { ProfilePage } from '../../page-objects/ProfilePage';
import { ProfileAPI } from '../api/ProfileAPI';
import { AuthAPI } from '../api/AuthAPI';



type AppFixture = {
    basePage: BasePage;
    loginPage: LoginPage;
    homePage: HomePage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    profilePage: ProfilePage;
    profileAPI: ProfileAPI;
    authAPI: AuthAPI;
    allureAutoHook: void;
    authedPage: void;
};

export const test = base.extend<AppFixture>({
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page)); 
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    profileAPI: async ({ request }, use) => {
            await use(new ProfileAPI(request));
        },
    authAPI: async ({ request }, use) => {
            await use(new AuthAPI(request));
        },

    authedPage: [async ({ loginPage }, use) => {
        const data = readCSVFile('userLogin.csv');
        const user = new UserLoginData(data[0]);
        await loginPage.Login(user);
        await use(); 
    }, { auto: true }],

    allureAutoHook: [
        async ({ page }, use, testInfo) => {
            await allure.epic('ShopVN E-Commerce');
            await allure.suite('Regression Test Suite');
            await use();
            try {
                if (testInfo.status !== testInfo.expectedStatus && !page.isClosed()) {
                    const screenshot = await page.screenshot({ fullPage: true, timeout: 3000 });
                    await testInfo.attach('Screenshot on Failure', {
                        body: screenshot,
                        contentType: 'image/png',
                    });
                }
            } catch (error) {
                console.log('Skip screenshot capture due to page closed:', error);
            }
        },
        { auto: true }
    ]
});

export { expect };