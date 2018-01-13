# node-smssend
Dead simple zero cost SMS sending tool for node apps.  

Utilizes a map of providers to send a single SMS message to a cell phonme number via the given providers SMS via email service.
## Setup
### Installation via npm
```
npm i --save node-smssend
```
## Usage
You must first configure the SMSSend object by passing the configuration to its constructor like so:

### SMSSend Configuration Example
```
let providers = [
    {name: 'Alltel', emailHost: 'message.alltel.com'},
    {name: 'AT&T', emailHost: 'txt.att.net'},
    {name: 'T-Mobile', emailHost: 'tmomail.net'},
    {name: 'Virgin Mobile', emailHost: 'vmobl.com'},
    {name: 'Sprint', emailHost: 'messaging.sprintpcs.com'},
    {name: 'Verizon', emailHost: 'vtext.com'},
    {name: 'Nextel', emailHost: 'messaging.nextel.com'},
    {name: 'US Cellular', emailHost: 'mms.uscc.net'},
    {name: 'Cricket', emailHost: 'mms.cricketwireless.net'},
    {name: 'Boost', emailHost: 'myboostmobile.com'},
    {name: 'Google Fi', emailHost: 'msg.fi.google.com'},
    {name: 'Republic ', emailHost: 'text.republicwireless.com'},
];

let config = {
    providers: providers,
    emailGatewayConfig: {
        host: process.env.CONFIG_EMAILGATEWAY_HOST,
        port: process.env.CONFIG_EMAILGATEWAY_PORT,
        useTls: false,
        username: process.env.CONFIG_EMAILGATEWAY_AUTH_USERNAME,
        password: process.env.CONFIG_EMAILGATEWAY_AUTH_PASSWORD,
        mailFrom: process.env.CONFIG_EMAILGATEWAY_MAILFROM,
    },
};

let smsSend = new SMSSend(config);
```

### SMSSend Configuration
| Property | Description | Required? |
| ---------|-------------|-----------|
| providers | List of configured SMS providers with the form: ``` {name: 'AT&T', emailHost: 'txt.att.net'} ```.  If not provided the default list will be used. |  true |
| emailGatewayConfig | Holds the config for the smtp server you will use. | true |
| emailGatewayConfig.host | The host name for the smtp server. | true |
| emailGatewayConfig.port | The port for the smtp server. | true |
| emailGatewayConfig.useTls | Does your smtp server use tls? | true |
| emailGatewayConfig.username | The username for smtp server login. | true |
| emailGatewayConfig.password | The password for smtp server login. | true |
| emailGatewayConfig.mailFrom | The email adress used for outgoing mail. | true |

With the SMSSend configured, you can send an SMS message via the sendSMS method like so:
```
smsSend.sendSMS(
    'AT&T',
    process.env.TEST_SMS_NUMBER,
    'Testing SMSGateway').then((result) => {
        console.log(`SUCCESS: ${result}`);
    }, (err) => {
        console.log(`FAIL: ${err.message}`);
});
```

### SMSSend.sendSMS Parameters
| Parameter | Description | Required? |
| ----------|-------------|-----------|
| providerName | The key for the provider to use in the providers list. | true |
| cellPhone | The cell phone number to send the SMS message to. | true |
| msg | The text for the SMS message to send | true |

A full example is as follows:

### Full Example
```
let dotenv = require('dotenv');
let SMSGateway = require('./index.js');

dotenv.config();

let providers = [
    {name: 'Alltel', emailHost: 'message.alltel.com'},
    {name: 'AT&T', emailHost: 'txt.att.net'},
    {name: 'T-Mobile', emailHost: 'tmomail.net'},
    {name: 'Virgin Mobile', emailHost: 'vmobl.com'},
    {name: 'Sprint', emailHost: 'messaging.sprintpcs.com'},
    {name: 'Verizon', emailHost: 'vtext.com'},
    {name: 'Nextel', emailHost: 'messaging.nextel.com'},
    {name: 'US Cellular', emailHost: 'mms.uscc.net'},
    {name: 'Cricket', emailHost: 'mms.cricketwireless.net'},
    {name: 'Boost', emailHost: 'myboostmobile.com'},
    {name: 'Google Fi', emailHost: 'msg.fi.google.com'},
    {name: 'Republic ', emailHost: 'text.republicwireless.com'},
];

let config = {
    providers: providers,
    emailGatewayConfig: {
        host: process.env.CONFIG_EMAILGATEWAY_HOST,
        port: process.env.CONFIG_EMAILGATEWAY_PORT,
        useTls: false,
        username: process.env.CONFIG_EMAILGATEWAY_AUTH_USERNAME,
        password: process.env.CONFIG_EMAILGATEWAY_AUTH_PASSWORD,
        mailFrom: process.env.CONFIG_EMAILGATEWAY_MAILFROM,
    },
};

let smsSend = new SMSSend(config);

smsSend.sendSMS(
    'AT&T',
    process.env.TEST_SMS_NUMBER,
    'Testing SMSGateway').then((result) => {
        console.log(`SUCCESS: ${result}`);
    }, (err) => {
        console.log(`FAIL: ${err.message}`);
});
```