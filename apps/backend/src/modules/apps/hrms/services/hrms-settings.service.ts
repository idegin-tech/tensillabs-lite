import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HrmsSettings } from '../schemas/hrms-settings.schema';

@Injectable()
export class HrmsSettingsService {
    constructor(
        @InjectRepository(HrmsSettings)
        public hrmsSettingsRepository: Repository<HrmsSettings>,
    ) { }

}
