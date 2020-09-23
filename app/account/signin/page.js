"use strict";

var document = null;

const fromobject = require("tns-core-modules/data/observable").fromObject;

const appsettings = require("tns-core-modules/application-settings");
const apputils = require("~/app-utils").utils;

const langdta = require("~/account/signin/language." + apputils.language() + ".json");
const langerr = require("~/account/signin/language.error." + apputils.language() + ".json");

exports.pageLoaded = function (args) {
    var page = args.object;
    var view = fromobject({
        processing: false,
        phone: "",
        password: "",

        language() {
            return eval("langdta." + arguments[0]);
        },

        labeltap_signup() {
            apputils.navigate("~/account/signup/page.js");
        },

        labeltap_forgotpassword() {
            apputils.navigate("~/account/forgotpassword/page.js");
        },

        buttontap_signin() {
            if (this.processing) {
                return;
            }
            this.processing = true;
            signIn(this.phone, this.password, arguments[0].object.type);
        }
    });
    page.bindingContext = view;

    //reference
    document = view;
}

function signIn(s_phone, s_password, s_type) {
    var http = require("tns-core-modules/http");
    http.getJSON({
        url: "https://api.interingilizce.com/_api/signin/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            phone: s_phone,
            password: s_password,
            type: s_type,
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

        document.processing = false;

        alert(langerr.errors[0].description);
    });
}