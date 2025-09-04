import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface CheckoutStepContainerProps {
    children: ReactNode;
    stepId: string;
    isActive: boolean;
}

const stepVariants = {
    hidden: {
        opacity: 0,
        x: 100,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        x: -100,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export function CheckoutStepContainer({ children, stepId, isActive }: CheckoutStepContainerProps) {
    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    key={stepId}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                >
                    <motion.div variants={containerVariants}>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
