import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('Docentes/:uuid?')
  findDocentes(@Param('uuid') uuid?: string) {
    return this.usuariosService.findDocentes(uuid);
  }

  @Get('Estudiantes/:uuid?')
  findEstudiantes(@Param('uuid') uuid?: string) {
    return this.usuariosService.findEstudiantes(uuid)
  }

  @Patch('EditarUsuario/:uuid')
  update(@Param('uuid', ParseUUIDPipe ) uuid: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(uuid, updateUsuarioDto);
  }

  @Post('CrearDocente')
  createDocente(@Body() createDocenteDto: CreateDocenteDto) {
    return this.usuariosService.createDocente(createDocenteDto);
  }

  @Post('CrearEstudiante')
  createEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.usuariosService.createEstudiante(createEstudianteDto)
  }

  @Get('Correo/:correo?')
  findCorreo(@Param('correo') correo?: string) {
    return this.usuariosService.findUser(correo)
  }
}
