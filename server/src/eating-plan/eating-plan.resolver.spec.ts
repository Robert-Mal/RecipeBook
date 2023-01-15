import { Test, TestingModule } from '@nestjs/testing';
import { EatingPlanResolver } from './eating-plan.resolver';

describe('EatingPlanResolver', () => {
  let resolver: EatingPlanResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatingPlanResolver],
    }).compile();

    resolver = module.get<EatingPlanResolver>(EatingPlanResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
