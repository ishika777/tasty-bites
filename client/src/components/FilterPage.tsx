import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox";
import { useRestaurantStore } from "@/store/useRestaurantStore";

export type FilterOptionState = {
    id : string;
    label : string;
}

const filterOptions : FilterOptionState[] = [
    {
        id : "burger",
        label : "Burger"
    },
    {
        id : "thali",
        label : "Thali"
    },
    {
        id : "biryani",
        label : "Biryani"
    },
    {
        id : "momos",
        label: "Momos"
    },
    {
        id : "pizza",
        label : "Pizza"
    }
]

const FilterPage = () => {

    const {setAppliedFilter, appliedFilter, resetAppliedFilter} = useRestaurantStore();

    const applyFilterHandler = (label : string) => {
        setAppliedFilter(label);
    }

  return (
    <div className="md:w-72">
        <div className="flex items-center justify-between">
            <h1 className="font-medium text-lg">Filter by cuisines</h1>
            <Button variant={"link"} onClick={resetAppliedFilter} className="">Reset</Button>
        </div>
        {
            filterOptions.map((option) => (
                <div key={option.id} onClick={() => applyFilterHandler(option.label)} className="flex items-center space-x-2 my-5">
                        <Checkbox
                        checked={appliedFilter.includes(option.label)}
                        id={option.id}
                        onChange={() => applyFilterHandler(option.label)}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option.label}</label>
                </div>
            ))
        }
    </div>
  )
}

export default FilterPage