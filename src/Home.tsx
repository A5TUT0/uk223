import Content from "@/components/centralContent";
import { LeftSidebar } from "./components/LeftSidebar";

export default function Home() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/4 p-4 ">
                <LeftSidebar />
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6">
                <Content />
            </div>
        </div>
    );
}
