import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { resendEmailOtp, verifyEmailOtp } from "~/utils/api";

export const loader = async ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) {
        return redirect("/forms"); // Redirige si l'email n'est pas présent
    }

    return json({
        title: "Vérification d'email",
        description: `Entrez le code OTP envoyé à ${email}`,
        email: email,
    });
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const otp = formData.get("otp");
    const email = formData.get("email");

    try {
        await verifyEmailOtp(email, otp);
        return json(
            {
                success: true,
                message: "Email vérifié avec succès! Redirection en cours...",
            },
            {
                headers: {
                    "Set-Cookie": `email_verified=true; Path=/; HttpOnly; SameSite=Lax`,
                },
            }
        );
    } catch (error) {
        return json({
            success: false,
            error: error.message || "Code OTP invalide ou expiré",
        });
    }
};

export default function VerifyEmail() {
    const { title, description, email } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const [otpDigits, setOtpDigits] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes en secondes
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    useEffect(() => {
        if (actionData?.success) {
            setIsRedirecting(true);
            // Redirection après 2 secondes
            const timer = setTimeout(() => {
                window.location.href = "/waiting-approval";
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [actionData]);

    // Compte à rebours pour l'expiration du code OTP
    useEffect(() => {
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    // Compte à rebours pour le bouton "Renvoyer le code"
    useEffect(() => {
        if (resendCountdown <= 0) {
            setResendDisabled(false);
            return;
        }

        const intervalId = setInterval(() => {
            setResendCountdown(resendCountdown - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [resendCountdown]);

    const handleResendOtp = async () => {
        try {
            setResendDisabled(true);
            setResendCountdown(60); // Désactive le bouton pendant 60 secondes

            // Ajout d'un message de chargement
            const loadingToast = alert("Envoi du code en cours...");

            const response = await resendEmailOtp(email);

            // Réinitialise le compte à rebours à 10 minutes
            setTimeLeft(10 * 60);

            // Message de succès avec plus de détails
            alert(
                "Un nouveau code OTP a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception."
            );

            // Log pour le débogage
            console.log("Réponse de resendEmailOtp:", response);
        } catch (error) {
            console.error("Erreur lors du renvoi du code OTP:", error);
            alert(
                error.message ||
                    "Erreur lors de l'envoi du nouveau code. Veuillez réessayer."
            );

            // En cas d'erreur, réactiver le bouton
            setResendDisabled(false);
            setResendCountdown(0);
        }
    };

    // Formater le temps restant en MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link
                    to="/"
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-300 mb-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Retour à l&apos;accueil
                </Link>

                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="relative text-white py-6 px-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-3 left-3 w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-3 right-3 w-28 h-28 bg-yellow-500 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative">
                            <h2 className="text-center text-2xl font-black">
                                {title}
                            </h2>
                            <p className="mt-1 text-center text-sm text-blue-100">
                                {description}
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full mt-4"></div>
                        </div>
                    </div>

                    <div className="p-6">
                        {isRedirecting ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-700">
                                    Redirection en cours...
                                </p>
                            </div>
                        ) : actionData?.success ? (
                            <div className="rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-green-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            {actionData.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Form className="space-y-6" method="post">
                                <input
                                    type="hidden"
                                    name="email"
                                    value={email}
                                />

                                {/* Compte à rebours */}
                                <div className="text-center mb-4">
                                    <div
                                        className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${
                                            timeLeft > 60
                                                ? "bg-blue-50 border-blue-200 text-blue-800"
                                                : "bg-red-50 border-red-200 text-red-800"
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-medium">
                                            Code expire dans :{" "}
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="otp-0"
                                        className="block text-sm font-bold text-gray-800 mb-2"
                                    >
                                        Code OTP (6 chiffres)
                                    </label>
                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        {otpDigits.map((d, i) => (
                                            <input
                                                key={i}
                                                id={`otp-${i}`}
                                                aria-label={`OTP ${i + 1}`}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]"
                                                maxLength={1}
                                                value={d}
                                                onChange={(e) => {
                                                    const v =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        );
                                                    const next = [...otpDigits];
                                                    next[i] = v;
                                                    setOtpDigits(next);
                                                    if (v && i < 5) {
                                                        const nextEl =
                                                            document.getElementById(
                                                                `otp-${i + 1}`
                                                            ) as HTMLInputElement | null;
                                                        nextEl?.focus();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Backspace" &&
                                                        !otpDigits[i] &&
                                                        i > 0
                                                    ) {
                                                        const prevEl =
                                                            document.getElementById(
                                                                `otp-${i - 1}`
                                                            ) as HTMLInputElement | null;
                                                        prevEl?.focus();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    const text = e.clipboardData
                                                        .getData("text")
                                                        .replace(/\D/g, "")
                                                        .slice(0, 6);
                                                    if (!text) return;
                                                    e.preventDefault();
                                                    const next = [
                                                        "",
                                                        "",
                                                        "",
                                                        "",
                                                        "",
                                                        "",
                                                    ] as string[];
                                                    for (
                                                        let j = 0;
                                                        j < text.length &&
                                                        j < 6;
                                                        j++
                                                    )
                                                        next[j] = text[j];
                                                    setOtpDigits(next);
                                                    const lastIndex = Math.min(
                                                        text.length - 1,
                                                        5
                                                    );
                                                    const lastEl =
                                                        document.getElementById(
                                                            `otp-${lastIndex}`
                                                        ) as HTMLInputElement | null;
                                                    lastEl?.focus();
                                                }}
                                                className="w-12 h-14 md:w-14 md:h-16 text-2xl text-center font-semibold rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white text-gray-900 focus:border-blue-500 focus:outline-none shadow-sm focus:shadow-md"
                                                placeholder="_"
                                            />
                                        ))}
                                    </div>
                                    {/* Valeur concaténée envoyée au serveur */}
                                    <input
                                        type="hidden"
                                        name="otp"
                                        value={otpDigits.join("")}
                                    />
                                </div>

                                {actionData?.error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-red-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-red-800">
                                                    {actionData.error}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={
                                            otpDigits.join("").length !== 6
                                        }
                                        className={`group relative w-full flex justify-center py-4 px-6 rounded-2xl shadow-lg text-lg font-bold transition-all duration-300 ${
                                            otpDigits.join("").length === 6
                                                ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:scale-[1.01] hover:shadow-blue-900/20"
                                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        } focus:outline-none`}
                                    >
                                        Vérifier
                                        {otpDigits.join("").length === 6 && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-2"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Vous n&apos;avez pas reçu de code ?
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendDisabled}
                                        className={`mt-3 inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl shadow-sm transition-all duration-300 ${
                                            resendDisabled
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        } focus:outline-none`}
                                    >
                                        {resendDisabled
                                            ? `Renvoyer le code (${resendCountdown}s)`
                                            : "Renvoyer le code"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
