import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to Rest Controller API!' };
  }
}
