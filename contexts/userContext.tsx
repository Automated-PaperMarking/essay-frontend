'use client';


import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { jwtDecode } from "jwt-decode";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { CustomJwtPayload, User, UserSession } from '@/types/user';

interface UseContextValue extends UserSession {
    updateAccessToken: (token: string | null) => void;
    isChecking: boolean;
    setIsChecking: (isChecking: boolean) => void;
    logout: () => void;
}

interface UserContextProps {
    children: ReactNode;
    initialSession?: UserSession;
}

const UserContext = createContext<UseContextValue | undefined>(undefined);

export const UserProvider: React.FC<UserContextProps> = ({
    children,
    initialSession
}) => {
    const [session, setSession] = useState<UserSession>(
        initialSession || { user: null, isAuthenticated: false }
    );
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkStoredToken = () => {
            try {
                const storedToken = getCookie('accessToken');
                if (typeof storedToken === 'string') {
                    const decodedToken = jwtDecode<CustomJwtPayload>(storedToken);

                    // Check token expiration
                    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
                        // Token expired
                        deleteCookie('accessToken');
                        setSession({ user: null, isAuthenticated: false });
                        setIsChecking(false);
                        return;
                    }

                    const user: User = {
                        name: decodedToken.username,
                        email: decodedToken.username,
                        role: decodedToken.role,
                        token: storedToken,
                        id: decodedToken.id,
                    };
                    setSession({
                        user,
                        isAuthenticated: true
                    });
                }
            } catch (error) {
                deleteCookie('accessToken');
                setSession({ user: null, isAuthenticated: false });
            } finally {
                setIsChecking(false);
            }
        };

        checkStoredToken();
    }, []);

    const updateAccessToken = (token: string | null) => {
        try {
            if (typeof token === 'string') {
                setCookie('accessToken', token);
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                const user: User = {
                    name: decodedToken.username,
                    email: decodedToken.username,
                    role: decodedToken.role,
                    token: token,
                    id: decodedToken.id,
                };

                setSession({
                    user,
                    isAuthenticated: true
                });
            } else {
                deleteCookie('accessToken');
                setSession({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            deleteCookie('accessToken');
            setSession({ user: null, isAuthenticated: false });
        }
    };

    const logout = () => {
        deleteCookie('accessToken');
        setSession({ user: null, isAuthenticated: false });
    };

    const value = useMemo(
        () => ({
            ...session,
            updateAccessToken,
            isChecking,
            setIsChecking,
            logout
        }),
        [session, isChecking]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UseContextValue => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};