import { ActivityIndicator, DimensionValue, View } from 'react-native';

interface LoadingProps{
    size: DimensionValue | undefined;
    loading: boolean;
}

export default function LoadingScreen({size, loading} : LoadingProps) {
    return (
        <View style={{height: size, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator 
                size="large" 
                color="#624494"
                animating={loading}
                hidesWhenStopped={true}/>
        </View>
    )
}