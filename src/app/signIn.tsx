import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingScreen from '../components/loading-screen';
import ScrollableKeyBoardView from '../components/scrollableKeyBoardView';
import { styles } from '../constants/mobile/mobile_forum';
import { useAuth } from '../hooks/useAuth';

export default function SignIn() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [hidPass, setHidPass] = useState(true);
  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth()

  const handleLogIn = async () => {
    if(!emailRef.current || !passwordRef.current) {
      Alert.alert('Log In', 'Please fill all the fields!')
      return
    }

    // login process
    setLoading(true)
    let response
    try {
      response = await logIn(emailRef.current, passwordRef.current)
    } catch (err) {
      response = err
    }
    setLoading(false)
    console.log('got results: ', response)
    if (!response.success) {
      Alert.alert('Sign Up Issue', response.msg)
    }
  }
  return (
    <ScrollableKeyBoardView style={styles.container}>
      <StatusBar style="auto" />
      <ThemedView>
        <Image style={styles.image_log_in} source={require('../assets/images/login-illustration.png')}/>
      </ThemedView>
      {/* Inputs View */}
      <ThemedView style={{gap:10}}>
        <ThemedText style={{textAlign: 'center', paddingBottom: hp(1)}} type='title'>Log In</ThemedText>
        {/* signIn inputs*/}
        <ThemedView style={styles.input_background}>
            <Octicons name="mail" size={hp(2.7)} style={{margin: 'auto', marginLeft: 0}}/>
            <TextInput style={styles.inputs} 
                onChangeText={value => emailRef.current = value}
                placeholder='Email Address' placeholderTextColor={'#5f5f5f'}
                keyboardType="email-address" // Shows email-optimized keyboard
                textContentType="emailAddress" // Enables autofill on iOS
                autoCapitalize="none"
                autoCorrect={false}/>
        </ThemedView>
        <ThemedView style={styles.input_background}>
            <Octicons name="lock" size={hp(2.7)} style={{margin: 'auto', marginLeft: 0}}/>
            <TextInput style={styles.inputs} 
                onChangeText={value => passwordRef.current = value}
                placeholder='Password' placeholderTextColor={'#5f5f5f'}
                secureTextEntry={hidPass}
                textContentType="password" // Enables autofill on iOS
                autoCapitalize="none"
                autoCorrect={false}/>
              <TouchableOpacity style={styles.password_eye} onPress={() => setHidPass(!hidPass)}>
              <Ionicons
                name={hidPass ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
              </TouchableOpacity>
        </ThemedView>
        <ThemedText style={styles.grey_small_text}>Forgot Password?</ThemedText>

        <ThemedView style={{marginTop:2}}>
          {
            loading? (
              <ThemedView>
                <LoadingScreen size={hp(10)} loading={loading} />
              </ThemedView>
            ):(
              <ThemedView>
                <TouchableOpacity style={styles.submit_button} onPress={handleLogIn}>
                  <ThemedText style={styles.submit_text} type='title'>Log In</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              )
          }
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.more_options_container}>
        <ThemedText style={styles.grey_small_text}>Don't have an account?   </ThemedText>
        <Pressable onPress={() => router.push('/signUp')}>
          <ThemedText style={styles.more_option_text}>Sign up</ThemedText>
        </Pressable>
      </ThemedView>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link"> TESTING FOR NOW Go to home screen</ThemedText>
      </Link>
    </ScrollableKeyBoardView>
  );
}
