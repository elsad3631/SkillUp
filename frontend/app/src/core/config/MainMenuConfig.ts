export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    heading: "employees",
    route: "/employees",
    keenthemesIcon: "user",
    bootstrapIcon: "bi-people",
  },
  {
    heading: "projects",
    route: "/projects",
    keenthemesIcon: "briefcase",
    bootstrapIcon: "bi-kanban",
  },
];

export default MainMenuConfig;
