import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { portfoliosApi } from "./portfoliosApi";
import { mapPortfolio } from "./mappers";
import type {
  CreateAssetRequestDto,
  CreatePortfolioRequestDto,
  SellAssetRequestDto,
  UpdateAssetRequestDto,
  UpdatePortfolioRequestDto,
} from "../types";

export function usePortfoliosQuery() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const dto = await portfoliosApi.getAll();
      return dto.portfolios.map(mapPortfolio);
    },
  });
}

export function useCreatePortfolioMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePortfolioRequestDto) =>
      portfoliosApi.createPortfolio(body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

export function useUpdatePortfolioMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdatePortfolioRequestDto;
    }) => portfoliosApi.updatePortfolio(id, body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

export function useDeletePortfolioMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => portfoliosApi.deletePortfolio(id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

export function useAddAssetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      portfolioId,
      body,
    }: {
      portfolioId: string;
      body: CreateAssetRequestDto;
    }) => portfoliosApi.addAsset(portfolioId, body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

export function useUpdateAssetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      portfolioId,
      assetId,
      body,
    }: {
      portfolioId: string;
      assetId: string;
      body: UpdateAssetRequestDto;
    }) => portfoliosApi.updateAsset(portfolioId, assetId, body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

export function useDeleteAssetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      portfolioId,
      assetId,
    }: {
      portfolioId: string;
      assetId: string;
    }) => portfoliosApi.deleteAsset(portfolioId, assetId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}

export function useSellAssetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      portfolioId,
      assetId,
      body,
    }: {
      portfolioId: string;
      assetId: string;
      body: SellAssetRequestDto;
    }) => portfoliosApi.sellAsset(portfolioId, assetId, body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["portfolios"] }),
        qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
    },
  });
}
