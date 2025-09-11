// DI.types.ts
import { ToastType } from "@/components/Common/Toast/Toast";
import { GlobalState } from "../services/GlobalState";
import { usePathname } from "next/navigation";

export interface RequestMethods {
  GET: Function;
  DELETE: Function;
  PATCH: Function;
  POST: Function;
  PUT: Function;
}

export interface EventMethods {
  logEvent: (data: any) => Promise<any>;
}

export interface ToastService {
  show: (message: string, type: ToastType, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warn: (message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export interface DIProps {
  globalState?: {
    set: typeof GlobalState.set;
    get: typeof GlobalState.get;
    remove: typeof GlobalState.remove;
    reset: typeof GlobalState.reset;
  };
  request?: RequestMethods;
  events?: EventMethods;  // Add events API
  redux?: any;
  dispatch?: Function;
  location?: ReturnType<typeof usePathname>;
  toast?: ToastService;
}