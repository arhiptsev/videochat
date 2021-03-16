import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {
  constructor(
  ) { }

  @Get('/test')
  public test(): string {
    return 'test tt';
  }
}
