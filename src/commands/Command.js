class Command {
    constructor(command, description) {
        this.command = command;
        this.description = description;
    }

    exec(line) {
        this.handler(line);
    }

    handler(line) {
        console.log(this.command + ' command does not have a handler.');
    }
}

module.exports = Command;