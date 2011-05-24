//
// ToodleDo API functions
// P Matthews May 2011
//

//get reference to overlay functions
var thundertoodle = window.opener.thundertoodle;

//get prefs handle
// Get the "extensions.myext." branch
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
prefs = prefs.getBranch("extensions.thundertoodle.");
var toodleapi = {

taskToCreate:null,

//look up the user ID
toodleGetUid: function(e){
      var eml = prefs.getCharPref("toodle_eml");
      if(thundertoodle.debug) Application.console.log("email: " + eml);
      var pwd = prefs.getCharPref("toodle_pass");
      if(thundertoodle.debug) Application.console.log("pass: " + pwd);
      var hash = hex_md5(eml+"api4dcd5a209a23d");
      var req = new XMLHttpRequest();
      //token = api4dcd5a209a23d
      req.open('GET', 'http://api.toodledo.com/2/account/lookup.php?appid=Thundertoodle;sig='+hash+';email='+eml+';pass='+pwd, true);
      req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
         if(req.status == 200){             
             var ret = eval("(" + req.responseText+")");
             thundertoodle.sesh_uid =  ret.userid;
             if(thundertoodle.debug) Application.console.log("uid: " + thundertoodle.sesh_uid);
             toodleapi.toodleGetToken();
     }
          else{
             alert("Error signing on to Toodledo service!");
             return -1;
             }
     } 
    };
    req.send(null);
  },
  
  //create the session token
  toodleGetToken: function(e){
     
      var hash = hex_md5(thundertoodle.sesh_uid+"api4dcd5a209a23d");
      
      var req = new XMLHttpRequest();
      //token = api4dcd5a209a23d
      req.open('GET', 'http://api.toodledo.com/2/account/token.php?userid='+ thundertoodle.sesh_uid+';appid=Thundertoodle;sig='+hash, true);
      req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
         if(req.status == 200){
             //alert(req.responseText);
             var ret = eval("(" + req.responseText+")");  
             if(thundertoodle.debug) Application.console.log("get token returned:" + req.responseText);
             var sesh_token  = ret.token;
             if(thundertoodle.debug) Application.console.log("session token: " + sesh_token);
             thundertoodle.sesh_key = hex_md5(hex_md5(prefs.getCharPref("toodle_pass"))+"api4dcd5a209a23d"+sesh_token);
             toodleapi.toodleCreateTask();
         }
          else{
             return -1;
             }
     } 
    };
    req.send(null);
  },
  
  //create the task on the ToodleDo service
  toodleCreateTask: function(e){
      
      if(thundertoodle.debug) Application.console.log("session key: " + thundertoodle.sesh_key);
      if  (thundertoodle.sesh_key == null){
          toodleapi.toodleGetUid();         
          return;
      }
     
      var req = new XMLHttpRequest();
      //var jsontasks = '[{"title"%3A"tester"}]'; //encodeURIComponent
      //alert(toodleapi.sesh_token);
      var params = "key="+thundertoodle.sesh_key+"&tasks="+ toodleapi.taskToCreate;      
     
      req.open('POST','http://api.toodledo.com/2/tasks/add.php?',true);
      //Send the proper header information along with the request
	  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  req.setRequestHeader("Content-length", params.length);
	  req.setRequestHeader("Connection", "close");
	  
      req.onreadystatechange = function (e) {
      if (req.readyState == 4) {
         if(req.status == 200){
             alert(req.responseText);}
         else{
              alert(req.status);
             }
        } 
     };
     req.send(params);
  }

}