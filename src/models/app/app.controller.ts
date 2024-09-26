import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiTags('Status')
export class AppController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'Status' })
  create() {
    return {statusCode: 200, message: 'OK'};
  }
}
