var fileExtension = function (file) {
    var extensionSplit = file.name.split('.');
    if (extensionSplit.length > 1) {
        return extensionSplit[extensionSplit.length - 1];
    }
    return 'none';
};
export default fileExtension;
