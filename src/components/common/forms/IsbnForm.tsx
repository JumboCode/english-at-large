"use client"; 
import BookForm from "../../BookForm"; 
import {Book} from "@prisma/client"

interface IsbnFormProps {
    exit: () => void;
    existingBook?: Book | null;
    onSave?: (arg0: Book | null) => void;
    isbn: string;
}

const IsbnForm = (props: IsbnFormProps) => {
    const { exit, existingBook, onSave, isbn } = props;

    return (
        <div>
            <BookForm 
                exit={exit}
                existingBook={existingBook}
                onSave={onSave}
                isbn={isbn}
            />
        </div>
    );
}

export default IsbnForm;