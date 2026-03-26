import * as SecureStorage from 'expo-secure-store';
import { ReactNativeAsyncStorage } from "firebase/auth";

export const useSecureStorage = (): ReactNativeAsyncStorage => {

    const getItem = async (key: string)  =>  {
        try {
            const token = await SecureStorage.getItemAsync(key)
            return token
        } catch (err) {
            console.log("Secure Storage could not get this key: ", key)
        }
        return null
    }

    const setItem = async (key: string, value: string) => {
        try {
            await SecureStorage.setItemAsync(key, value)
        } catch (err) {
            console.log("Secure Storage could not set this (key, value): (", key, ", ", value,")")
        }
    }

    const removeItem = async (key: string)  =>  {
        try {
            await SecureStorage.deleteItemAsync(key)
        } catch (err) {
            console.log("Secure Storage could not remove this key:", key)
        }
    }

    return {
        getItem,
        setItem,
        removeItem,
    };
}