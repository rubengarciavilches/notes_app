import React, {useEffect, useState} from "react";
import {Session, Token, User} from "../types";
import Cookies from "js-cookie";
import {getUser, register, authUser, registerGuest} from "../dbcalls";
import {getRandomString} from "../helper";
import {useSession} from "../SessionContext";

function BasicAuth() {
    enum CredentialsState {
        Closed,
        LoggingIn,
        SigningUp,
        RecoveringPassword,
        LoggedIn,
    }

    //user_id, token, expires_at
    const {session, setSession} = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [credentialsState, setCredentialsState]
        = useState<CredentialsState>(CredentialsState.Closed);
    const [credsErrorMsg, setCredsErrorMsg] = useState<string>("");

    useEffect(() => {
        const user_id = Cookies.get("user_id");
        const token = Cookies.get("token");
        const expires_at = Cookies.get("expires_at");

        if (!user_id || !token || !expires_at) {
            resetCredentials();
        } else {
            getUser(user_id)
                .then((user) => {
                    if (!user) {
                        return;
                    }
                    const curSession: Session = {
                        user: user,
                        token: token,
                        expires_at: expires_at
                    }
                    setSession(curSession);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    resetCredentials();
                });
        }
    }, []);

    function resetCredentials() {
        setSession(null);
        resetCookies();
        setCredentialsState(CredentialsState.LoggingIn);
        setEmail("");
        setPassword("");
        setUsername("");
    }

    function resetCookies() {
        Cookies.remove("user_id");
        Cookies.remove("token");
        Cookies.remove("expires_at");
    }

    function signUpNewUser(email: string, password: string, username: string) {
        if (!verifyCredentials()) return;
        register(email, password, username).then((user_id) => {
            if (user_id) {
                console.log("Registered new user: " + user_id);
                loginUser(email, password);
            }
        });
    }

    function updateCredentials(session: Session) {
        setSession(session);
        saveCookies(session);
        setCredentialsState(CredentialsState.LoggedIn);
    }

    function loginUser(email: string, password: string) {
        if (!verifyCredentials(false)) return;
        authUser(email, password).then((token: Token | null) => {
            if (!token) return; //TODO error message
            Cookies.set("token", token.id);
            getUser(token.user_id).then((user) => {
                if (!user) return;
                const newSession: Session = {
                    user: user,
                    token: token.id,
                    expires_at: token.expires_at
                }
                updateCredentials(newSession);
            })
        })
    }

    function logout() {
        resetCredentials();
    }

    function loginAsGuest() {
        // const email = `${getRandomString(16)}@noteitguest-${getRandomString(8)}.com`;
        // const password = "password";
        // signUpNewUser(email, password, "NoteItGuest-" + getRandomString(4));
        registerGuest().then((token: Token | null) => {
            if (!token) return;
            Cookies.set("token", token.id);
            getUser(token.user_id).then((user) => {
                if (!user) return;
                console.log("Registered new guest user: " + user.username);
                const curSession: Session = {
                    user: user,
                    token: token.id,
                    expires_at: token.expires_at
                }
                updateCredentials(curSession);
            })
        });
    }

    function saveCookies(sessionToSave: Session) {
        if (!sessionToSave) return;

        const expireDate = new Date(sessionToSave.expires_at).getTime();
        const nowDate = new Date().getTime();
        const timeDiffDays = Math.floor((expireDate - nowDate) / (24 * 60 * 60 * 1000));
        Cookies.set("user_id", sessionToSave.user.id, {expires: timeDiffDays});
        Cookies.set("token", sessionToSave.token, {expires: timeDiffDays});
        Cookies.set("expires_at", sessionToSave.expires_at, {expires: timeDiffDays});
    }

    function openCredentialsScreen() {
        setCredentialsState(CredentialsState.LoggingIn);
    }

    function verifyCredentials(checkUsername = true): boolean {
        const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email))
            setCredsErrorMsg("Invalid email address.");
        else if (email.length > 255)
            setCredsErrorMsg("The email address must be less than 256 characters long.");
        else if (password.length < 6)
            setCredsErrorMsg("The password must be at least 6 characters long.");
        else if (password.length > 255)
            setCredsErrorMsg("The password must be less than 256 characters long.");
        else if (checkUsername && username.length < 3)
            setCredsErrorMsg("The username must be at least 3 characters long.");
        else if (checkUsername && username.length > 255)
            setCredsErrorMsg("The username must be less than 256 characters long.");
        else {
            setCredsErrorMsg("");
            return true;
        }
        return false;
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const curEmail = event.target.value;
        setEmail(curEmail);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const curPassword = event.target.value;
        setPassword(curPassword);
    }

    function handleUsernameChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const curUsername = event.target.value;
        setUsername(curUsername);
    }

    if (!session) {
        return (
            <>
                {(credentialsState === CredentialsState.LoggingIn) && (
                    <div className={"right"}>
                        <button className={"button highlight-shadow"} onClick={openCredentialsScreen}>Log In
                        </button>
                    </div>
                )}
                {(credentialsState === CredentialsState.SigningUp
                    || credentialsState === CredentialsState.LoggingIn) && (
                    <>
                        <div className={"grayed-out-background"}></div>
                        <div className={"floating-window log-in-window thin-border padding-48"}>
                            <div>
                                {credentialsState === CredentialsState.SigningUp && (
                                    <div>
                                        <h3>Sign up</h3>
                                        <p>Username</p>
                                        <textarea
                                            className={"better-input thin-border"}
                                            placeholder={"Write your username"}
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                    </div>
                                )}
                                {(credentialsState === CredentialsState.LoggingIn) && (
                                    <h3>Log in to continue</h3>
                                )}
                                <p>Email address</p>
                                <textarea
                                    className={"better-input"}
                                    placeholder={"Write your email address"}
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <p>Password</p>
                                <textarea
                                    className={"better-input thin-border"}
                                    placeholder={"Write your password"}
                                    value={"*".repeat(password.length)}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            {credsErrorMsg.length > 0 && (
                                <p className={"error-message"}>{credsErrorMsg}</p>
                            )}
                            {credentialsState === CredentialsState.LoggingIn && (
                                <div className={"bottom-menu"}>
                                    <div className={"center"}>
                                        <button className={"button"} onClick={() => {
                                            loginUser(email, password);
                                        }}>Login
                                        </button>
                                    </div>
                                    <p className={"center"}>Don't have an account?</p>
                                    <div className={"center"}>
                                        {/*<button className={"button"} onClick={() => {*/}
                                        {/*    setOpenLogin(false)*/}
                                        {/*}}>Cancel Login*/}
                                        {/*</button>*/}
                                        <button className={"button"} onClick={() => {
                                            setCredentialsState(CredentialsState.SigningUp);
                                        }}>Sign Up!
                                        </button>
                                        <button className={"button"} onClick={loginAsGuest}>Login as Guest
                                        </button>
                                    </div>
                                </div>
                            )}
                            {credentialsState === CredentialsState.SigningUp && (
                                <div className={"bottom-menu"}>
                                    <div className={"center"}>
                                        <button className={"button"} onClick={() => {
                                            signUpNewUser(email, password, username);
                                        }}>Sign Up!
                                        </button>
                                    </div>
                                    <p className={"center"}>Already have an account?</p>
                                    <div className={"center"}>
                                        <button className={"button"} onClick={() => {
                                            setCredentialsState(CredentialsState.LoggingIn);
                                        }}>Log In
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </>
        );
    } else {
        return (
            <div className={"right"}>
                <p>You are logged in as {session.user.username}</p>
                <button className={"button"} onClick={logout}>Log Out</button>
            </div>
        )
    }
}

export default BasicAuth;