import React from "react";
import {useLocation, useParams} from "react-router-dom";

function DisplayValentineApp() {
    const {valentineId} = useParams();// /H8T1
    const {search} = useLocation();
    const query = new URLSearchParams(search);
    const password = query.get("password"); // /H8T1?password=fd34-#fh
    return (
        <h1>Ask Valentine! {valentineId} With Password: {password}</h1>
    );
}

export default DisplayValentineApp;