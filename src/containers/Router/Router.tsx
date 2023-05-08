import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ErrorPage } from "../../components/ErrorPage";
import { Layout } from "../Layout/Layout";
import { Center, Spinner } from "@chakra-ui/react";
import React, { Suspense, useCallback } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

export const Loader = () => (
  <Center flex="1">
    <Spinner />
  </Center>
);

export const usePaginationFromUrl = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  const page = +(searchParams.get("page") ?? 1);
  const setPage = useCallback(
    (p: number) => {
      const newPage = Math.max(1, p);
      setSearchParam({ page: newPage.toString() });
    },
    [setSearchParam]
  );
  return { page, setPage };
};

export const useRedirectFromUrl = (defaultTo = "/") => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  return useCallback(
    () =>
      navigate(
        searchParams.get("redirect")
          ? decodeURIComponent(searchParams.get("redirect") ?? "")
          : defaultTo,
        { replace: true }
      ),
    [navigate, searchParams, defaultTo]
  );
};

const MeetingsView = React.lazy(() => import("../MeetingsView/MeetingsView"));
// const MeetingCreateView = React.lazy(
// () => import("@/spa/views/MeetingCreateView")
// );
// const MeetingUpdateView = React.lazy(
// () => import("@/spa/views/MeetingUpdateView")
// );
// const ApiView = React.lazy(() => import("@/spa/views/ApiView"));

export const Router = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<MeetingsView />} />
              <Route path="*" element={<ErrorPage errorCode={404} />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
// <Route path="create" element={<MeetingCreateView />} />
// <Route path=":login" element={<MeetingUpdateView />} />
// <Route path="api" element={<ApiView />} />
