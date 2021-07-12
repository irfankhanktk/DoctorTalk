var app = require('express')();
var http = require('http').createServer(app);
const axios = require('axios').default;
const PORT = 3000;
var io = require('socket.io')(http);
// const STATIC_CHANNELS = ['global_notifications', 'global_chat'];

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
var online = 0;
var allClients = [];





//-----------------------------------API Calling Here------------------------------------------------
const baseUrl = 'http://192.168.43.47/DrPatient_API/api/';
const getUrl = (rel) => `${baseUrl}${rel}`;

const postData = async (data,relativeUrl) => {
  const url = getUrl(relativeUrl);
  console.log('url in server side : ', url);

  const config = {
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: data,
  };
  try {
    const response = await axios(config)
      .then((res) => res)
      .catch((error) => error);
    // console.log('response from api in server:::::::::',response);
    return response;
  } catch (err) {
    return { status: null };
  }
};

//----------------------------------------API CALL END-------------------------------------






io.on('connection', (socket) => {
  socket.on('auth', (token) => {
    const temp = allClients.filter((item) => {
      return item.token.Phone !== token.Phone;
    })
    // console.log('temp', temp);
    const user = {
      id: socket.id,
      token: token
    }
    temp.push(user);
    allClients = [...temp];
    let len = allClients.length;
    len--;
    console.log('new user  :', user.token.Name);
    io.emit('newUser', user);
  });



  socket.on('chat message', msgInfo => {
    console.log('msg on server : ', msgInfo)
    var isToOffline = true;
    allClients.forEach((ele) => {

      if (ele.token.Phone === msgInfo.To_ID) {
        isToOffline = false;
        socket.broadcast.to(ele.id).emit('msg', msgInfo);
      }
    })
    if (isToOffline) {
      console.log('user if offline now we are going to save ur msg in api');
      delete msgInfo.Is_Download;
      delete msgInfo.Friend_ID;



      (async function () {
        try {
          const resp = await postData(msgInfo,'Message/PostMessage');
          if (resp.status === 200) {

          }
        } catch (e) {
          console.error(e);
        }
      })();


    }

  });




  socket.on('Group message', msgInfo => {

    console.log('msg on server : ', msgInfo)

    mIDs = msgInfo.G_MemberIDs?.split(',');
    console.log(mIDs);
    let count = 0;
    allClients.forEach((ele) => {
      const f = mIDs?.find(m => m === ele.token.Phone);
      if (f) {
        count++;
        console.log('ele.token.Phone', ele.token.Phone);
        socket.broadcast.to(ele.id).emit('Group', msgInfo);
      }
    });
    if (mIDs.length !== count) {
     
      (async function () {
        try {
          const resp = await postData(msgInfo,'Group/PostGroupMessage');
          if (resp.status === 200) {
              console.log('send successfully');
          }
        } catch (e) {
          console.log('something went wrong');
          console.error(e);
        }
      })();

    }
  });

  //on creating  group
  socket.on('emitCreatedGroup', groupInfo => {
    mIDs = groupInfo?.G_MemberIDs?.split(',');
    console.log(mIDs);
    allClients?.forEach((ele) => {
      const f = mIDs?.find(m => m === ele.token.Phone);
      if (f) {
        // isToOffline = false;
        console.log('ele.token.Phone', ele.token.Phone);
        socket.broadcast.to(ele.id).emit('onGroupCreated', groupInfo);
      }
    });
  });




  socket.on('disconnect', function () {
    console.log('Disconnected one user');
    const temp = allClients.filter((item) => {
      return item.id !== socket.id;
    });
    temp?.forEach(item => { console.log(item.Name); })

    allClients = [...temp];
    // var i = allClients.indexOf(socket);
    // allClients.splice(i, 1);
  });
});



//fetching nasa api with get request 
// const https = require('https');

// https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
//   let data = '';

//   // A chunk of data has been received.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(JSON.parse(data).explanation);
//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });