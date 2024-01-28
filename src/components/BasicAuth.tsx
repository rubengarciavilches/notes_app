import React, {useEffect, useState} from "react";
import {Session, Token, User} from "../types";
import Cookies from "js-cookie";
import {getUser, register, authUser, registerGuest} from "../dbcalls";
import {getRandomString} from "../helper";

function BasicAuth() {
    //user_id, token, expires_at
    const [session, setSession] = useState<Session | null>(null);
    const [openLogin, setOpenLogin] = useState<boolean>(false);

    useEffect(() => {
        const user_id = Cookies.get("user_id");
        const token = Cookies.get("token");
        const expires_at = Cookies.get("expires_at");

        if (!user_id || !token || !expires_at) {
            setSession(null);
            resetCookies();
        } else {
            getUser(user_id)
                .then((user) => {
                    if (!user){
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
                    setSession(null);
                    resetCookies();
                });
        }
    }, []);

    function resetCookies() {
        Cookies.remove("user_id");
        Cookies.remove("token");
        Cookies.remove("expires_at");
    }

    function signUpNewUser(email: string, password: string, username: string) {
        register(email, password, username).then((user_id) => {
            if (user_id) {
                console.log("Registered new user: " + user_id);
                loginUser(email, password);
            }
        });
    }

    function loginUser(email: string, password: string) {
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
                setSession(newSession);
                saveCookies(newSession);
            })
        })
    }

    function logout() {
        setSession(null);
        resetCookies();
    }

    function loginAsGuest() {
        // const email = `${getRandomString(16)}@noteitguest-${getRandomString(8)}.com`;
        // const password = "password";
        // signUpNewUser(email, password, "NoteItGuest-" + getRandomString(4));
        registerGuest().then((token:Token|null) => {
            if (!token) return;
            Cookies.set("token", token.id);
            getUser(token.user_id).then((user)=>{
                if(!user) return;
                console.log("Registered new guest user: " + user.username);
                const curSession: Session = {
                    user: user,
                    token: token.id,
                    expires_at: token.expires_at
                }
                setSession(curSession);
                saveCookies(curSession);
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

    if (!session) {
        return (
            <>
                {!openLogin && (
                    <div className={"right"}>
                        <button className={"button highlight-shadow"} onClick={() => {
                            setOpenLogin(true)
                        }}>Log In
                        </button>
                    </div>
                )}
                {openLogin && (
                    <>
                        <div className={"grayed-out-background"}></div>
                        <div className={"floating-window log-in-window thin-border padding-48"}>
                            <div className={"bottom-menu"}>
                                <div className={"center"}>
                                    <button className={"button"} onClick={() => {
                                        setOpenLogin(false)
                                    }}>Cancel Login
                                    </button>
                                    <button className={"button"} onClick={loginAsGuest}>Login as Guest
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </>
        )
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