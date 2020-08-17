import { S3 } from "aws-sdk";

const { IMAGES_BUCKET_NAME } = process.env;

var s3 = new S3();

export const getSignedUrls = async (key) => {
  const params = {
    Bucket: IMAGES_BUCKET_NAME,
    Key: key,
    Expires: 900,
    ContentType: 'image/png'
  };
  console.log(`Getting signed url for`, params);
  const putUrl = await s3.getSignedUrlPromise('putObject', params);
  const url = `https://${IMAGES_BUCKET_NAME}.s3.amazonaws.com/${key}`;

  return { url, putUrl };
}