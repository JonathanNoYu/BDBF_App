import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from "react";
import { auth } from '../../firebaseConfig';
import { db_firebase } from '../constants/firestore';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log('got user', user)
            if (user) {
                setIsAuthenticated(true)
                setUser(user)
            } else {
                setIsAuthenticated(false)
                setUser(null)
            }
        })
        return unsub
    }, [])

    async function logIn(email, password) {
        try {
            // Signs in, user will get updated in the useEffect above.
            const response = await signInWithEmailAndPassword(auth, email, password)
            return {success: true}
        } catch (err) {
            console.log(err)
            let issue = err.code
            if (issue.includes('auth/invalid-credential')) issue = 'Your email or password is incorrect'
            return {success: false, msg: issue}
        }
    }

    async function logOut() {
        try {
            await signOut(auth)
            return {success: true}
        } catch (err) {
            let issue = err.code
            return {success: false, msg: issue}
        }
    }

    async function register(email, password, fullName, team) {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log('response:', response)
            const docRes = await setDoc(doc(db_firebase, "users", response?.user?.uid), {
                userId: response?.user?.uid,
                fullName: fullName,
                email: email,
                team: [team],
                pushNotifToken: [],
            })
            return {success: true, data: response?.user}
        } catch (err) {
            console.log(err)
            let issue = err.code
            if (issue.includes('auth/invalid-email')) issue = 'Invalid email address'
            if (issue.includes('auth/email-already-in-use')) issue = 'This email is already in use'
            return {success: false, msg: issue}
        }
    }

    return(
        <AuthContext.Provider value={{user, isAuthenticated, logIn, logOut, register}}>
            {children}
        </AuthContext.Provider>
    )
}