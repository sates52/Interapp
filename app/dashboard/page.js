"use strict";

var document = null;
var purchase_control = 1;
const fromobject = require("tns-core-modules/data/observable").fromObject;

const appsettings = require("tns-core-modules/application-settings");
const apputils = require("~/app-utils").utils;
const language = require("~/dashboard/language." + apputils.language() + ".json");

exports.pageLoaded = function (args) {
    var page = args.object;
    var view = fromobject({
        processing: true,
        student() {
            return "";
        },
        event() {
            return "";
        },
        teacher() {
            return "";
        },
        showDetails() {

            return "collapsed";

        },

        language() {
            return eval("language." + arguments[0]);
        },

        labeltap_reload() {
            apputils.navigate("~/dashboard/page.js");
        },
        buttontap_purchase() {
            apputils.navigate("~/purchase/page.js");
        }
    });
    page.bindingContext = view;

    //reference
    document = view;

    //load data
    setTimeout(function () {
        var http = require("http");
        http.getJSON({
            url: "https://api.interingilizce.com/_api/dashboard",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                token: appsettings.getString("token"),
                timezone: apputils.timezone(),
                uuid: apputils.uuid(),
                apikey: apputils.apikey()
            })
        }).then((r) => {
            pageShowed(args, r);
        }, (e) => {
            pageError(args);
        });
    }, 1000);


    function pageShowed(args, r) {
        document.processing = false;

        var page = args.object;
        var view = fromobject({
            student() {
                return eval("r.student." + arguments[0]);
            },

            event() {
                return eval("r.bookevent." + arguments[0]);
            },
            teacher() {

                if (eval("r.teacher.id") == 0)
                    purchase_control = 0;
                return eval("r.teacher." + arguments[0]);
            },
            language() {
                return eval("language." + arguments[0]);
            },
            showDetails() {

                if (purchase_control == 0)
                    return "visible";
                else
                    return "collapsed";

            },
        });

        page.bindingContext = view;
    }

    function pageError(args) {
        document.processing = false;

        alert(language.errors[0].description);
    }

}
