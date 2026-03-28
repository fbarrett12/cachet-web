import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ImportPage } from "./pages/ImportPage";
import { BetsPage } from "./pages/BetsPage";
import { BetDetailPage } from "./pages/BetDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <Routes>
          <Route path="/" element={<ImportPage />} />
          <Route path="/bets" element={<BetsPage />} />
          <Route path="/bets/:betId" element={<BetDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}