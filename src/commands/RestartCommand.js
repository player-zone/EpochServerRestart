const Command = require('./Command');

class RestartCommand extends Command {
    constructor() {
        super('!restart', 'Force a server restart');
    }

    handler() {
        if (!global.services.StartServer) {
            console.log('Server service is not working.');
            return;
        }

        console.log('Restarting server...');

        clearInterval(global.services.StartServer.interval);
        global.services.StartServer.bootServer();
    }
}

module.exports = RestartCommand;