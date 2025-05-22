import { Entity, Column, OneToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import { VolunteerApplicationEntity } from "./VounteerApplicationEntity";
import { VolunteerHistoryEntity } from "./VolunteerHistoryEntity";
import { JoinColumn } from "typeorm";

@Entity("helpers")
export class HelperEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.helper)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ type: "varchar", length: 50, nullable: true })
  residentNumber?: string;

  @Column({ type: "text", nullable: true })
  resumeFileUrl?: string;

  @Column({ type: "boolean", nullable: true })
  isVerified?: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @OneToMany(() => VolunteerApplicationEntity, (va) => va.helper)
  volunteerApplications!: VolunteerApplicationEntity[];

  @OneToMany(() => VolunteerHistoryEntity, (vh) => vh.helper)
  volunteerHistories!: VolunteerHistoryEntity[];
}
