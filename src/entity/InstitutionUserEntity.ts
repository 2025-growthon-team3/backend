import { Entity, OneToOne, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import { InstitutionEntity } from "./InstitutionEntity";

@Entity("institution_users")
export class InstitutionUserEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.institutionUser)
  user!: UserEntity;

  @ManyToOne(() => InstitutionEntity, (inst) => inst.institutionUsers)
  institution!: InstitutionEntity;
}
