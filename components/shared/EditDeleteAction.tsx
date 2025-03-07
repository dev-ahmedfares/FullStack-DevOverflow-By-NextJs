"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  itemId: string;
  type: string;
}

function EditDeleteAction({ itemId, type }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = async () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  const handleDelete = async () => {
    if (type === "Question") {
      const res = await deleteQuestion({
        questionId: JSON.parse(itemId),
        path: pathname,
      });

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success(res?.success);
      }
      
    } else if (type === "Answer") {
      const res = await deleteAnswer({
        answerId: JSON.parse(itemId),
        path: pathname,
      });

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success(res?.success);
      }
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
