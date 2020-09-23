"use strict";

const appsettings = require("tns-core-modules/application-settings");
const apputils = require("~/app-utils").utils;

exports.pageLoaded = function (args) {
    appsettings.setString("token", "abcd-9oli-all0-5ui6-walp-4ert");
    appsettings.setString("token", "");

    if (appsettings.getString("token", "") == "") {
        apputils.navigate("~/account/signin/page.js");
    } else {
        apputils.navigate("~/dashboard/page.js");
    }
}