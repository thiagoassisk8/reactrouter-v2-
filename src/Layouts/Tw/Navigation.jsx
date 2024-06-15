import React, { useState } from 'react';
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

import { AuthProvider } from "../../auth";
import MenuIconBlack from '../../assets/svg/menu-icon-black.svg';
import MenuIconWhite from '../../assets/svg/menu-icon-white.svg';

const userData = AuthProvider?.userData;

const userIsLoggedIn = () => {
    if (!AuthProvider || !AuthProvider?.isAuthenticated) {
        return false;
    }

    return true;
}

const Navigation = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [mobileShowItems, setMobileShowItems] = useState(false);
    const evalClasses = () => mobileShowItems ? 'w-full md:block md:w-auto' : 'hidden w-full md:block md:w-auto';
    const [menuClasses, setMenuClasses] = useState(evalClasses());

    const toggleMenu = () => {
        setMobileShowItems(!mobileShowItems);

        setMenuClasses(evalClasses());
    };

    const navLink = (link, active = null, key = null) => {
        active = link.active ?? active;
        let props = {
            className: "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent",
        };

        if (active) {
            props['aria-current'] = 'page';
            props['className'] = 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500'
        }

        return (
            <li key={key}>
                <Link
                    {...props}
                    to={link.to}
                >{link.label}</Link>
            </li>
        );
    }

    const links = [
        {
            to: '/',
            label: 'Home',
        },
        {
            to: '/protected',
            label: 'Protected Page',
        },
        {
            to: '/team',
            label: 'Team page',
            show: true,
        },
        {
            to: '/team',
            label: 'Team hidde page',
            show: false,
        },
        {
            to: '/status',
            label: 'Status',
        },
        {
            to: '/products',
            label: 'Products',
        },
        {
            to: '/login',
            label: 'Login',
            show: () => {
                return !userIsLoggedIn();
            },
        },
        // {
        //     to: '/logout',
        //     label: 'Logout',
        //     show: () => {
        //         return userIsLoggedIn();
        //     },
        // },
    ];

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">App</span>
                    </Link>
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded="false"
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        <img src={MenuIconBlack} className='dark:hidden' alt='Menu' />
                        <img src={MenuIconWhite} className='hidden dark:block' alt='Menu' />
                    </button>
                    <div
                        className={menuClasses}
                        id="navbar-default"
                    >
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {links.filter(item => {
                                let toEvaluate = item?.show;

                                if (toEvaluate === undefined || toEvaluate === true) {
                                    return true;
                                }

                                if (['', 0, '0', false].includes(toEvaluate)) {
                                    return false;
                                }

                                if (typeof toEvaluate === 'function' && toEvaluate?.constructor?.name === 'Function') {
                                    return toEvaluate(item);
                                }

                                return false;
                            }).map((link, linkIndex) => navLink(link, currentPath === link?.to, linkIndex))}
                            <AuthStatus/>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

function AuthStatus() {
    // Get our logged in user, if they exist, from the root route loader data
    // let routeData = useRouteLoaderData("root");
    // let userData = routeData?.user;
    let fetcher = useFetcher();

    if (!userIsLoggedIn()) {
        return null;
    }

    let isLoggingOut = fetcher.formData != null;

    return (
        <li>
            <div
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
                <div className="flex">
                    <div>{userData?.name ? userData?.name : ''}</div>
                    <fetcher.Form method="post" action="/logout">
                        <button
                            type="submit" disabled={isLoggingOut}
                            className={userData?.name ? 'inline ms-3' : 'inline'}
                        >
                            {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                    </fetcher.Form>
                </div>
            </div>
        </li>
    );
}

export default Navigation
