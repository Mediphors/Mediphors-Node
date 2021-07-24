# Mediphors-Node

The backend API for the Mediphors website

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can update it using `npm`! Just run this command and it will update npm. This command may need extra permission so either use sudo before the command or run cmd as admin.

    $ npm install npm -g

---

## Install

    $ git clone https://github.com/Mediphors/Mediphors-Node
    $ npm install

## Running the project 

To have the node server restart on changes run with nodemon

    $ nodemon start

To run the node server normally

    $ npm start


## Simple build for production

    $ npm build
