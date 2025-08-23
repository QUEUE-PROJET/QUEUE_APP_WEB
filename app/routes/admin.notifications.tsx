import {
  ArrowPathIcon,
  BellAlertIcon,
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  InformationCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { useState } from "react";
import { Sidebar } from "~/components/SidebarAdmin";
import { requireAuth } from "~/services/auth.server";
import { fetchUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "~/utils/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { token } = await requireAuth(request);
  console.log("Token:", token); // Debug

  try {
    const [unread, all] = await Promise.all([
      fetchUserNotifications(token, false),
      fetchUserNotifications(token)
    ]);

    console.log("Unread:", unread); // Debug
    console.log("All:", all); // Debug

    return json({
      token,
      unreadCount: unread.length,
      notifications: all,
    });
  } catch (error) {
    console.error("Erreur API:", error); // Debug détaillé
    return json({
      unreadCount: 0,
      notifications: [],
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

// Empêcher la revalidation automatique de la page
export function shouldRevalidate() {
  return false;
}

export default function NotificationsPage() {
  const data = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const token = data?.token;

  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    revalidator.revalidate();
    // Simuler un délai pour l'animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;

    try {
      await markNotificationAsRead(id, token);
      setLocalNotifications((prev: Notification[]) =>
        prev.map((n: Notification) => n.id === id ? { ...n, is_read: true } : n)
      );
      setLocalUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;

    try {
      await markAllNotificationsAsRead(token);
      setLocalNotifications((prev: Notification[]) =>
        prev.map((n: Notification) => ({ ...n, is_read: true }))
      );
      setLocalUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon;
      case 'error':
        return XCircleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'info':
        return InformationCircleIcon;
      default:
        return BellIcon;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const baseColors = {
      success: isRead ? 'from-emerald-50 to-green-100 border-emerald-200' : 'from-emerald-100 to-green-200 border-emerald-300',
      error: isRead ? 'from-red-50 to-rose-100 border-red-200' : 'from-red-100 to-rose-200 border-red-300',
      warning: isRead ? 'from-amber-50 to-yellow-100 border-amber-200' : 'from-amber-100 to-yellow-200 border-amber-300',
      info: isRead ? 'from-blue-50 to-indigo-100 border-blue-200' : 'from-blue-100 to-indigo-200 border-blue-300',
      default: isRead ? 'from-gray-50 to-slate-100 border-gray-200' : 'from-blue-50 to-indigo-100 border-blue-200'
    };
    return baseColors[type as keyof typeof baseColors] || baseColors.default;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              {/* En-tête avec animation */}
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00296b] via-[#003f88] to-[#00509d] rounded-3xl transform -skew-y-1 shadow-2xl"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-br from-[#fdc500] to-[#ffd500] rounded-2xl shadow-lg">
                        <BellAlertIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent mb-2">
                          Centre de Notifications
                        </h1>
                        <p className="text-lg text-gray-600">
                          {localUnreadCount > 0
                            ? `${localUnreadCount} notification${localUnreadCount > 1 ? 's' : ''} non lue${localUnreadCount > 1 ? 's' : ''}`
                            : "Toutes les notifications sont lues"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
                      </button>
                      {localUnreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="bg-gradient-to-r from-[#fdc500] to-[#ffd500] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                        >
                          <CheckIcon className="h-5 w-5" />
                          <span>Tout marquer comme lu</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-gray-50/50"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Aperçu des Notifications
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:scale-110 transition-transform duration-300">
                          <BellIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Total</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {localNotifications.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 group-hover:scale-110 transition-transform duration-300">
                          <ClockIcon className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Non lues</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {localUnreadCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                          <EyeIcon className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Lues</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {localNotifications.length - localUnreadCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des notifications */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-[#00296b] to-[#003f88] px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">
                      Notifications Récentes
                    </h3>
                  </div>
                </div>

                <div className="p-8">
                  {localNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {localNotifications.map((notification: Notification) => {
                        const IconComponent = getNotificationIcon(notification.type || 'default');
                        const colorClass = getNotificationColor(notification.type || 'default', notification.is_read);

                        return (
                          <div
                            key={notification.id}
                            className={`relative group bg-gradient-to-r ${colorClass} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2`}
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-xl ${notification.is_read ? 'bg-gray-100' : 'bg-white/50'} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <IconComponent className={`h-6 w-6 ${notification.is_read ? 'text-gray-600' : 'text-blue-600'}`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <h3 className={`text-lg font-bold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'} group-hover:text-blue-900 transition-colors duration-300`}>
                                    {notification.title}
                                  </h3>
                                  <div className="flex items-center space-x-2 ml-4">
                                    {!notification.is_read && (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg">
                                        Nouveau
                                      </span>
                                    )}
                                    <span className="text-sm text-gray-500 whitespace-nowrap">
                                      {formatDate(notification.created_at)}
                                    </span>
                                  </div>
                                </div>

                                <p className={`mt-3 text-base ${notification.is_read ? 'text-gray-600' : 'text-gray-700'} leading-relaxed`}>
                                  {notification.message}
                                </p>

                                {!notification.is_read && (
                                  <div className="mt-4 flex justify-end">
                                    <button
                                      onClick={() => handleMarkAsRead(notification.id)}
                                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                                    >
                                      <CheckIcon className="h-4 w-4" />
                                      <span>Marquer comme lu</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // État vide
                    <div className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full shadow-lg">
                          <BellIcon className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-gray-600">
                            Aucune notification
                          </h3>
                          <p className="text-lg text-gray-500 max-w-md">
                            Vous n&apos;avez aucune notification pour le moment. Les nouvelles notifications apparaîtront ici.
                          </p>
                        </div>
                        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl border border-blue-200">
                          <div className="flex items-center space-x-3">
                            <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                            <p className="text-blue-800 font-medium">
                              Les notifications importantes apparaîtront automatiquement ici
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}