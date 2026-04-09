import { db_firebase } from "@/constants/firestore"
import { collection, DocumentData, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"


// const dateYear = new Date(Date.now()).getFullYear()
const dateYear = new Date('2025').getFullYear()
export const thisYear = new Date(dateYear, 0, 1)

export const useFirestoreRaces = () => {
    const [races, setRaces] = useState<DocumentData[]>([])

    useEffect(() => {
        const q = query(collection(db_firebase, "races"),
            where("schedule_timestamp", ">=", thisYear),
            orderBy("schedule_timestamp", 'desc'));
        const unsub = onSnapshot(q, (querySnapshot) => {
          let allRaces = querySnapshot.docs.map((doc) => doc.data())
          setRaces([...allRaces])
          })
          return unsub
        }, [])
    return races
}