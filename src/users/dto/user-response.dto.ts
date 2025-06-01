import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date and time when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date and time when the user was last updated',
  })
  updatedAt: Date;
}
