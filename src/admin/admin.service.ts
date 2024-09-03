import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) readonly adminRepository: Repository<Admin>,
  ) {}

  async findOne(id: string) {
    let admin: Admin;
    if (id) {
      admin = await this.adminRepository.findOne({
        where: { id },
      });
    }
    if (!admin) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    let admin: Admin;
    if (id) {
      admin = await this.adminRepository.findOne({
        where: { id },
      });
    }
    if (!admin) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }
    if (Object.keys(updateAdminDto).length === 0) {
      return admin;
    }
    const updateAdmin = Object.assign(admin, updateAdminDto);

    return await this.adminRepository.save(updateAdmin);
  }
}
