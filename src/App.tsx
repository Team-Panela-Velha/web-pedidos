import { Refine, Authenticated } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { LayoutDashboard, FolderTree, Package, PlusCircle, Table2, Receipt } from "lucide-react";
import {
  CategoryList,
  CategoryCreate,
  CategoryEdit,
  CategoryShow,
} from "./pages/categories";
import {
  ProductList,
  ProductCreate,
  ProductEdit,
  ProductShow,
} from "./pages/products";
import {
  ExtraList,
  ExtraCreate,
  ExtraEdit,
  ExtraShow,
} from "./pages/extras";
import {
  TableList,
  TableCreate,
  TableEdit,
  TableShow,
} from "./pages/tables";
import { TabGrid } from "./pages/tabs";
import { Dashboard } from "./pages/dashboard";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { Login } from "./pages/login";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { BrandIcon } from "./components/brand-icon";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              authProvider={authProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Painel",
                    icon: <LayoutDashboard className="h-4 w-4" />,
                  },
                },
                {
                  name: "categories",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    label: "Categorias",
                    icon: <FolderTree className="h-4 w-4" />,
                    canDelete: true,
                  },
                },
                {
                  name: "products",
                  list: "/products",
                  create: "/products/create",
                  edit: "/products/edit/:id",
                  show: "/products/show/:id",
                  meta: {
                    label: "Produtos",
                    icon: <Package className="h-4 w-4" />,
                    canDelete: true,
                  },
                },
                {
                  name: "extras",
                  list: "/extras",
                  create: "/extras/create",
                  edit: "/extras/edit/:id",
                  show: "/extras/show/:id",
                  meta: {
                    label: "Extras",
                    icon: <PlusCircle className="h-4 w-4" />,
                    canDelete: true,
                  },
                },
                {
                  name: "tables",
                  list: "/tables",
                  create: "/tables/create",
                  edit: "/tables/edit/:id",
                  show: "/tables/show/:id",
                  meta: {
                    label: "Mesas",
                    icon: <Table2 className="h-4 w-4" />,
                    canDelete: true,
                  },
                },
                {
                  name: "tabs",
                  list: "/tabs",
                  meta: {
                    label: "Comandas",
                    icon: <Receipt className="h-4 w-4" />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "u4IsEg-nf6kM6-Cs7Vo2",
                title: {
                  text: "Pokes e Boas",
                  icon: <BrandIcon />,
                },
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="/categories">
                    <Route index element={<CategoryList />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route>
                  <Route path="/products">
                    <Route index element={<ProductList />} />
                    <Route path="create" element={<ProductCreate />} />
                    <Route path="edit/:id" element={<ProductEdit />} />
                    <Route path="show/:id" element={<ProductShow />} />
                  </Route>
                  <Route path="/extras">
                    <Route index element={<ExtraList />} />
                    <Route path="create" element={<ExtraCreate />} />
                    <Route path="edit/:id" element={<ExtraEdit />} />
                    <Route path="show/:id" element={<ExtraShow />} />
                  </Route>
                  <Route path="/tables">
                    <Route index element={<TableList />} />
                    <Route path="create" element={<TableCreate />} />
                    <Route path="edit/:id" element={<TableEdit />} />
                    <Route path="show/:id" element={<TableShow />} />
                  </Route>
                  <Route path="/tabs" element={<TabGrid />} />
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
