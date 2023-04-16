import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
/*First Page is Always Sign in for Node Number*/
export default function Index(){
    const router = useRouter();
    const {
		register,
		watch,
        reset,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            node:""
        },
        criteriaMode: "all"
    });

    const submitNode = async (data) => {
        console.log(data);
        router.replace(`${data.node}`);

        reset();
        clearErrors();
    }

    const onError = () => {
        console.log(errors)
    };


    return (<>
        <div className=" font-rale w-screen h-screen flex flex-col place-content-center place-items-center">
            <form onSubmit={handleSubmit(submitNode, onError)} className="p-5 border rounded-md flex flex-col items-center">
                <p className="text-lg">Please enter your node number: </p>
                <input type="text" {...register("node", {
                    required: true,
                    pattern: new RegExp("^[0-9]*$"),
                    validate: {
                        minimum: (value) => parseInt(value) >= 1,
                        maximum: (value) => parseInt(value) <= 3
                    }})}
                    className='mt-2 py-2 px-5 text-black text-center font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Node' autoComplete="off"
                />

                <button className="mt-5 italic font-medium hover:bg-gray-200 py-1 px-5 border rounded-full bg-gray-100">Submit</button>

                <div className="mt-2">
                    {errors.node?.type === "required" && <p className="text-rose-700">Error: Input your node number!</p>}
                    {errors.node?.type === "pattern" && <p className="text-rose-700">Error: Invalid Input!</p>}
                    {errors.node?.type === "minimum" && <p className="text-rose-700">Error: Your Node is Below 1!</p>}
                    {errors.node?.type === "maximum" && <p className="text-rose-700">Error: Your Node is Above 3!</p>}
                </div>
            </form>
        </div>
    
    
    
    </>);






}