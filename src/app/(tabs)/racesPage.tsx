import { Button } from 'react-native';

import { RaceDataDisplay, RaceListDisplay } from '@/components/race-data-display';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { thisYear } from '@/constants/dates';
import { db_firebase } from '@/constants/firestore';
import { general_style } from '@/constants/mobile/general';
import { Fonts } from '@/constants/theme';
import { useFirestoreRaces } from '@/hooks/use-firestore-races';
import { Timestamp, addDoc, collection } from 'firebase/firestore';

export default function RaceDataPage() {
  const { races, nextUpcomingRace } = useFirestoreRaces()
  const nextRace = nextUpcomingRace()
  console.log(nextRace)
  const testingAddNewRace = async () => {
    let zeroOrOne = Math.floor(Math.random());
    let randomTeam = zeroOrOne == 0 ? "team1" : "team2"
    console.log(randomTeam)
    const res = await addDoc(collection(db_firebase, "races"), 
    {
      race_num: races.length,
      schedule_timestamp: Timestamp.now(),
      completed_time_ms: [],
      teams: ['team1'],
    })
  }
  return (
    <ThemedView style={general_style.container}>
      <ThemedView style={general_style.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {thisYear.getUTCFullYear()} Races
        </ThemedText>
      </ThemedView>
      {
        nextRace ? <RaceDataDisplay race={nextRace} /> : <ThemedText />
      }
      <Button title="Add fake race" onPress={testingAddNewRace} />
      <RaceListDisplay races={races}/>
    </ThemedView>
  );
}
