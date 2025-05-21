import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class InstitutionSimpleDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsNumber()
  @Type(() => Number)
  lat!: number;

  @IsNumber()
  @Type(() => Number)
  lng!: number;
}
