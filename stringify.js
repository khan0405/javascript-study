var toJSONStringRecursive = (function(window, JSON) {
    var jsonString = function(obj) {
        var decorate = decorateDefault;
        if (typeof obj == 'object') {
            if (obj instanceof Array) {
                decorate = decorateArray;
            }
            else if (obj instanceof Date) {
                decorate = decorateDate;
            }
            else {
                decorate = decorateObject;
            }
        }
        else if (typeof obj == 'string') {
            decorate = decorateString;
        }
        return decorate(obj);
    };

    var decorateObject = function(obj) {
        var result = "{";

        var keys = Object.keys(obj);
        keys.forEach(function (key, i) {
            if (i > 0) result += ",";
            result += '"' + key + '":' + jsonString(obj[key]);
        });

        return result + "}";
    };

    var decorateArray = function(obj) {
        var result = "[";

        for (var i = 0; i < obj.length; i++) {
            if (i > 0) result += ',';
            result += jsonString(obj[i]);
        }
        return result + "]";
    };
    var decorateDate = function(obj) {
        return decorateString(dd.toJSON());
    };
    var decorateString = function (obj) {
        return '"' + obj + '"';
    };
    var decorateDefault = function (obj) {
        return obj;
    };

    return function(obj) {
        return jsonString(obj);
    };
})();
