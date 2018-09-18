const commands = require('./commands');

class CommandService {
    constructor() {
        this.commands = [];

        this.loadCommands();
    }

    registerCommand(command) {
        this.commands.push(command);
    }

    loadCommands() {
        commands.forEach((command) => {
            this.registerCommand(command);
        });
    }

    availableCommandsInformation() {
        const commandInformation = this.commands.map((c, i) => {
            return `  ${i+1}. ${c.command} - ${c.description}`;
        }).join('\n');

        console.log('Available commands:\n' + commandInformation + '\n\n');
    }

    execute(line) {
        const lineExplode = line.split(' ');
        const commandName = lineExplode[0];

        if (!commandName) {
            return;
        }

        const command = this.commands.find((c) => {
            return c.command === commandName;
        })

        if (!command) {
            console.log('Command not found.');
            return;
        }

        command.exec(line);
    }
}

module.exports = CommandService;