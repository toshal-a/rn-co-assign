import { Tabs } from 'expo-router';

import Activity from '../../assets/activity.svg';
import Bookmark from '../../assets/bookmark.svg';
import Discover from '../../assets/discover.svg';
import Home from '../../assets/home.svg';
import Profile from '../../assets/profile.svg';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopColor: 'rgba(255, 255, 255, 0.2)',
                },
            })}>
            <Tabs.Screen
                name="index"
                options={{
                    //title: 'For You',
                    tabBarIcon: ({ color, size }) => <Home height={size} width={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, size }) => <Discover height={size} width={size} color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="activity"
                options={{
                    title: 'Activity',
                    tabBarIcon: ({ color, size }) => <Activity height={size} width={size} color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="bookmark"
                options={{
                    tabBarIcon: ({ color, size }) => <Bookmark height={size} width={size} color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => <Profile height={size} width={size} color={color} />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
