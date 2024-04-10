export enum Apps {
    "PortfolioApp",
    "NoteItApp",
}

export interface Note {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Session {
    user: User;
    token: string;
    expires_at: string;
}

export interface User {
    id: string;
    email: string;
    encrypted_password: string;
    username: string;
    created_at: string;
    user_type: string;
}

export interface Token{
    id: string;
    user_id: string;
    expires_at: string;
}

export default class CustomError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = statusCode ? ('APIError-'+statusCode) : 'APIError';
        this.statusCode = statusCode;
    }
}