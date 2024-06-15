import {
    Form,
    useActionData,
    useLocation,
    redirect,
    useNavigation,
} from "react-router-dom";

import { AuthProvider } from "../auth";

export default function LoginPage() {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let from = params.get("from") || null;

    let navigation = useNavigation();
    let isLoggingIn = navigation.formData?.get('email') && navigation.formData?.get('password');

    let actionData = useActionData();

    return (
        <div
            className='p-5 bg-white dark:bg-gray-900 w-full'
        >
            <div className="w-full mx-3 flex items-center justify-center vsc-initialized md:w-6/12 md:mx-auto mb-3">
                {from ? <h4 className='text-center'>You must log in to view the page at {from}</h4> : ''}
            </div>

            <div className="w-full mx-3 flex items-center justify-center vsc-initialized md:w-6/12 md:mx-auto mb-3">
                <Form
                    method="post" replace
                    className="w-full"
                >
                    <input type="hidden" name="redirectTo" value={from ?? ''} />
                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                        <input
                            type="email"
                            id="email"
                            defaultValue={"email@mail.com"}
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            defaultValue={"password"}
                            id="password"
                            name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        disabled={isLoggingIn}
                    >
                    {isLoggingIn ? "Logging in..." : "Login"}
                    </button>

                    {actionData && actionData.error ? (
                        <p style={{ color: "red" }}>{actionData.error}</p>
                    ) : null}
                </Form>
            </div>
        </div>
    );
}


export async function loginAction({ request }) {
    let formData = await request.formData();
    let username = formData.get("username");
    let email = formData?.get('email');
    let password = formData?.get('password');

    // Validate our form inputs and return validation errors via useActionData()
    if (!email || !password) {
        return {
            error: "You must provide a email and password to log in",
        };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
        await AuthProvider.signin({
            username,
            email,
            password,
        });
    } catch (error) {
        error = typeof error === 'string' ? error : (error?.message || null);
        // Unused as of now but this is how you would handle invalid
        // username/password combinations - just like validating the inputs
        // above
        return {
            error: error || "Invalid login attempt",
        };
    }

    let redirectTo = formData.get("redirectTo");
    return redirect(redirectTo || "/");
}

export async function loginLoader() {
    if (AuthProvider.isAuthenticated) {
        return redirect("/");
    }
    return null;
}
