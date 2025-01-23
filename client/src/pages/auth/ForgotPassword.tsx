import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/store/useUserStore'
import { Loader2, Mail } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from "sonner"


const ForgotPassword = () => {

    const [email, setEmail] = useState<string>("")
    const [loading, setLoading] = useState(false);
    
    const {forgotPassword} = useUserStore()

    const submitHnadler = async(e: FormEvent) => {
        e.preventDefault();
        if(!email){
            toast.error("Enter email-id")
            return;
        }
        try {
            setLoading(true)
            await forgotPassword(email);
            setEmail("");
        } catch (error) {
            setLoading(false)
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
        <form onSubmit={submitHnadler} className='flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4'>
            <div className='text-center'>
                <h1 className='font-extrabold text-2xl mb-2'>Forgot Password</h1>
                <p className='text-sm text-gray-600'>Enter your email address to reset your password</p>

            </div>
            <div className="relative">
                <Input 
                type='text'
                value={email}
                name='email'
                onChange={(e : ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder='Enter you email'
                  className="pl-11 focus-visible:ring-1"
                />
                 <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
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
              Send Reset Link
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

export default ForgotPassword