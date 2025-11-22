import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as AWS from 'aws-sdk';

@Injectable()
export class FileUploadService {
  // private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    // Initialize AWS S3
    // this.s3 = new AWS.S3({
    //   accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    //   secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    //   region: this.configService.get('AWS_REGION'),
    // });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    // Mock implementation - in production, upload to S3
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    
    // const params = {
    //   Bucket: this.configService.get('AWS_S3_BUCKET'),
    //   Key: fileName,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: 'public-read',
    // };

    // const result = await this.s3.upload(params).promise();
    // return result.Location;

    // Mock URL for development
    return `https://cdn.schoolos.com/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Extract key from URL and delete from S3
    // const key = fileUrl.split('.com/')[1];
    // await this.s3.deleteObject({
    //   Bucket: this.configService.get('AWS_S3_BUCKET'),
    //   Key: key,
    // }).promise();
  }
}
