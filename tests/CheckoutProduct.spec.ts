import { test } from '../core/fixtures/page-fixture';
import { readCSVFile } from '../core/utils/csvReader';
import { ProductData } from '../data-object/product-data';
import * as allure from 'allure-js-commons';
import { UserData } from '../data-object/user-data';

test('S5 Verify that user checkout succeeds with valid recipient information (COD).', 
    { tag: ['@S5', '@Regression'] }, async ({ homePage, cartPage, checkoutPage }) => {
    // 1. Metadata for Allure
    await allure.feature('Purchase Flow');
    await allure.severity('Normal');
    await allure.description('Verify that user checkout succeeds with valid recipient information (COD)');

    const data: ProductData[] = readCSVFile('product.csv') as ProductData[];
    const productList = data.map(row => new ProductData(row));  

    const userInfo = readCSVFile('userInfo.csv');
    const user = new UserData(userInfo[0]);

    // 2. Test Steps
    await allure.step('1. Delete all tiems in cart', async () => {
        await cartPage.DeleteAllProductInCart();
    });

    await allure.step('2. Add products from Home page', async () => {
        await homePage.NavigateToHomePage();
        await homePage.waitForListProduct();
        await homePage.AddMultipleProductsToCart(productList);
    });

    await allure.step('3. Verify products are added successfully', async () => {
        await cartPage.VerifyAllProductsInCart(data);
    });

    await allure.step('4. Checkout product and input valid user information', async () => {
        await cartPage.ClickOnCheckoutBtn();
        await checkoutPage.InputCheckoutInfo(user);
        await checkoutPage.SelectCODPaymentOption();
        await checkoutPage.ClickCheckoutBtn();
    });

    await allure.step('5. Verify the user checkout succeeds with valid recipient information (COD)', async () => {
        
        await checkoutPage.VerifyCheckoutSuccessfullywithUserInfo(user , productList);
    });
});