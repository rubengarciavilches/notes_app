import {Note, Token, User} from "./types";
import BasicAuth from "./components/BasicAuth";


export async function getUser(userId: string): Promise<User|null> {
    const url = `http://localhost:8090/api/v1/user/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Automatically includes cookies
        });
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function register(email: string, password: string, username: string): Promise<string|null> {
    const url = `http://localhost:8090/api/v1/user/register`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                username
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function registerGuest(): Promise<Token|null> {
    const url = `http://localhost:8090/api/v1/user/register/guest`;
    try {
        const response = await fetch(url, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function authUser(email: string, password: string):Promise<Token|null> {
    const url = `http://localhost:8090/api/v1/auth`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); //token, user_id, expires_at
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function getAllNotes(userId: string): Promise<Note[]|null> {
    const url = `http://localhost:8090/api/v1/note/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',  // Automatically includes cookies
        });
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}