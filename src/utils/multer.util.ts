import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { nanoid } from 'nanoid';

const ONE_KB = 1024;
const IMAGE_MAX_SIZE = 5;

const upload = (
  folderName: string,
  storeToDisk = true,
  fileFilter: undefined | ((req: Request, file: Express.Multer.File, callback: FileFilterCallback) => void) = undefined,
) => {
  return multer({
    storage: storeToDisk
      ? multer.diskStorage({
          destination(_req, _file, callback) {
            const filePath = './uploads/' + folderName;
            callback(null, filePath);
          },
          filename: function (_req, file, cb) {
            const extension = file.mimetype.split('/')[1];
            const fileName = nanoid() + '.' + extension;
            cb(null, fileName);
          },
        })
      : undefined,

    limits: {
      fileSize: ONE_KB * ONE_KB * IMAGE_MAX_SIZE, // in MB
    },
    fileFilter: fileFilter,
  });
};

export default upload;
