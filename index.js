const readline = require('readline');
const StartServer = require('./src/StartServer');
const CommandService = require('./src/CommandService');

const log = require('simple-node-logger').createSimpleLogger('logs.log');

global.services = {};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function validateTimer(time) {
    if (isNaN(time)) 
        return false; 

    if (time < 1 || time > 10) 
        return false;

    return true;
}

rl.question('How often would you like the server to restart (in hours)? ', (answer) => {
    if (isNaN(answer)) {
        console.log('Not a number! Exiting...'.error);
        rl.close();
        return;
    }

    global.services.StartServer = new StartServer(answer);
    global.services.CommandService = new CommandService();

    global.services.CommandService.availableCommandsInformation();
});

rl.on('line', (line) => {
    global.services.CommandService.execute(line);
});

