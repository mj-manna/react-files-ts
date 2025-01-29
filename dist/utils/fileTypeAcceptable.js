// eslint-disable-next-line
var mimeTypeRegexp = /^(application|audio|example|image|message|model|multipart|text|video|\*)\/[a-z0-9\.\+\*-]+$/;
var extRegexp = /\.[a-zA-Z0-9]*$/;
var fileTypeAcceptable = function (accepts, file) {
    if (!accepts) {
        return true;
    }
    return accepts.some(function (accept) {
        if (file.type && accept.match(mimeTypeRegexp)) {
            var _a = file.type.split('/'), typeLeft = _a[0], typeRight = _a[1];
            var _b = accept.split('/'), acceptLeft = _b[0], acceptRight = _b[1];
            if (acceptLeft && acceptRight) {
                if (acceptLeft === '*' && acceptRight === '*') {
                    return true;
                }
                if (acceptLeft === typeLeft && acceptRight === '*') {
                    return true;
                }
                if (acceptLeft === typeLeft && acceptRight === typeRight) {
                    return true;
                }
            }
        }
        else if (file.extension && accept.match(extRegexp)) {
            var ext = accept.substr(1);
            return file.extension.toLowerCase() === ext.toLowerCase();
        }
        return false;
    });
};
export default fileTypeAcceptable;
