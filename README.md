sky-er110-router-reconnect-script
=================================

This is a simple script created to quickly restart "Sky ER110" internet via
  disconnect / connect actions.

This can fix lags or speed drop caused by router running too long without
  restart - Which I guess resets the network buffer?

Anyway, this script can be easily integrated with corn job.


Warning
-------
There is no warranty for this free software. Use at your own risk.


Setup
-----
1. Install Node (v10). Use of [`nvm`][nvm] is preferred.
2. Install dependencies: `npm install` or `yarn install`
3. (optional) setup corn job or systemd unit to run when you are asleep.


Usage
-----
    node index.js


License
-------

GNU General Public License v3


[nvm]: https://github.com/creationix/nvm#installation
