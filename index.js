const Discord = require('discord.js');
const client = new Discord.Client();
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

 client.login('NTIxMTUwMDQ2OTE0MzQ3MDE5.Du4TTg.zkGgZNyTLsgyvygZMdjGri6A5c4');




 var startUp = setTimeout(startUpBot, 500);
 function startUpBot()
 {
    var intervalID = setInterval(checkTimes, 500);
 }
function checkTimes() {
    var i;
    for(i = 0; i < localStorage.length; i++)
    {
        var inStorage = localStorage.getItem(localStorage.key(i));
        if(inStorage != null)
        {
            var array = inStorage.split("@@%^$@%&");
            var timeStamp = array[0];
            var dateInfo = array[1];
            if(Date.now() > timeStamp)
            {
                console.log(timeStamp + ":" + Date.now())
                //Do the reminder
                //428950203144470528 General
                var channel = client.channels.get('428950203144470528');
                //console.log(channel);
                channel.send(dateInfo);
                localStorage.removeItem(localStorage.key(i));
                return;
            }
        }
    }
}

client.on('message', msg => {

    console.log(msg.author.tag + ":" + client.user.tag);
    if(msg.author.tag != client.user.tag)
    {
        if(msg.content === 'ping')
        {
            msg.reply('pong');
        }

        var incomingMessage = msg.content;
        incomingMessage = incomingMessage.toLowerCase();

        if (incomingMessage === "list reminders") {
            var respond = listReminders();
            msg.reply(respond);
        }
        else if (incomingMessage === "clear reminders secret lock haha") {
            var respond = clearReminders();
            msg.reply(respond);
        }
        else if (incomingMessage.includes("remind me:")) {

            var respond = remindMeStart(msg.content, msg.author.id);
            msg.reply(respond);
        }
        else if(incomingMessage.includes("remind")) {

            var respond = remindFriendStart(msg.content, msg.mentions.users);
            msg.reply(respond);
        }
    }
})


function clearReminders()
{
    localStorage.clear();
    return "All reminders were cleared."
}

function listReminders()
{
    var response = "";
    var i;
    
    for(i = 0; i < localStorage.length; i++)
    {
        var inStorage = localStorage.getItem(localStorage.key(i));
        if(inStorage != null)
        {
            response += inStorage.split("@@%^$@%&")[1];
        }
    }
    return response;
}

function remindMeStart(incomingMessage, userTag)
{
    try{
    var split = incomingMessage.split("remind me: ");
    var dateInfo = split[1].split("@@");
    var date = dateInfo[0];

    //Number followed by thing
    var addToTimestamp = 0;
    var number = date.split(" ")[0];
    var timeStyle = date.split(" ")[1].toLowerCase();

    if(timeStyle === "sec" || timeStyle === "seconds")
    {
        addToTimestamp = 1000 * number;
    }
    if(timeStyle === "hours")
    {
        addToTimestamp = 1000 * number * 60 * 60;
    }
    if(timeStyle === "days" || timeStyle === "days")
    {
        addToTimestamp = 1000 * number * 60 * 60 * 24;
    }
    if(timeStyle === "min" || timeStyle === "mins" || timeStyle === "minutes")
    {
        addToTimestamp = 1000 * number * 60;
    }
    var info = dateInfo[1]


    var localLength = localStorage.length;
    var timestamp = Date.now() + addToTimestamp;
    console.log(timestamp + ":" + Date.now());
    localStorage.setItem(localLength, "" + timestamp + "@@%^$@%&" + " <@" + userTag + "> " + info);


    return "I will remind you\n" + info + " \nIn " + date;
}
    catch(err) {
        console.log(err.message);
        return "Sorry there was an error";
      }
}




function remindFriendStart(incomingMessage, mentions)
{
    try {      
    var split = incomingMessage.split(": ");
    console.log(incomingMessage);
    var dateInfo = split[1].split("@@");
    var date = dateInfo[0];

    //Number followed by thing
    var addToTimestamp = 0;
    var number = date.split(" ")[0];
    var timeStyle = date.split(" ")[1].toLowerCase();

    console.log("////////////////////////");
    console.log(timeStyle);
    if(timeStyle === "sec" || timeStyle === "seconds")
    {
        addToTimestamp = 1000 * number;
    }
    if(timeStyle === "hours")
    {
        addToTimestamp = 1000 * number * 60 * 60;
    }
    if(timeStyle === "days" || timeStyle === "days")
    {
        addToTimestamp = 1000 * number * 60 * 60 * 24;
    }
    if(timeStyle === "min" || timeStyle === "mins" || timeStyle === "minutes")
    {
        addToTimestamp = 1000 * number * 60;
    }
    var info = dateInfo[1]
    var localLength = localStorage.length;
    var timestamp = Date.now() + addToTimestamp;

    
    var userTags = "";
    try 
    {
    mentions.forEach(element => {
        userTags += "<@" + element.id + ">" + " "
    });
    }
    catch(err)
    {
        console.log(err.message + "ITS IN THE FOREACH");
    }

    localStorage.setItem(localLength, "" + timestamp + "@@%^$@%&" + userTags + " " + info);

    return "I will remind " + userTags + "\n" + info + "\nIn " + date;
    }
catch(err) {
    console.log(err.message);
    return "Sorry there was an error";
  }
}

