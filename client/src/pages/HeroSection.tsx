import { useState, KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HeroSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  const clickHandler = () => {
    if(!searchText){
        toast.error("Enter name, city or country")
        return;
    }
    navigate(`/search/${searchText}`)
  }

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-4">
      <div className="flex flex-col gap-10 md:w-[40%] ">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
            Order Food anytime and anywhere
          </h1>
          <p className="text-gray-500">
            Hey! Our delicious food is waiting for you, we are always near to
            you.
          </p>
        </div>

        <div className="relative flex items-center justify-between gap-2">
          <div onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter') {
                  clickHandler();
                }
              }} className="flex-1 w-full">
            <Input
              type="text"
              value={searchText}
              placeholder="Search restaurants by name, city & country"
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10  shadow-lg focus-visible:ring-1"
            />
            <Search className="text-gray-600 absolute inset-y-2 left-2" />
          </div>
          <Button
            onClick={clickHandler}
            className="bg-orange hover:bg-hoverOrange"
          >
            Search
          </Button>
        </div>
      </div>

      <div>
        <img
          className="object-contain w-full max-h-[500px] max-w-[90%]"
          src="/hero image.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroSection;
