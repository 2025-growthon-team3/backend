// src/entity/VolunteerApplication.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { HelperEntity } from "./HelperEntity";
import { HelpeeEntity } from "./HelpeeEntity";

@Entity("volunteer_applications")
export class VolunteerApplicationEntity extends BaseEntity {
  @ManyToOne(() => HelperEntity, helper => helper.volunteerApplications)
  @JoinColumn({ name: "helper_id" })
  helper!: HelperEntity;

  @ManyToOne(() => HelpeeEntity, helpee => helpee.volunteerApplications)
  @JoinColumn({ name: "helpee_id" })
  helpee!: HelpeeEntity;

  @Column({ type: "enum", enum: ["requested", "approved", "rejected"] })
  status!: "requested" | "approved" | "rejected";
}