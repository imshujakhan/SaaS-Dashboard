import { dealerService } from './dealerService';
import { orderService } from './orderService';
import { dashboardService } from './dashboardService';

export const api = {
  ...dealerService,
  ...orderService,
  ...dashboardService,
};
