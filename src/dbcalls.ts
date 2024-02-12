import CustomError, {Note, Token, User} from "./types";

const apiURL = "http://localhost:8090/api/v1/";

type BaseResponse<T> = {
    content?: T;
    errorMessage?: string;
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

async function tryFetch<Content, APIResponse extends BaseResponse<Content>>(name: string, url: string, method: Method, body: {} | undefined, hasCredentials: boolean = true): Promise<Content | undefined> {
    let response: Response;
    try {
        const requestOptions: RequestInit = {
            method: method,
            headers: {},
        }
        if (body) {
            requestOptions.headers = {
                'Content-Type': 'application/json',
            }
            requestOptions.body = JSON.stringify(body);
        }
        if (hasCredentials)
            requestOptions.credentials = "include";
        response = await fetch(`${apiURL}${url}`, requestOptions);
    } catch (error) {
        throw new CustomError(`Error during ${name}, couldn't reach API, please try again later.`, 503);
    }

    const authResponse: APIResponse = await response.json();

    if (!response.ok) { //(UserNotFoundException e) = 404, (IncorrectCredentialsException e) = 401
        if (authResponse && authResponse.errorMessage) {
            throw new CustomError(authResponse.errorMessage, response.status);
        } else {
            console.error(`Unexpected HTTP error during auth! Response: ${response}`);
            throw new CustomError(`Unexpected HTTP error during auth! Response: ${response}`);
        }
    }
    return authResponse.content; //token, user_id, expires_at
}

export async function checkAPI(): Promise<string | undefined> {
    return tryFetch("checkAPI", "", "GET", undefined, false);
}

export async function getUser(userId: string): Promise<User | undefined> {
    return tryFetch("getUser", `user/${userId}`, "GET", undefined);
}

export async function register(email: string, password: string, username: string): Promise<string | undefined> {
    return tryFetch("signUp", `user/signup`, "POST", {email, password, username}, false);
}

export async function registerGuest(): Promise<Token | undefined> {
    return tryFetch("signUpGuest", "user/signup/guest", "POST", undefined, false);
}

export async function authUser(email: string, password: string): Promise<Token | undefined> {
    return tryFetch("auth", "auth", "POST", {email, password}, false);
}

export async function getAllNotes(userId: string): Promise<Note[] | undefined> {
    return tryFetch("getAllNotes", `note/${userId}`, "GET", undefined);
}

export async function addNewNote(userId: string, title: string, content: string): Promise<Note | undefined> {
    return tryFetch("addNote", `note/${userId}`, "POST", {title, content});
}

export async function updateNote(userId: string, noteId: string, title: string, content: string): Promise<Note | undefined> {
    return tryFetch("updateNote", `note/${userId}/${noteId}`, "PUT", {title, content});
}

export async function deleteNote(userId: string, noteId: string): Promise<boolean | undefined> {
    return tryFetch("deleteNote", `note/${userId}/${noteId}`, "DELETE", undefined);
}