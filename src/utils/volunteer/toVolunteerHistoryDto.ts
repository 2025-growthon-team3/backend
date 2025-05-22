// src/utils/toVolunteerHistoryDto.ts
import { plainToInstance } from "class-transformer";
import { VolunteerHistoryEntity } from "@/entity/VolunteerHistoryEntity";
import { VolunteerHistoryDto } from "@/dto/volunteer/getVolunteerHistoryDTO";

export function toVolunteerHistoryDto(
  entity: VolunteerHistoryEntity
): VolunteerHistoryDto {
  return plainToInstance(VolunteerHistoryDto, {
    id: entity.id,
    helpTime: entity.helpTime,
    helpee: {
      id: entity.helpee.id,
      name: entity.helpee.name,
      gender: entity.helpee.gender,
      age: entity.helpee.age,
      birthDate: entity.helpee.birthDate,
      helpRequestDetail: entity.helpee.helpRequestDetail,
      isMatched: entity.helpee.isMatched,
      helpTime: entity.helpee.helpTime,
      helpDetail: entity.helpee.helpDetail,
    },
  });
}
