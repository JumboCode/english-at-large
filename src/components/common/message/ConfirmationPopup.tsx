"use client";
import CheckCircleIcon from "@/assets/icons/CheckCircle";
import FailCircleIcon from "@/assets/icons/FailCircle";
import CloseIcon from "@/assets/icons/Close";
import { useState } from "react";

interface SuccessProps {
    message: string;
    success: boolean;
}

const ConfirmationPopup = (props: SuccessProps) => {
    const {message, success} = props;
    const [shown, setShown] = useState(true)

    return (
        <div className={"bottom-[15px] right-[15px] shadow-lg rounded-b-lg " + (shown ? "fixed" : "hidden")}>
            <div className={"h-1 " + (success ? "bg-green-500" : "bg-red-500")}></div>
            <div className="flex flex-row gap-x-[100px] p-3">
                <div className="flex flex-row gap-x-1">
                    <div className="my-auto">{success ? <CheckCircleIcon /> : <FailCircleIcon />}</div>
                    <div>{message}</div>
                </div>
                <div className="my-auto">
                    <button onClick={() => {setShown(false)}}><CloseIcon /></button>
                </div>
            </div>
        </div> 
    )
}

export default ConfirmationPopup;