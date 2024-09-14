import React from 'react';
import { View, StyleSheet } from 'react-native';

import SearchIcon from '../../assets/search.svg';

const SearchHeader = () => {

    return (
        <View style={styles.container}>
            <SearchIcon width={20} height={20} color="white"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
    }
});

export default SearchHeader;