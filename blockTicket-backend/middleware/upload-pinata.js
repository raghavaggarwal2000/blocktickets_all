const CustomError = require("../errors");
const pinataSDK = require("@pinata/sdk");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const uploadToPinata = async (req, res) => {
  const pinata = pinataSDK(
    "6aff73d61f9a9377963c",
    "5fe4bd174a6d80b442b67116f479e40aa6e53ec7a62ff9c8e6f3ff719d7363bb"
  );
  let data = req.body;
  let { pinataUpload } = req.body;
  const file = req.file;
  try {
    if (pinataUpload) {
      const readableStreamForFile = fs.createReadStream(file.path);
      const filePinOptions = {
        pinataMetadata: {
          name: `${data.name}.img`,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };
      let filePinResult = await pinata.pinFileToIPFS(
        readableStreamForFile,
        filePinOptions
      );
      data.image = `https://unicus.mypinata.cloud/ipfs/${filePinResult.IpfsHash}`;
      data.attributes = JSON.parse(data.attributes || "{}");

      const dataPinOptions = {
        pinataMetadata: {
          name: `${data.name}.json`,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };
      let dataPinResult = await pinata.pinJSONToIPFS(data, dataPinOptions);
      // Upload to AWS S3
      AWS.config.update({
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        region: process.env.S3_AWS_REGION,
      });
      const s3 = new AWS.S3({});

      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      const file_ =
        process.env.S3_FOLDER_NAME +
        `/${file.fieldname}/` +
        Date.now() +
        "-" +
        uuid() +
        "." +
        extension;
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${file_}`,
        Body: fs.createReadStream(file.path),
      };
      let s3UploadResult = await s3.upload(params).promise();
      // console.log("s3UploadResult: ", s3UploadResult);

      fs.unlinkSync(file.path);

      return res.send({
        pinata_hash: dataPinResult.IpfsHash,
        s3_upload: s3UploadResult["Location"],
      });
    } else {
      // Upload to AWS S3
      AWS.config.update({
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        region: process.env.S3_AWS_REGION,
      });
      const s3 = new AWS.S3({});

      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      const file_ =
        process.env.S3_FOLDER_NAME +
        `/${file.fieldname}/` +
        Date.now() +
        "-" +
        uuid() +
        "." +
        extension;
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${file_}`,
        Body: fs.createReadStream(file.path),
      };
      let s3UploadResult = await s3.upload(params).promise();
      // console.log("s3UploadResult: ", s3UploadResult);

      fs.unlinkSync(file.path);

      return res.send({
        pinata_hash: null,
        s3_upload: s3UploadResult["Location"],
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "An error occurred while uploading to Pinata" });
  }
};

module.exports = { uploadToPinata };
