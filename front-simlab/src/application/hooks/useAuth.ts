import { useAuthContext } from "../../presentation/contexts/AuthContext";

export const useAuth = () => {
    return useAuthContext();
}