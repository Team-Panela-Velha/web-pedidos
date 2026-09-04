import type { NotificationRequest } from "@/types/notification/notificationTypes";
import { apiService } from "../apiService";

class NotificationService {
  send(request: NotificationRequest): Promise<void> {
    return apiService.post<void, NotificationRequest>("/notifications", request);
  }
}

export const notificationService = new NotificationService();
