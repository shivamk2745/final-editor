import { createContext,useContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider=({children})=>{

    const initalState =localStorage.getItem('uid');

    const [authUser,setAuthUser]=useState(initalState?JSON.parse(initalState):null);

    return(
        <AuthContext.Provider value={[authUser,setAuthUser]}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext)