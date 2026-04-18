import { db_firebase } from "@/constants/firestore"
import { collection, DocumentData, limit, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuth } from "./use-auth"

/**
 * Format the data in a useStates
        User Entity Diaagram for firestore
        user_id:        Int64
        teams:          <Array<String>>
        email:          String
        full_name:      String
 * 
 * @returns races
 */
export const useFirestoreUserData = () => {
    const [userData, setUserData] = useState<DocumentData | null>(null)
    const [userTeams, setUserTeams] = useState<Object>({})
    const { user } = useAuth()

    useEffect(() => {
        const q = query(collection(db_firebase, "user"),
            where("email", "==", user.email),
            where("user_id", "==", user.user_id),
            limit(1));
        const unsubUserData = onSnapshot(q, (querySnapshot) => {
          let docData = querySnapshot.docs[0].data
          setUserData(docData)
        })
        const unsubUserTeam = onSnapshot(q, (querySnapshot) => {
          let docData = querySnapshot.docs[0].data
          setUserTeams(docData)
        })
        return () => {
            unsubUserData()
            unsubUserTeam()
        }
    }, [])
    return {
        userData,
    }
}