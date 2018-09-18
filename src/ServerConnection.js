const armaRcon = require('arma-rcon');

class ServerConnection {
    constructor(options) {
        this.address = options.address || '127.0.0.1';
        this.port = options.port || 2302;
        this.rconPassword = options.password || 'password';
        this.connected = false;

        console.error = function() {};
        this.connection = new armaRcon.ARMAServer(this.address, this.port);
    }

    retryLogin() {
        const maximum = 180; // keep trying for 3 minutes from server start
        let retries = 0;

        return new Promise((resolve,reject) => {
            this.login()
                .then(resolve)
                .catch(() => {
                    setTimeout(() => {
                        retries++;
                        if (retries === maximum) {
                            reject('Failed to log in to the server');
                        }
                        retryLogin().then(resolve).catch(() => {});
                    }, 1000);
                });
        });
    }

    login() {
        return new Promise((resolve, reject) => {
            this.connection.login(this.rconPassword, (error, loggedIn) => {
                if (error || !loggedIn) {
                    reject(false);
                    return;
                }

                resolve(true);
                this.connected = true;
            });
        }) 
    }

    sendGlobalMessage(message) {
        if (!this.connected) {
            return;
        }

        // it won't let us send the message unless the user is logged int
        this.login()
            .then(() => {
                setTimeout(() => {
                    this.connection.globalMessage(message, (error) => {
                        if (error) {
                            console.log("Failed to send a message to the server");
                            return;
                        }
                    });
                }, 200);
            })
            .catch(() => {
                console.log("Failed to send a message to the server");
            });

    }
}

module.exports = ServerConnection;