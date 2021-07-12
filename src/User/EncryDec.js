export const encrypt=(text)=>{
    let str='';
   for(let i=0;i<text.length;i++){
      str=text[i]+2;
   }
   return str;
}
export const decrypt=(text)=>{
    let str='';
   for(let i=0;i<text.length;i++){
      str=text[i]-2;
   }
   return str;
}