import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";
import { useState } from "react";

const ListItem = ({ item, handleEdit, handleDelete }) => {
  const [content, setContent] = useState(item.content);
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const saveTodo = async () => {
    if (!content.trim()) {
      toast.error("Task cannot be empty");
      setContent(item.content);
      setIsEditing(false);
      return;
    }
    if (content === item.content) {
      setIsEditing(false);
      return;
    }

    await handleEdit(item.id, { content });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveTodo();
    }
    if (e.key === "Escape") {
      setContent(item.content);
      setIsEditing(false);
    }
  };

  return (
    <li
      className="todo__list-item"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="todo__list-item--content-wrapper">
        <div {...listeners} className="todo__list-item--drag-handle">
          <img src="/assets/images/icon-drag.svg" alt="drag to do" />
        </div>

        <input
          type="checkbox"
          checked={item.isComplete}
          id={`checkbox-${item.id}`}
          className="todo__list-item--checkbox"
          onChange={(e) => {
            handleEdit(item.id, { isComplete: e.target.checked });
          }}
        />
        {isEditing ? (
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={saveTodo}
            className="todo__list-item--edit-box"
            onKeyDown={handleKeyDown}
            rows={3}
          />
        ) : (
          <span
            className={`todo__list-item--text-display ${item.isComplete ? "completed" : ""}`}
            onClick={() => setIsEditing(true)}
          >
            {content}
          </span>
        )}
      </div>

      <button
        className="todo__list-item--delete-btn"
        onClick={() => handleDelete(item.id)}
        aria-label="Delete todo"
      >
        <img src="/assets/images/icon-cross.svg" alt="delete to-do" />
      </button>
    </li>
  );
};

export default ListItem;
