import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SessionHub from "./pages/SessionHub";
import PhraseDetail from "./pages/PhraseDetail";
import SessionDetail from "./pages/SessionDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SessionHub />} />
          <Route path="/phase/:phraseId" element={<PhraseDetail />} />
          <Route
            path="/phase/:phraseId/session/:id"
            element={<SessionDetail />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
