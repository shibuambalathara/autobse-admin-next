import { gql } from "@apollo/client";

export const LIST_BLOCKED_DEALERS_QUERY = gql`
  query ListBlockedDealers(
    $where: BlockWhereUniqueInput
    $orderBy: BlockOrderByInput
    $take: Int
    $skip: Int
    $search: String
  ) {
    getBlockedDealers(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      blockedCount
      blockedDealer {
        id
        panCardNo
        reason
        createdAt
        createdById
        seller {
          id
          name
        }
      }
    }
  }
`;

export const BLOCK_DEALER_MUTATION = gql`
  mutation BlockDealer(
    $where: BlockWhereUniqueInput!
    $blockDealerInput: BlockDealerInput!
  ) {
    blockDealer(where: $where, BlockDealerInput: $blockDealerInput)
  }
`;

export const UNBLOCK_DEALER_MUTATION = gql`
  mutation UnblockDealer(
    $where: BlockWhereUniqueInput!
    $blockDealerInput: BlockDealerInput!
  ) {
    unblockDealer(where: $where, BlockDealerInput: $blockDealerInput)
  }
`;
