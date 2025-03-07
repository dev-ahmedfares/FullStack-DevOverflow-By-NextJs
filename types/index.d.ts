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
  searchParams: { [key: string]: string | undefined };
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

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}
