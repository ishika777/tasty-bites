import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/store/useUserStore'
import { Eye, EyeOff, Loader2, LockKeyhole, Moon, Sun } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/store/useThemeStore";


const ResetPassword = () => {

    const params = useParams<{ resetToken: string }>();
    const resetToken = params.resetToken as string;

    const {setTheme} = useThemeStore();

    const {resetPassword} = useUserStore();
    
    const [newPassword, setNewPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);


    const submitHandaler = async(e: FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await resetPassword(resetToken, newPassword);
        } catch (error) {
            setLoading(false)
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen w-full'>
            <div className="absolute top-8 right-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <form onSubmit={submitHandaler} className='flex flex-col gap-5 md:border border-gray-300 md:p-8 w-full max-w-md rounded-lg mx-4'>
                <div className='text-center'>
                    <h1 className='font-extrabold text-center text-2xl mb-2'>Reset Password</h1>
                    <p className='text-sm text-gray-600'>Enter your new password</p>

                </div>
                <div className="relative">
                <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />

                    <Input
                        type={seePassword ? "text" : "password"}
                        value={newPassword}
                        name='email'
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        placeholder='Enter you new password'
                        className="pl-11 focus-visible:ring-1 pr-11"
                    />
                    {
                            seePassword ? (
                                    <Eye size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                            ) : (
                                
                                    <EyeOff size={18} onClick={() => setSeePassword(!seePassword)} className="absolute inset-y-2 right-2 top-3 text-gray-500" />
                            )
                        }
                </div>

                <div>
                    {loading ? (
                        <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-orange hover:bg-hoverOrange"
                        >
                            Reset
                        </Button>
                    )}
                    <div className="mt-3 text-center">
                        Back to{" "}
                        <Link to="/login" className='text-blue-500 hover:underline'>Login</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword