import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LoadingScreen from '../components/loading-screen';

export default function SignIn() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [hidPass, setHidPass] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleLogIn = async () => {
    if(!emailRef.current || !passwordRef.current) {
      Alert.alert('Sign In', 'Please fill all the fields!')
      return
    }

    // login process
  }
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <ThemedView style={styles.image}>
        <ThemedText>Sign In Image Here</ThemedText>
      </ThemedView>
      {/* Inputs View */}
      <ThemedView style={{gap:10}}>
        <ThemedText style={{textAlign: 'center', paddingBottom: hp(1)}} type='title'>Sign In</ThemedText>
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

        <ThemedView>
          {
            loading? (
              <ThemedView>
                <LoadingScreen size={hp(10)} loading={loading} />
              </ThemedView>
            ):(
              <ThemedView>
                <TouchableOpacity style={styles.sign_in_button} onPress={handleLogIn}>
                  <ThemedText style={styles.sign_in} type='title'>Sign In</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              )
          }
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.sign_up_block}>
        <ThemedText style={styles.grey_small_text}>Don't have an account?   </ThemedText>
        <Pressable onPress={() => router.push('/signUp')}>
          <ThemedText style={styles.sign_up}>Sign up</ThemedText>
        </Pressable>
      </ThemedView>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input_background: {
    flexDirection: 'row',
    gap: 4,
    width: wp(85),
    height: hp(5),
    backgroundColor: '#aaaaaa',
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  inputs: {
    fontSize: hp(2),
    flex: 1,
    fontWeight: 'semibold',
    color: "#404040",
  },
  grey_small_text: {
    fontSize: hp(1.8),
    textAlign: 'right',
    color: "#5f5f5f"
  },
  sign_in_button: {
    height: hp(6.5),
    backgroundColor: '#624494',
    borderRadius: 10,
    justifyContent: 'center',
  },
  sign_in: {
    height: hp(3.8),
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: wp(1),
    textAlign: 'center',
    overflow: 'visible',
  },
  sign_up_block: {
    flexDirection: 'row',
  },
  sign_up: {
    fontSize: hp(1.8),
    fontWeight: 'semibold',
    color: '#624494',
  },
  password_eye: {
    justifyContent: 'center',
    marginRight: hp(0.85),
  },
  image: {
    gap: 12,
    paddingTop: '8%',
    paddingHorizontal: '5%'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
