import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import {
    Form,
    useActionData,
    useNavigation,
    useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import { login } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        rememberMe: formData.get("rememberMe") === "on",
    };

    const result = await login({ ...credentials, request });

    if (result.redirectTo) {
        return redirect(result.redirectTo, {
            headers: result.headers || new Headers(),
        });
    }

    if (result.success) {
        // Cas où le changement de mot de passe est requis
        if (result.mustChangePassword) {
            return redirect("/change-password", {
                headers: result.headers,
            });
        }

        // Cas normal
        const userRole = result.userRole;
        const redirectTo =
            userRole === "ENTREPRISE_AGENT" ? "/dashboard" : "/admin";

        return redirect(redirectTo, {
            headers: result.headers,
        });
    }

    return json(
        {
            error: result.error,
            email: credentials.email,
            rememberMe: credentials.rememberMe,
        },
        {
            status: 401,
            headers: result.headers,
        }
    );
}

export default function Login() {
    const [searchParams] = useSearchParams();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
            {/* Contenu principal */}
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg">
                    {/* Carte de connexion */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
                        {/* Éléments décoratifs en arrière-plan */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 overflow-hidden">
                            <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-r from-[#00296b] to-[#00509d] rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-8 right-8 w-40 h-40 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full blur-3xl animate-pulse delay-1000"></div>
                        </div>

                        {/* Logo et titre */}
                        <div className="relative px-8 pt-12 text-center">
                            <div className="mb-8">
                                <h1 className="text-5xl font-black bg-gradient-to-r from-[#00296b] via-[#003f88] to-[#00509d] bg-clip-text text-transparent mb-4 leading-tight">
                                    Bon retour !
                                </h1>
                                <p className="text-xl text-gray-600 font-medium leading-relaxed">
                                    Connectez-vous à votre espace Q-App
                                </p>
                                <div className="w-32 h-1.5 bg-gradient-to-r from-[#fdc500] to-[#ffd500] mx-auto rounded-full mt-6"></div>
                            </div>
                        </div>

                        {/* Formulaire */}
                        <div className="px-8 md:px-10 pb-12">
                            <Form className="space-y-8" method="post">
                                <input
                                    type="hidden"
                                    name="redirectTo"
                                    value={
                                        searchParams.get("redirectTo") ??
                                        undefined
                                    }
                                />

                                {/* Champ Email */}
                                <div className="group space-y-3">
                                    <label
                                        htmlFor="email"
                                        className="block text-lg font-bold text-gray-800"
                                    >
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-gray-400 group-hover:text-[#003f88] transition-colors duration-300"
                                            >
                                                <path
                                                    d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            defaultValue={actionData?.email}
                                            placeholder="votre@email.com"
                                            className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-[#003f88] focus:ring-0 caret-[#003f88] text-lg font-medium shadow-sm hover:shadow-md focus:shadow-lg group-hover:scale-105 transform"
                                        />
                                    </div>
                                </div>

                                {/* Champ Mot de passe */}
                                <div className="group space-y-3">
                                    <label
                                        htmlFor="password"
                                        className="block text-lg font-bold text-gray-800"
                                    >
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-gray-400 group-hover:text-[#003f88] transition-colors duration-300"
                                            >
                                                <path
                                                    d="M16 12V8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V12M12 16V18M8 12H16C17.1046 12 18 12.8954 18 14V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V14C6 12.8954 6.89543 12 8 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="current-password"
                                            required
                                            placeholder="Votre mot de passe"
                                            className="w-full pl-14 pr-14 py-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-[#003f88] focus:ring-0 caret-[#003f88] text-lg font-medium shadow-sm hover:shadow-md focus:shadow-lg group-hover:scale-105 transform"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-[#003f88] transition-all duration-300 transform hover:scale-110"
                                        >
                                            {showPassword ? (
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9.88 9.88C9.33065 10.4294 9.01118 11.1768 9.01118 11.955C9.01118 12.7332 9.33065 13.4806 9.88 14.03C10.4294 14.5794 11.1768 14.8988 11.955 14.8988C12.7332 14.8988 13.4806 14.5794 14.03 14.03M9.88 9.88L14.03 14.03M9.88 9.88C10.4294 9.33065 11.1768 9.01118 11.955 9.01118C12.7332 9.01118 13.4806 9.33065 14.03 9.88M14.03 14.03C13.4806 14.5794 12.7332 14.8988 11.955 14.8988C11.1768 14.8988 10.4294 14.5794 9.88 14.03M14.03 14.03L9.88 9.88M3 3L21 21M12 6.5C7 6.5 3 12 3 12S7 17.5 12 17.5C17 17.5 21 12 21 12S17 6.5 12 6.5Z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M2 12S6.5 4 12 4S22 12 22 12S17.5 20 12 20S2 12 2 12Z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center group">
                                        <input
                                            id="rememberMe"
                                            name="rememberMe"
                                            type="checkbox"
                                            defaultChecked={
                                                actionData?.rememberMe
                                            }
                                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-[#003f88] focus:ring-[#003f88] focus:ring-2 transition-all duration-300 transform group-hover:scale-110"
                                        />
                                        <label
                                            htmlFor="rememberMe"
                                            className="ml-3 block text-base text-gray-700 font-semibold group-hover:text-[#003f88] transition-colors duration-300"
                                        >
                                            Se souvenir de moi
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <a
                                            href="/forgot-password"
                                            className="text-sm font-bold text-[#003f88] hover:text-[#fdc500] transition-all duration-300 transform hover:scale-105 relative group"
                                        >
                                            <span className="relative z-10">
                                                Mot de passe oublié ?
                                            </span>
                                            <div className="absolute inset-0 bg-[#fdc500] rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </a>
                                        <span className="text-gray-300">•</span>
                                        <a
                                            href="/"
                                            className="text-sm font-bold text-[#003f88] hover:text-[#fdc500] transition-all duration-300 transform hover:scale-105 relative group"
                                            aria-label="Retour à l'accueil"
                                        >
                                            <span className="relative z-10">
                                                Accueil
                                            </span>
                                            <div className="absolute inset-0 bg-[#fdc500] rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </a>
                                    </div>
                                </div>

                                {/* Message d'erreur */}
                                {actionData?.error && (
                                    <div className="p-5 rounded-2xl border-2 border-red-200 bg-red-50 transform transition-all duration-300 hover:scale-105">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="text-red-600"
                                                >
                                                    <path
                                                        d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-base font-bold text-red-800">
                                                {actionData.error}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Bouton de connexion */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`group relative w-full py-5 px-8 rounded-2xl text-xl font-black transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl flex items-center justify-center overflow-hidden ${
                                            isSubmitting
                                                ? "bg-gray-400"
                                                : "bg-gradient-to-r from-[#00296b] via-[#003f88] to-[#00509d]"
                                        } text-white`}
                                    >
                                        {/* Effet de brillance au hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>

                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                <span className="relative z-10">
                                                    Connexion en cours...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mr-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                                                >
                                                    <path
                                                        d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span className="relative z-10">
                                                    Se connecter
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Form>

                            {/* Section création de compte */}
                            <div className="mt-12 pt-8 border-t-2 border-gray-100">
                                <div className="text-center space-y-6">
                                    <div className="relative">
                                        <p className="text-lg text-gray-600 font-semibold">
                                            Pas encore de compte ?
                                        </p>
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
                                    </div>

                                    <a
                                        href="/forms"
                                        className="group relative inline-flex items-center px-10 py-5 rounded-2xl text-xl font-black transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl bg-gradient-to-r from-[#fdc500] to-[#ffd500] text-[#00296b] overflow-hidden"
                                    >
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>

                                        <div className="w-8 h-8 rounded-full bg-[#00296b] flex items-center justify-center mr-4 relative z-10 group-hover:rotate-12 transition-transform duration-300">
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-[#ffd500]"
                                            >
                                                <path
                                                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7ZM20 8V14M23 11H17"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                                            Créer un compte entreprise
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
