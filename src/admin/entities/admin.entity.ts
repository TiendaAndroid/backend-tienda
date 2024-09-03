import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin')
export class Admin {
     @PrimaryGeneratedColumn()
     id: string;

     @Column('text')
     name: string;

     @Column('text')
     logo: string;

     @Column('text')
     primaryColor:string;

     @Column('text')
     secondaryColor:string;

     @Column('text')
     thirdColor:string

     @Column('text')
     forthColor:string

     @Column('text')
     fiveColor:string

     @Column('text')
     primaryFontColor:string;

     @Column('text')
     secondaryFontColor:string;
}
