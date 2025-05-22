import { Entity, OneToOne, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import { InstitutionEntity } from "./InstitutionEntity";
import { JoinColumn } from "typeorm";

@Entity("institution_users")
export class InstitutionUserEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.institutionUser)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => InstitutionEntity, (inst) => inst.institutionUsers)
  institution!: InstitutionEntity;
}
