import {
    Form,
    useActionData,
    useLocation,
    useNavigation,
  } from "react-router-dom";

export default function ProtectedPage() {
    return <h3 className='text-gray-800 dark:text-white'>Protected</h3>;
}
