import { Button, ScrollView, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { db_firebase } from '@/constants/firestore';
import { Fonts } from '@/constants/theme';
import { DocumentData, Timestamp, addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function RaceDataPage() {
  const [races, setRaces] = useState<DocumentData[]>([])
  const dateYear = new Date(Date.now()).getFullYear()
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

  const testingAddNewRace = async () => {
    let zeroOrOne = Math.floor(Math.random());
    let randomTeam = zeroOrOne == 0 ? "team1" : "team2"
    console.log(randomTeam)
    const res = await addDoc(collection(db_firebase, "races"), 
    {
      race_num: races?.length,
      schedule_timestamp: Timestamp.now(),
      completed_time_ms: [],
      teams: [randomTeam],
    })
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={old_styles.headerImage}
        />
      }>
      <ThemedView style={old_styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {thisYear.getUTCFullYear()} Races
        </ThemedText>
      </ThemedView>
      <Button title="Add fake race" onPress={testingAddNewRace} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{gap: 20}}>
        {
          races.map((race, index) => {
            const schedule_timestamp = new Timestamp(race?.schedule_timestamp.seconds, race?.schedule_timestamp.nanoseconds).toDate().toLocaleString()
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

const old_styles = StyleSheet.create({
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
