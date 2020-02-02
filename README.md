In order to run this app:

- Install [node.js](https://nodejs.org/en/).
- Clone the repository.
- Install dependencies using `npm install`.
- Get a key from the [Maker channel on IFTTT](https://ifttt.com/maker_webhooks). 
- Add the key to the `config.json`. Also add your plex username and the device name that should trigger events. Multiple devices are supported. A device can have `start_hour` and `end_hour` to prevent events to be triggered during specific time of the day.

- Run it with:

 ```
 node index.js
 ```

- Add the webhook to https://app.plex.tv/web/app#!/account/webhooks
- If it's in the same server as your Plex Media Server, the webhook would be:
```
http://localhost:12000
```

---

A `plex-webhooks.service` is also available if you want to run it as a service, just replace the `ExecStart` and `WorkingDirectory` to the correct paths and copy the file to your Systemd services folder.