export interface User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    token?: string;
    loginDate?: Date;
}
