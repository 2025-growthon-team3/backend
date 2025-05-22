//클래스 검사
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UserEntity } from "../../entity/UserEntity";
import { UserResponseDto } from "../../dto/auth/userResponseDTO";

export async function toUserResponseDto(
  user: UserEntity
): Promise<UserResponseDto> {
  const dto = plainToInstance(UserResponseDto, user);
  await validateOrReject(dto);
  return dto;
}
