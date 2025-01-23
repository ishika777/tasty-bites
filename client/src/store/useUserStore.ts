import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { USER_API_END_POINT } from "@/constants/constants";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

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
    signup: (input: SignupInputState) => Promise<void>;
    login: (input: LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    updateProfile: (input: any) => Promise<void>;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            loading: false,
            signup: async (input: SignupInputState) => {
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
                        toast(response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            loading: false,
                        });
                    }
                } catch (error: any) {
                    console.log(error);

                    set({ loading: false });
                    toast.error(error.response.data.message);
                }
            },
            login: async (input: LoginInputState) => {
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
                        toast(response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            loading: false,
                        });
                    }
                } catch (error: any) {
                    console.log(error);

                    set({ loading: false });
                    toast.error(error.response.data.message);
                }
            },
            verifyEmail: async (verificationCode: string) => {
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
                        toast(response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            loading: false,
                        });
                    }
                } catch (error: any) {
                    console.log(error);

                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
            },
            checkAuthentication: async () => {
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
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ isAuthenticated: false, isCheckingAuth: false });
                }
            },
            logout: async () => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${USER_API_END_POINT}/logout`, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.data.success) {
                        toast(response.data.message);
                        set({ user: null, isAuthenticated: false, loading: false });
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
            },
            forgotPassword: async (email: string) => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${USER_API_END_POINT}/forgot-password`,{ email },{
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.data.success) {
                        set({ loading: false });
                        toast(response.data.message);
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
            },
            resetPassword: async (resetToken: string, newPassword: string) => {
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
                    }
                } catch (error: any) {
                    console.log(error);
                    set({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
            },
            updateProfile: async (input: any) => {
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
                        toast.success   (response.data.message);
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                        });
                    }
                } catch (error: any) {
                    console.log(error);
                    ({ loading: false });
                    toast.error(error.response?.data.message || error.message);
                }
            },
        }),
        {
            name: "user",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
