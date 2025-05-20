import { Entity, Column, OneToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { HelperEntity } from "./HelperEntity";
import { InstitutionUserEntity } from "./InstitutionUserEntity";

@Entity()
export class UserEntity extends BaseEntity {

  @Column({type: "boolean"})
  isFirstLogin!: boolean;
  // 카카오에서 제공하는 고유 사용자 ID
  @Column({ type: "varchar", length: 255, nullable: true })
  kakaoId!: string;

  // 사용자 이름 또는 닉네임
  @Column({ type: "varchar", length: 255, nullable: true })
  name!: string;

  // 이메일 (카카오에서 받을 수도 있고, 없을 수도 있음)
  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string;

  // 프로필 이미지 URL
  @Column({ type: "varchar", length: 255, nullable: true })
  profileImage!: string;

  @Column({ type: "enum", enum: ["helper", "institution"] })
  role!: "helper" | "institution";

  @Column({ type: "point", nullable: true })
  location?: string;

  @OneToOne(() => HelperEntity, helper => helper.user)
  helper?: HelperEntity;

  @OneToOne(() => InstitutionUserEntity, iu => iu.user)
  institutionUser?: InstitutionUserEntity;
}

//kakaoId: email만 가지고는 중복/누락 생기기에 추가
//profileImage: 프론트앤드에서 유저의 프로필 이미지가 있으면 프론트에서 편하다고 생각
//numllable: NOT NULL 제약 위반 방지 위해서 넣음
//! 뜻 : 나중에 값 넣어줄께
