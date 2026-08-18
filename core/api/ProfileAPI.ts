import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { APIURLConstants } from '../../env/apiURL';
import { URLConstants } from '../../env/url';


export class ProfileAPI {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    profile_url = URLConstants.BASE_URL + APIURLConstants.PROFILE_API_URL;

    async apiUpdateProfileName(newName: string, token: string): Promise<APIResponse> {

        return await this.request.patch(this.profile_url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            multipart: {
                name: newName
            }
        });
    }

    async GetProfileName(token: string): Promise<APIResponse> {
        var a = await this.request.get(this.profile_url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return a;
    }

    async CallAPIUpdateProfile(name: string, token: string) {
        const response = await this.apiUpdateProfileName(name, token);
        expect(response.status()).toBe(200);
    }

    async CallAPIGetProfileName(token: string): Promise<String> {
        const response = await this.GetProfileName(token);
        expect(response.status()).toBe(200);
        const body = await response.json();
        return body.name;
    }


}