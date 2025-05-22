// src/dto/institution/InstitutionSimpleListDto.ts
import { IsNumber, IsString } from "class-validator";

export class InstitutionSelectDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;
}
