"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  itemId: string;
  type: string;
}

function EditDeleteAction({ itemId, type }: Props) {
  const pathname = usePathname();
  const router = useRouter()
  
  const handleEdit = async () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`)
  };

  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };

  return (
    <div className="flex justify-end gap-2 max-sm:w-full sm:gap-3">
      {type === "Question" && (
        <Image
          src={"/assets/icons/edit.svg"}
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src={"/assets/icons/trash.svg"}
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
}

export default EditDeleteAction;
