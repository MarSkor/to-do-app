import { useDroppable } from "@dnd-kit/core";

const ListWrapper = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className="todo__list-wrapper" ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
};
export default ListWrapper;
