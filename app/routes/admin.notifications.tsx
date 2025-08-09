import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Sidebar } from "~/components/SidebarAdmin";
import { requireAuth } from "~/services/auth.server";
import { fetchUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "~/utils/api";

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

export default function NotificationsPage() {
  const { unreadCount, notifications, token } = useLoaderData<typeof loader>();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id, token);
      setLocalNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);
      setLocalNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar fixe */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Contenu principal avec défilement */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            <div className="space-y-4">
              {localNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${!notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{notification.message}</p>
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}