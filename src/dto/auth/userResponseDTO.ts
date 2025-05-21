//반환할객체 정의
import {
  IsString, //스트링이여한다한
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer"; //tye w제이슨의 스

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
