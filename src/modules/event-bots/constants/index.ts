import { ROUTES } from "@/constants/routes";

export const EVENT_BOTS_PAGE_SIZE = 10;

export const EVENT_BOT_ROUTES = {
  list: ROUTES.eventBots,
  add: ROUTES.eventBotsAdd,
  edit: (id: string) => ROUTES.eventBotEdit(id),
  deleted: ROUTES.eventBotsDeleted,
  upload: (id: string) => ROUTES.eventBotUpload(id),
  createdByUser: (userId: string) => ROUTES.userDetail(userId),
} as const;
