import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { ErrorModal } from "../components/ErrorModal";

type OpenAlertOptions = {
  title?: string;
  actionLabel?: string;
  onConfirm?: () => void;
};

type OpenConfirmOptions = {
  title?: string;
  actionLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

type ErrorModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  actionLabel: string;
  cancelLabel: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ModalContextValue = {
  openAlert: (message: string, options?: OpenAlertOptions) => void;
  openConfirm: (
    message: string,
    confirmAction: () => void,
    options?: OpenConfirmOptions,
  ) => void;
  replaceAlert: (message: string, options?: OpenAlertOptions) => void;
  replaceConfirm: (
    message: string,
    confirmAction: () => void,
    options?: OpenConfirmOptions,
  ) => void;
  closeModal: () => void;
};

const DEFAULT_STATE: ErrorModalState = {
  isOpen: false,
  title: "오류",
  message: "",
  actionLabel: "확인",
  cancelLabel: "취소",
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ErrorModalState>(DEFAULT_STATE);

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const replaceAlert = useCallback((message: string, options?: OpenAlertOptions) => {
    setState((prev) => {
      if (prev.isOpen) {
        console.warn("[modal] replacing active modal with alert");
      }
      return {
        isOpen: true,
        title: options?.title ?? "오류",
        message,
        actionLabel: options?.actionLabel ?? "확인",
        cancelLabel: DEFAULT_STATE.cancelLabel,
        onConfirm: options?.onConfirm,
        onCancel: undefined,
      };
    });
  }, []);

  const replaceConfirm = useCallback(
    (message: string, confirmAction: () => void, options?: OpenConfirmOptions) => {
      setState((prev) => {
        if (prev.isOpen) {
          console.warn("[modal] replacing active modal with confirm");
        }
        return {
          isOpen: true,
          title: options?.title ?? "확인",
          message,
          actionLabel: options?.actionLabel ?? "확인",
          cancelLabel: options?.cancelLabel ?? "취소",
          onConfirm: confirmAction,
          onCancel: options?.onCancel,
        };
      });
    },
    [],
  );

  const value = useMemo<ModalContextValue>(
    () => ({
      openAlert: replaceAlert,
      openConfirm: replaceConfirm,
      replaceAlert,
      replaceConfirm,
      closeModal,
    }),
    [closeModal, replaceAlert, replaceConfirm],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ErrorModal
        isOpen={state.isOpen}
        title={state.title}
        message={state.message}
        actionLabel={state.actionLabel}
        cancelLabel={state.cancelLabel}
        onConfirm={state.onConfirm}
        onCancel={state.onCancel}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export type { OpenAlertOptions, OpenConfirmOptions };
