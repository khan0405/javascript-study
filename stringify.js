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
        return convert(obj);
    };

    var convertObject = function(obj) {
        var result = "{";

        var keys = Object.keys(obj);
        keys.forEach(function (key, i) {
            if (i > 0) result += ",";
            result += '"' + key + '":' + jsonString(obj[key]);
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
        return '"' + obj + '"';
    };
    var convertDefault = function (obj) {
        return obj;
    };

    return function(obj) {
        return jsonString(obj);
    };
})();

// 비재귀 함수.
// 난 드디어 해냈다........
// 이건 진짜 인간승리다.
// 나를 정말 칭찬해 주고싶다. 엄마 아빠 나 해냈어요 얏호
// 내일은 칭찬의 의미로 나를 위해 치킨을 사겠다.
var toJSONStringNonRecursive = (function(window, JSON) {
  var STR_VALUE = {
    arrPrefix: {str: '['},
    arrSuffix: {str: ']'},
    objPrefix: {str: '{'},
    objSuffix: {str: '}'},
    delimiter: {str: ','}
  };
  var jsonString = function(obj) {
    var stack = [], // 콜스택 대용. 여기에서 prefix/suffix/delimiter 및 각 object/array/date/primitive type 정보들을 넣어준다.
        result = []; // 최종으로 string으로 변환할 것들을 여기에 넣어준다.

    // 최초로 object 정보를 넣어준다.
    stack.push(stackObj(obj));

    var next;
    while((next = stack.pop())) {
      var o = next.o;
      // 각 밸류의 값과 상관이 없는 값일 경우 result값에 넣어준다.
      if (next.str) {
        result.push(next.str);
      }
      // primitive value인 경우, 해당 값을 result값에 넣는다.
      else if (typeof o != 'object') {
        if (o === undefined) o = null;
        result.push(decoration(o));
      }
      // null 값인 경우;;;
      else if (o == null) {
        result.push(decoration(null));
      }
      // date인 경우, 해당 값의 JSON 매핑값을 result값에 넣는다.
      else if (o instanceof Date) {
        result.push(decoration(o.toJSON()));
      }
      // Array인 경우 해당 값들을 stack에 먼저 넣는다.
      else if (o instanceof Array) {
        // suffix 값을 먼저 넣는다.
        stack.push(STR_VALUE.arrSuffix);
        // stack의 특성상 선입선출이 되기 때문에 순서가 바뀌지 않도록 거꾸로 뒤집어준다.
        o.reverse();
        o.forEach(function(val, i) {
          if (i > 0) stack.push(STR_VALUE.delimiter);
          stack.push(stackObj(val));
        });
        stack.push(STR_VALUE.arrPrefix);
      }
      // 나머진 아마도 다 Object..... 일거야...ㅠㅠㅠㅠㅠ아마도.....
      else {
        stack.push(STR_VALUE.objSuffix);
        var keys = Object.keys(o);
        // stack의 특성상 선입선출이 되기 때문에 순서가 바뀌지 않도록 거꾸로 뒤집어준다.
        keys.reverse();
        keys.forEach(function(key, i) {
          if (i > 0) stack.push(STR_VALUE.delimiter);
          stack.push(stackObj(o[key]));
          stack.push({str: '"' + key + '":'});
        });
        stack.push(STR_VALUE.objPrefix);
      }
    }

    return toStringValue(result);
  }

  // 변환한 json 데이터들을 string으로 변환하여 내보낸다.
  var toStringValue = function(stack) {
    var result = '';
    stack.forEach(function(str) {
      result += str;
    });
    return result;
  }

  // object 정보를 담고있는 객체를 반환한다.
  var stackObj = function(obj) {
    return {o: obj};
  }

  // 기존 primitive type의 값을 반환한다.
  var decoration = function(val) {
    return 'string' == typeof val ? '"' + val + '"' : val;
  }

  return function(obj) {
    return jsonString(obj);
  }
})();
