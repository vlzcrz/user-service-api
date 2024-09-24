import { IsOptional } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn('uuid')
    uuid: string

    @Column()
    nombre: string

    @Column()
    apellido: string

    @Column('text', {
        unique: true
    })
    correo: string

    @Column()
    rol: string

    @Column()
    contrasena: string
}
