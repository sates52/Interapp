const frame = require("tns-core-modules/ui/frame").Frame;
const platform = require("tns-core-modules/platform");
const utils = {
    navigate: function () {
        frame.topmost().navigate({ moduleName: arguments[0], backstackVisible: false, clearHistory: true });
    },

    language: function () {
        switch (platform.device.language) {
            default: return "en";
        };
    },
    userlanguage: function () {
        return platform.device.language;
    },
    timezone: function () {
        return new Date().getTimezoneOffset();
    },

    uuid: function () {
        return platform.device.uuid;
    },

    brand: function () {
        return "interingilizce";
    },

    region: function () {
        return platform.device.region;
    },

    apikey: function () {
        return "b76c-0d6b-042e-4391-a4ee-0001";
    }
}
exports.utils = utils;