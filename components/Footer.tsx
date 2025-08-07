import Link from "next/link";
import { SiLinkedin } from "react-icons/si";
import { RxDividerVertical } from "react-icons/rx";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
    return (
        <div className="absolute bottom-1 mx-auto w-full text-sm">
            <div className="flex items-center justify-center text-gray-400">
                <span className="font-mono">Built by: </span>
                <Link
                    href={"https://www.linkedin.com/in/abrar-ansari-9b26b0323/"}
                    target="_blank"
                    className="ml-3 px-1"
                >
                    <SiLinkedin />
                </Link>
                <span>
                    <RxDividerVertical />
                </span>
                <Link
                    href={"https://x.com/abrarrr_21"}
                    target="_blank"
                    className="px-1"
                >
                    <BsTwitterX />
                </Link>
            </div>
        </div>
    );
};

export default Footer;
