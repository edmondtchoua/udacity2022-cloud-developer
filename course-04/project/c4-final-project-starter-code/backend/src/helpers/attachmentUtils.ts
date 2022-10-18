import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

export async function getUploadUrl(todoId: string, bucketName: string) {
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: parseInt(urlExpiration)
    })
  }