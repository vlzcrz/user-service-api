import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class UsuariosService {

  
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository : Repository<Usuario>
  ) {}

  async findDocentes(uuid?: string) {
    if(uuid) {
      const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
      const docente = await queryBuilder
      .select(["usuario.uuid", "usuario.nombre", "usuario.apellido", "usuario.correo"])
      .where(' usuario.uuid = :uuid AND usuairo.rol = :rol', {
        uuid: uuid,
        rol: 'Docente'
      })
      .getOne()
      return docente
    }

    const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
    const docenteList = await queryBuilder
    .select(["usuario.uuid", "usuario.nombre", "usuario.apellido", "usuario.correo"])
    .where(' rol = :rol', {
      rol: 'Docente'
    })
    .getMany()
    return docenteList
      
  }

  async findEstudiantes(uuid?: string) {
    if(uuid) {
      const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
      const estudiante = await queryBuilder
        .select(["usuario.uuid","usuario.nombre", "usuario.apellido", "usuario.correo"])
        .where( 'usuario.rol = :rol AND usuario.uuid = :uuid', {
          uuid: uuid,
          rol: 'Estudiante'
        }).getOne()
      return estudiante
    }
    const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
    const estudianteList = await queryBuilder.
      select(['usuario.uuid','usuario.nombre', 'usuario.apellido', 'usuario.correo'])
      .where( 'usuario.rol = :rol', { rol: 'Estudiante'} )
      .getMany()
    return estudianteList
  }

  async update(uuid: string, updateUsuarioDto: UpdateUsuarioDto) {
    const updateUsuario = await this.usuarioRepository.preload({
      uuid: uuid,
      ...updateUsuarioDto
    })

    if(!updateUsuario)
      throw new NotFoundException(`No se encontro al usuario con uuid: ${uuid}`)

    await this.usuarioRepository.save(updateUsuario)
    return updateUsuario;
  }

  async createDocente(createDocenteDto: CreateDocenteDto) {
    const docente = this.usuarioRepository.create(createDocenteDto)
    docente.rol = 'Docente'
    docente.contrasena = docente.nombre
    try {
      await this.usuarioRepository.save(docente)
    }
    catch {
      throw new BadRequestException('Correo electronico en uso')
    }

    return docente
  }

  async createEstudiante(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.usuarioRepository.create(createEstudianteDto)
    estudiante.rol = 'Estudiante'
    estudiante.contrasena = ''
    try {
      await this.usuarioRepository.save(estudiante)
    }
    catch {
      throw new BadRequestException('Correo electronico en uso')
    }

    return estudiante
  }
}
