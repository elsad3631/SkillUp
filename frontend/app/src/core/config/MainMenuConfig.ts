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
    heading: "Employees",
    route: "/employees",
    keenthemesIcon: "user",
    bootstrapIcon: "bi-people",
  },
  {
    heading: "customers",
    route: "/customers",
    keenthemesIcon: "profile-user",
    bootstrapIcon: "bi-person-badge",
  },
  {
    heading: "projects",
    route: "/projects",
    keenthemesIcon: "briefcase",
    bootstrapIcon: "bi-kanban",
  },
  {
    heading: "Training",
    route: "/training",
    keenthemesIcon: "education",
    bootstrapIcon: "bi-mortarboard",
  },
  {
    heading: "Calendar",
    route: "/my-calendar",
    keenthemesIcon: "calendar",
    bootstrapIcon: "bi-calendar-event",
  },
  {
    sectionTitle: "Quick Actions",
    pages: [
      {
        heading: "Asset Types",
        route: "/asset-types",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-list-check",
      },
      {
        heading: "Comments Demo",
        route: "/comments-demo",
        keenthemesIcon: "chat",
        bootstrapIcon: "bi-chat-dots",
      },
    ],
    keenthemesIcon: "flash",
    bootstrapIcon: "bi-lightning",
  },
];

export default MainMenuConfig;
