import { NativeModules, Platform } from 'react-native'
var Aes = NativeModules.Aes

const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length);

const encryptData = (text, key) => {
    return Aes.randomKey(16).then(iv => {
        return Aes.encrypt(text, key, iv).then(cipher => ({
            cipher,
            iv,
        }))
    })
}


export const decryptData=async(encryptedData)=> {
    try {
        const key= await generateKey('khan', 'irfan', 5000, 256);
        var text = await Aes.decrypt(encryptedData.cipher, key,encryptedData.iv);
        console.log(text)
        return text
    } catch (e) {
        console.error(e)
    }
}
export const encryptMyData =async (text) => {

          try {
            const key= await generateKey('khan', 'irfan', 5000, 256);
            const encrypetedData= await encryptData(text, key);
            return encrypetedData;
            // const txt=await decryptData(encrypetedData);
            // console.log('txt:',txt);
          } catch (error) {
              console.log('error :',error);
          }
}