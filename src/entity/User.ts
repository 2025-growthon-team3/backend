import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar", length: 255 })
  name: string | undefined;

  @Column({ type: "varchar", length: 255 })
  email: string | undefined;
}
