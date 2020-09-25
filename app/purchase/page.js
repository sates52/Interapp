"use strict";

var document = null;
var dialogsModule = require("tns-core-modules/ui/dialogs");
var mins;

var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const listViewModule = require("tns-core-modules/ui/list-view");
const fromobject = require("tns-core-modules/data/observable").fromObject;

const appsettings = require("tns-core-modules/application-settings");
const apputils = require("~/app-utils").utils;
const language = require("~/purchase/language." + apputils.language() + ".json");



exports.pageLoaded = function (args) {



    var page = args.object;
    var view = fromobject({
        processing: true,
        /*
                mins: new ObservableArray([
                    { mey: "Apples-" },
                    { mey: "Bananas" },
                    { mey: "Oranges" }
                ]),
                */
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








    exports.onItemSelected = function (args) {
        alert(args.index);
    }

    setTimeout(function () {
        var http = require("http");

        http.getJSON({
            url: "https://api.interingilizce.com/_api/packages",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                token: appsettings.getString("token"),
                apikey: apputils.apikey()
            })
        }).then((r) => {
            //alert(r.data.package[0].listprice);
            pageShowed(args, r);
        }, (e) => {
            alert("Json hata");
            pageError(args);
        });
    }, 1000);

    function pageShowed(args, r) {
        //document.processing = false;
        alert(JSON.parse(r.data.package));
        var page = args.object;
        var view = fromobject({
            student() {
                return eval("r.student." + arguments[0]);
            },
/*
            mins: new ObservableArray([
                { month: "Apples-", id: 2 },
                { month: "Bananas", id: 3 },
                { month: "Oranges", id: 4 }
            ]),
*/
            // mins: new ObservableArray([r.data.package[0].month]),
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
        alert("hata");
        alert(language.errors[0].description);
    }


}




