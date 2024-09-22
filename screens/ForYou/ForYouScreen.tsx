import axios from 'axios';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import ForYouItem from './ForYouItem';
import SearchHeader from '../../components/headers/SearchHeader';
import TimerHeader from '../../components/headers/TimerHeader';
import UnderlineHeader from '../../components/headers/UnderlineHeader';

interface Option {
    id: string;
    answer: string;
}

export interface MCQ {
    type: string;
    id: number;
    playlist: string;
    description: string;
    image: string;
    question: string;
    options: Option[];
    user: {
        name: string;
        avatar: string;
    };
}

const ForYouScreen: React.FC = () => {
    const navigation = useNavigation();
    const [mcqs, setMcqs] = useState<MCQ[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true, // Make header transparent
            headerStyle: styles.header,
            headerLeft: () => <TimerHeader />,
            headerRight: () => <SearchHeader />,
            headerTitleAlign: 'center',
            headerTitle: () => <UnderlineHeader title="For You" />,
        });
    }, [navigation]);

    useEffect(() => {
        fetchMCQs();
    }, []);

    const fetchNextMCQ = async (): Promise<MCQ | undefined> => {
        try {
            const response = await axios.get('https://cross-platform.rp.devfactory.com/for_you');
            return response.data;
        } catch (error) {
            console.error('Error fetching MCQs:', error);
        }
    };

    const fetchMCQs = async () => {
        try {
            const mcqs: MCQ[] = [];
            for (let i = 0; i < 3; i += 1) {
                const nextMcq = await fetchNextMCQ();
                if (nextMcq) {
                    mcqs.push(nextMcq);
                }
            }
            setMcqs(mcqs);
        } catch (error) {
            console.error('Error fetching MCQs:', error);
        }
    };

    const appendNewMCQ = async () => {
        try {
            console.log('Appending new question as end is reached');
            const nextMcq = await fetchNextMCQ();
            if (nextMcq) {
                setMcqs((prevMcqs) => [...prevMcqs, nextMcq]);
            }
        } catch (error) {
            console.error('Error fetching next MCQ:', error);
        }
    };

    const renderMCQ = ({ item }: { item: MCQ }) => {
        return (
            <ForYouItem
                item={item}
            />
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar
                style="light" // Adjust status bar content based on theme
                translucent
                backgroundColor="transparent"
            />
            <FlatList
                data={mcqs}
                renderItem={renderMCQ}
                keyExtractor={(item, index) => `${item.id.toString()}_${index}`}
                onEndReached={appendNewMCQ}
                onEndReachedThreshold={1}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        backgroundColor: 'transparent',
    },
});

export default ForYouScreen;
