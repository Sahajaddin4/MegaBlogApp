const io = require('../../index');

exports.notifyAdmin = (channelName,message)=>{
    this.channelName = channelName;
    this.message = message;
    createNotification(channelName,message);
}

exports.notifySingleUser = (channelName,message)=>{
    createNotification(channelName,message);
}

 function createNotification(channelName,message){
     io.emit(channelName, message);    
}

