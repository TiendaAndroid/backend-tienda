import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoVivienda } from './tipo.enum';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'directions' })
export class Direction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.direction, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: TipoVivienda,
  })
  tipo: TipoVivienda;

  @Column('text')
  pais: string;

  @Column('text')
  municipio: string;

  @Column('text')
  estado: string;

  @Column('text')
  calle: string;

  @Column('text')
  noExterior: string;

  @Column('text', { nullable: true })
  noInterior?: string;

  @Column('text')
  colonia: string;

  @Column('int')
  cp: number;
}
