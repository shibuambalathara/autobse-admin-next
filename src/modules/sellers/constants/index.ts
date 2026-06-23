import { ROUTES } from "@/constants/routes";

export const SELLERS_PAGE_SIZE = 10;

export const SELLER_ROUTES = {
  list: ROUTES.sellers,
  add: ROUTES.sellersAdd,
  edit: (id: string) => ROUTES.sellerEdit(id),
  blockedDealers: (sellerId: string, sellerName?: string) =>
    sellerName
      ? (`${ROUTES.blockedDealersBySeller(sellerId)}?name=${encodeURIComponent(sellerName)}` as const)
      : ROUTES.blockedDealersBySeller(sellerId),
  blockedDealersList: ROUTES.blockedDealers,
} as const;
