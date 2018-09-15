# ARMA 2 server restart
## Description
If you've ever played on a DayZ server (DayZ mod from ARMA 2) you probably have noticed that most servers restart every 3-4 hours. It's because it has to re-spawn and reset some objects, and also (for most server) clean the missions that spawned durigng the game. 

We've decided to make this very simple command-line application to make it a bit easier for everyone. 

## Features
* Restarts the server every X hours
* Sends configurable notifications to the players on the server before restart
* Allows to run custom scripts before booting the server up (need to be recompiled)
* Allows to run the server with a custom command

## Requirements
DayZ Epoch doesn't support other systems than Windows, so this software supports windows only.
This application also requires an RCon access to run.

## Installation
It's a very simple program. You can put its folder wherever you want in your system but I think it's best to keep it in the ARMA directory or in your Server configuration directory.

The program requires a .env file to be in the same directory as the executable itself.
Take a look at the .env.example file.

Here are the flags you can set:
* **HOST** - IP address of your server (default: 127.0.0.1)
* **PORT** - Port at which your server is running (default: 2302)
* **PASSWORD** (**required**) - BattlEye Server password

* **STARTUP_COMMAND** (**required**) is the command which will be run to start the server; it has no default value so you need to make sure you add it in. Otherwise, the application will close.
On player-zone.pl it looks like this:
```
STARTUP_COMMAND=start "arma2" /min /high ../arma2oaserver.exe -port=2302 "-config=D:\DZE_Server_Config\11_chernarus.cfg" "-cfg=D:\DZE_Server_Config\basic.cfg" "-profiles=D:\DZE_Server_Config" -name=server "-mod=@DayZ_Epoch;@DayZ_Epoch_Server;"
```

* **PROCESS_NAME** (*optional*) is the name of the process to kill on server restart, in case you're running something else than an Arma 2:OA Server. 
Default value is `arma2oaserver.exe`.

* **RESTART_MESSAGE** (*optional*) is the message that'll be displayed to all players on the server. You can include a `{minutes}` string in it and it will replace it with a number representing how many minutes are left until restart. (default: `Warning! This server will restart in {minutes} minutes.`)

* **RESTART_TIMEPERIODS** (*optional*) is required to be a JSON Array. It represents how many minutes before the restart you want to show the `RESTART_MESSAGE` before. (default: `[10,5,2,1]`)

If you're worried about the setting of the restart interval, don't be! Application will ask you for it when you start it. 

The application will also try to log in as an admin to your server, and the interval won't start unless it logs in successfuly. It'll ensure a high precision.

## Notes
Please note it's a really early-stage idea and an experiment. We quickly realised some of the features are obsolete. We're looking forward to refractoring the code and making it more stable and cleaner. 

## Contributions
All contributions are welcome!

