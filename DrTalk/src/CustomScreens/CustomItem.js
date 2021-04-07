import React from 'react';
import { View, Text,TouchableOpacity,Image} from 'react-native';


const image = require('../assets/images/logo.jpg');

const CustomItem = ({item,navigation,screen}) => {
    return (
        <TouchableOpacity onPress={() =>screen?navigation.navigate(screen, item):{}} style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
            {item.image ? <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={{ uri: `data:image/jpeg;base64,${item.image}` }} />
                : <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
            }
            <View>
                <Text style={{ left: 20 }}>{item.name}</Text>
                {item&&item.role&&<Text style={{ left: 20 }}>{item.role}</Text>}
            </View>

        </TouchableOpacity>
    );
};
export default CustomItem;