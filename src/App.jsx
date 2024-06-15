import {
    Form,
    Link,
    Outlet,
    RouterProvider,
    createBrowserRouter,
    redirect,
    useActionData,
    useFetcher,
    useLocation,
    useNavigation,
    useRouteLoaderData,
} from "react-router-dom";
import { AuthProvider } from "./auth";

import LoginPage, {loginAction, loginLoader} from './Pages/LoginPage'
import PublicPage from './Pages/PublicPage'
import TeamPage from './Pages/TeamPage'
import ProductsPage from './Pages/ProductsPage'
import StatusPage from './Pages/StatusPage'
import ProtectedPage from './Pages/ProtectedPage'
import Navigation from './Layouts/Tw/Navigation';

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        loader() {
            // Our root route always provides the user, if logged in
            return {
                user: AuthProvider.user,
            };
        },
        Component: Layout,
        children: [
            {
                index: true,
                Component: PublicPage,
            },
            {
                path: "login",
                action: loginAction,
                loader: loginLoader,
                Component: LoginPage,
            },
            {
                path: "team",
                Component: TeamPage,
            },
            {
                path: "products",
                Component: ProductsPage,
            },
            {
                path: "status",
                Component: StatusPage,
            },
            {
                path: "protected",
                loader: protectedLoader,
                Component: ProtectedPage,
            },
            {
                path: "/auth/logout",
                async action() {
                    // We signout in a "resource route" that we can hit from a fetcher.Form
                    await AuthProvider.signout();
                    return redirect("/");
                },
                loader: logoutAction,
            },
        ],
    },
    {
        path: "/logout",
        async action() {
            console.log('/logout route');
            // We signout in a "resource route" that we can hit from a fetcher.Form
            await AuthProvider.signout();
            return redirect("/");
        },
        loader: logoutAction,
    },
]);

export default function App() {
    return (
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    );
}

function Layout() {
    return (
        <div>
            <Navigation/>
            <Outlet />
        </div>
    );
}

function protectedLoader({ request }) {
    // If the user is not logged in and tries to access `/protected`, we redirect
    // them to `/login` with a `from` parameter that allows login to redirect back
    // to this page upon successful authentication
    if (!AuthProvider.isAuthenticated) {
        let params = new URLSearchParams();
        params.set("from", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());
    }
    return null;
}

async function logoutAction(...params) {
    console.log('logout route');
    await AuthProvider.signout();
    return redirect("/");
}
