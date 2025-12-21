"use client";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { UserProfile, Expense, SavingsGoal } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getAuth } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

const { firestore, auth } = initializeFirebase();

export async function getUser(uid: string): Promise<UserProfile | null> {
  try {
    if (!uid) return null;

    const userRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    return { uid, ...userDoc.data() } as UserProfile;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function getExpenses(userId: string): Promise<Expense[]> {
  try {
    if (!userId) return [];

    const expensesRef = collection(firestore, "users", userId, "expenses");
    const querySnapshot = await getDocs(expensesRef);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Expense)
    );
  } catch (error) {
    console.error("Error getting expenses:", error);
    return [];
  }
}

export async function addExpense(userId: string, expenseData: Omit<Expense, 'id' | 'userId' | 'date'>) {
    if (!userId) throw new Error("User not authenticated");
    
    const expensePayload = {
      ...expenseData,
      date: serverTimestamp(),
      userId: userId,
    };

    const expensesRef = collection(firestore, "users", userId, "expenses");
    await addDoc(expensesRef, expensePayload);
}


export async function getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
  try {
    if (!userId) return [];

    const goalsRef = collection(firestore, "users", userId, "savingsGoals");
    const querySnapshot = await getDocs(goalsRef);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as SavingsGoal)
    );
  } catch (error) {
    console.error("Error getting savings goals:", error);
    return [];
  }
}

export async function addSavingsGoal(userId: string, goalData: Omit<SavingsGoal, 'id' | 'userId' | 'currentAmount'>) {
    if (!userId) throw new Error("User not authenticated");

    const newGoalData = {
        ...goalData,
        currentAmount: 0,
        userId: userId,
    };

    const goalsRef = collection(firestore, "users", userId, "savingsGoals");
    await addDoc(goalsRef, newGoalData);
}

export async function updateUserSettings(userId: string, settingsData: Partial<UserProfile>) {
    if (!userId) throw new Error("User not authenticated");

    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, settingsData, { merge: true });
}
