var cloudinary = require("cloudinary").v2;
const { compress } = require('compress-images/promise');
const CustomError = require("../errors");
var fs = require('fs');
cloudinary.config({
  cloud_name: "dhmglymaz",
  api_key: "519646171183911",
  api_secret: "wztja-vWQOkLiqmHesfIfQSLZrE",
  secure: true,
});

const Compress = async (userId, fileExtension) => {
  try {
    const imagePath = [];
    INPUT_path_to_your_images = `picture/img/${fileExtension}`;
    OUTPUT_path = "build/img/";
    const result = await compress({
        source:INPUT_path_to_your_images,
        destination: OUTPUT_path,
        enginesSetup: {
                jpg: { engine: 'mozjpeg', command: ['-quality', '60']},
                png: { engine: 'pngquant', command: ['--quality=20-50', '-o']},
            }
    });
    console.log("Rresult" ,result)
    const {statistics,errors} = result;
    if(statistics){
        const image1 = await cloudinary.uploader.upload(
            `build/img/${fileExtension}`,
            { tags: "basic_sample" },
          );
          if(image1){
              imagePath.push(image1)
          }
          const image2 = await cloudinary.uploader.upload(
            `picture/img/${fileExtension}`,
            { tags: "basic_sample" }
          );
          if(image2){
            imagePath.push(image2)
        }
    }
    fs.unlinkSync(`picture/img/${fileExtension}`);
    fs.unlinkSync(result?.statistics[0].path_out_new);
    // fs.unlinkSync()
    return imagePath;
  } catch (err) {
    throw new CustomError.BadRequestError(err.message);
  }
};

module.exports = Compress;
