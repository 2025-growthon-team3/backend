// src/dto/volunteer/VolunteerWithoutTimestampsDto.ts
import { IsEnum, IsObject } from "class-validator";
import { HelpeeEntity } from "@/entity/HelpeeEntity";

export class GetApplicationByHelperDTO {
  @IsEnum(["requested", "approved", "rejected"])
  status!: "requested" | "approved" | "rejected";

  @IsObject()
  helpee!: HelpeeEntity;

}
