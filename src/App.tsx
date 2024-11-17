import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import MainPage from "@pages/Main/MainPage";
// import NotFoundPage from "@pages/NotFound/NotFoundPage";
// import DetailPage from "@pages/Detail/DetailPage";
// lazy loading
import { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";
const MainPage = lazy(() => import("@pages/Main/MainPage"));
const NotFoundPage = lazy(() => import("@pages/NotFound/NotFoundPage"));
const DetailPage = lazy(() => import("@pages/Detail/DetailPage"));


const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <Suspense fallback={<CircularProgress className="loading" />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/estate/:estateId" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;