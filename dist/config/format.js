"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsFormat = void 0;
function errorsFormat(errors) {
    var errorFormat = {};
    for (var index = 0; index < errors.length; index++) {
        errorFormat[errors[index].param] = errors[index].msg;
    }
    return errorFormat;
}
exports.errorsFormat = errorsFormat;
