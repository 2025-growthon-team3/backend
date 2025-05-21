import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { InstitutionSimpleDto } from "@/dto/institution/institutionLocationDTO";

export async function toInstitutionLocationDto(
  institution: InstitutionEntity
): Promise<InstitutionSimpleDto> {
  const dto = plainToInstance(InstitutionSimpleDto, {
    id: institution.id,
    name: institution.name,
    address: institution.address,
    lat: institution.latitude,
    lng: institution.longitude,
  });

  await validateOrReject(dto);
  return dto;
}
