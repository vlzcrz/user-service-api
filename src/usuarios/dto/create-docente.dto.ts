import { IsEmail, IsString, MinLength } from "class-validator"


export class CreateDocenteDto {
    
    @IsString()
    @MinLength(4)
    nombre: string

    @IsString()
    @MinLength(4)
    apellido: string

    @IsString()
    @IsEmail()
    correo: string
}