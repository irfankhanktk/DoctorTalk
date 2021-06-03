import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');
export const insert = (tableName, columns, data, questions) => {
    // create(tableName);
    console.log('insert fun');
    console.log('tableName:',tableName);
    console.log('columns',columns);
    console.log('data',data);
    console.log('questions :',questions);
    console.log('INSERT INTO ' + tableName + '(' + columns + ') VALUES (' + questions+')');


    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO ' + tableName + '(' + columns + ') VALUES (' + questions + ')',
            data,
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('inserted successfully in '+tableName);
                } else console.log('insertion Failed');
            },
            (tx, results) => {
                console.log('Results', results);
            }
        );
      
    //    select(tableName);
    });
}

export const select = async (tableName) => {
    
    db.transaction(function (tx) {
        tx.executeSql(
            'select * from ' + tableName,
            [],
            (tx, results) => {
                // const temp = [];
                console.log('results.rows.length::::::::::::::::::::  ',results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                    console.log('row' + i, results.rows.item(i));
                    // temp.push(results.rows.item(i));
                }

            },
            (tx, error) => {
                console.log('error:::::::::::::::::::', error);
                // res = error;
            }
        );
    });
}
export const create = async (tableName) => {

    db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
        //     (tx, results) => alert('successfully droped ' + tableName),
        //     (tx, results) => alert('failed to drop table ' + tableName)
        // );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS ' + tableName + '(Message_ID INTEGER PRIMARY KEY AUTOINCREMENT, From_ID VARCHAR(20), To_ID VARCHAR(20), Message_Content Text,Message_Type Text,Is_Seen INTEGER,Is_Download INTEGER,Created_Date Text)',
            [],
            (tx, results) => { console.log('successfully created ' + tableName) },
            (tx, results) => { console.log('failed to create table ' + tableName) }
        );
    });

}
export const create_Friend_Table = async (Phone) => {

    db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS Friend' , [],
        //     (tx, results) => console.log('successfully droped Friend'),
        //     (tx, results) => console.log('failed to drop table Friend')
        // );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Friend'+ Phone +'(Friend_ID INTEGER PRIMARY KEY, Friend_Type TEXT, Image TEXT, IsApproved INTEGER,IsBlock_ByFriend INTEGER,IsBlock_ByMe INTEGER,IsRejected INTEGER, Name TEXT, Phone TEXT, Role TEXT)',
            [],
            (tx, results) => { console.log('successfully created Friend') },
            (tx, results) => { console.log('failed to create table Friend') }
        );
    });

}
export const create_User_Table = async (Phone) => {

    db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS Friend' , [],
        //     (tx, results) => console.log('successfully droped Friend'),
        //     (tx, results) => console.log('failed to drop table Friend')
        // );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS User'+ Phone +'(User_ID INTEGER PRIMARY KEY, Image TEXT, Name TEXT, Phone TEXT, Role TEXT)',
            [],
            (tx, results) => { console.log('successfully created User') },
            (tx, results) => { console.log('failed to create table User') }
        );
    });

}
export const update = async (tableName, columns, values) => {

    db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
        //     (tx, results) => alert('successfully droped ' + tableName),
        //     (tx, results) => alert('failed to drop table ' + tableName)
        // );
        tx.executeSql(
            'UPDATE ' + tableName + ' SET ' + columns + ' where Message_ID=?',
            values,
            (tx, results) => { console.log('successfully updated ' + tableName) },
            (tx, results) => { console.log('failed to update ' + tableName) }
        );
    });

}
export const create_CCD_Table = async () => {
    // dropTable('CCD');
    db.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS CCD (CCD_ID INTEGER PRIMARY KEY AUTOINCREMENT, Friend_ID VARCHAR(20),CCD_Title,CCD_Text TEXT)',
            [],
            (tx, results) => { console.log('successfully created CCD') },
            (tx, results) => { console.log('failed to create table CCD') }
        );
    });

}
export const deleteRow=(tableName,where,values)=>{
    db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM '+tableName+' '+where,
            values,
            (tx, results) => { console.log('successfully deleted')},
            (tx, results) => { console.log('failed to delete')}
        );
    });

}
export const dropTable = async (tableName) => {

    await db.transaction((tx) => {
        tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
            (tx, results) => alert('successfully droped ' + tableName),
            (tx, results) => alert('failed to drop table ' + tableName)
        );
    });

}