import { useState } from "react";
import {useAuthContext} from "./useAuthContext"

export const useSignup = () => {
  const [error,setError] = useState(null)
  const [isLoading,setIsLoading] = useState(null)
  const {dispatch} = useAuthContext()
  const signup = async (name,email,password,inviteCode) => {
    setIsLoading(true)
    setError(null)

    // const response = await fetch('https://pilot-portal-backend.onrender.com/api/user/signup',{
    const response = await fetch('/api/user/signup',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password, inviteCode })
})

    const json = await response.json();
    if(!response.ok){
      setIsLoading(false)
      setError(json.error)
    }

    if(response.ok){
      // save the user to browser's local storage
      localStorage.setItem('user',JSON.stringify(json))

      // update global auth context
      dispatch({type: 'LOGIN', payload: json})

      setIsLoading(false)
    }
  }

  return {signup, isLoading, error}
}

export default useSignup