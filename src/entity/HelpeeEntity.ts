// src/entity/Helpee.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { VolunteerApplicationEntity } from "./VounteerApplicationEntity";
import { VolunteerHistoryEntity } from "./VolunteerHistoryEntity";
import { InstitutionEntity } from "./InstitutionEntity";

@Entity("helpees")
export class HelpeeEntity extends BaseEntity {
  @Column({ type: "varchar", length: 50 })
  name!: string;
  
  @Column({ type: "enum", enum: ["male", "female"], nullable: true })
  gender?: "male" | "female";

  @Column({ type: "int", nullable: true })
  age?: number;

  @Column({ type: "date", nullable: true })
  birthDate?: string;

  @Column({ type: "text", nullable: true })
  helpRequestDetail?: string;

  @Column({ type: "boolean", nullable: true })
  isMatched?: boolean;

  @ManyToOne(() => InstitutionEntity, (inst) => inst.helpees)
  @JoinColumn({ name: "institution_id" })
  institution!: InstitutionEntity;   

  @Column({ type: "datetime", nullable: true })
  helpTime?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  helpDetail?: string;

  @OneToMany(() => VolunteerApplicationEntity, (va) => va.helpee)
  volunteerApplications!: VolunteerApplicationEntity[];

  @OneToMany(() => VolunteerHistoryEntity, (vh) => vh.helpee)
  volunteerHistories!: VolunteerHistoryEntity[];
}