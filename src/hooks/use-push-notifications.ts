import { db_firebase } from "@/constants/firestore";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from 'expo-notifications';
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useAuth } from "./use-auth";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const usePushNotifications = (): PushNotificationState => {
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>( undefined);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const { isAuthenticated, user } = useAuth();

    //prevents duplicate navigations when a notification is tapped
    const isNavigatingRef = useRef(false);
    const router = useRouter();

    async function addPushNotificationTokenToFirestore(token: Notifications.ExpoPushToken | undefined) {
        // Add push token to database (takes a second to perform due to 2 await calls)
        if (isAuthenticated && user != null && token !== undefined) {
            // Get existing push tokens (from other devices but same user)
            let moreDocs = undefined;
            try {
                moreDocs = await getDoc(doc(db_firebase, "users", user.uid))
            } catch(err) {
                console.log('Error in getting user doc from firestore', err)
            }
            try {
                if (moreDocs != undefined && moreDocs.exists()) {
                    // Get past user data and updated push token (filters for unique tokens)
                    const pastUserData = moreDocs.data()
                    const allTokens = [...pastUserData.pushNotifToken, token].map((t) => t.data)
                    const noDupTokens = [...new Set(allTokens)].filter((t) => t !== undefined)
                    const docRes = await updateDoc(doc(db_firebase, "users", user.uid), {
                        ...pastUserData,
                        pushNotifToken: noDupTokens,
                    })
                } else {
                    await updateDoc(doc(db_firebase, "users", user.uid), {
                        pushNotifToken: [token],
                    })
                }
            } catch(err) {
                console.log('Error in Adding Push Notfi token to firestore', err)
            }
        } else {
            console.log("No user or Token found")
        }
    }

    async function registerForPushNotificationsAsync() : Promise<Notifications.ExpoPushToken | undefined> {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }
            let token;
            try {
                const projectId =
                Constants.expoConfig?.extra?.eas?.projectId ??
                Constants.easConfig?.projectId;
                if (!projectId) {
                    throw new Error('Project ID not found');
                }
                token = await Notifications.getExpoPushTokenAsync()
            } catch (e) {
                console.error('Failed to get notification tokens:', e);
            }

            if (finalStatus !== "granted") {
                return;
            }
            console.log(token)
            return token;
        }
        return undefined
    }

    const handleNotificationResponse = useCallback(
        async (response: Notifications.NotificationResponse) => {
            // Prevent multiple navigations
            if (isNavigatingRef.current) return;
            const data = response.notification.request.content.data;
            console.log('notif data:', data)
            try {
                if (data.goto) {
                    switch(data.goto) {
                        case '/explore':
                            router.push('/explore');
                            break
                        }
                };
            } catch (error) {
                console.error("Error handling notification tap:", error);
            } 
            finally {
                // Reset flag after a short delay
                setTimeout(() => {
                    isNavigatingRef.current = false;
                }, 1000);
            }
        },[router]
    );

    useEffect(() => {
        // Find better way to handle error here.
        registerForPushNotificationsAsync()
        .then((token) => {
            setExpoPushToken(token)
            addPushNotificationTokenToFirestore(token)
        })
        .catch((error: any) => console.log(error));

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            handleNotificationResponse(response)
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [handleNotificationResponse]);

    return {
        expoPushToken,
        notification,
    };
}