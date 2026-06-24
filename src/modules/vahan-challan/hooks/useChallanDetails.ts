"use client";

import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  CHALLAN_QUERY,
  CHALLAN_SUMMARY_QUERY,
} from "@/graphql/documents/vahan-challan";
import type {
  ChallanQueryResult,
  ChallanRecord,
  ChallanSummaryResult,
} from "@/modules/vahan-challan/types";

export function useChallanDetails() {
  const [rcNumber, setRcNumber] = useState("");
  const [chassisNum, setChassisNum] = useState("");
  const [engineNum, setEngineNum] = useState("");
  const [challans, setChallans] = useState<ChallanRecord[]>([]);
  const [blacklist, setBlacklist] = useState<unknown[]>([]);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [fetchChallan, { loading }] = useLazyQuery<ChallanQueryResult>(
    CHALLAN_QUERY,
    { fetchPolicy: "network-only" }
  );

  const [fetchSummary, { loading: summaryLoading }] =
    useLazyQuery<ChallanSummaryResult>(CHALLAN_SUMMARY_QUERY);

  const validateInputs = () => {
    if (!rcNumber) {
      setErrorMsg("Please enter RC number");
      return false;
    }
    if (!chassisNum) {
      setErrorMsg("Please enter chassis number");
      return false;
    }
    if (!engineNum) {
      setErrorMsg("Please enter engine number");
      return false;
    }
    return true;
  };

  const searchChallans = async () => {
    if (!validateInputs()) return;

    setHasSearched(true);
    setSummary(null);
    setErrorMsg("");
    setChallans([]);
    setBlacklist([]);

    try {
      const { data } = await fetchChallan({
        variables: {
          rcNumber: rcNumber.toUpperCase(),
          chassisNum: chassisNum.toUpperCase(),
          engineNum: engineNum.toUpperCase(),
        },
      });

      const response = data?.getProvahanChallanData;

      if (!response) {
        setErrorMsg("No challan data found");
        return;
      }

      setChallans(response.challans ?? []);
      setBlacklist(response.blacklist ?? []);

      if (!response.challans?.length) {
        setErrorMsg("No challan data found");
      }
    } catch {
      setErrorMsg("Failed to fetch challan data");
    }
  };

  const fetchChallanSummary = async () => {
    if (!validateInputs()) return;

    setErrorMsg("");
    setHasSearched(false);
    setChallans([]);
    setBlacklist([]);

    try {
      const { data } = await fetchSummary({
        variables: {
          rcNumber: rcNumber.toUpperCase(),
          chassisNum: chassisNum.toUpperCase(),
          engineNum: engineNum.toUpperCase(),
        },
      });

      setSummary(
        (data?.getChallanSummaryFromJson as Record<string, unknown> | null) ??
          null
      );
    } catch {
      setErrorMsg("Failed to fetch challan summary");
    }
  };

  return {
    rcNumber,
    setRcNumber,
    chassisNum,
    setChassisNum,
    engineNum,
    setEngineNum,
    challans,
    blacklist,
    summary,
    errorMsg,
    hasSearched,
    loading,
    summaryLoading,
    searchChallans,
    fetchChallanSummary,
  };
}
