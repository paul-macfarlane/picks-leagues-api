import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username for login',
  })
  @IsString()
  @Length(3, 100)
  username: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'The password for login',
  })
  @IsString()
  @Length(8)
  password: string;
}
