import { useLogout } from "@/hooks/auth";
import { LogOutIcon } from "lucide-react";

const LogOut = () => {
  const { logout } = useLogout();

  const userName = localStorage.getItem("username") || "User";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between w-full relative">
      {/* Avatar & Username */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-9 h-9 flex items-center justify-center rounded-full text-white font-semibold bg-primary">
          {initial}
        </div>
      </div>

      {/* Logout Icon */}
      <button
        onClick={() => logout()}
        className="ml-5 text-black hover:cursor-pointer"
      >
        <LogOutIcon />
      </button>
    </div>
  );
};

export default LogOut;
