"use strict";

var document = null;

const fromobject = require("tns-core-modules/data/observable").fromObject;

const appsettings = require("tns-core-modules/application-settings");
const apputils = require("~/app-utils").utils;

const langdta = require("~/account/signup/language." + apputils.language() + ".json");
const langerr = require("~/account/signup/language.error." + apputils.language() + ".json");

exports.pageLoaded = function (args) {
    var page = args.object;
    var view = fromobject({
        processing: false,
        phone: "",
        password: "",

        language() {
            return eval("langdta." + arguments[0]);
        },

        labeltap_signin() {
            apputils.navigate("~/account/signin/page.js");
        },

        buttontap_signup() {
            if (this.processing) {
                return;
            }
            this.processing = true;
            signUp(this.phone, this.password);
        }
    });
    page.bindingContext = view;

    //reference
    document = view;
}

function signUp(s_phone, s_password) {
    var http = require("http");
    http.getJSON({
        url: "https://api.interingilizce.com/_api/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            phone: s_phone,
            password: s_password,
            timezone: apputils.timezone(),
            uuid: apputils.uuid(),
            brand: apputils.brand(),
            language: apputils.userlanguage(),
            country: apputils.region(),
            apikey: apputils.apikey()

        })
    }).then((r) => {
        document.processing = false;
        var err = r.error.number;
        if (err == 0) {
            appsettings.setString("token", r.token.id);
            apputils.navigate("~/dashboard/page.js");
            return;
        } else {
            alert(langerr.errors[err].description);
        }
    }, (e) => {
        alert(e);
        document.processing = false;

        alert(langerr.errors[0].description);
    });
}