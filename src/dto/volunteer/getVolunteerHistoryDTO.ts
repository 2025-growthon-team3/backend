// src/dto/volunteer/VolunteerHistoryDto.ts
import { Type } from "class-transformer";
import { IsDate, ValidateNested } from "class-validator";

class HelpeeSimpleDto {
  id!: number;
  name!: string;
  gender?: "male" | "female";
  age?: number;
  birthDate?: string;
  helpRequestDetail?: string;
  isMatched?: boolean | null;
  helpTime?: string | null;
  helpDetail?: string | null;
}

export class VolunteerHistoryDto {
  id!: number;

  @IsDate()
  @Type(() => Date)
  helpTime!: Date;

  @ValidateNested()
  @Type(() => HelpeeSimpleDto)
  helpee!: HelpeeSimpleDto;
}
