const readline = require('readline');
const StartServer = require('./src/StartServer');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let serverService = null;

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

    serverService = new StartServer(answer);

    console.log('\nOther Commands:\n  1. !restart - restarts the server\n  2. !shutdown - shuts the server down');
});

// todo: Handle the above commands
rl.on('line', () => {
    console.log('Commands are not supported yet.');
});

