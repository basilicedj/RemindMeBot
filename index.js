const Discord = require('discord.js');
const client = new Discord.Client();
//428950203144470528 General
//521434157193232392 Bot Testing
var messageChannel = '428950203144470528';
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

 client.login('NTIxMTUwMDQ2OTE0MzQ3MDE5.Du4TTg.zkGgZNyTLsgyvygZMdjGri6A5c4');



//Start the bot
 var startUp = setTimeout(startUpBot, 5000);
 function startUpBot()
 {
    var channel = client.channels.get(messageChannel);
    channel.send("Remind me bot is up and running poi~");
    var intervalID = setInterval(checkTimes, 500);
 }

 function processAttachment(attachmentCollection)
 {
    var attachment = attachmentCollection.first();
    if(attachment != null)
    {
        console.log("Has Attachment");
        var channel = client.channels.get(messageChannel);
        //channel.send(attachment.url);
        return attachment.url;
    }
    return "";
 }

//Check the time for each entry in storage
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
                var channel = client.channels.get(messageChannel);
                channel.send(dateInfo);
                localStorage.removeItem(localStorage.key(i));
                return;
            }
        }
    }
}


//If you get a message
client.on('message', msg => {
    //If the message author is not this bot
    if(msg.author.tag != client.user.tag)
    {
        if(msg.content === 'ping')
        {
            msg.reply('pong');
        }

        var attachment = processAttachment(msg.attachments);

        //If the bot is tagged in the message
        if(msg.mentions.users.get(client.user.id) != null)
        {
            
            var incomingMessage = msg.content.split("> ")[1];
            incomingMessage = incomingMessage.toLowerCase();

            if (incomingMessage === "list reminders") {
                var respond = listReminders();
                msg.reply(respond);
            }
            else if (incomingMessage.includes("remove reminder ")) {
                var respond = removeReminder(incomingMessage);
                msg.reply(respond);
            }
            else if (incomingMessage === "clear reminders secret lock hasssssha") {
                var respond = clearReminders();
                msg.reply(respond);
            }
            else if (incomingMessage.includes("remind me:")) {
                var respond = remindMeStart(msg.content, msg.author.id, attachment);
                msg.reply(respond);
            }
            else if(incomingMessage.includes("remind")) {
                   var respond = remindFriendStart(msg.content, msg.mentions.users, attachment);
                   msg.reply(respond);
            }
        }
    }
})

//Clears all reminders
function clearReminders()
{
    localStorage.clear();
    return "All reminders were cleared."
}

function removeReminder(indexString)
{
    var index = (indexString.split("remove reminder ")[1]) - 1;
    localStorage.removeItem(localStorage.key(index));
    return "Removed reminder " + (index+1);
}

//Lists all the reminders
function listReminders()
{
    var response = "";
    var i;
    
    for(i = 0; i < localStorage.length; i++)
    {
        var inStorage = localStorage.getItem(localStorage.key(i));
        if(inStorage != null)
        {
            console.log("TIMESTAMP IN STORAGE: " + inStorage.split("@@%^$@%&")[0])
            date = new Date(inStorage.split("@@%^$@%&")[0] - 0);

            var info = inStorage.split("@@%^$@%&")[1].split("\nATTCH")[0];
            response += "\n" + (i+1) + ": " + date.toString() + ": " + info;
        }
    }
    return response;
}

function findDateTimestamp(incomingString)
{
    date = new Date();
    date = Date.parse(incomingString);
    date = new Date(date);
    console.log(date.getTime());
    return date.getTime();
}

function findTimestamp(incomingStr)
{
    var incomingString = incomingStr;
    var hasDate = false;
    var dateOfHasDate = 0;
    if(incomingString.includes("/"))
    {
        hasDate = true;
        var spitArray = incomingString.split(" ");
        dateOfHasDate = findDateTimestamp(spitArray[0]);
        incomingString = incomingStr.substring(spitArray[0].length+1);
        console.log("String split from date: " + incomingString);
    }
    try
    {
        var addToTimestamp = 0;
        var timeArray = incomingString.split(" ");
        var i = 0;
        for(i = 0; i < timeArray.length; i = i + 2)
        {
            if(timeArray[i] === "")
            {
                break;
            }
            var number = timeArray[i];
            var timeStyle = timeArray[i+1].toLowerCase();
            if(timeStyle === "sec" || timeStyle === "seconds" || timeStyle === "second" || timeStyle === "secs")
            {
                addToTimestamp += 1000 * number;
            }
            if(timeStyle === "hours" || timeStyle === "hour")
            {
                addToTimestamp += 1000 * number * 60 * 60;
            }
            if(timeStyle === "days" || timeStyle === "day")
            {
                addToTimestamp += 1000 * number * 60 * 60 * 24;
            }
            if(timeStyle === "week" || timeStyle === "weeks")
            {
                addToTimestamp += 1000 * number * 60 * 60 * 24 * 7;
            }
            if(timeStyle === "min" || timeStyle === "mins" || timeStyle === "minutes" || timeStyle === "minute")
            {
                addToTimestamp += 1000 * number * 60;
            }
        }
        
        var timestamp = Date.now() + addToTimestamp;
        if(hasDate)
        {
            timestamp = dateOfHasDate + addToTimestamp;
         //Convert to eastern from coordinated universal   
         timestamp += 1000 * 60 * 60 * 5;
            console.log("Date and adding: " + timestamp);
        }
        return timestamp;
    }
    catch(err) {
        console.log(err.message);
        return 0;
      }
}

//Taken an incoming message and the Author and returns a response
function remindMeStart(incomingMessage, userTag, attachment)
{
    try{
        var messageLowerCase = incomingMessage.toLowerCase();
        var split = messageLowerCase.split("remind me: ");
        var timeStyle = split[1].split("@@")[0];
        var timestamp = findTimestamp(timeStyle)        
        var info = incomingMessage.split("@@")[1];
        info += "\nATTCH" + attachment;

        var localLength = localStorage.length;

        localStorage.setItem(localLength, "" + timestamp + "@@%^$@%&" + " <@" + userTag + "> " + info);
        return "I will remind you\n" + info.split("\nATTCH")[0] + " \nIn " + timeStyle;
}
    catch(err) {
        console.log(err.message);
        return "Sorry there was an error";
      }
}




function remindFriendStart(incomingMessage, mentions, attachment)
{
    try {      
        var messageLowerCase = incomingMessage.toLowerCase();
        var split = messageLowerCase.split("remind me: ");
        var timeStyle = split[1].split("@@")[0];
        var info = incomingMessage.split("@@")[1];
        info += "\nATTCH" + attachment;
        var localLength = localStorage.length;
        var timestamp = findTimestamp(timeStyle)  
        var userTags = "";

        mentions.forEach(element => {
            userTags += "<@" + element.id + ">" + " "
        });


        localStorage.setItem(localLength, "" + timestamp + "@@%^$@%&" + userTags + " " + info);
        return "I will remind " + userTags + "\n" + info.split("\nATTCH")[0] + "\nIn " + timeStyle;
    }
catch(err) {
    console.log(err.message);
    return "Sorry there was an error";
  }
}
