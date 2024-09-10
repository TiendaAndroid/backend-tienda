import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('reset-password')
export class ResetPassword {
     @PrimaryGeneratedColumn('uuid')
     id: string;
   
     @Column('text', {
       unique: true,
     })
     email: string;
  
     @Column('text')
     token: string;

     @Column({ type: 'timestamptz', nullable: true })
     dateValid: Date;
}