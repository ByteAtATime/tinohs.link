import { vi } from "vitest";
import type { IAuthProvider } from "../types/auth";

export class MockAuthProvider implements IAuthProvider {
    isAuthenticated = vi.fn();
}
