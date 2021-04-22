import React, { useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { insert, show } from '../API/DManager';
var db = openDatabase('Khan.db');
const SqlLiteTest = () => {

    useEffect(() => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT * FROM Student",
                [], (tx, results) => {
                    console.log('results.rows.length bahir',results.rows.length);
                    if (results.rows.length == 0) {
                        console.log('results.rows.length andar',results.rows.length);
                        txn.executeSql('DROP TABLE IF EXISTS Student', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Student(id INTEGER PRIMARY KEY,name VARCHAR(20))',
                            []
                        );
                    }
                }
            );

        });
    }, []);

    const insertStudent = () => {
        insert('Student','id,name',[1,'saad'],'?,?')
        // console.log('helo');
        // db.transaction(function (tx) {
        //     console.log('helo andar');
        //     tx.executeSql(
        //         'INSERT INTO Student(id,name) VALUES (?,?)',
        //         [1, 'ali'],
        //         (tx, results) => {
        //             console.log('Results', results.rowsAffected);
        //             if (results.rowsAffected > 0) {
        //                 alert('ok');
        //             } else alert('Registration Failed');
        //         }
        //     );
        // });
    }
    const showStudent =async() => {
        show('Student').then((results)=>{
            console.log('results : ',results);
            if(results){
            for (let i = 0; i < results.rows.length; ++i)
            console.log('Resultsjnm,', results.rows.item(i));
            }
        })
       
        // db.transaction(function (tx) {
        //     console.log('helo andar');
        //     tx.executeSql(
        //         'select * from Student',
        //         [],
        //         (tx, results) => {

        //             for (let i = 0; i < results.rows.length; ++i)
        //                 console.log('Results', results.rows.item(i));
        //         }
        //     );
        // });
    }
    const updateStudent = () => {

        db.transaction(function (tx) {
            console.log('helo andar');
            tx.executeSql(
                "update Student set name='alia' where id=1",
                [],
            );
        });
    }
    const deleteStudent = () => {

        db.transaction(function (tx) {
            tx.executeSql(
                "delete from Student where id=1",
                [],
            );
        });
    }
    return (
        <View>
            <TouchableOpacity onPress={() => insertStudent()} style={{ margin: 30, backgroundColor: 'green' }}>
                <Text>Insert</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showStudent()} style={{ margin: 30, backgroundColor: 'green' }}>
                <Text>Show</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateStudent()} style={{ margin: 30, backgroundColor: 'green' }}>
                <Text>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteStudent()} style={{ margin: 30, backgroundColor: 'green' }}>
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};
export default SqlLiteTest;