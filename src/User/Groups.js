import React from 'react';
import { View, Text, FlatList } from 'react-native';
import CustomGroupItem from '../CustomScreens/CustomGroupItem';
import { useStateValue } from '../Store/StateProvider';
const Groups = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { allFriends, token, user, socket, messages, groups } = state;
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={groups}
                renderItem={({ item }) => (
                    <CustomGroupItem item={item} navigation={navigation} />
                )}
                keyExtractor={(item, index) => index + ''}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, }} />
                )}
            />

        </View>
    );
};
export default Groups;