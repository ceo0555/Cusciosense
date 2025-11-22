import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.notification.create({ data });
  }

  async createBulk(data: any) {
    const { title, message, type, category, recipients } = data;
    const { schoolId, roles } = recipients;

    // Get all users matching criteria
    const users = await this.prisma.user.findMany({
      where: {
        role: { in: roles },
        isActive: true,
      },
    });

    const notifications = users.map(user => ({
      userId: user.id,
      title,
      message,
      type,
      category,
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });

    return { message: 'Notifications sent successfully', count: notifications.length };
  }

  async getNotifications(userId: string, filters: any) {
    const { isRead, category, page = 1, limit = 20 } = filters;
    
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (category) where.category = category;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { data: notifications, total, page, limit, unreadCount };
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return { message: 'All notifications marked as read' };
  }
}
