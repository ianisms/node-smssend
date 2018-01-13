let dotenv = require('dotenv');
let SMSSend = require('./index.js');

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
    'Testing SMSSend').then((result) => {
        console.log(`SUCCESS: ${result}`);
    }, (err) => {
        console.log(`FAIL: ${err.message}`);
    });
