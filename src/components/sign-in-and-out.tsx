import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import { Alert, Button } from "react-native";
import { ThemedView } from "./themed-view";

export function SignInAndOut() {
    const { logOut, user } = useAuth()
    const router = useRouter()
    const handleLogout = async () => {
        let response
        try {
          response = await logOut()
        } catch (err) {
          response = err
        }
    
        console.log('got results: ', response)
        if (!response.success) {
          Alert.alert('Sign Up Issue', response.msg)
        }
    }
    return(
        <ThemedView>
                {
                  user === null ? (
                    <ThemedView>
                      <Button title="Log In" onPress={() => router.replace('/signIn')} />
                    </ThemedView>
                  ) :(
                    <ThemedView>
                      <Button title="Sign Out" onPress={handleLogout} />
                    </ThemedView>
                  )
                }
        </ThemedView>
    )
}