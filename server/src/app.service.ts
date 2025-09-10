import { Injectable } from '@nestjs/common';
import { DirectusService } from './directus/directus.service';

@Injectable()
export class AppService {
  constructor(private readonly directusService: DirectusService) {}
   getHello() {
    this.directusService.getRoles().then(roles => {
      // console.log(roles);
    });
   
    return 'Hello World!';
  }
}
