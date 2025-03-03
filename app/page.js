import Welcome from "@/components/Welcome";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Welcome />
            <div className="flex flex-col gap-4 items-center mt-8">
                <Link 
                    href="/create-account" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48 text-center"
                >
                    新增遊戲帳號
                </Link>
                <Link 
                    href="/edit-account" 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-48 text-center"
                >
                    變更遊戲帳號資料
                </Link>
                <Link 
                    href="/delete-account" 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-48 text-center"
                >
                    刪除遊戲帳號
                </Link>
            </div>
        </>
    );
}
