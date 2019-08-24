import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  /**
   * Definition how multer will storage our image files.
   * In this case, multer will save file using diskStorage method.
   * This method will save files on ../../tmp/uploads folder set on destionation
   * resolve.
   */
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /**
     * Inside filename statement, we can define how our
     * imagem name will be formatted
     *
     * @param __request (all request informtion)
     * @param __file (all file information, like, size, extensions, etc.)
     * @param __callback (final result)
     */
    filename: (__request, __file, __callback) => {
      // first we call randomBytes to generate a 16 bytes name.
      crypto.randomBytes(16, (__error, __response) => {
        if (__error) return __callback(__error);
        /**
         * As return, we get the callback and work on it
         * As null, we means that we do not want a error
         * Then as a response from randomBytes, we convert the hex to string
         * and concat the extname of the file, the final result will be i.e.:
         * @return a file with random hex name + extname 9sdf89asd98f8d.png
         */
        return __callback(
          null,
          __response.toString('hex') + extname(__file.originalname)
        );
      });
    },
  }),
};
