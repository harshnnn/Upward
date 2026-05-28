import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';

import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Post('reminders')
  create(@Req() req: any, @Body() body: any) {
    return this.svc.createReminder(req.user.id, body);
  }

  @Get('reminders')
  list(@Req() req: any, @Query('includeCompleted') includeCompleted?: string) {
    return this.svc.listReminders(req.user.id, includeCompleted === 'true');
  }

  @Get('reminders/due')
  due(@Req() req: any) {
    return this.svc.findDueReminders(req.user.id);
  }

  @Get('reminders/:id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.svc.getReminder(req.user.id, id);
  }

  @Patch('reminders/:id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.svc.updateReminder(req.user.id, id, body);
  }

  @Patch('reminders/:id/complete')
  complete(@Req() req: any, @Param('id') id: string) {
    return this.svc.completeReminder(req.user.id, id);
  }

  @Delete('reminders/:id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.svc.deleteReminder(req.user.id, id);
  }
}

export default NotificationsController;
