export interface Note {
    id: number;
    title: string;
    content: string;
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