// src/utils/institution/toInstitutionSimpleListDto.ts
import { InstitutionEntity } from "@/entity/InstitutionEntity";
import { InstitutionSelectDto } from "@/dto/institution/institutionSelectDTO";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

export async function toInstitutionSelectDto(
  institutions: InstitutionEntity[]
): Promise<InstitutionSelectDto[]> {
  const dtoList = plainToInstance(
    InstitutionSelectDto,
    institutions.map((inst) => ({
      id: inst.id,
      name: inst.name,
    }))
  );

  for (const dto of dtoList) {
    await validateOrReject(dto);
  }

  return dtoList;
}
