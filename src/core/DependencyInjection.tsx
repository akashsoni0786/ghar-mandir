"use client";
import ErrorBoundary from "../services/ErrorBoundary";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../services/GlobalState";
import { request } from "../services/Request";
import { usePathname } from "next/navigation";
import { ToastService } from "./DI.types";
import { useToast } from "@/components/Common/Toast/ToastProvider";

type DependencyInjectionProps = {
  [key: string]: any;
};

const DependencyInjection = <P extends object>(
  WrappedComponent: React.ComponentType<P & DependencyInjectionProps>
) => {
  const DIWrapper = React.forwardRef<any, P>((props, ref) => {
    const { showToast } = useToast();

    const toast: ToastService = {
      show: showToast,
      error: (message, duration) => showToast(message, "error", duration),
      warn: (message, duration) => showToast(message, "warn", duration),
      success: (message, duration) => showToast(message, "success", duration),
      info: (message, duration) => showToast(message, "info", duration),
    };
    
    const store = useSelector((state: typeof GlobalState) => state);
    const location = usePathname();
    const dispatch = useDispatch();

    // Prepare dependencies object
    const dependencies = {
      globalState: {
        set: GlobalState.set(),
        get: GlobalState.get(),
        remove: GlobalState.remove(),
        reset: GlobalState.reset(),
      },
      request: {
        GET: request.GET(store),
        DELETE: request.DELETE(store),
        PATCH: request.PATCH(store),
        POST: request.POST(store),
        PUT: request.PUT(store),
      },
      events: {
        logEvent: (data: any) => request.POST(store)('/events/eventsLogs',data)
      },
      redux: store,
      dispatch,
      location,
      toast,
    };
    
    return (
      <ErrorBoundary>
        <WrappedComponent
          {...(props as P)}
          {...dependencies}
          ref={ref}
        />
      </ErrorBoundary>
    );
  });
  
  DIWrapper.displayName = `DI(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return DIWrapper;
};

export default DependencyInjection;
export const DI = DependencyInjection;