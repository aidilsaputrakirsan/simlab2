import { PracticumScheduling } from '@/domain/practicum-scheduling/PracticumScheduling';
import { TimeView } from '../time/TimeView';
import { PracticumSchedulingEquipmentView } from './PracticumSchedulingEquipmentView';
import { PracticumSchedulingMaterialView } from './PracticumSchedulingMaterialView';
import { PracticumSchedulingStatus } from '@/domain/practicum-scheduling/PracticumSchedulingStatus';
import { PracticumClassView } from './PracticumClassView';
import { Requestor } from '@/domain/shared/value-object/Requestor';
import { Laboran } from '@/domain/shared/value-object/Laboran';

export class PracticumSchedulingView {
    constructor(
        readonly id: number,
        readonly academicYear: string,
        readonly practicumId: number,
        readonly phoneNumber: number,
        readonly status: PracticumSchedulingStatus,
        readonly practicumName: string,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly practicumClasses: PracticumClassView[],
        readonly practicumSchedulingEquipments: PracticumSchedulingEquipmentView[],
        readonly practicumSchedulingMaterials: PracticumSchedulingMaterialView[],
        readonly requestor?: Requestor,
        readonly laboran?: Laboran,
        readonly canVerif?: number,
    ) { }

    static fromDomain(entity: PracticumScheduling): PracticumSchedulingView {
        return new PracticumSchedulingView(
            entity.id,
            entity.academicYear,
            entity.practicumId,
            entity.phoneNumber,
            entity.status,
            entity.practicumName,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.getPracticumClasses().map(PracticumClassView.fromDomain),
            entity.getPracticumSchedulingEquipments().map(PracticumSchedulingEquipmentView.fromDomain),
            entity.getPracticumSchedulingMaterials().map(PracticumSchedulingMaterialView.fromDomain),
            entity.getRequestor(),
            entity.getLaboran(),
            entity.getCanVerif()
        );
    }

    getTotalClass(): number {
        return this.practicumClasses?.length || 0
    }
}
