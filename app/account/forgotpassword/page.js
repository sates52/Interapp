"use strict";

var document = null;

const fromobject = require("tns-core-modules/data/observable").fromObject;

const appsettings = require("tns-core-modules/application-settings");
const apputils = require("~/app-utils").utils;

const langdta = require("~/account/forgotpassword/language." + apputils.language() + ".json");
const langerr = require("~/account/forgotpassword/language.error." + apputils.language() + ".json");

exports.pageLoaded = function (args) {
    var page = args.object;
    var view = fromobject({
        processing: false,
        phone: "",

        language() {
            return eval("langdta." + arguments[0]);
        },

        buttontap_forgotpassword() {
            if (this.processing) {
                return;
            }
            this.processing = true;
            forgotPassword(this.phone);
        }
    });
    page.bindingContext = view;

    //reference
    document = view;
}

function forgotPassword(s_phone) {
    var http = require("http");
    http.getJSON({
        url: "https://api.interingilizce.com/_api/forgetpassword",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            phone: s_phone,
            timezone: apputils.timezone(),
            uuid: apputils.uuid(),
            apikey: apputils.apikey()
            //Dil eklenmesi
        })
    }).then((r) => {
        document.processing = false;
        var err = r.error.number;
        if (err == 0) {
            alert(langdta.success);
            appsettings.setString("token", r.token.id);
            apputils.navigate("~/account/signin/page.js");
            return;
        } else {
            alert(langerr.errors[err].description);
        }
    }, (e) => {
        document.processing = false;
        alert(langerr.errors[0].description);
    });
}