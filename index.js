let nodemailer = require('nodemailer');
let Joi = require('joi');
let isValidNumber = require('libphonenumber-js').isValidNumber;

let defaultProviders = require('./defaultProviders.js');
let validateGatewayConfig = Symbol('validateGatewayConfig');
let validateEmailConfig = Symbol('validateEmailConfig');
let sendMail = Symbol('sendMail');

class SMSSend {
    constructor(config) {
        this[validateGatewayConfig](config);
        this.config = config;
        if (!this.config.providers) {
            this.config.providers = defaultProviders;
        }
        this.transporter = nodemailer.createTransport({
            host: this.config.emailGatewayConfig.host,
            port: this.config.emailGatewayConfig.port,
            secure: this.config.emailGatewayConfig.useTls,
            auth: {
                user: this.config.emailGatewayConfig.username,
                pass: this.config.emailGatewayConfig.password,
            },
        });
        this.transporter.verify((error, success) => {
            if (error) {
                 console.log(error);
            } else {
                 console.log('SMTP is ready to take our messages');
            }
         });
    }

    [validateGatewayConfig](config) {
        let schema = Joi.object().keys({
            providers: Joi.array().items(Joi.object().keys({
                name: Joi.string().required(),
                emailHost: Joi.string().required(),
            })),
            emailGatewayConfig: Joi.object().keys({
                host: Joi.string().required(),
                port: Joi.number().integer().required(),
                useTls: Joi.boolean().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
                mailFrom: Joi.string().email().required(),
            }).required(),
        });
        Joi.assert(config, schema, 'Invalid Gateway Config!');
    }

    [validateEmailConfig](config) {
        let schema = Joi.object().keys({
            from: Joi.string().email().required(),
            to: Joi.string().email().required(),
            subject: Joi.string().required(),
            text: Joi.string(),
            html: Joi.string(),
        });
        Joi.assert(config, schema, 'Invalid Email Config!');
    }

    [sendMail](config) {
        this[validateEmailConfig](config);
        let that = this;
        return new Promise((resolve, reject) => {
            that.transporter.sendMail(config,
                (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(`Message sent from: ${config.from} ` +
                    `to: ${config.to} subject: ${config.subject}`);
                }
            });
        });
    }

    sendSMS(providerName, cellPhone, msg) {
        if (!providerName) {
            throw new Error('Missing providerName!');
        }
        if (!isValidNumber(cellPhone, 'US')) {
            throw new Error('Invalid cellPhone!');
        }
        if (!msg) {
            throw new Error('Missing msg!');
        }
        let provider = this.config.providers.find((p) => {
            return p.name === providerName;
        });
        if (!provider) {
            throw new Error(
                `${providerName} not found in configured providers`);
        }
        let that = this;
        return new Promise((resolve, reject) => {
            let config = {
                from: that.config.emailGatewayConfig.mailFrom,
                to: `${cellPhone}@${provider.emailHost}`,
                text: msg,
            };
            this.transporter.sendMail(config,
                (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    let result =
                        `SMS sent to ${cellPhone}, msg: ${msg}`;
                    console.log(result);
                    resolve(result);
                }
            });
        });
    }
}

module.exports=SMSSend;
