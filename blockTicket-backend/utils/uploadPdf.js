const AWS = require('aws-sdk');
const fs = require('fs');

const AWSCredentials = {
    accessKey: 'AKIA5BOLECF2PAHOXBQT',
    secret: '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',
    bucketName: 'blocktickets'
};

const s3 = new AWS.S3({
    accessKeyId: AWSCredentials.accessKey,
    secretAccessKey: AWSCredentials.secret
});

const uploadToS3 = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: AWSCredentials.bucketName,
        Key: fileName,
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadToS3("output.pdf"); // file to upload