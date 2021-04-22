import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');
export const insert = (tableName, columns, data, questions) => {
    create(tableName);
    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO ' + tableName + '(' + columns + ') VALUES (' + questions + ')',
            data,
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('inserted successfully');
                } else alert('insertion Failed');
            }
        );
    });
}

export const select = async (tableName) => {
  
     db.transaction(function (tx) {
        tx.executeSql(
            'select * from ' + tableName,
            [],
            (tx, results) => {
                console.log('select * from ' + tableName, results);
               
                const temp=[];
                for (let i = 0; i < results.rows.length; ++i) {
                    console.log('row'+i,results.rows.item(i));
                    temp.push(results.rows.item(i));
                }
               
            },
            (tx, error) => {
                console.log('error:', error);
                // res = error;
            }
        );
    });
}
export const create = async (tableName) => {
 
    await db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
        //     (tx, results) => alert('successfully droped ' + tableName),
        //     (tx, results) => alert('failed to drop table ' + tableName)
        // );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS ' + tableName + '(Message_ID INTEGER PRIMARY KEY AUTOINCREMENT, From_ID VARCHAR(20), To_ID VARCHAR(20), Message_Content Text,Message_Type Text,Is_Seen INTEGER,Is_Download INTEGER)',
            [],
            (tx, results) => { alert('successfully created ' + tableName)},
            (tx, results) => { alert('failed to create table ' + tableName)}
        );
    });

}

export const update = async (tableName,columns,values) => {
 
    await db.transaction((tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
        //     (tx, results) => alert('successfully droped ' + tableName),
        //     (tx, results) => alert('failed to drop table ' + tableName)
        // );
        tx.executeSql(
            'UPDATE '+tableName+' SET '+columns+' where Message_ID=?',
            values,
            (tx, results) => { alert('successfully updated ' + tableName)},
            (tx, results) => { alert('failed to update ' + tableName)}
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