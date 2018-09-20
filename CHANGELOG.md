# Changelog

## Unreleased

## Released

### 0.1.0 - 20.09.2018
Fixed
* **Critical** Replaced initInterval functionality with a setTimeout function; it created a new interval every single restart but kept the old one, so there were multiple restart cycles running at the same time; the longer it was running for, the more intervals it had.
* Messages were not sending properly to the server

### 0.0.2 - 19.09.2018
Added
* Commands support
* Logging to a file
Fixed
* Program crashes because of a missing `this` keyword in the retryLogin method

### 0.0.1 - 15.09.2018
Added
* Basic functionality of the program
* Interval which restarts the server
* Estabilish RCON connection with the server
* Functionality to send messages to the players via RCON connection