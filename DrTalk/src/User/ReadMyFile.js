import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import RNFS, { getAllExternalFilesDirs } from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import { WebView } from 'react-native-webview';
import convert from 'xml-js'
// import  xml2js from 'react-native-xml2js'
import XMLParser from 'react-xml-parser'
// import { TouchableOpacity } from 'react-native-gesture-handler';
const ReadMyFile = () => {
    const [DATA, SETDATA] = useState([]);
    const [xml, setXml] = useState('');
    const [uri, setUri] = useState(null);

    const myFun = (obj) => {
        if (obj.length == 0)
            return;
        for (let index = 0; index < obj.length; index++) {
            if (obj[index].name === 'title') {
                console.log('title: ', obj[index].value);
            }
            if (obj[index].name === 'table') {
                console.log('table: ', obj[index].children);
            }
            myFun(obj[index].children);
        }
        //   myFun(obj.children)
    }
    const onclickBtn = async () => {
        const xml = await RNFS.readFile(uri);// On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        // console.log('contents', xml);
        const sections = xml.split('<section>')
        const text = [];
        sections.forEach(ele => {
            // console.log('ele : ',ele);
            const start =ele.indexOf('<title>');
            const end =ele.indexOf('</text>');

        //    const secData= ele.split('</section>')
        //    const title=ele.split('<text>');
        //    console.log('[0]: ',secData[0].split('<text>')[0]);
        //    const start=secData&&secData[1].indexOf('<text>');
        //    const end=secData&&secData[1].indexOf('</text>');
        if(start>0&&end>0){
           const desired=ele&&ele.slice(start,end);
         
           var res = desired.replace("title", "h1");
           console.log('res: ',res);
           text.push(res+'</text>');
        }
        // text.join('</text>');
        console.log('------------------------------------------------',text);
        //    console.log('[1]: ',secData.split('<text>')[1]);

            // sec.push(secData);
        });
        SETDATA(text);
        // const sec=sections.split('</section>');
        // console.log('sec',sec);
    }
    const get_file = async () => {

        // fetch('content://com.coloros.filemanager.fileprovider/storage/emulated/0/GBWhatsApp/Media/GBWhatsApp%20Documents/Fahad.xml')
        // .then((response) => response.text())
        // .then((textResponse) => console.log('response is ', textResponse))
        // .catch((error) => {
        //     console.log(error);
        // });
        try {
            if (!uri) {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                });
                setUri(res.uri);
            }






            // var options = {ignoreComment: true, alwaysChildren: true};
            // var result = convert.xml2js(xml, options);
            // console.log('result : ',result);
            // console.log(xml.getElementsByTagName('section'));
            // var xml = new XMLParser().parseFromString(contents);    // Assume xmlText contains the example XML

            // console.log('getele table by parser id', xml.getElementsByTagName('section'));
            // console.log('xml: ', xml);
            // var obj = xml.getElementsByTagName('section');
            // // console.log(obj[0]);
            // // // myFun(obj);
            // const ar=[];
            // // console.log('0',obj[0].getElementsByTagName('table'));

            // for (let index = 0; index < obj.length; index++) {

            //     const title = obj[index].getElementsByTagName('title');
            //     var table = obj[index].getElementsByTagName('table');
            //     var tab = table[0];
            //     var tit = title[0];
            //     console.log(index, { tit, tab });
            //     var options = { compact:true,ignoreComment: true, spaces: 0,ignoreAttributes:true,fullTagEmptyElement:true,ignoreDeclaration:true};
            //     const thead=tab&&tab.getElementsByTagName('thead');
            //     const tr=thead&&thead.getElementsByTagName('tr');
            //     var headings='';
            //     tr&&tr.children.forEach(element => {
            //         headings.push(element.value);
            //     });
            //    console.log('headings : ',headings);
            //     var object={
            //         title:tit.value,
            //         // children:tab
            //     }

            //     var result = convert.js2xml(object, options);
            //     console.log('result :',result);

            // ar.push(result);

            // }

            // console.log('contents split on section ',contents.split('<section>'));
            // let arr = [];
            // contents.split('<section>').forEach(ele => {
            //     // arr.push(ele.split('</section>'));
            //     // console.log('element :');
            //     const item = ele.split('</section>')[0];

            //     const e = '<section>' + item + '</section>';
            //     arr.push(e);
            //     console.log('element :', e);
            // })
            // arr.forEach(ele=>{
            //     if(ele.includes('<table'))
            //     {
            //        console.log('[0]  : ',ele.split('<table')[0])
            //        console.log('[1]  : ',ele.split('<table')[1])

            //     }
            // })
            //  SETDATA(ar);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
        //   try {


        //   } catch (e) {
        //     alert("" + e);
        //   }




    }
    const parserRn = () => {
        var xml = new XMLParser().parseFromString('<Books><Book><Name>Me Before You</Name><Author>Jojo Moyes</Author></Book><Book><Name>Me Before You</Name><Author>irfan</Author></Book></Books>');    // Assume xmlText contains the example XML
        // console.log('xml: ',xml);
        console.log('getele', xml.getElementsByTagName('Book'));
    }
    useEffect(() => {
        get_file();
        parserRn();
    }, []);
    return (
        <View>
            <TouchableOpacity style={{ padding: 20, margin: 20, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => onclickBtn()}>
                <Text>Click</Text>
            </TouchableOpacity>
            <FlatList
                data={DATA}
                renderItem={({ item }) => (
                    <View>
                        <WebView originWhitelist={['*']}
                            source={{ html: item }}
                            style={{ height: 100 }}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index + ''}
            />
        </View>
    );
};
export default ReadMyFile;