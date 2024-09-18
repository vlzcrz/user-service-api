import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {

    @IsString()
    @MinLength(4)
    @IsOptional()
    nombre?: string;

    @IsString()
    @MinLength(4)
    @IsOptional()
    apellido?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    correo?: string;
}
