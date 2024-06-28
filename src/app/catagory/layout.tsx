import Deals from "@/components/frontside/deals/Deals";
import Filter from "@/components/frontside/filter/Filter";
import Sidebar from "@/components/frontside/sidebar/Sidebar";

const layout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div>
      <div className="grid">
        <div className="grid">
            <Filter />
        </div>
        <div className="flex border-b-2">
          <div>
            <Sidebar />
          </div>
          <div> {children}</div>
        </div>
        <div>
          <Deals />
        </div>
      </div>
    </div>
  )
};

export default layout;
