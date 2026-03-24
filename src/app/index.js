import { ThemedView } from '@/src/components/themed-view';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function LoadingScreen() {
    return (
        <ThemedView style={styles.container}>
            <ActivityIndicator size={wp(85)} color="gray" />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});