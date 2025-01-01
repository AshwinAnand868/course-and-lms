'use client';

import ReactConfetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {

    const confettiStore = useConfettiStore();

    if(!confettiStore.isOpen) return;

    return (
        <ReactConfetti
            className="z-[100]"
            numberOfPieces={1000}
            recycle={false}
            onConfettiComplete={() => {
                confettiStore.onClose();
            }}
        />
    )
}