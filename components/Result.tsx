type ResultProps = {
    response: string;
};

export default function Result({ response }: ResultProps) {
    return (
        <div className="w-9/12 min-h-10 md:w-full md:min-h-16 border-2 rounded-md border-zinc-500 bg-gray-400/30 shadow-lg text-white flex justify-center items-center">
            <div className=" p-2 m-1 ">{response}</div>
        </div>
    );
}
