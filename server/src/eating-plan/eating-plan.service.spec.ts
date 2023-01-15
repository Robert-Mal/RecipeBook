import { Test, TestingModule } from '@nestjs/testing';
import { EatingPlanService } from './eating-plan.service';

describe('EatingPlanService', () => {
  let service: EatingPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatingPlanService],
    }).compile();

    service = module.get<EatingPlanService>(EatingPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
