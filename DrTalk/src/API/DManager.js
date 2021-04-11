import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');

export const insert = (tableName,columns,data,questions) => {
    console.log('helo');
    db.transaction(function (tx) {
        console.log('helo andar');
        tx.executeSql(
            'INSERT INTO '+tableName+'('+columns+') VALUES ('+questions+')',
            data,
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    alert('ok');
                } else alert('Registration Failed');
            }
        );
    });
}

export const show =async(tableName) => {
    var res=null
    await db.transaction(function (tx) {
        tx.executeSql(
            'select * from '+tableName+'',
            [],
            (tx, results) => {
                console.log('res:',results);
                 res=results;
            },
            (tx,error)=>{
                console.log('error:',error);
                res=error;
            }
        );
    });
    return res;
}
