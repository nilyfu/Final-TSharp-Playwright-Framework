import { APIRequestContext, expect } from '@playwright/test';
import { APIURLConstants } from '../../env/apiURL';
import { UserLoginData } from '../../data-object/user-login-data';
import { URLConstants } from '../../env/url';

export class AuthAPI {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    auth_url = URLConstants.BASE_URL + APIURLConstants.AUTH_API_URL;

    async getToken(user: UserLoginData): Promise<string> {
        const response = await this.request.post(this.auth_url, {
            data: {
                username: user.username,
                password: user.password
            }
        });
        expect(response.status(), `Failed to login. Status code: ${response.status()}`).toBe(200);
        const responseBody = await response.json();
        return responseBody.token;
    }
}