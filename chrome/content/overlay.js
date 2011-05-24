var thundertoodle = {
   
  debug:true,
  sesh_uid:null,
  sesh_key:null,  
    
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("thundertoodle-strings");
  
  },

  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
                                this.strings.getString("helloMessage"));
  },

  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    thundertoodle.onMenuItemCommand(e);
  },
  
  openTaskDialog: function(e){
         //toodleapi.toodleCreateTask();
         var win = window.openDialog("chrome://thundertoodle/content/create-task.xul", "Create Task", "chrome,centerscreen"); 

  }
  
  
};

window.addEventListener("load", function () { thundertoodle.onLoad(); }, false);
