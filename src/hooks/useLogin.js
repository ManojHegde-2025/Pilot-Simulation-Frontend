import { useState } from "react";
import {useAuthContext} from "./useAuthContext"

export const useLogin = () => {
  const [error,setError] = useState(null)
  const [isLoading,setIsLoading] = useState(null)
  const {dispatch} = useAuthContext()
  const login = async (email,password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('https://pilot-simulation-backend.onrender.com/api/user/login',{
    // const response = await fetch('/api/user/login',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
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

  return {login, isLoading, error}
}

export default useLogin