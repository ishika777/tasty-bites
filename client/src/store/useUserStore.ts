import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

const USER_API_END_POINT = import.meta.env.VITE_BACKEND_URL + "/api/v1/user"

type User = {
    fullname: string;
    email: string;
    contact: number;
    address: string;
    city: string;
    country: string;
    profilePicture: string;
    admin: boolean;
    isVerified: boolean;
};

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signup: (input: SignupInputState) => Promise<boolean>;
    login: (input: LoginInputState) => Promise<boolean>;
    verifyEmail: (verificationCode: string) => Promise<boolean>;
    checkAuthentication: () => Promise<boolean>;
    logout: () => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, newPassword: string) => Promise<boolean>;
    updateProfile: (input: any) => Promise<boolean>;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            loading: false,
            signup: async (input: SignupInputState): Promise<boolean> => {
                try {
                    set({ loading: true });
                    const response = await axios.post(
                        `${USER_API_END_POINT}/signup`,
                        input,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            loading: false,
                        });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
            login: async (input: LoginInputState): Promise<boolean> => {
                try {
                    set({ loading: true });
                    const response = await axios.post(
                        `${USER_API_END_POINT}/login`,
                        input,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            loading: false,
                        });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
            verifyEmail: async (verificationCode: string): Promise<boolean> => {
                try {
                    set({ loading: true });
                    const response = await axios.post(
                        `${USER_API_END_POINT}/verify-email`,
                        { verificationCode },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            loading: false,
                        });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
            checkAuthentication: async (): Promise<boolean> => {
                try {
                    set({ isCheckingAuth: true });
                    const response = await axios.get(`${USER_API_END_POINT}/check-auth`, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.data.success) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isCheckingAuth: false,
                        });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ isAuthenticated: false, isCheckingAuth: false });
                }
                return false;
            },
            logout: async (): Promise<boolean> => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${USER_API_END_POINT}/logout`, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ user: null, isAuthenticated: false, loading: false });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
            forgotPassword: async (email: string): Promise<boolean> => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${USER_API_END_POINT}/forgot-password`,{ email },{
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
            resetPassword: async (resetToken: string, newPassword: string): Promise<boolean> => {
                try {
                    set({ loading: true });
                    const response = await axios.post(
                        `${USER_API_END_POINT}/reset-password/${resetToken}`,
                        { newPassword },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false });
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
            updateProfile: async (input: any): Promise<boolean> => {
                try {
                    const response = await axios.put(
                        `${USER_API_END_POINT}/profile/update`,
                        input,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({user: response.data.user, isAuthenticated: true});
                        return true;
                    }
                } catch (error: any) {
                    console.log(error);
                    ({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
                return false;
            },
        }),
        {
            name: "user",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
