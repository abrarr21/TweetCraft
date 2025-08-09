import { Copy } from "lucide-react";

interface copyToClipboardProp {
    copyText: () => void;
}
export default function CopyShare({ copyText }: copyToClipboardProp) {
    return (
        <div className="relative mt-6 w-11/12 bg-red-300 md:mt-6 md:w-7/12">
            <div className="absolute right-2 md:right-5">
                <Copy
                    onClick={copyText}
                    className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-zinc-400 md:h-5 md:w-5"
                />
            </div>
        </div>
    );
}
