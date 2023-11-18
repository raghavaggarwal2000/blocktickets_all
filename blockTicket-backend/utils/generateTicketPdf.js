const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
//const data = require('./../data.json');
//const ticketID =121222;
const pdf = require('html-pdf');
const AWS = require('aws-sdk');
const AWSCredentials = {
  accessKey: 'AKIA5BOLECF2PAHOXBQT',
  secret: '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',
  bucketName: 'blocktickets'
};

const s3 = new AWS.S3({
  accessKeyId: AWSCredentials.accessKey,
  secretAccessKey: AWSCredentials.secret
});

const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'invoice-html', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf8');
    //console.log(html)
    return hbs.compile(html)(data);
};
const generateTicketPdf = async (ticketID,data) => {
    try {
        const content = await compile('index', data);
      
        const options = {
            format: 'A2'
            
          }
        pdf.create(content, options).toFile(`invoice/${ticketID}.pdf`, (err, res) => {
            if (err) {
              console.log(err);
            }
         //  const url =  uploadToS3(`invoice/${ticketID}.pdf`);
          const fileName= `invoice/${ticketID}.pdf`;
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
                  console.log(data.Location);
                  return data.Location;
              });
          });

      /*  const browser = await puppeteer.launch();

        const page = await browser.newPage();

        //console.log(data)

        const content = await compile('index', data);

       // console.log(content)

        await page.setContent(content);

        await page.pdf({
            path: `${ticketID}.pdf`,
            format: 'A3',
            printBackground: true
        })

        console.log("done creating pdf");

        await browser.close();

        process.exit();*/
        
    } catch (e) {
        console.log(e);
    }

};
//const url = generatePdf(ticketID,data);
module.exports = generateTicketPdf;

