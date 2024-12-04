import Content from "@/components/centralContent";
import { LeftSidebar } from "./components/LeftSidebar";

export default function Home() {
    return (
        <div className="flex min-h-screen">
            <div className="pr-10 min-w-[250px]"
            >
                <LeftSidebar />
            </div>

            <div className="w-3/4 p-6">
                <Content />
            </div>
        </div>
    );
}
