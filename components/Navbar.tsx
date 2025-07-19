import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Logout from "./Logout";
import XeroConnectButton from "./XeroConnectButton";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b bg-background w-full flex items-center">
      <div className="flex w-full items-center justify-between my-4 px-4">

        {/* ✅ Client Component Button */}
        <XeroConnectButton />

        <div className="flex items-center gap-x-5">
          <Link href="/private" className="text-sm hover:underline">
            Private
          </Link>

          {!user ? (
            <Link href="/login">
              <div className="bg-blue-600 text-white text-sm px-4 py-2 rounded-sm hover:bg-blue-700 transition">
                Login
              </div>
            </Link>
          ) : (
            <>
              <span className="text-sm text-gray-700">{user.email}</span>
              <Logout />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
