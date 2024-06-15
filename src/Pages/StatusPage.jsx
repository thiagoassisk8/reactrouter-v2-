export default function TeamPage() {
    return (
        <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen">
            <div className="w-full sm:w-3/4 xl:w-1/2 mx-auto p-6">
                <div className="px-6 py-4 bg-white dark:bg-gray-800 from-gray-700/50 via-transparent rounded-lg shadow-2xl shadow-gray-500/20 flex items-center focus:outline focus:outline-2 focus:outline-red-500">
                    <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                    </div>

                    <div className="ml-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Application up</h2>

                        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            HTTP request received.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
