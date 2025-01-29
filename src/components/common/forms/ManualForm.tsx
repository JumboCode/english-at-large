"use client"; 
import BookForm from "../../BookForm"; 
import {Book} from "@prisma/client"

interface ManualFormProps {
    exit: () => void;
    existingBook?: Book | null;
    onSave?: (arg0: Book | null) => void;
}

const ManualForm = (props: ManualFormProps) => {
    const { exit, existingBook, onSave } = props;

    return (
        <div>
            <BookForm 
                exit={exit}
                existingBook={existingBook}
                onSave={onSave}
            />
        </div>
    );
}

export default ManualForm;