import React from 'react';
import { useState ,useEffect} from 'react';
import { ActivityIndicator, Text, View,FlatList} from 'react-native';

const Status = () => {

    const [loading,setLoading]=useState(false);
    const [data,setData]=useState();
    
    useEffect(async() => {
        // fetch('http://192.168.1.115/Std_Api/api/student/getstudentdata')
        //   .then((response) => response.json())
        //   .then((json) =>{setData(json);console.log('ujhgj',data);})
        //   .catch((error) => console.error(error))
        //   .finally(() => setLoading(false));
      }, []);

    return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
       {loading?<ActivityIndicator size='large' color={'red'} />:(
       <FlatList
        data={data}
        renderItem={(renderItem)=>(
           <View style={{flexDirection:'row',justifyContent:'space-around'}}>
               <Text>{renderItem.name}jwejrj</Text>
               <Text>{renderItem.Email}</Text>
           </View>
        )}
        keyExtractor={(item) => item.Email}
       
      />)}
    </View>
    );
};

export default Status;
