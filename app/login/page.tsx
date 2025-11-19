'use client'
import { useState } from "react"

export default function Login() {
    const [password, setPassword] = useState('')
    const handleLogin = () => {
        console.log(password);
        
        if (password !== "umesh@1234") {
            alert("wrong password")
            return
        }

        localStorage.setItem("authstat", "true")
        window.location.href = "/"
    }


    return (
        <div>
            <input type="text"  placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}