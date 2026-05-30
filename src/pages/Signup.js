import { useState } from "react";   
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {signup, isLoading, error} = useSignup()
    const [inviteCode, setInviteCode] = useState('')

    const handleSubmit = async (e) =>{
        e.preventDefault()
        
        // console.log(email,password)
        await signup(name,email,password,inviteCode)
    }

    return(
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <label> Name: </label>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name " required />
            
            <label> Email: </label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>

            <label> Password: </label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>

            <label> Club Invite Code: </label>
            <input type="password" onChange={(e) => setInviteCode(e.target.value)} value={inviteCode} placeholder="Enter the secret code" required />
            
            <button disabled={isLoading} className="bt">Sign Up</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default Signup