import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  headerText: string;
  address : string | null;
  role: number | undefined;
}

export const MainLayout = ({ children,address ,headerText ,role}: MainLayoutProps) => {
  return (
    <div>
      <Sidebar role={role}/>
      <div
        style={{
          marginLeft: "250px",
          paddingLeft: "1.5rem",
          paddingTop: "1rem",
        }}
        className="text-primary"
      >
        <div className="fixed top-0 left-[250px] w-[calc(100%-250px)] z-50 ">
          <Header text={headerText} address={address} />
        </div>
        <div className="mt-[5rem] ml-[2rem] mr-[3.5rem]">{children}</div>
      </div>
    </div>
  );
};
