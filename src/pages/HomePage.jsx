import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ListItem from "../components/ListItem";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import ListFooterInfo from "../components/ListFooterInfo";
import { useForm } from "react-hook-form";
import errorHandler from "../utils/errorHandler";
import Pagination from "../components/Pagination";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState({
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  });
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, [filter, page]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        limit: 10, //matching backend
        filter: filter === "all" ? "" : filter,
      }).toString();

      const res = await api.get(`/todos?${queryParams}`);
      setItems(res.data);
    } catch (error) {
      toast.error("Could not load tasks.");
      if (error.response && error.response.status === 404) {
        setItems({ data: [], pagination: { totalItems: 0 } });
      } else {
        toast.error("Could not load tasks.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ content: "" });
    }
  }, [isSubmitSuccessful, reset]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.data.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = prevItems.data.findIndex(
          (item) => item.id === over.id,
        );

        const newSortedData = arrayMove(prevItems.data, oldIndex, newIndex);
        return {
          ...prevItems,
          data: newSortedData,
        };
      });
    }
  };

  const onSubmit = async (value) => {
    if (isSubmitting || !value.content?.trim()) return;
    try {
      const res = await api.post("/todos", value);
      if (res.status === 201) {
        const newTodo = res.data;
        setItems((prevState) => ({
          ...prevState,
          data: [newTodo, ...prevState.data],
          pagination: {
            ...prevState.pagination,
            totalItems: (prevState.pagination?.totalItems || 0) + 1,
          },
        }));

        toast.success("Task created successfully!");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((validationError) => {
          setError(validationError.path, {
            type: "server",
            message: validationError.msg,
          });
        });
      } else {
        const message = errorHandler(error);
        setGlobalError(message);
        toast.error(message);
      }
    }
  };

  const handleEdit = async (todoId, updates) => {
    try {
      const res = await api.patch(`/todos/${todoId}`, updates);
      if (res.status === 200) {
        const updatedTodo = res.data;
        setItems((prev) => ({
          ...prev,
          data: prev.data.map((todo) =>
            todo.id === todoId ? updatedTodo : todo,
          ),
        }));
        toast.success("Task updated!");
      }
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      toast.success("Task Deleted.");
      fetchData();
    } catch (err) {
      console.error("Error deleting", err);
      toast.error("Failed to delete task.");
      fetchData();
    }
  };

  const clearCompleted = async () => {
    try {
      setItems((prev) => {
        const remainingTodos = prev.data.filter((item) => !item.isComplete);
        return {
          ...prev,
          data: remainingTodos,
          pagination: {
            ...prev.pagination,
            totalItems: remainingTodos.length,
          },
        };
      });
      await api.delete(`/todos/completed`);
      toast.success("Successfully cleared completed tasks.");
    } catch (error) {
      toast.error("Failed to clear completed tasks.");
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <section className="todo__list-section">
      {globalError && (
        <div className="global-form-error">
          <p>{globalError}</p>
        </div>
      )}
      <section className="todo__form-wrapper">
        <form className="todo__form" onSubmit={handleSubmit(onSubmit)}>
          <label className="todo__list-item-label">
            <input
              className="todo__list-item-input"
              type="checkbox"
              id="disabled-checkbox"
              name="checkbox"
              disabled={true}
            />
          </label>
          <input
            className="todo__text-input"
            type="text"
            placeholder="Create a new todo..."
            disabled={isSubmitting}
            {...register("content", {
              required: "Todo content is required.",
              maxLength: {
                value: 240,
                message: "Content is too long (Max 240).",
              },
            })}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isSubmitting) {
                e.preventDefault();
              }
            }}
          />

          <button
            disabled={isSubmitting}
            type="submit"
            style={{ display: "none" }}
          />
        </form>
        {errors.content && (
          <span className="inputHasError">{errors.content.message}</span>
        )}
      </section>

      <ul className="todo__list-wrapper">
        {isLoading && items.data.length === 0 ? (
          <p className="todo__filtering">Loading items...</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.data}
              strategy={verticalListSortingStrategy}
            >
              {items.data?.map((item) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {!isLoading && items.data.length === 0 && (
          <p className="todo__filtering">No items found.</p>
        )}
      </ul>

      <ListFooterInfo
        data={items.pagination}
        filter={filter}
        setFilter={setFilter}
        handleFilterChange={handleFilterChange}
        clearCompleted={clearCompleted}
      />

      <Pagination pagination={items.pagination} setPage={setPage} />

      <footer className="todo__footer">
        <p>Drag and drop to reorder list</p>
      </footer>
    </section>
  );
};

export default HomePage;
