// src/entity/WelfareInstitution.ts
import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { HelpeeEntity } from "./HelpeeEntity";
import { InstitutionUserEntity } from "./InstitutionUserEntity";

@Entity("welfare_institutions")
export class InstitutionEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  institutionCode!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber?: string;

  // 위도와 경도 추가
  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @OneToMany(() => HelpeeEntity, helpee => helpee.institution)
  helpees!: HelpeeEntity[];

  @OneToMany(() => InstitutionUserEntity, iu => iu.institution)
  institutionUsers!: InstitutionUserEntity[];
}
