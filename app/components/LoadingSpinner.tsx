import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    text?: string;
    fullScreen?: boolean;
}

export function LoadingSpinner({
    size = "md",
    text = "Chargement...",
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12"
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className={`${sizeClasses.xl} animate-spin text-blue-600 mx-auto mb-4`} />
                    <p className={`${textSizeClasses.lg} text-gray-700 font-medium`}>
                        {text}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mx-auto mb-3`} />
                <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
                    {text}
                </p>
            </div>
        </div>
    );
}

export function PageLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="ml-64 overflow-y-auto p-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart Skeletons */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
        </div>
    );
}
