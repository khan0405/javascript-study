/**
 * Created by KHAN on 2015-11-12.
 */
var toJSONStringRecursive = (function(window, JSON) {
    var jsonString = function(obj) {
        var convert = convertDefault;
        if (obj && typeof obj == 'object') {
            if (obj instanceof Array) {
                convert = convertArray;
            }
            else if (obj instanceof Date) {
                convert = convertDate;
            }
            else {
                convert = convertObject;
            }
        }
        else if (typeof obj == 'string') {
            convert = convertString;
        }
        else if (obj == undefined) {
            obj = null;
        }
        return convert(obj);
    };

    var convertObject = function(obj) {
        var result = "{";

        var keys = Object.keys(obj);
        keys.forEach(function (key, i) {
            if (i > 0) result += ",";
            result += '"' + key.replace(/"/g, '\\"') + '":' + jsonString(obj[key]);
        });

        return result + "}";
    };

    var convertArray = function(obj) {
        var result = "[";

        for (var i = 0; i < obj.length; i++) {
            if (i > 0) result += ',';
            result += jsonString(obj[i]);
        }
        return result + "]";
    };
    var convertDate = function(obj) {
        return convertString(dd.toJSON());
    };
    var convertString = function (obj) {
        return '"' + obj.replace(/"/g, '\\"') + '"';
    };
    var convertDefault = function (obj) {
        return obj;
    };

    return function(obj) {
        if (typeof obj == 'function' || obj === undefined) {
            return undefined;
        }
        return jsonString(obj);
    };
})();

// 비재귀 함수.
// 난 드디어 해냈다........
// 이건 진짜 인간승리다.
// 나를 정말 칭찬해 주고싶다. 엄마 아빠 나 해냈어요 얏호
// 내일은 칭찬의 의미로 나를 위해 치킨을 사겠다.
var toJSONStringNonRecursive = (function(window, JSON) {
    // 각 Object, array, 구분자를 뜻하는 객체를 담고있는 변수.
    var STR_VALUE = {
        arrPrefix: {str: '['},
        arrSuffix: {str: ']'},
        objPrefix: {str: '{'},
        objSuffix: {str: '}'},
        delimiter: {str: ','}
    };

    // object 정보를 담고있는 객체를 반환한다.
    var stackObj = function(obj) {
        return {o: obj};
    }

    // 기존 primitive type의 값을 반환한다.
    var convert = function(val) {
        return 'string' == typeof val ? '"' + val.replace(/"/g, '\\"') + '"' : val;
    }

    // 각 object들을 스택에 push한다.
    var pushStackObjectValue = function(stack, obj) {
        var type = 'obj', isArray = false, list, o;

        if (obj instanceof Array) {
            isArray = true;
            type = 'arr';
            list = obj;
        }
        else {
            list = Object.keys(obj);
        }

        stack.push(STR_VALUE[type + 'Suffix']);

        // stack의 특성상 선입선출이 되기 때문에 순서가 바뀌지 않도록 거꾸로 뒤집어준다.
        list.reverse();
        list.forEach(function(val, i) {
            if (i > 0) stack.push(STR_VALUE.delimiter);
            o = isArray ? val : obj[val];
            stack.push(stackObj(o));
            !isArray && stack.push({str: '"' + val.replace(/"/g, '\\"') + '":'});
        });
        stack.push(STR_VALUE[type + 'Prefix']);
    }

    return function(obj) {
        if (typeof obj == 'function' || obj === undefined) {
            return undefined;
        }
        var stack = [], // 콜스택 대용. 여기에서 prefix/suffix/delimiter 및
        // 각 object/array/date/primitive type 정보들을 넣어준다.
            result = ''; // 최종적으로 반환될 문자열 값

        // 최초로 object 정보를 넣어준다.
        stack.push(stackObj(obj));

        var next;
        while((next = stack.pop())) {
            var o = next.o;
            // 각 밸류의 값과 상관이 없는 값일 경우 result값에 넣어준다.
            if (next.str) {
                result += next.str;
            }
            // primitive value인 경우, 해당 값을 result값에 넣는다.
            else if (!o || typeof o != 'object') {
                if (o === undefined) o = null;
                result += convert(o);
            }
            // date인 경우, 해당 값의 JSON 매핑값을 result값에 넣는다.
            else if (o instanceof Date) {
                result += convert(o.toJSON());
            }
            // 나머진 아마도 다 Object..... 일거야...ㅠㅠㅠㅠㅠ아마도.....
            else {
                pushStackObjectValue(stack, o);
            }
        }

        return result;
    }
})();

// json parsing
var parseJSONString = function(v) {
    return (new Function('', 'return ' + v.trim()))();
}
