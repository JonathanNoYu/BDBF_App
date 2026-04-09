import { useThemeColor } from '@/hooks/use-theme-color';
import { KeyboardAvoidingView, Platform, ScrollView, ViewProps } from "react-native";

export type ScrollableKeyBoardViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ios = Platform.OS == 'ios';
export default function ScrollableKeyBoardView({children, style, lightColor, darkColor, ...otherProps}: ScrollableKeyBoardViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    
    return (
        <KeyboardAvoidingView
            behavior={ios? 'padding': 'height'}
            style={[{ backgroundColor }, style]}
            {...otherProps}>
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}