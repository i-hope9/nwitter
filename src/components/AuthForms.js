import React, {useState} from "react";
import {authService} from "../fbase";

const AuthForms = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const toggleAccount = () => setNewAccount(prev => !prev);   // ??

    const onChange = (event) => {
        const {target: {name, value}} = event;  // ?? 비구조화 할당
        if (name === "email") {
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (event) => { // async: promise 반환해주니까 ?
        event.preventDefault();     // default: 새로고침. 이걸 막기 위함.
        try {
            let data;
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                );
            } else {
                // login
                data = await authService.signInWithEmailAndPassword(
                    email, password
                );
            }
            console.log(data);
        }
        catch (error) {
            setError(error.message);
        }
    }
    return (
        <>
        <form onSubmit={onSubmit}>
            <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
            <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
            <input type="submit" value={newAccount ? "Create Account" : "Log In"} required/>
            {error}
        </form>
        <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account" }</span>
        </>
    )
}

export default AuthForms;
