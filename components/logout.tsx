import { authClient } from "@/lib/auth-client";

export default function Logout() {
    return (
        <button
            onClick={() => {
                authClient.signOut().then(() => {
                    window.location.href = "/";
                });
            }}
        >
            Logout
        </button>
    );
}