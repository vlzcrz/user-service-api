import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator"


export class CreateUsuarioDto {

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
