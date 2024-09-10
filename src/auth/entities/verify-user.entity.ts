import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('verify-user')
export class VerifyUser {
     @PrimaryGeneratedColumn('uuid')
     id: string;
   
     @Column('text', {
       unique: true,
     })
     email: string;
  
     @Column('text')
     name: string;
   
     @Column('text')
     lastName: string;
   
     @Column('text')
     token: string;

     @Column('text')
     password: string;
   }
   