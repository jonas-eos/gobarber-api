import File from '../models/File';

class FileController {
  async store(__request, __response) {
    const { originalname: name, filename: path } = __request.file;

    const file = await File.create({
      name,
      path,
    });

    return __response.json(file);
  }
}

export default new FileController();
