import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export const CreateNotificationLogsDtoKeys: (keyof CreateNotificationLogsDto)[] = ['title', 'subTitle', 'imageUrl', 'body', 'data', 'topicId', 'userReceiveIds']

export class SendNotiDto {
  @ApiProperty({
    example: 'Notification Title',
    description: 'The title of the notification',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
    title: string;

  @ApiProperty({
    example: 'Notification Subtitle',
    description: 'The subtitle of the notification',
    required: false,
  })
  @IsOptional()
  @IsString()
    subTitle?: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The image URL of the notification',
    required: false,
  })
  @IsOptional()
  @IsString()
    imageUrl?: string;

  @ApiProperty({
    example: 'This is the body of the notification.',
    description: 'The body of the notification',
    required: false,
  })
  @IsOptional()
  @IsString()
    body?: string;

  @ApiProperty({
    example: '{"key":"value"}',
    description: 'The data of the notification in JSON format',
    required: false,
  })
  @IsOptional()
  @IsString()
    data?: string;

  // notification with
  // api just use topicId or userIReceived,s not both. Logic create will do on BE
  @ApiProperty({
    example: '',
    description: 'the id of application is the topic id',
    required: false,
  })
  @IsOptional()
  @IsString()
    topicId?: string;

  @ApiProperty({
    example: '123',
    description: 'the id of user will receive noti - each other',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || typeof value != 'string') return null
    return value?.split(',').map((el) => Number(el.trim()))
  })
  @IsArray()
    userReceiveIds?: number[];
}

export class CreateNotificationLogsDto extends SendNotiDto {
}