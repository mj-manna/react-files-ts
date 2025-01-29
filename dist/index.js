var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useCallback, useRef, useState } from 'react';
import fileExtension from './utils/fileExtension';
import fileSizeReadable from './utils/fileSizeReadable';
import fileTypeAcceptable from './utils/fileTypeAcceptable';
var Files = function (_a) {
    var _b = _a.accepts, accepts = _b === void 0 ? null : _b, children = _a.children, className = _a.className, _c = _a.clickable, clickable = _c === void 0 ? true : _c, dragActiveClassName = _a.dragActiveClassName, _d = _a.inputProps, inputProps = _d === void 0 ? {} : _d, _e = _a.multiple, multiple = _e === void 0 ? true : _e, _f = _a.maxFiles, maxFiles = _f === void 0 ? Infinity : _f, _g = _a.maxFileSize, maxFileSize = _g === void 0 ? Infinity : _g, _h = _a.minFileSize, minFileSize = _h === void 0 ? 0 : _h, _j = _a.name, name = _j === void 0 ? 'file' : _j, _k = _a.onChange, onChange = _k === void 0 ? function (files) { return console.log(files); } : _k, onDragEnter = _a.onDragEnter, onDragLeave = _a.onDragLeave, _l = _a.onError, onError = _l === void 0 ? function (err) { return console.log("error code ".concat(err.code, ": ").concat(err.message)); } : _l, style = _a.style;
    var idCounter = useRef(1);
    var dropzoneElement = useRef(null);
    var inputElement = useRef(null);
    var _m = useState(false), isDragging = _m[0], setDragging = _m[1];
    var handleError = function (error, file) {
        onError(error, file);
    };
    var handleDragOver = useCallback(function (event) {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    var handleDragEnter = function (event) {
        var el = dropzoneElement.current;
        if (dragActiveClassName && el && !el.className.includes(dragActiveClassName)) {
            el.className = "".concat(el.className, " ").concat(dragActiveClassName);
        }
        if (typeof children === 'function') {
            setDragging(true);
        }
        if (onDragEnter) {
            onDragEnter(event);
        }
    };
    var handleDragLeave = function (event) {
        var el = dropzoneElement.current;
        if (dragActiveClassName && el) {
            el.className = el.className.replace(" ".concat(dragActiveClassName), '');
        }
        if (typeof children === 'function') {
            setDragging(false);
        }
        if (onDragLeave) {
            onDragLeave(event);
        }
    };
    var openFileChooser = function () {
        if (inputElement.current) {
            inputElement.current.value = '';
            inputElement.current.click();
        }
    };
    var handleDrop = function (event) {
        event.preventDefault();
        handleDragLeave(event);
        var filesAdded = event instanceof DragEvent && event.dataTransfer
            ? event.dataTransfer.files
            : event.target.files;
        if (!filesAdded)
            return;
        if (!multiple && filesAdded.length > 1) {
            filesAdded = [filesAdded[0]];
        }
        var fileResults = [];
        if (filesAdded) {
            for (var i = 0; i < filesAdded.length || 0; i += 1) {
                var file = filesAdded[i];
                file.id = "files-".concat(idCounter.current);
                idCounter.current += 1;
                file.extension = fileExtension(file);
                file.sizeReadable = fileSizeReadable(file.size);
                file.preview = file.type && file.type.split('/')[0] === 'image'
                    ? { type: 'image', url: URL.createObjectURL(file) }
                    : { type: 'file' };
                if (fileResults.length >= maxFiles) {
                    handleError({ code: 4, message: 'maximum file count reached' }, file);
                    break;
                }
                if (file.size > maxFileSize) {
                    handleError({ code: 2, message: "".concat(file.name, " is too large") }, file);
                    break;
                }
                if (file.size < minFileSize) {
                    handleError({ code: 3, message: "".concat(file.name, " is too small") }, file);
                    break;
                }
                if (!fileTypeAcceptable(accepts, file)) {
                    handleError({ code: 1, message: "".concat(file.name, " is not a valid file type") }, file);
                    break;
                }
                fileResults.push(file);
            }
        }
        onChange(fileResults);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("input", __assign({ accept: accepts ? accepts.join(',') : '', style: { display: 'none' } }, inputProps, { ref: inputElement, type: "file", multiple: multiple, name: name, onChange: handleDrop })),
        React.createElement("div", { ref: dropzoneElement, className: className, onClick: clickable ? openFileChooser : undefined, onDrop: handleDrop, onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, style: style }, typeof children === 'function' ? children(isDragging) : children)));
};
export default Files;
