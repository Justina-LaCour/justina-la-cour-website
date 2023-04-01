import type { User } from "firebase/auth";
import { writable } from "svelte/store";

export const adminUser = writable<User | null>(null);
