interface HeaderProps {
  text: string;
  address: string | null;
}

export const Header = ({ text, address }: HeaderProps) => {
  return (
    <div className="bg-white w-full h-[3.5rem] flex items-center justify-between px-8 shadow-sm box-border">
      <p className="text-xl font-bold text-black">{text}</p>
      <div className="text-sm text-gray-500 truncate max-w-[250px] text-right bg-gray-100 text-gray-700 text-sm rounded px-3">
        address: {address || "Disconnected"}
      </div>
    </div>
  );
};
