"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  DELETED_WHATSAPP_QUERY,
  EVENTS_BRIEF_QUERY,
} from "@/graphql/documents/whatsapp";
import {
  WHATSAPP_PAGE_SIZE,
  type WhatsappStatusValue,
  type WhatsappTemplateValue,
} from "@/modules/whatsapp/constants";
import type {
  DeletedWhatsappResult,
  EventsBriefResult,
  WhatsappWhereInput,
} from "@/modules/whatsapp/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useDeletedWhatsappList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const [template, setTemplate] = useState<WhatsappTemplateValue | "">("");
  const [status, setStatus] = useState<WhatsappStatusValue | "">("");
  const [eventNo, setEventNo] = useState("");

  const queryVariables = useMemo(() => {
    const where: WhatsappWhereInput = {};

    if (template) where.templateName = template;
    if (status) where.status = status;
    if (eventNo) where.event = { eventNo: Number(eventNo) };

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: searchQuery ? undefined : (page - 1) * WHATSAPP_PAGE_SIZE,
      take: searchQuery ? undefined : WHATSAPP_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    };
  }, [eventNo, page, searchQuery, status, template]);

  const { data, loading, refetch } = useQuery<DeletedWhatsappResult>(
    DELETED_WHATSAPP_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    }
  );

  const { data: eventsData } = useQuery<EventsBriefResult>(EVENTS_BRIEF_QUERY, {
    variables: {
      take: 100,
      orderBy: [{ eventNo: "DESC" }],
    },
    fetchPolicy: "cache-first",
  });

  const recipients = data?.deletedWhatsapp?.whatsapp ?? [];
  const total = data?.deletedWhatsapp?.deletedMessageCount ?? 0;
  const eventOptions =
    eventsData?.events?.events?.map((event) => ({
      label: String(event.eventNo),
      value: String(event.eventNo),
    })) ?? [];

  const clearFilters = () => {
    setSearchInput("");
    setTemplate("");
    setStatus("");
    setEventNo("");
    setPage(1);
  };

  return {
    searchInput,
    setSearchInput,
    template,
    setTemplate,
    status,
    setStatus,
    eventNo,
    setEventNo,
    page,
    setPage,
    pageSize: WHATSAPP_PAGE_SIZE,
    recipients,
    total,
    loading,
    refetch,
    clearFilters,
    eventOptions,
    isSearching: Boolean(searchQuery),
  };
}
