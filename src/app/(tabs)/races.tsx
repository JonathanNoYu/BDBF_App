import { Button, ScrollView, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { db_firebase } from '@/constants/firestore';
import { Fonts } from '@/constants/theme';
import { thisYear, useFirestoreRaces } from '@/hooks/use-firestore-races';
import { msToTime } from '@/scripts/time-utility';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function RaceDataPage() {
  const races = useFirestoreRaces()
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
          style={race_styles.headerImage}
        />
      }>
      <ThemedView style={race_styles.titleContainer}>
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
            let schedule_timestamp = new Timestamp(race?.schedule_timestamp.seconds, race?.schedule_timestamp.nanoseconds).toDate().toLocaleString(undefined, {
              year: '2-digit',
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
            let raceNum: string = race?.race_num
            let timeArray: number[] = race?.completed_time_ms
            let teamArray: string[] = race?.teams
            let raceColor = (timeArray && timeArray.length == 0) ? "#9e9156" : "#49b42e"
            return(
              <ThemedView key={index} style={{...race_styles.raceDataContianer}}>
                <ThemedView style={{...race_styles.raceAndSchedule, backgroundColor: raceColor}}>
                  <ThemedText>Race {raceNum}</ThemedText>
                  <ThemedText>{schedule_timestamp}</ThemedText>
                </ThemedView>
                {
                  teamArray.map((team, ind: number) => {
                    let completedTimeOrDNF;
                    if (timeArray.length > 0) { // Check if Race has started yet
                      completedTimeOrDNF = timeArray[ind] ? msToTime(timeArray[ind]) : 'DNF'
                    } else {
                      completedTimeOrDNF = "TBD" // Yet to Race
                    }
                    return(
                      <ThemedView key={raceNum + ' ' + index + ' ' + ind} style={race_styles.timesAndTeam}>
                        <ThemedText>{team}</ThemedText>
                        <ThemedText>{completedTimeOrDNF}</ThemedText>
                      </ThemedView>
                    )
                  })
                }
              </ThemedView>
            )
          })
        }
      </ScrollView>
    </ParallaxScrollView>
  );
}

const race_styles = StyleSheet.create({
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
  raceDataContianer: {
    borderRadius: 10,
    padding: hp(1),
    backgroundColor: '#808080'
  },
  raceAndSchedule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: wp(1),
    paddingRight: wp(1),
    borderRadius: 2,
  },
  timesAndTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#808080'
  }
});
