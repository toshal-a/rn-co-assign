import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, useWindowDimensions, Platform, Dimensions, Animated } from 'react-native';

import { MCQ } from './ForYouScreen';
import Add from '../../assets/add.svg';
import Bookmark from '../../assets/bookmark.svg';
import ChevronRight from '../../assets/chevron-right.svg';
import Comment from '../../assets/comment.svg';
import Heart from '../../assets/heart.svg';
import Playlist from '../../assets/playlist.svg';
import Share from '../../assets/share.svg';
import HighlightedText from '../../components/text/HighlightedText';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ForYouItemProps = {
    item: MCQ;
};

const ForYouItem = ({ item }: ForYouItemProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [animatedValues, setAnimatedValues] = useState<{ [key: string]: Animated.Value }>({});
    const [showGif, setShowGif] = useState<boolean>(false);

    const headerHeight = useHeaderHeight();
    const tabBarHeight = useBottomTabBarHeight();
    // const { height: screenHeight, width: screenWidth } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const screenWidth = Dimensions.get('screen').width;
    const screenHeight = Dimensions.get('screen').height;
    
    const revealAnswer = async (): Promise<string | null> => {
        if (!correctAnswer) {
            try {
                const response = await axios.get(`https://cross-platform.rp.devfactory.com/reveal?id=${item.id}`);
                return response.data.correct_options[0].id;
            } catch (error) {
                console.error('Error revealing answer:', error);
            }    
        } 
        return correctAnswer;
    };

    useEffect(() => {
        revealAnswer().then((value) => {
            setCorrectAnswer(value);
        });
    }, []);

    useEffect(() => {
        const initialAnimatedValues = item.options.reduce((acc, option) => {
            acc[option.id] = new Animated.Value(0);
            return acc;
        }, {} as { [key: string]: Animated.Value });
        setAnimatedValues(initialAnimatedValues);
    }, [item.options]);

    const handleAnswerSelect = async (optionId: string) => {
        if (!selectedAnswer) {
            Animated.timing(animatedValues[optionId], {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setShowGif(true);
            });
            
            if (correctAnswer && optionId !== correctAnswer) {
                Animated.timing(animatedValues[correctAnswer], {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
            setSelectedAnswer(optionId);
        }
    };

    return (
        <View>
            <Image 
                source={{ uri: item.image }} 
                style={[
                    styles.questionImage,
                    { 
                        height: screenHeight - tabBarHeight,
                    }
                ]} />
            <View
                style={[
                    styles.mcqContainer,
                    {
                        marginTop: headerHeight + 30,
                        height: screenHeight - headerHeight - 30 - tabBarHeight,
                    },
                ]}>
                <HighlightedText
                    text={item.question}
                    textStyle={styles.question}
                    background="rgba(0, 0, 0, 0.5)"
                    textContainer={[
                        styles.questionContainer,
                        {
                            maxWidth: screenWidth * 0.8,
                            marginBottom: 20,
                            flexWrap: 'wrap'
                        },
                    ]}
                />
                <View style={styles.bottomContainer}>
                    <View style={styles.bottomInfoContainer}>
                        <View style={styles.optionContainer}>
                            {item.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    activeOpacity={1}
                                    style={[
                                        styles.option,
                                        // selectedAnswer && correctAnswer === option.id ? styles.correctOption : null,
                                        // selectedAnswer === option.id &&
                                        //     correctAnswer !== option.id ?
                                        //     styles.wrongOption : null,
                                    ]}
                                    onPress={() => handleAnswerSelect(option.id)}>
                                    <Animated.View
                                        style={[
                                            styles.animatedBackground,
                                            {
                                                width: animatedValues[option.id]?.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%'],
                                                }),
                                                backgroundColor: selectedAnswer && correctAnswer === option.id
                                                    ? 'rgba(45,134,104, 255)'
                                                    : 'rgba(183,90,81,255)',
                                            },
                                        ]}
                                    />
                                    <View style={styles.optionContext}>
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionText}>{option.answer}</Text>
                                        </View>
                                        { 
                                            showGif && selectedAnswer && selectedAnswer === option.id ?
                                            (
                                                <Image
                                                    source={
                                                        correctAnswer === option.id
                                                            ? require('../../assets/correct.gif')
                                                            : require('../../assets/wrong.gif')
                                                    }
                                                    style={[
                                                        styles.resultGif,
                                                        correctAnswer === option.id
                                                            ? styles.correctGif
                                                            : styles.wrongGif
                                                    ]}
                                                />
                                            ) :
                                            <View style={styles.resultGif} />
                                        } 
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <View style={styles.infoContainer}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{item.user.name}</Text>
                                </View>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                        <View style={styles.actionContainer}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                                <View style={styles.addContainer}>
                                    <Add width={20} height={20} color="white" />
                                </View>
                            </View>
                            <View style={styles.actions}>
                                <Heart color="white" width={35} height={35}/>
                                <Text style={styles.actionText}>{200}</Text>
                            </View>
                            <View style={styles.actions}>
                                <Comment color="white" width={35} height={35}/>
                                <Text style={styles.actionText}>{60}</Text>
                            </View>
                            <View style={styles.actions}>
                                <Bookmark color="white" width={35} height={35}/>
                                <Text style={styles.actionText}>{80}</Text>
                            </View>
                            <View style={styles.actions}>
                                <Share color="white" width={35} height={35}/>
                                <Text style={styles.actionText}>{10}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.playlistContainer}>
                        <Playlist color="rgba(255, 255, 255, 1)" width={20} height={20} />
                        <View style={styles.playlistTextContainer}>
                            <Text style={styles.playlist}>{'Playlist: ' + item.playlist}</Text>
                            <ChevronRight color="rgba(255, 255, 255, 1)" width={20} height={20} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mcqContainer: {
        flex: 1,
    },
    questionImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        resizeMode: 'cover',
        //height: '100%',
        opacity: 0.5,
    },
    bottomInfoContainer: {
        paddingStart: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    question: {
        color: 'white',
        fontSize: 24,
        marginBottom: 5,
        fontWeight: 'bold',
        lineHeight: 34,
    },
    questionContainer: {
        marginLeft: 20,
    },
    option: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginVertical: 10,
        borderRadius: 10,
    },
    optionContext: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionTextContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingLeft: 10,
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
        fontSize: 16,
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        flex: 1, // Add this to allow the text to wrap if needed
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
        width: 50,
        height: 50,
        position: 'absolute',
    },
    addContainer: {
        position: 'absolute',
        bottom: -10,
        borderRadius: 10,
        left: 15,
        backgroundColor: '#28b18f',
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
    },
    actionContainer: {
        padding: 10,
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
        fontWeight: '600',
        fontSize: 14,
    },
    playlistContainer: {
        backgroundColor: '#161616',
        paddingVertical: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
    },
    playlistTextContainer: {
        marginLeft: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionContainer: {
        flex: 1,
    },
    actions: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
    },
    animatedBackground: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        borderRadius: 10,
    },
    resultGif: {
        width: 40,
        height: 40,
        //marginLeft: 10,
        marginRight: 10,
        overflow: 'hidden',
    },
    correctGif: {
        transform: [{ scaleX: -1 }],
    },
    wrongGif: {
        transform: [{ rotate: '-180deg' }],
    },
});

export default ForYouItem;
