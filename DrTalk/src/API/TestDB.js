import React, { useEffect } from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import { create, insert, select } from './DManager';
const TestDB=()=>{
    useEffect(async()=>{
       const res =await create('Messages')
       console.log('res: ',res);
    },[]);
    const insertData=()=>{
        insert('Messages','From_ID,To_ID,Message_Content,Message_Type,IsSeen',['11','22','Hi whats going on','text',0],'?,?,?,?,?');
    }
    const showData=async()=>{
       select('Messages').then(res=>console.log('respppppp:',res));
    //    console.log('response: ',res);
    //    for (let i = 0; i < res.rows.length; ++i){
    //    console.log(results.rows.item(i));}
    }
return(
    <View>

      <TouchableOpacity onPress={()=>insertData()} style={{backgroundColor:'blue',marginVertical:20,padding:5,alignItems:"center"}}><Text>Insert data</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>showData()} style={{backgroundColor:'blue',marginVertical:20,padding:5,alignItems:"center"}}><Text>Select data</Text></TouchableOpacity>
    </View>
 );
};
export default TestDB;