import { useState } from "react";
import { MessageSquare, LayoutDashboard, Users } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Button } from "../components/common/Button";
import { MessageInbox } from "../components/admin/MessageInbox";
import { AnalyticsDashboard } from "../components/admin/AnalyticsDashboard";
import { useAuth } from "../context/AuthContext";
import { getGreeting } from "../utils/dateTime";
import { UsersListPage } from "./UsersListPage";

export const AdminDashboard = () => {
    const [showMessages, setShowMessages] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [showUsers, setShowUsers] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
            <Header
                username={user?.username || ""}
                
            />

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-[#2C3E50]">
                            {getGreeting()}, Admin
                        </h2>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => {
                                    setShowAnalytics(true);
                                    setShowMessages(false);
                                    setShowUsers(false);
                                }}
                                className={`flex items-center gap-2 ${
                                    showAnalytics
                                        ? "bg-[#2C3E50]"
                                        : "bg-gray-500"
                                }`}
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                Dashboard
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowAnalytics(false);
                                    setShowMessages(false);
                                    setShowUsers(!showUsers);
                                }}
                                className={`flex items-center gap-2 ${
                                  showUsers
                                      ? "bg-[#2C3E50]"
                                      : "bg-gray-500"
                              }`}
                            >
                                <Users className="h-5 w-5" />
                                Users
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowMessages(!showMessages);
                                    setShowAnalytics(false);
                                    setShowUsers(false);
                                }}
                                className={`flex items-center gap-2 ${
                                    showMessages
                                        ? "bg-[#2C3E50]"
                                        : "bg-gray-500"
                                }`}
                            >
                                <MessageSquare className="h-5 w-5" />
                                Messages
                            </Button>
                        </div>
                    </div>

                    {showMessages ? (
                        <MessageInbox />
                    ) : showAnalytics ? (
                        <AnalyticsDashboard />
                    ) : showUsers ? (
                        <UsersListPage />
                    ) : null}
                </div>
            </main>
        </div>
    );
};
