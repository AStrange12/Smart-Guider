
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
import { updateExpense } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useUser, useFirestore } from "@/firebase";
import { Expense } from "@/lib/types";

type Props = {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
  onExpenseUpdated: () => void;
};

export default function EditExpenseDialog({
  expense,
  isOpen,
  onClose,
  onExpenseUpdated,
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

      await updateExpense(firestore, user.uid, expense.id, {
        description: String(formData.get("description")),
        amount: Number(formData.get("amount")),
        category: String(formData.get("category")),
        type: String(formData.get("type")) as "need" | "want",
      });

      toast({ title: "Expense updated" });

      onExpenseUpdated();
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Update the details of your transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              defaultValue={expense.description}
              required
            />
          </div>

          <div>
            <Label>Amount (₹)</Label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              defaultValue={expense.amount}
              required
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select name="category" defaultValue={expense.category}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="EMI">EMI</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select name="type" defaultValue={expense.type}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="need">Need</SelectItem>
                <SelectItem value="want">Want</SelectItem>
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
