import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import SearchHeader from './headers/SearchHeader';
import TimerHeader from './headers/TimerHeader';
import UnderlineHeader from './headers/UnderlineHeader';

interface Option {
    id: string;
    answer: string;
}

interface MCQ {
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

    const [selectedAnswer, setSelectedAnswer] = useState<{ [key: string]: string | null }>({});
    const [correctAnswer, setCorrectAnswer] = useState<{ [key: string]: string | null }>({});

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true, // Make header transparent
            //headerTitle: 'For You', // Empty title
            headerStyle: styles.header,
            headerBackground: () => <View style={styles.transparentHeader} />, // Custom transparent header background
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

    const revealAnswer = async (id: string) => {
        try {
            const response = await axios.get(`https://cross-platform.rp.devfactory.com/reveal?id=${id}`);
            setCorrectAnswer((prev) => ({ ...prev, [id]: response.data.correct_options[0] }));
        } catch (error) {
            console.error('Error revealing answer:', error);
        }
    };

    const handleAnswerSelect = (id: string, optionId: string) => {
        setSelectedAnswer((prev) => ({ ...prev, [id]: optionId }));
        revealAnswer(id);
    };

    const renderMCQ = ({ item }: { item: MCQ }) => (
        <View style={styles.mcqContainer}>
            <Image source={{ uri: item.image }} style={styles.questionImage} />
            <View style={styles.questionContainer}>
                <Text style={styles.question}>{item.question}</Text>
                {item.options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.option,
                            selectedAnswer[item.id] === option.id && styles.selectedOption,
                            correctAnswer[item.id] === option.id && styles.correctOption,
                            selectedAnswer[item.id] === option.id &&
                                correctAnswer[item.id] !== option.id &&
                                styles.wrongOption,
                        ]}
                        onPress={() => handleAnswerSelect(item.id.toString(), option.id)}>
                        <Text style={styles.optionText}>{option.answer}</Text>
                    </TouchableOpacity>
                ))}
                <View style={styles.infoContainer}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                        <Text style={styles.userName}>{item.user.name}</Text>
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.playlist}>{item.playlist}</Text>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <Ionicons name="heart-outline" size={24} color="white" />
                <Ionicons name="chatbubble-outline" size={24} color="white" />
                <Ionicons name="bookmark-outline" size={24} color="white" />
                <Ionicons name="share-outline" size={24} color="white" />
            </View>
        </View>
    );

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
                snapToInterval={Dimensions.get('window').height}
                snapToAlignment="start"
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    header: {
        //padding: 10,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    mcqContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        height: Dimensions.get('window').height,
    },
    questionImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    questionContainer: {
        padding: 20,
        paddingBottom: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    question: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    option: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    selectedOption: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    correctOption: {
        backgroundColor: 'rgba(0, 255, 0, 0.4)',
    },
    wrongOption: {
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
    },
    optionText: {
        color: 'white',
    },
    infoContainer: {
        marginTop: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    userName: {
        color: 'white',
        fontWeight: 'bold',
    },
    description: {
        color: 'white',
        marginBottom: 5,
    },
    playlist: {
        color: 'white',
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    transparentHeader: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default ForYouScreen;
