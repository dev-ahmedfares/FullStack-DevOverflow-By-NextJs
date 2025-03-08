import { BADGE_CRITERIA } from "@/constants";

export type ThemeOption = {
  value: string;
  label: string;
  icon: string;
};

export type SidebarLinks = {
  imgURL: string;
  route: string;
  label: string;
};

export type URLProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

export type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export interface ParamsProps {
  params: { id: string };
}

export interface BadgeCounts {
  GOLD : number;
  SILVER : number;
  BRONZE : number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA

