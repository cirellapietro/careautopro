import BottomNav from "./BottomNav";

export default function AppLayout({ children }) {
  return (
    <div style={{ paddingBottom: "80px" }}>
      {children}
      <BottomNav />
    </div>
  );
}
