const fs = require('fs');
const { exec } = require('child_process');

const ServerConnection = require('./ServerConnection');

class StartServer {
    constructor(hours = 3) {
        // is the server running?
        this.online = false;
        // configuration object, filled from the .env file
        this.config = {};

        // message timeouts
        this.messageTimeouts = [];

        console.log('Server will restart every ' + hours + ' hours');
        
        // how often will the server restart [ms]
        this.intervalTime = hours * 60 * 60 * 1000;

        this.interval = null;
        
        this.loadEnv();
    }
    
    // initialise the interval
    initInterval() {
        this.bootServer();
        this.interval = setInterval(this.bootServer, this.intervalTime);
        this.initRestartMessages();
    }

    /**
     * Checks if server process is running
     * @returns {Promise}
     */
    isServerRunning() {
        return new Promise((resolve, reject) => {
            exec('tasklist', (err, stdout, stderr) => {
                resolve(stdout.toLowerCase().indexOf('arma2oaserver.exe'.toLowerCase()) > -1)
            });
        });
    }

    async bootServer() {
        // if the server is online (hopefully!), kill it
        let isServerUp = await this.isServerRunning();

        if (isServerUp) {
            console.log('Killing Arma 2 server...');
            await this.killServer();
        }

        // run pre-boot scripts
        await this.preBootScripts();
        
        // start the server!
        this.startServer();

        // connect to the server, a minute should be safe
        setTimeout(() => {
            new ServerConnection({
                address: this.config.HOST,
                port: this.config.PORT,
                password: this.config.PASSWORD
            });
        }, 60000)
    }

    /**
     * Runs custom scripts before booting the server up
     * @returns {Promise}
     */
    preBootScripts() {
        console.log('Preparing to start the server...');

        return new Promise((resolve, reject) => {
            // any pre-boot scripts to run? Add them here
            resolve();
        });
    }

    /**
     * Loads the .env file
     * it's a really simplified parser so try not to overcomplicate it
     * it could as well be a separate class - todo
     */
    loadEnv() {
        if (!fs.existsSync('.env')) {
            console.log('No ENV file found! Please close the program and add your configuration.');
            return;
        }

        let lineReader = require('readline').createInterface({
            input: fs.createReadStream('.env')
        });

        lineReader
            .on('line', (line) => {
                // ignore empty lines
                if (line.length === 0)
                    return;

                // ignore commented lines
                if (line[0] === '#') 
                    return;

                // find the index of equal sign
                const equalCharIndex = line.indexOf('=');

                // if it's not present, ignore this line as well
                if (equalCharIndex === -1)
                    return;

                
                const key = line.substr(0, equalCharIndex);
                const value = line.substr(equalCharIndex + 1, line.length-1);

                this.config[key] = value;
            })
            .on('close', this.initInterval.bind(this));
    }

    /**
     * Kills the server process
     * @returns {Promise}
     */
    killServer() {
        return new Promise((resolve, reject) => {
            exec(`taskkill /im ${this.config.PROCESS_NAME || 'arma2oaserver.exe'} /f`, (error) => {
                if (error) {
                    console.log('Error! Unable to kill the process.');
                    reject();
                    return;
                }

                // Ckear all the timeouts for the messages
                // todo: put into a separate function
                this.messageTimeouts.forEach((timeout) => { clearInterval(timeout) });
                this.messageTimeouts = [];
                
                // a little timeout before we proceed
                setTimeout(resolve, 10000);
                this.online = false;
            }) 
        });
    }

    /**
     * runs the server boot command
     */
    startServer() {
        if (!this.config.STARTUP_COMMAND) {
            console.log('Error! No startup command found.');
            process.exit(0);
        }

        exec(`${this.config.STARTUP_COMMAND}`, (error, stdin, stdout) => {
            if (error) {
                console.log('Error! Could not start up the server. Did you setup your start scripts correctly?');
                console.log(stdout);
                return;
            }

            this.online = true;
        });
    }

    /**
     * Initialise timeouts for the restart server messages shown on the server to all players
     */
    initRestartMessages() {
        const template = this.config.KILLSERVER_MESSAGE || 'Warning! This server will restart in {minutes} minutes.';
        let timePeriods = [10, 5, 2, 1];

        if (this.config.KILLSERVER_TIMEPERIODS) {
            const parsed = JSON.parse(this.config.KILLSERVER_TIMEPERIODS);

            if (parsed && typeof parsed === 'object' && parsed instanceof Array) {
                timePeriods = parsed;
            }
        }

        timePeriods.forEach((time) => {
            this.messageTimeouts.push(setTimeout(() => {
                ServerConnection.sendGlobalMessage(template.replace('{message}', time));
            }, this.intervalTime - (time * 60 * 1000)));
        });
    }
}

module.exports = StartServer;