var formidable = require("formidable");
const fs = require('fs');
const path = require('path')
const stringRandom = require('string-random')
module.exports = function uploadFile(uploadFolder) {
    return function (req, res, next) {
        try {
            if (!req || !req.app || !req.app.settings) throw new Error('Parameter req should be a Express request object');
            uploadFolder = uploadFolder || process.cwd() + '/uploadfiles';
            var form = new formidable.IncomingForm({
                multiples: true
            });
            form.parse(req, function (err, fields, files) {
                if (err) throw new Error('Some error appear in the function form.parse');
                //no file upload
                if (!files || !files.file) next();
                if (files.file.length > 1) {
                    for (const file of files.file) {
                        fileParser(file);
                    }
                } else {
                    fileParser(files.file)
                }
                next();
            });
        } catch (err) {
            //pass error to next middleware
            next(err);
        }
    }

    function fileParser(file) {
        const fileMetaData = Object.create(null);
        //get the file mata data
        fileMetaData.fileName = file.name;
        fileMetaData.tempPath = file.path;
        fileMetaData.fileSize = file.size;

        //the target PATH from user to save files , default value is `${process.cwd()}+"/uploadfiles"`
        //create the folder
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder);
        }
        let targetPath = path.join(uploadFolder, fileMetaData.fileName);
        //Check for duplicate file names
        while (fs.existsSync(targetPath)) {
            //the file path exited,create a hash file name
            const randomStr = stringRandom(8, {
                number: false
            })
            const fileCommonName = fileMetaData.fileName.split('.')[0];
            const fileExtendName = fileMetaData.fileName.split('.')[1];
            targetPath = path.join(uploadFolder, (fileCommonName + "-" + randomStr + "." + fileExtendName));
        }
        try {
            fs.renameSync(fileMetaData.tempPath, targetPath)
        } catch (err) {
            throw new Error('Some error appear in the function fs.renameSync')
        }
    }
}