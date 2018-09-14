const armaRcon = require('arma-rcon');

class ServerConnection {
    constructor(options) {
        this.address = options.address || '127.0.0.1';
        this.port = options.port || 2302;
        this.rconPassword = options.password || 'password';
        this.connected = false;

        this.connection = new armaRcon.ARMAServer(this.address, this.port);

        this.login();
    }
    
    login() {
        this.connection.login(this.rconPassword, (error, loggedIn) => {
            if(error || !loggedIn) {
                console.log('Failed to log in to server');
                return;
            }
            
            this.connected = true;
        });
    }

    sendGlobalMessage(message) {
        if (!this.connected) {
            return;
        }

        this.connection.globalMessage(message, (error) => {
            if (error) {
                console.log("Failed to send a message to the server");
                return;
            }
        });
    }
}

module.exports = ServerConnection;