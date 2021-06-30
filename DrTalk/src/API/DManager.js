import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');
export const insert = (tableName, columns, data, questions) => {
 console.log( 'INSERT INTO ' + tableName + ' (' + columns + ') VALUES (' + questions + ')');
 console.log('data: ',data);
    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO ' + tableName + ' (' + columns + ') VALUES (' + questions + ')',
            data,
            (tx, results) => {
                if (results.rowsAffected > 0) {
                console.log('inserted Successfully in '+tableName);
                }
            },
            (tx, results) => {
                console.log('insertion failed in '+tableName);
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
            'CREATE TABLE IF NOT EXISTS ' + tableName + '(Message_ID INTEGER PRIMARY KEY AUTOINCREMENT, From_ID VARCHAR(20), To_ID VARCHAR(20), Message_Content Text,Message_Type Text,Is_Seen INTEGER,Is_Download INTEGER,Created_Date Text, Created_Time Text)',
            [],
            (tx, results) => { console.log('successfully created ' + tableName) },
            (tx, results) => { console.log('failed to create table ' + tableName) }
        );
    });

}
export const create_Friend_Table = async (Phone) => {

    db.transaction((tx) => {
        tx.executeSql('DROP TABLE IF EXISTS Friend'+Phone , [],
            (tx, results) => console.log('successfully droped Friend'),
            (tx, results) => console.log('failed to drop table Friend')
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Friend'+ Phone +'(Friend_ID INTEGER PRIMARY KEY, Friend_Type TEXT, Image TEXT, IsApproved INTEGER,IsBlock_ByFriend INTEGER,IsBlock_ByMe INTEGER,IsRejected INTEGER, Name TEXT, Phone TEXT, Role TEXT,Status Text, IsArchive INTEGER)',
            [],
            (tx, results) => { console.log('successfully created Friend') },
            (tx, results) => { console.log('failed to create table Friend') }
        );
    });

}
export const create_User_Table = async (Phone) => {

    db.transaction((tx) => {
        tx.executeSql('DROP TABLE IF EXISTS User'+ Phone , [],
            (tx, results) => console.log('successfully droped Friend'),
            (tx, results) => console.log('failed to drop table Friend')
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS User'+ Phone +'(User_ID INTEGER PRIMARY KEY, Image TEXT, Name TEXT, Phone TEXT, Role TEXT)',
            [],
            (tx, results) => { console.log('successfully created User') },
            (tx, results) => { console.log('failed to create table User') }
        );
    });

}
export const update = async (tableName, columns, where,values,) => {
console.log( 'UPDATE ' + tableName + ' SET ' + columns +' '+ where,
values);
    db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
        //     (tx, results) => alert('successfully droped ' + tableName),
        //     (tx, results) => alert('failed to drop table ' + tableName)
        // );
        tx.executeSql(
            'UPDATE ' + tableName + ' SET ' + columns +' '+ where,
            values,
            (tx, results) => { console.log('successfully updated ' + tableName) },
            (tx, results) => { console.log('failed to update ' + tableName) }
        );
    });

}
export const updateStatus = async (phone, status) => {

    db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
        //     (tx, results) => alert('successfully droped ' + tableName),
        //     (tx, results) => alert('failed to drop table ' + tableName)
        // );
        tx.executeSql(
            'UPDATE Friend'+ phone +' SET Status=? where Phone=?',
            [status,phone],
            (tx, results) => { console.log('successfully updated status' + tableName)},
            (tx, results) => { console.log('failed to update status' + tableName) }
        );
    });

}
export const create_CCD_Table = async () => {
    // dropTable('CCD');
     
    db.transaction((tx) => {
        //  tx.executeSql('DROP TABLE IF EXISTS CCD', [],
        //     (tx, results) => console.log('successfully droped '),
        //     (tx, results) => alert('failed to drop table ')
        // );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS CCD (CCD_ID INTEGER PRIMARY KEY , Patient_ID VARCHAR(20),Visited_Date, CCD_Title TEXT, CCD_Table TEXT)',
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
        tx.executeSql('DELETE FROM ' + tableName, [],
            (tx, results) => alert('successfully droped ' + tableName),
            (tx, results) => alert('failed to drop table ' + tableName)
        );
    });

}
export const deleteCCDRecords = async (tableName) => {

    await db.transaction((tx) => {
        tx.executeSql('DELETE FROM CCD', [],
            (tx, results) => alert('successfully droped '),
            (tx, results) => alert('failed to drop table ')
        );
    });

}