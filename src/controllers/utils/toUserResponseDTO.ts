import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UserEntity } from "../../entity/UserEntity";
import { UserResponseDto } from "../../dto/userResponseDTO";

export async function toUserResponseDto(
  user: UserEntity
): Promise<UserResponseDto> {
  const dto = plainToInstance(UserResponseDto, user);
  await validateOrReject(dto);
  return dto;
}
