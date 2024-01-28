import React, {useState, useEffect, SetStateAction} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Auth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import {getRandomString} from "../helper";

const supabase = createClient(
    'https://jozdgwrnvsvwprgjfnkf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvemRnd3JudnN2d3ByZ2pmbmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwMzA1MzksImV4cCI6MjAyMTYwNjUzOX0.vlmRiOSZBiHdazle89Qd-dArLvwQ6VXANrFS-ZpKBLw'
);

function SupabaseAuth() {
    const [session, setSession] = useState<SetStateAction<any>>(null)
    const [openLogin, setOpenLogin] = useState<boolean>(false);

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        console.log(session);

        return () => subscription.unsubscribe()
    }, []);

    async function logout() {
        const {error} = await supabase.auth.signOut();
    }

    async function signUpNewUser(email: string, password: string) {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            // options: {
            //     emailRedirectTo: 'https://example.com/welcome'
            // }
        });

        console.log("logged in!", data);
    }

    function loginAsGuest() {
        const email = `${getRandomString(16)}@noteitguest-${getRandomString(8)}.com`;
        const password = "password";
        signUpNewUser(email, password).then();
        setOpenLogin(false);
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
                            <Auth
                                supabaseClient={supabase}
                                appearance={{theme: ThemeSupa}}
                                // providers={["apple", "discord", "facebook", "github", "google", "twitter"]}
                                providers={[]}
                                socialLayout={"horizontal"}
                            />
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
                <p>You are logged in as
                    {session.user.email.includes("noteitguest")
                        ? " Guest"
                        : session.user.email.substring(0, 5) + "..."}
                </p>
                <button className={"button"} onClick={logout}>Log Out</button>
            </div>
        )
    }
}

export default SupabaseAuth;