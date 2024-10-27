
export interface UserPayload {
    sub: number;
    name: string;
    email: string;
}

export class LoginResponse {
    access_token: string;
}