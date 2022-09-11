import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Observable, of, switchMap } from 'rxjs';
import { FeedPost } from 'src/feed/models/post.interface';
import { JwtGuard } from '../guards/jwt.guard';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from '../helpers/image-storage';
import { UserService } from '../services/user.service';
import { Express } from 'express';
import { User } from '../models/user.interface';
import { FriendRequest } from '../models/friend-request.entity';
import { FriendRequestStatus } from '../models/friend-request.interface';

// This is a hack to make Multer available in the Express namespace

type File = Express.Multer.File;

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('image')
  async findImage(@Request() req, @Res() res): Promise<any> {
    const userId = req.user.id;
    const { imageName } = await this.userService.findUserImageById(userId);

    return of(res.sendFile(imageName, { root: './images' }));
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  async findUserImageName(
    @Request() req,
    @Res() res,
  ): Promise<{ imageName: string }> {
    const userId = req.user.id;
    const { imageName } = await this.userService.findUserImageById(userId);

    return { imageName };
  }

  @Get('image/:filename')
  findImageByName(@Param('filename') fileName: string, @Res() res) {
    if (!fileName || ['null', '[null]'].includes(fileName)) {
      return;
    }

    return res.sendFile(fileName, { root: './images' });
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.findUser(userId);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(@UploadedFile() file: File, @Request() req): any {
    console.log({ file });

    const fileName = file?.filename;

    if (!fileName) {
      return of({ error: 'File must be a png, jpg/jpeg' });
    }

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullimageName = join(imagesFolderPath + '/' + fileName);

    return isFileExtensionSafe(fullimageName).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;

          return this.userService.updateUserImageById(userId, fileName);
        }

        removeFile(fullimageName);
        return of({ error: "File content doesn't match extention" });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/send/:receiverId')
  sendConnectionRequest(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Promise<FriendRequest | { error: string }> {
    const receiverId = parseInt(receiverStringId);
    return this.userService.sendFriendRequest(receiverId, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Promise<FriendRequestStatus> {
    const receiverId = parseInt(receiverStringId);
    return this.userService.getFriendRequestStatus(receiverId, req.user);
  }

  @UseGuards(JwtGuard)
  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') receiverStringId: string,
    @Body() statusResponse: FriendRequestStatus,
  ): Promise<FriendRequestStatus | { error: string }> {
    const friendRequestId = parseInt(receiverStringId);

    return this.userService.respondToFriendRequest(
      statusResponse.status,
      friendRequestId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/me/received-requests')
  getFriendRequestsFromRecepients(
    @Request() req,
  ): Promise<FriendRequestStatus[] | { error: string }> {
    return this.userService.getFriendRequestsFromRecepients(req.user);
  }
}
