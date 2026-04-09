import { ScrollView, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { db_firebase } from '@/constants/firestore';
import { Fonts } from '@/constants/theme';
import { DocumentData, Timestamp, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function RaceDataPage() {
  const [races, setRaces] = useState<DocumentData[]>([])
  // const dateYear = new Date(Date.now()).getFullYear()
  const dateYear = new Date('2025').getFullYear()
  const thisYear = new Date(dateYear, 0, 1)
  useEffect(() => {
    const q = query(collection(db_firebase, "races"),
      where("schedule_timestamp", ">=", thisYear));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let allRaces = querySnapshot.docs.map((doc) => doc.data())
      setRaces([...allRaces])
      })
      return unsub
    }, [])
  console.log(races)
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {thisYear.getUTCFullYear()} Races
        </ThemedText>
      </ThemedView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: 10}}>
        {
          races.map((race, index) => {
            const schedule_timestamp = new Timestamp(race?.schedule_timestamp.seconds, race?.schedule_timestamp.nanoseconds).toDate().toString()
            return(
              <ThemedView key={index}>
                <ThemedText>Race Number:{race?.race_num}</ThemedText>
                <ThemedText>Completed_time_ms:{race?.completed_time_ms }</ThemedText>
                <ThemedText>Teams:{race?.teams }</ThemedText>
                <ThemedText>schedule_timestamp:{schedule_timestamp}</ThemedText>
              </ThemedView>
            )
          })
        }
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
