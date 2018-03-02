var cellUrl = "https://demo.personium.io/u-aizu-100/",
  engineEndPoint = "__/html/Engine/getAppAuthToken",
  appUrl = "https://demo.personium.io/app-aizu-health-store/",
  friendUrl = 'https://demo.personium.io/u-aizu-99/',
  id = "me",
  password = "wakamatsu",
  refresh_token, //getUerAuthToken
  access_token, //getAppAuthToken
  box_access_token, //getProtectedBoxAccessToken
  box_refresh_token, //getProtectedBoxAccessToken
  box100_location = "https://demo.personium.io/u-aizu-100/io_personium_demo_aizu-health-store",
  friend_access_token, //friendGetApp
  trancell_access_token, //getTranscellToken
  friend_get_protected_access_token, //friendGetProtectedBoxAccessToken
  box99_location = "	https://demo.personium.io/u-aizu-99/io_personium_demo_aizu-health-store";

var kcal = [];
var date = [];

getUerAuthToken = function(){
  return $.ajax ({
    type: "POST",
    url: cellUrl + '__token',
    processData: true,
    dataType: 'json',
    data: {
      grant_type: "password",
      username: "me",
      password: "wakamatsu"
    },
    headers: {
      'Accept':'application/json',
    }
  });
}

getAppAuthToken = function() {
  var url = appUrl + engineEndPoint;
    return $.ajax({
        type: "POST",
        url: url,
        data: {
                p_target: cellUrl
        },
        headers: {
          'Accept':'application/json',
          'x-personium-cors':'true'
      }
    });
};

getProtectedBoxAccessToken = function() {
  return $.ajax({
    type: "POST",
    url: cellUrl + '__token',
    processData: true,
    dataType: 'json',
    data: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: appUrl,
        client_secret: access_token
    },
    headers: {
      'Accept':'application/json',
      'Content-Type': 'application/json',
    }
  });
};

getBox = function(){
  return $.ajax({
  type: "GET",
  url: cellUrl + '__box',
  processData: true,
  dataType: 'json',
  headers: {
    'Authorization' : 'Bearer ' + box_access_token,
    'Accept':'application/json',
    }
  });
}

aizuGetListOfHealthRecords = function () {
  var top = 300,
  orderby = "startDate asc",
  filter = "startDate ge datetimeoffset'2018-02-06T00:00:00+09:00'";
  var url = box100_location + '/OData/HealthRecord?$top=' + top + '&$orderby=' + orderby;
  //+ '&$filter=' + filter;
  return $.ajax({
    type: "GET",
    url: url,
    processData: true,
    dataType: 'json',
    headers: {
      'Authorization' : 'Bearer ' + box_access_token,
      'Accept':'application/json',
  }
  });
}

friendGetApp = function (){
  var url = appUrl + engineEndPoint;
    return $.ajax({
        type: "POST",
        url: url,
        data: {
                p_target: friendUrl
        },
        headers: {
          'Accept':'application/json',
          'x-personium-cors':'true'
      }
    });
}

getTranscellToken = function(){
  return $.ajax ({
    type: "POST",
    url: cellUrl + '__token',
    processData: true,
    dataType: 'json',
    data: {
      grant_type: "refresh_token",
      refresh_token: box_refresh_token,
      p_target: friendUrl
    },
    headers: {
      'Accept':'application/json'
    }
  });
}

friendGetProtectedBoxAccessToken = function(){
  return $.ajax({
    type: "POST",
    url: friendUrl + '__token',
    processData: true,
    dataType: 'json',
    data: {
        grant_type: "urn:ietf:params:oauth:grant-type:saml2-bearer",
        assertion: trancell_access_token,
        client_id: appUrl,
        client_secret: friend_access_token
    },
    headers: {
      'Accept':'application/json',
      'Content-Type': 'application/json',
    }
  });
}

friendGetBox = function(){
  return $.ajax({
  type: "GET",
  url: friendUrl + '__box',
  processData: true,
  dataType: 'json',
  headers: {
    'Authorization' : 'Bearer ' + friend_get_protected_access_token,
    'Accept':'application/json',
    }
  });
}

friendGetListOfHealthRecords = function (){
  var top = 100,
  orderby = "endDate desc",
  filterBasal = "type eq 'HKQuantityTypeIdentifierBasalEnergyBurned' ";
  var filterActive = "type eq 'HKQuantityTypeIdentifierActiveEnergyBurned' ";
  var filterHealth = "type eq 'HKQuantityTypeIdentifierHeartRate' ";
  var filterDistance = "type eq 'HKQuantityTypeIdentifierDistanceWalkingRunning' ";
  var filterSteps = "type eq 'HKQuantityTypeIdentifierStepCount' ";
  var filterStepsTest = "substringof('StepCount', type)";
  var filterStartWith = " startswith(type, 'HK')	";
  var filterPartialMatch = " substringof('StepCount', type)"
  var filterTime = "StartDate ge datetimeoffset'2017-12-15T18:39:10+09:00'" //string = $params
  var string = $.param(filterTime)
//getTranscellToken
// let urlOData = Common.getBoxUrl() + 'OData/vevent';
let filterStr = $.param({
    "$top": 300,
    // "$filter": "endDate ge datetimeoffset'2018-01-01T00:00:00+09:00'",
    "$filter": "endDate ge datetimeoffset'2018-01-01T00:00:00+09:00' and type eq 'HKQuantityTypeIdentifierStepCount' ",    
    "$orderby": "endDate asc"
});
// let queryUrl = urlOData + '?' + filterStr;
//
  console.log(string)
  // var url = box99_location + '/OData/HealthRecord?$top=' + top + '&$filter=' + filterBasal;
    var url = box99_location + '/OData/HealthRecord?' + filterStr;
  // var url = box99_location + '/OData/HealthRecord?$top=' + top + '&$orderby=' + orderby;
  return $.ajax({
    type: "GET",
    url: url,
    processData: true,
    dataType: 'json',
    headers: {
      'Authorization' : 'Bearer ' + friend_get_protected_access_token,
      'Accept':'application/json',
  }
  });
}

getRecords = function(data){
  console.log("getRecords");
  //Making arrays for graph
  for (var i in data.d.results){
    console.log(data.d.results[i]);
    kcal[i] = data.d.results[i].value;
    date[i] = moment(data.d.results[i].endDate).format('MMMM Do YYYY');
    //, h:mm:ss a'
    console.log("Date:" + date[i])
    //.locale(currentLocale)
    // date[i] = convertUnixToDate(data.d.results[i].endDate);
    // console.log(kcal[i]);
    // console.log(date[i]);
  }
}

convertUnixToDate = function(u){
  //remove unnecessary numbers from fetched data
  var s = u.replace(/\D/g,'');
  // converting string to number
  var x = Number(s)
  console.log("UNIX timestamp: " + x);
  //covnerting unix timestamp to datetime
  var d = moment.unix(x).format("YYYY MMM Do");
  console.log("Date: " + d);
  return d;
}


//Chart
var myChart = document.getElementById("myChart").getContext("2d");
var testChart = new Chart(myChart,
  {
  type:'line',
  data:{
    labels:date,
    datasets:[{
      label:"kcal",
      data: kcal,
      fill:false,
      "borderColor":"rgb(33, 255, 14)",
      "lineTension":0.1
    }]
  },
  "options":{
    title:{
      display:true,
      text:"Graph Test",
      fontSize:22
    },
    legend:{
      display:true,
      position:"right",
    },
    layout:{
      padding:50
    },
    scales: {
      xAxes: [{
          ticks: {
              fontSize: 8
          }
      }],
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
}
  }
})



//Imprementation 03
$('button').click(function(){
    getUerAuthToken()
    .done(function(userAuthoDdata){
      console.log("getUerAuthToken");
      console.log(userAuthoDdata)
      refresh_token = userAuthoDdata.refresh_token;
      getAppAuthToken()
      .done(function(appAuthoData){
        console.log("getAppAuthToken");
        console.log(appAuthoData)
        access_token = appAuthoData.access_token;
        getProtectedBoxAccessToken()
          .done(function(protectedBoxData){
            console.log("getProtectedBoxAccessToken");
      console.log(protectedBoxData)
            box_access_token = protectedBoxData.access_token;
            box_refresh_token = protectedBoxData.refresh_token;
            getBox()
            console.log("getBoxData");
            aizuGetListOfHealthRecords()
            .done(function(aizuHealthRecordsData){
              console.log('aizuHealthRecords');
              console.log(aizuHealthRecordsData);
            })
            friendGetApp()
            .done(function(friendGetAppData){
              console.log("friendGetApp");
              console.log(friendGetAppData);
              friend_access_token = friendGetAppData.access_token;
              getTranscellToken()
              .done(function(getTranscellTokenData){
                console.log('getTranscellToken');
                console.log(getTranscellTokenData);
                trancell_access_token = getTranscellTokenData.access_token;
                friendGetProtectedBoxAccessToken()
                .done(function(friendGetProtectedBoxAccessTokenData){
                  console.log("friendGetProtectedBoxAccessToken");
                  console.log(friendGetProtectedBoxAccessTokenData);
                  friend_get_protected_access_token = friendGetProtectedBoxAccessTokenData.access_token;
                  friendGetBox();
                  console.log("friendGetBox");
                  friendGetListOfHealthRecords()
                  .done(function(friendGetListOfHealthRecordsData){
                    console.log("friendGetListOfHealthRecords");
                    console.log(friendGetListOfHealthRecordsData);
                    getRecords(friendGetListOfHealthRecordsData);
                  })
                })
              })
            })
        })
      });
    })
});
