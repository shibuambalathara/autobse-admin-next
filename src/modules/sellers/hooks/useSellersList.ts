"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { SELLERS_LIST_QUERY } from "@/graphql/documents/sellers";
import { SELLERS_PAGE_SIZE } from "@/modules/sellers/constants";
import type { Seller, SellersListResult } from "@/modules/sellers/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

function matchesSearch(seller: Seller, query: string): boolean {
  const haystack = [
    seller.name,
    seller.contactPerson,
    seller.nationalHead,
    seller.mobile,
    seller.billingContactPerson,
    seller.GSTNumber,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function useSellersList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useQuery<SellersListResult>(
    SELLERS_LIST_QUERY,
    { fetchPolicy: "network-only" }
  );

  const allSellers = data?.sellers ?? [];

  const filteredSellers = useMemo(() => {
    if (!searchQuery) return allSellers;
    return allSellers.filter((seller) => matchesSearch(seller, searchQuery));
  }, [allSellers, searchQuery]);

  const total = filteredSellers.length;
  const pageSize = SELLERS_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentPage = Math.min(page, totalPages);

  const sellers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSellers.slice(start, start + pageSize);
  }, [filteredSellers, currentPage, pageSize]);

  const clearSearch = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    sellers,
    allSellers,
    loading,
    error,
    refetch,
    searchInput,
    setSearchInput: (value: string) => {
      setSearchInput(value);
      setPage(1);
    },
    searchQuery,
    clearSearch,
    page: currentPage,
    setPage,
    pageSize,
    total,
    totalPages,
  };
}
