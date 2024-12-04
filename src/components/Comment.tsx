import { useState } from 'react';

interface CommentProps {
    id: number;
    username: string;
    content: string;
    creationDate: string;
    userId: number;
    currentUserId: number | null;
    canModerate: boolean;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
}

export function Comment({
    id,
    username,
    content,
    creationDate,
    userId,
    currentUserId,
    canModerate,
    onDelete,
    onEdit,
}: CommentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const canEditOrDelete = currentUserId === userId || canModerate;

    console.log('Comment Render:', {
        id,
        userId,
        currentUserId,
        canModerate,
        canEditOrDelete: currentUserId === userId || canModerate,
    });


    const handleEditSave = () => {
        if (editedContent.trim()) {
            onEdit(id, editedContent);
            setIsEditing(false);
        }
    };

    return (
        <div className="border-b pb-2 mb-4">
            <p>
                <strong>{username}</strong> - {new Date(creationDate).toLocaleString()}
            </p>
            {isEditing ? (
                <div className="mt-2">
                    <textarea
                        className="w-full p-2 border rounded bg-gray-800 text-white"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="flex space-x-2 mt-2">
                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                            onClick={handleEditSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mt-2 text-gray-300">{content}</p>
            )}
            {/* Botones visibles solo si el usuario actual puede editar/eliminar */}
            {canEditOrDelete && !isEditing && (
                <div className="mt-2 flex space-x-2">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={() => onDelete(id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
