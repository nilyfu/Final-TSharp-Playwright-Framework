import { expect, test } from '../core/fixtures/page-fixture';
import { readCSVFile } from '../core/utils/csvReader';
import * as allure from 'allure-js-commons';
import { UserLoginData } from '../data-object/user-login-data';

test('S6 Verify that Fullname is updated successfully',
    { tag: ['@S6', '@Regression'] }, async ({ profilePage,authAPI,profileAPI }) => {
        // 1. Metadata for Allure
        await allure.feature('Purchase Flow');
        await allure.severity('Normal');
        await allure.description('Verify that Fullname is updated successfully');

        const userInfo = readCSVFile('userLogin.csv');
        const user = new UserLoginData(userInfo[0]);
        const newName = profilePage.getRandomFullname();
        let token: string = '';
        let defaultName: string = '';

    try {
        await allure.step('0. Get API token', async () => {
            token = await authAPI.getToken(user);
        });

        await allure.step('1. Get current profile name', async () => {
            defaultName = (await profileAPI.CallAPIGetProfileName(token)).toString();
        });

        await allure.step('2. Update fullname via API', async () => {
            await profileAPI.CallAPIUpdateProfile(newName, token);
        });

        await allure.step('3. Verify fullname is updated successfully', async () => {
            const actualName = await profileAPI.CallAPIGetProfileName(token);
            expect(actualName,`The actual name ${actualName} has updated same as ${newName}`).toContain(newName);
            
        });

    } finally {
        if (token !== '' && defaultName !== '') {
            await allure.step('4. Clear updated data - restore default value via API', async () => {
                await profileAPI.CallAPIUpdateProfile(defaultName, token);
            });
        }
    }
    });