import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.enum';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getUser(@Query('id') id: string) {
    return this.authService.getUser(id);
  }

  @Post('register')
  register(@Body() user: User): Observable<User> {
    return this.authService.registerAccount(user);
  }

  @Post('login')
  login(@Body() user: User): Observable<{ token: string }> {
    console.log({ user });

    return this.authService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }
}
