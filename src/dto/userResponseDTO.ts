import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";

export class UserResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsEnum(["helper", "institution"])
  @IsOptional()
  role?: "helper" | "institution" | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number | null;

  @IsBoolean()
  isFirstLogin?: boolean;
}
