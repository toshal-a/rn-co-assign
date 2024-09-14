import { View, Text, StyleSheet } from 'react-native';

type UnderlineHeaderProps = {
    title: string;
};

const UnderlineHeader = ({ title }: UnderlineHeaderProps) => {
    return (
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleText}>{title}</Text>
            {/* Underline below the title to create the notch-like effect */}
            <View style={styles.underline} />
        </View>
    );
};

const styles = StyleSheet.create({
    headerTitleContainer: {
        alignItems: 'center', // Center the title and underline
    },
    headerTitleText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    underline: {
        marginTop: 4,
        height: 4,
        width: 50,
        backgroundColor: '#fff', // Black color for the underline
        borderRadius: 2, // Rounded corners for a "notch" effect
    },
});

export default UnderlineHeader;
