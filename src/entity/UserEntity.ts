import { Entity, Column, OneToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { HelperEntity } from "./HelperEntity";
import { InstitutionUserEntity } from "./InstitutionUserEntity";

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ type: "boolean", default: true })
  isFirstLogin!: boolean;
  // 카카오에서 제공하는 고유 사용자 ID
  @Column({ type: "varchar", length: 255, nullable: true })
  kakaoId!: string;

  // 사용자 이름 또는 닉네임
  @Column({ type: "varchar", length: 255, nullable: true })
  name!: string;

  // 프로필 이미지 URL
  @Column({ type: "varchar", length: 255, nullable: true })
  profileImage!: string;

  @Column({ type: "enum", enum: ["helper", "institution"], nullable: true })
  role?: "helper" | "institution";

  // 위도와 경도 추가
  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @OneToOne(() => HelperEntity, (helper) => helper.user)
  helper?: HelperEntity;

  @OneToOne(() => InstitutionUserEntity, (iu) => iu.user)
  institutionUser?: InstitutionUserEntity;
}
