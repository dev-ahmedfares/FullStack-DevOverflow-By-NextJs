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
