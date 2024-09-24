import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository : Repository<Usuario>
  ) {}

  async findUser(correo?: string) {
    if(!correo)
      throw new BadRequestException('Valor correo en blanco, ingrese un correo valido');
    
    const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
    const usuarioExist = await queryBuilder.select(["usuario.correo", "usuario.contrasena"]).where('usuario.correo = :correo', {correo: correo}).getExists()
    if(!usuarioExist)
      throw new NotFoundException('El correo ingresado no existe')

    const usuario = await queryBuilder.select(["usuario.correo", "usuario.contrasena"]).where('usuario.correo = :correo', {correo: correo}).getOne()
    return usuario

  }

  async findDocentes(uuid?: string) {

    if (uuid && (!uuidValidate(uuid) || uuidVersion(uuid) !== 4)) {
      throw new BadRequestException('No es un formato uuid v4 valido');
    }

    const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
    if(uuid) {
      
      const docenteExist = await queryBuilder
      .select(["usuario.uuid", "usuario.nombre", "usuario.apellido", "usuario.correo"])
      .where(' usuario.uuid = :uuid AND usuario.rol = :rol', {
        uuid: uuid,
        rol: 'Docente'
      })
      .getExists()

      if(!docenteExist)
        throw new NotFoundException('El docente con la uuid asociada no existe')
      
      const docente = await queryBuilder
      .select(["usuario.uuid", "usuario.nombre", "usuario.apellido", "usuario.correo"])
      .where(' usuario.uuid = :uuid AND usuario.rol = :rol', {
        uuid: uuid,
        rol: 'Docente'
      })
      .getOne()

      return docente
    }

    const docenteList = await queryBuilder
    .select(["usuario.uuid", "usuario.nombre", "usuario.apellido", "usuario.correo"])
    .where(' rol = :rol', {
      rol: 'Docente'
    })
    .getMany()
    return docenteList
      
  }

  async findEstudiantes(uuid?: string) {

    if (uuid && (!uuidValidate(uuid) || uuidVersion(uuid) !== 4)) {
      throw new BadRequestException('No es un formato uuid v4 valido');
    }

    const queryBuilder = this.usuarioRepository.createQueryBuilder("usuario")
    if(uuid) {
      const estudianteExist = await queryBuilder
        .select(["usuario.uuid","usuario.nombre", "usuario.apellido", "usuario.correo"])
        .where( 'usuario.rol = :rol AND usuario.uuid = :uuid', {
          uuid: uuid,
          rol: 'Estudiante'
        }).getExists()
      
      if(!estudianteExist)
        throw new NotFoundException('El estudiante con la uuid asociada no existe')

      const estudiante = await queryBuilder
        .select(["usuario.uuid","usuario.nombre", "usuario.apellido", "usuario.correo"])
        .where( 'usuario.rol = :rol AND usuario.uuid = :uuid', {
          uuid: uuid,
          rol: 'Estudiante'
        }).getOne()

      return estudiante
    }

    const estudianteList = await queryBuilder.
      select(['usuario.uuid','usuario.nombre', 'usuario.apellido', 'usuario.correo'])
      .where( 'usuario.rol = :rol', { rol: 'Estudiante'} )
      .getMany()
    return estudianteList
  }

  async updateEstudiante(uuid: string, updateUsuarioDto: UpdateUsuarioDto) {

    const usuario = await this.usuarioRepository.findOne({ where: { uuid } });

    if(!usuario || usuario.rol !== 'Estudiante')
      throw new NotFoundException(`No se encontro al estudiante con uuid: ${uuid}`)

    const updateUsuario = await this.usuarioRepository.preload({
      uuid: uuid,
      ...updateUsuarioDto
    })

    await this.usuarioRepository.save(updateUsuario)
    const updateResponse = {
      uuid_estudiante: updateUsuario.uuid,
      nombre: updateUsuarioDto.nombre,
      apellido: updateUsuarioDto.apellido,
      correo: updateUsuarioDto.correo
    }
    
    return updateResponse;
  }

  async updateDocente(uuid: string, updateUsuarioDto: UpdateUsuarioDto) {

    const docente = await this.usuarioRepository.findOne({ where: { uuid} })

    if(!docente || docente.rol !== 'Docente')
      throw new NotFoundException(`No se encontro al docente con uuid: ${uuid}`)

    const updateUsuario = await this.usuarioRepository.preload({
      uuid: uuid,
      ...updateUsuarioDto
    })

    

    await this.usuarioRepository.save(updateUsuario)
    const updateResponse = {
      nombre: updateUsuarioDto.nombre,
      apellido: updateUsuarioDto.apellido,
      correo: updateUsuarioDto.correo
    }
    return updateResponse;
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

    const createEstudianteResponse = {
      uuid_estudiante: estudiante.uuid,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      correo: estudiante.correo,
    }

    return createEstudianteResponse
  }
}
