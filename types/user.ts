export interface User {
    name: string;
    email: string;
    role: string;
    token: string;
    id: string;
}

export interface CustomJwtPayload {
    username: string;
    email: string;
    role: string;
    id: string;
    exp?: number;
}


export interface UserSession {
    user: User | null;
    isAuthenticated: boolean;
}