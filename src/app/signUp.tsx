import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Feather, FontAwesome5, Ionicons, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LoadingScreen from '../components/loading-screen';
import ScrollableKeyBoardView from '../components/scrollableKeyBoardView';

export default function SignIn() {
  const router = useRouter();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const teamRef = useRef("");

  const [hidPass, setHidPass] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if(!emailRef.current || !passwordRef.current || !nameRef.current || !teamRef.current) {
      Alert.alert('Sign Un', 'Please fill all the fields!')
      return
    }

    // login process
    setLoading(true)

    setLoading(false)
  }
  return (
    <ScrollableKeyBoardView style={styles.container}>
      <StatusBar style="dark" />
      <ThemedView>
        <Image style={styles.image_sign_up} source={require('../assets/images/sign-up-illustration.png')}/>
      </ThemedView>
      {/* Inputs View */}
      <ThemedView style={{gap:10}}>
        <ThemedText style={{textAlign: 'center', paddingBottom: hp(1)}} type='title'>Sign Up</ThemedText>
        {/* signIn inputs*/}
        <ThemedView style={styles.input_background}>
            <Feather name="user" size={hp(2.2)} style={{margin: 'auto', marginLeft: 0}}/>
            <TextInput style={styles.inputs} 
                onChangeText={value => nameRef.current = value}
                placeholder='Full Name' placeholderTextColor={'#5f5f5f'}
                textContentType='name'
                autoCapitalize="words"
                autoCorrect={false}/>
        </ThemedView>
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
        <ThemedView style={styles.input_background}>
            <FontAwesome5 name="dragon" size={hp(2.2)} style={{margin: 'auto', marginLeft: 0}}/>
            <TextInput style={styles.inputs} 
                onChangeText={value => teamRef.current = value}
                placeholder='Dragon Boat Team' placeholderTextColor={'#5f5f5f'}
                autoCapitalize="none"
                autoCorrect={false}/>
        </ThemedView>

        <ThemedView style={{marginTop:2}}>
          {
            loading? (
              <ThemedView>
                <LoadingScreen size={hp(10)} loading={loading} />
              </ThemedView>
            ):(
              <ThemedView>
                <TouchableOpacity style={styles.submit_button} onPress={handleSignUp}>
                  <ThemedText style={styles.sign_up} type='title'>Sign Up</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              )
          }
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.more_options_container}>
        <ThemedText style={styles.grey_small_text}>Don't have an account?   </ThemedText>
        <Pressable onPress={() => router.replace('/signIn')}>
          <ThemedText style={styles.sign_in}>Log In</ThemedText>
        </Pressable>
      </ThemedView>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link"> TESTING FOR NOW Go to home screen</ThemedText>
      </Link>
    </ScrollableKeyBoardView>
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
    color: "#5f5f5f",
  },
  submit_button: {
    height: hp(6.5),
    backgroundColor: '#624494',
    borderRadius: 10,
    justifyContent: 'center',
  },
  sign_up: {
    height: hp(3.8),
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: wp(0.6),
    textAlign: 'center',
    overflow: 'visible',
  },
  more_options_container: {
    flexDirection: 'row',
    marginTop: hp(1)
  },
  sign_in: {
    fontSize: hp(1.8),
    fontWeight: 'semibold',
    color: '#624494',
  },
  password_eye: {
    justifyContent: 'center',
    marginRight: hp(0.85),
  },
  image_sign_up: {
    alignSelf:'center',
    height:hp(31),
    width: wp(85),
    marginBottom: hp(2),
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
