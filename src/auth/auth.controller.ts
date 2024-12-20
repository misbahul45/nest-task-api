import { BadRequestException, Body, Controller, HttpException, HttpStatus, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTypes } from 'src/types/auth.types';
import { AUTHRESPONSE, REQUEST, USER, WebResponse } from 'src/types/web.types';
import { LocalGuard } from './guards/local.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RefreshGuard } from './guards/refresh.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post('signup')
  async signup(@Body() body:AuthTypes.SIGNUP) : Promise<WebResponse<AuthTypes.RESPON_SIGNUP>> {
    try {
      const result=await this.authService.signup(body);

      return {
        data:result as AuthTypes.RESPON_SIGNUP,
        success:true,
        message:"User created successfully",
      }
    } catch (error) {
      throw new HttpException(
          {
              message: 'User not created',
              errors: [error.message],
          },
          HttpStatus.BAD_REQUEST,
      );
    }
  }


  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Request() req:REQUEST):Promise<WebResponse<AUTHRESPONSE>>{
    try {
      const { accessToken, refreshToken, ...user }=await this.authService.signinFunction(req.user)
      return{
        data:{
          user,
          accessToken,
          refreshToken
        },
        message:"Success login",
        success:true
      }
    } catch (error) {
      if(error) throw new BadRequestException("Invalid email or password");
    }
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Request() req:REQUEST):Promise<WebResponse<AUTHRESPONSE>>{
    try {
      const { accessToken, refreshToken, ...user  }=await this.authService.refreshToken(req.user)
      return{
        data:{
          user,
          accessToken,
          refreshToken
        },
        message:"Success refresh token",
        success:true
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message || "Invalid refresh token");
    }
  }

  @UseGuards(JwtGuard) 
  @Post('signout')
  async logout(@Request() req:REQUEST):Promise<WebResponse<null>>{
    try {
      await this.authService.signoutFunction(req.user.id)
      return{
        data:null,
        message:"Success logout",
        success:true
      }
    } catch (error) {
      throw new BadRequestException(error.message || "Invalid user id");
    }
  }
}
