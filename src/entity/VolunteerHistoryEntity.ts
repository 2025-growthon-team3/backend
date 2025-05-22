// src/entity/VolunteerHistory.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { HelperEntity } from "./HelperEntity";
import { HelpeeEntity } from "./HelpeeEntity";

@Entity("volunteer_histories")
export class VolunteerHistoryEntity extends BaseEntity {
  @ManyToOne(() => HelperEntity, helper => helper.volunteerHistories)
  @JoinColumn({ name: "helper_id" })
  helper!: HelperEntity;

  @ManyToOne(() => HelpeeEntity, helpee => helpee.volunteerHistories)
  @JoinColumn({ name: "helpee_id" })
  helpee!: HelpeeEntity;

  @Column({ type: "date" })
  helpTime!: Date;
}