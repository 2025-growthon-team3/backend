// src/controllers/utils/toVolunteerWithoutTimestampsDto.ts
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { VolunteerApplicationEntity } from "@/entity/VounteerApplicationEntity";
import { GetApplicationByHelperDTO } from "@/dto/volunteer/getApplicationByHelperDTO";

export async function toGetApplicationByHelperDto(
  entity: VolunteerApplicationEntity
): Promise<GetApplicationByHelperDTO> {
  const dto = plainToInstance(GetApplicationByHelperDTO, {
    status: entity.status,
    helpee: entity.helpee,
  });

  await validateOrReject(dto);
  return dto;
}
