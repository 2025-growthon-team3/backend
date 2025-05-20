// src/entity/InstitutionUser.ts
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import { InstitutionEntity } from "./InstitutionEntity";

@Entity("institution_users")
export class InstitutionUserEntity extends BaseEntity {
  @OneToOne(() => UserEntity, user => user.institutionUser)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => InstitutionEntity, wi => wi.institutionUsers)
  @JoinColumn({ name: "institution_id" })
  institution!: InstitutionEntity;

}