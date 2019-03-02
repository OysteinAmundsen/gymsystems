import {ApiModelProperty} from '@nestjs/swagger';

export class ErrorResponse {
  @ApiModelProperty({description: 'Error status code'})
  statusCode: number;

  @ApiModelProperty({description: 'Error description'})
  message: string;
}
