
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSavingsGoal } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useUser, useFirestore } from "@/firebase";
import { SavingsGoal } from "@/lib/types";

type Props = {
  goal: SavingsGoal;
  isOpen: boolean;
  onClose: () => void;
  onGoalUpdated: () => void;
};

export default function EditGoalDialog({
  goal,
  isOpen,
  onClose,
  onGoalUpdated,
}: Props) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      await updateSavingsGoal(firestore, user.uid, goal.id, {
        name: String(formData.get("name")),
        targetAmount: Number(formData.get("targetAmount")),
        currentAmount: Number(formData.get("currentAmount")),
        deadline: new Date(String(formData.get("deadline"))),
        category: String(formData.get("category")) as SavingsGoal['category'],
      });

      toast({ title: "Updated successfully" });

      onGoalUpdated();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err?.message,
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const deadline =
    goal.deadline?.toDate?.().toISOString().split("T")[0] ?? "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>Update your savings goal</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Goal Name</Label>
            <Input name="name" defaultValue={goal.name} required />
          </div>

          <div>
            <Label>Target Amount</Label>
            <Input
              name="targetAmount"
              type="number"
              defaultValue={goal.targetAmount}
              required
            />
          </div>

          <div>
            <Label>Current Amount</Label>
            <Input
              name="currentAmount"
              type="number"
              defaultValue={goal.currentAmount}
              required
            />
          </div>

          <div>
            <Label>Deadline</Label>
            <Input name="deadline" type="date" defaultValue={deadline} />
          </div>

          <div>
            <Label>Category</Label>
            <Select name="category" defaultValue={goal.category}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Gadget">Gadget</SelectItem>
                <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Down Payment">Down Payment</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
