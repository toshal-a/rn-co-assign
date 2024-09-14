import { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import ActivityIcon from '../../assets/activity.svg';

const TimerHeader = () => {
    const [timeSpent, setTimeSpent] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        startTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    });

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeSpent((prevTime) => prevTime + 1);
        }, 60000); // Update every minute
    };

    return (
        <View style={styles.timerContainer}>
            <ActivityIcon color="rgba(255, 255, 255, 0.6)" height={20} width={20} />
            <Text style={styles.timer}>{timeSpent}m</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    timerContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
    },
    timer: {
        marginLeft: 10,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
    },
})

export default TimerHeader;
