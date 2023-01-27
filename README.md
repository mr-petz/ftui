Addons for FTUI 3 

FTUI 3 uses [Web Components technologies](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in pure ES2020 javascript.

Caution! 
 * This version is not compatible with older fhem-tablet-ui versions.
 * This version is under construction.

Install
-------
 * copy the folder www/ftui to your FHEM www (e.g.: /opt/fhem/www/ftui)
 ````
wget https://github.com/mr-petz/ftui/tarball/addons -O /tmp/ftui_addons.tar
cd /tmp && tar xvzf /tmp/ftui_addons.tar
mv /tmp/mr-petz-ftui_addons-*/www/ftui /opt/fhem/www
````

Update
------
call 
 ````
update all https://raw.githubusercontent.com/mr-petz/ftui/addons/controls_ftui_addons.txt
````
on the FHEM command field of FHEMWEB

License
-------
This project is licensed under [MIT](http://www.opensource.org/licenses/mit-license.php).
