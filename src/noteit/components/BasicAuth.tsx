import React, {useEffect, useState} from "react";
import CustomError, {Session, Token, User} from "../../types";
import {getUser, register, authUser, registerGuest, checkAPI} from "../../dbcalls";
import {useSession} from "../../SessionContext";
import {t} from "i18next";

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
        const user_id = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");
        const expires_at = localStorage.getItem("expires_at");

        if (!user_id || !token || !expires_at) {
            resetCredentials();
        } else {
            getUser(user_id, token)
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

        const intervalId = setInterval(() => {
            //Checks if the API is up and working.
            checkAPI().then((message) => {
                console.log(message)
                setCredsErrorMsg("");
                clearInterval(intervalId);
            }).catch((error: CustomError) => {
                console.error("Promise rejected with error:", error);
                setCredsErrorMsg(error.message);
            });
        }, 1000)
    }, []);

    function resetCredentials() {
        setSession(null);
        resetAuth();
        setCredentialsState(CredentialsState.LoggingIn);
        setEmail("");
        setPassword("");
        setUsername("");
    }

    function resetAuth() {
        localStorage.setItem("user_id", "");
        localStorage.setItem("token", "");
        localStorage.setItem("expires_at", "");
    }

    function signUpNewUser(email: string, password: string, username: string) {
        if (!verifyCredentials()) return;
        register(email, password, username).then((user_id) => {
            if (user_id) {
                console.log("Registered new user: " + user_id);
                loginUser(email, password);
            }
        }).catch((error: CustomError) => {
            console.error("Promise rejected with error:", error);
            setCredsErrorMsg(error.message);
        });
    }

    function updateCredentials(session: Session) {
        setSession(session);
        saveAuth(session);
        setCredentialsState(CredentialsState.LoggedIn);
    }

    function loginUser(email: string, password: string) {
        if (!verifyCredentials(false)) return;
        authUser(email, password).then((token: Token | undefined) => {
            if (!token) return; //TODO error message
            localStorage.setItem("token", token.id);
            getUser(token.user_id, token.id).then((user) => {
                if (!user) return;
                const newSession: Session = {
                    user: user,
                    token: token.id,
                    expires_at: token.expires_at
                }
                updateCredentials(newSession);
            })
        }).catch((error: CustomError) => {
            console.error("Promise rejected with error:", error);
            setCredsErrorMsg(error.message);
        });
    }

    function logout() {
        resetCredentials();
    }

    function loginAsGuest() {
        // const email = `${getRandomString(16)}@noteitguest-${getRandomString(8)}.com`;
        // const password = "password";
        // signUpNewUser(email, password, "NoteItGuest-" + getRandomString(4));
        registerGuest().then((token) => {
            if (!token) return;
            localStorage.setItem("token", token.id);
            getUser(token.user_id, token.id).then((user) => {
                if (!user) return;
                console.log("Registered new guest user: " + user.username);
                const curSession: Session = {
                    user: user,
                    token: token.id,
                    expires_at: token.expires_at
                }
                updateCredentials(curSession);
            }).catch((error: CustomError) => {
                console.error("Promise rejected with error:", error);
                setCredsErrorMsg(error.message);
            });
        }).catch((error: CustomError) => {
            console.error("Promise rejected with error:", error);
            setCredsErrorMsg(error.message);
        });
    }

    function saveAuth(sessionToSave: Session) {
        if (!sessionToSave) return;

        localStorage.setItem("user_id", sessionToSave.user.id);
        localStorage.setItem("token", sessionToSave.token);
        localStorage.setItem("expires_at", sessionToSave.expires_at);
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
                        <button className={"button highlight-shadow"} onClick={openCredentialsScreen}>{t("notes_app.basic_auth.log_in")}
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
                                        <h3>{t("notes_app.basic_auth.sign_up")}</h3>
                                        <p>{t("notes_app.basic_auth.username")}</p>
                                        <textarea
                                            className={"better-input thin-border"}
                                            placeholder={t("notes_app.basic_auth.username_placeholder")}
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                    </div>
                                )}
                                {(credentialsState === CredentialsState.LoggingIn) && (
                                    <h3>{t("notes_app.basic_auth.log_in_msg")}</h3>
                                )}
                                <p>{t("notes_app.basic_auth.email")}</p>
                                <textarea
                                    className={"better-input"}
                                    placeholder={t("notes_app.basic_auth.email_placeholder")}
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <p>{t("notes_app.basic_auth.password")}</p>
                                <textarea
                                    className={"better-input thin-border"}
                                    placeholder={t("notes_app.basic_auth.password_placeholder")}
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
                                        }}>{t("notes_app.basic_auth.log_in")}
                                        </button>
                                    </div>
                                    <p className={"center"}>{t("notes_app.basic_auth.no_account_msg")}</p>
                                    <div className={"center"}>
                                        {/*<button className={"button"} onClick={() => {*/}
                                        {/*    setOpenLogin(false)*/}
                                        {/*}}>Cancel Login*/}
                                        {/*</button>*/}
                                        <button className={"button"} onClick={() => {
                                            setCredentialsState(CredentialsState.SigningUp);
                                        }}>{t("notes_app.basic_auth.sign_up")}
                                        </button>
                                        <button className={"button"} onClick={loginAsGuest}>{t("notes_app.basic_auth.log_in_guest")}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {credentialsState === CredentialsState.SigningUp && (
                                <div className={"bottom-menu"}>
                                    <div className={"center"}>
                                        <button className={"button"} onClick={() => {
                                            signUpNewUser(email, password, username);
                                        }}>{t("notes_app.basic_auth.sign_up")}
                                        </button>
                                    </div>
                                    <p className={"center"}>{t("notes_app.basic_auth.have_account_msg")}</p>
                                    <div className={"center"}>
                                        <button className={"button"} onClick={() => {
                                            setCredentialsState(CredentialsState.LoggingIn);
                                        }}>{t("notes_app.basic_auth.log_in")}
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
                <p>{t("notes_app.basic_auth.logged_in_msg")} {session.user.username}</p>
                <button className={"button"} onClick={logout}>{t("notes_app.basic_auth.log_out")}</button>
            </div>
        )
    }
}

export default BasicAuth;