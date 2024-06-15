/*
    interface AuthProvider {
    isAuthenticated: boolean;
    username: null | string;
    signin(username: string): Promise<void>;
    signout(): Promise<void>;
}
*/

const API_CONFIG = {
    baseUrl: 'http://localhost:3000',
}

export const AuthProvider = {
    get token() {
        return localStorage.getItem('token') || null;
    },
    get isAuthenticated() {
        console.log('this.token', this.token);
        return Boolean(this.token);
    },
    userData: {
        username: null,
    },
    async signin(loginData) {
        if (!loginData || typeof loginData !== 'object') {
            throw `Invalid login data`;
        }

        let {
            username,
            email,
            password,
        } = loginData;

        username = username || email;

        let response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
            cors: 'no-cors',
        });

        if (!response || !response?.ok) {
            throw `Error on login`;
        }

        let responseData = await response.json();

        let { token } = responseData || {};

        console.log({email, password}, responseData, token);

        if (!token) {
            throw `Fail on login`;
        }

        localStorage.setItem('token', token);

        // AuthProvider.userData.username = username;
        // AuthProvider.username = AuthProvider?.userData?.username;
    },
    async signout() {
        await new Promise(r => setTimeout(r, 500)) // fake delay
        localStorage.removeItem('token');
        // AuthProvider.userData.username = '';
        // AuthProvider.username = AuthProvider?.userData?.username;
    }
}
