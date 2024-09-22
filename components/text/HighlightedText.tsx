import { StyleProp, TextStyle, ViewStyle, Text } from 'react-native';

const highlight = (text: string, textStyle: StyleProp<TextStyle>, background: string) => {
    const textWords = text.split(' ');

    return textWords.map((line, i) => {
        return (
            <Text
                style={[
                    textStyle,
                    {
                        backgroundColor: background,
                    },
                ]}
                key={i}>
                {(i > 0 ? ' ' : '') + line}
            </Text>
        );
    });
};

const HightlightedText = ({
    text,
    textStyle,
    background,
    textContainer,
}: {
    text: string;
    textStyle: StyleProp<TextStyle>;
    background: string;
    textContainer: StyleProp<ViewStyle>;
}) => {
    return (
        <Text 
            style={[
                textContainer,
            ]}>
                {highlight(text, textStyle, background)}
        </Text>
    );
};

export default HightlightedText;