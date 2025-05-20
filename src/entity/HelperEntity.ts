// src/entity/Helper.ts
import { Entity, Column, OneToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import { VolunteerApplicationEntity } from "./VounteerApplicationEntity";
import { VolunteerHistoryEntity } from "./VolunteerHistoryEntity";

@Entity("helpers")
export class HelperEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.helper)
  user!: UserEntity;

  @Column({ type: "varchar", length: 50, nullable: true })
  residentNumber?: string;

  @Column({ type: "text", nullable: true })
  resumeFileUrl?: string;

  @Column({ type: "boolean", nullable: true })
  isVerified?: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @OneToMany(() => VolunteerApplicationEntity, (va) => va.helper)
  volunteerApplications!: VolunteerApplicationEntity[];

  @OneToMany(() => VolunteerHistoryEntity, (vh) => vh.helper)
  volunteerHistories!: VolunteerHistoryEntity[];
}
