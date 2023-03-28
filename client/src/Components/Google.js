import React, { useEffect, useState } from "react";
import axios from "axios"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom"

function Google() {

    let navigate = useNavigate();
    const [Ouser, SetUser] = useState(null)
    const [Key, SetKey] = useState(null)
    if (Ouser) {
        takeUserIn(Ouser)
    }
    async function takeUserIn(Ouser) {
        try {          
            const {email,name,picture}=Ouser
            console.log({ email, name, picture });
            const { data } = await axios.post("/api/user/OauthRegister", { email: email, name : name, picture: picture})
            console.log(data);
            localStorage.setItem("user-info", data.token);
            navigate("/chats", { replace: true })
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getGoogleID();
        if (localStorage.getItem("token")) {
            navigate("/chats", { replace: true })
        }
        async function getGoogleID() {
            try {
                const { data } = await axios.get("/api/user/key")
                SetKey(data.key)
            } catch (error) {
                console.log(error);
            }
        }
        // eslint-disable-next-line
    }, [])
    
    return (
        <center>
            <GoogleOAuthProvider clientId={Key}>
                <GoogleLogin
                    onSuccess={credentialResponse => SetUser(jwt_decode(credentialResponse.credential))}
                    onError={() => console.log('Login Failed')}
                /></GoogleOAuthProvider>
        </center>

    )
}

export default Google
