import { test } from '../core/fixtures/page-fixture';
import { readCSVFile } from '../core/utils/csvReader';
import { ProductData } from '../data-object/product-data';
import * as allure from 'allure-js-commons';


test('S2 Verify user adds product to cart successfully', { tag: ['@S2', '@Regression'] }, async ({ homePage, cartPage }) => {
    // 1. Metadata for Allure
    await allure.feature('Purchase Flow');
    await allure.severity('Normal');
    await allure.description('Verify user adds product to cart successfully');

    const data = readCSVFile('product.csv');
    const product = new ProductData(data[0]);

    // 2. Test Steps
    await allure.step('1. Delete product', async () => {
        await cartPage.DeleteProductBeforeAdd(product.productName);
    });

    await allure.step('2. Add product from Home page', async () => {
        await homePage.NavigateToHomePage();
        await homePage.waitForListProduct();
        await homePage.AddProductToCart(product.productName);
    });

    await allure.step('3. Verify product is added successfully', async () => {
        await cartPage.NavigateToCartPage();
        await cartPage.VerifyTheProductAddToCartSuccessfully(product);
    });
});