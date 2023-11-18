const fs = require("fs");
const CustomError = require("../errors")
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3 } =  require("@aws-sdk/client-s3");
// const S3 = require("aws-sdk/clients/s3")

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


const s3 = new S3({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
    signatureVersion: 'v4',
});

// V3 version to upload images to AWS SDK
async function uploadFile(file){
    try{
        const fileStream = fs.createReadStream(file.path);
        const parallelUploads3 = new Upload({
            client: s3,
            params: {
                Bucket: bucketName,
                Body: fileStream,
                Key: file.filename
            },
          });
      
          parallelUploads3.on("httpUploadProgress", (progress) => {
            console.log("progress"+ progress);
          });


        const data =  await parallelUploads3.done();
        fs.unlinkSync(file.path);

        return data;
    }
    catch(err){
        console.log(err);
        throw new CustomError.BadRequestError(err.message);
    }
}

// TO call this method deleteFile("https://blocktickets-io.s3.ap-south-1.amazonaws.com/image1689229801280.jpeg");
// to delete object from AWS 
const deleteFile = async (url) =>{
    try{
        const urlSplit = url.split("/");
        const fileName = urlSplit[urlSplit.length-1];
        console.log(fileName)
        const data = await s3.deleteObject({
            Bucket: bucketName, 
            Key: fileName 
        })
        return data;
    }
    catch(err){
        throw new CustomError.BadRequestError(err.message);
    }
};


module.exports = {
    uploadFile,
    deleteFile
}


