# ARMA 2 server restart
## Description
If you've ever played on a DayZ server (DayZ mod from ARMA 2) you probably have noticed that most servers restart every 3-4 hours. It's because it has to respawn and reset some objects, and also (for most server) clean the missions that spawned during the game. 

We've decided to make this very simple command-line application to make it a bit easier for everyone. 

## Features
* Restarts the server every X hours
* Sends configurable notifications to the players on the server before restart
* Allows to run custom scripts before booting the server up (need to be recompiled)
* Allows to run the server with a custom command

## Requirements
DayZ Epoch doesn't support other systems than Windows, so this software supports Windows only.
This application also requires a BattlEye RCon access to run.

## Installation
It's a very simple program. You can put its folder wherever you want in your system, but for security reasons, please **keep it away from the ARMA II Home directory**.

The program requires a .env file to be in the same directory as the executable itself.
Take a look at the .env.example file.

Here are the flags you can set:
* **HOST** - IP address of your server (default: 127.0.0.1)
* **PORT** - Port at which your server is running (default: 2302)
* **PASSWORD** (**required**) - BattlEye Server password

* **STARTUP_COMMAND** (**required**) is the command which will be run to start the server; it has no default value so you need to make sure you add it in. Otherwise, the application will close.
On player-zone.pl it looks like this:
```
STARTUP_COMMAND=start "arma2" /min /high D:/path/to/arma2oaserver.exe -port=2302 "-config=D:\DZE_Server_Config\11_chernarus.cfg" "-cfg=D:\DZE_Server_Config\basic.cfg" "-profiles=D:\DZE_Server_Config" -name=server "-mod=@DayZ_Epoch;@DayZ_Epoch_Server;"
```

* **PROCESS_NAME** (*optional*) is the name of the process to kill on server restart, in case you're running something else than an Arma 2:OA Server. 
Default value is `arma2oaserver.exe`.

* **RESTART_MESSAGE** (*optional*) is the message that'll be displayed to all players on the server. You can include a `{minutes}` string in it and it will replace it with a number representing how many minutes are left until restart. (default: `Warning! This server will restart in {minutes} minutes.`)

* **RESTART_TIMEPERIODS** (*optional*) is required to be a JSON Array. It represents how many minutes before the restart you want to show the `RESTART_MESSAGE` before. (default: `[10,5,2,1]`)

If you're worried about the setting of the restart interval, don't be! Application will ask you for it when you start it. 

The application will also try to log in as an admin to your server, and the restart cycle won't start unless it logs in successfuly. It'll ensure that the server is always restarting on time.


## Commands
Application will always let you type in any command you'd like.
Following commands are available:

* `!restart` - force the server to restart

If you'd like to add a new command, go to `src/commands` directory and create a new file, e.g. `MyNewCommand.js`. Inside of it, create a `MyNewCommand` class which must extend the `Command` class from `src/commands/Command.js`. 
Call the `Command` constructor with `super('!mynewcommand', 'runs my new command')`, providing it with your command name (which is basically what the user should write in the command line to execute the command) and description (which will appear in the commands list). Your `MyNewCommand` should also have a `handler` method, which will be called once the command has been called from the command line. 
To let the application know about the new command, remember to import it to `src/commands/index.js` file and add it to the exported array of commands.

The concept is really simple, see `src/commands/RestartCommand.js` for reference.

Remember to run `npm run compile` to generate a new .exe file with your new commands.

## Custom scripts
Scripts are not yet fully supported, but they will allow you to run any script before running the server process. They will be located in `src/scripts` directory. 

## Custom build
When you add new scripts and commands, you probably want to have your version of the application in your own repository.

Follow this amazing tutorial:
https://gist.github.com/sangeeths/9467061

This will let you have this project in your own repository, but also will let you pull the latest updates from this repository.

## Notes
Please note it's a really early-stage idea and an experiment. We quickly realised some of the features are obsolete. We're looking forward to refractoring the code and making it more stable and cleaner. 

## Contributions
All contributions are welcome!

