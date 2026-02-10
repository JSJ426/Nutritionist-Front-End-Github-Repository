import { useCallback, useMemo, useState } from "react";

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
};

const DEFAULT_STATE: ErrorModalState = {
  isOpen: false,
  title: "오류",
  message: "",
  actionLabel: "확인",
  cancelLabel: "취소",
};

export function useErrorModal() {
  const [state, setState] = useState<ErrorModalState>(DEFAULT_STATE);
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();
  const [onCancel, setOnCancel] = useState<(() => void) | undefined>();

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openAlert = useCallback((message: string, options?: OpenAlertOptions) => {
    setOnConfirm(() => options?.onConfirm);
    setOnCancel(undefined);
    setState({
      isOpen: true,
      title: options?.title ?? "오류",
      message,
      actionLabel: options?.actionLabel ?? "확인",
      cancelLabel: DEFAULT_STATE.cancelLabel,
    });
  }, []);

  const openConfirm = useCallback(
    (message: string, confirmAction: () => void, options?: OpenConfirmOptions) => {
      setOnConfirm(() => confirmAction);
      setOnCancel(() => options?.onCancel ?? (() => undefined));
      setState({
        isOpen: true,
        title: options?.title ?? "확인",
        message,
        actionLabel: options?.actionLabel ?? "확인",
        cancelLabel: options?.cancelLabel ?? "취소",
      });
    },
    [],
  );

  const modalProps = useMemo(
    () => ({
      isOpen: state.isOpen,
      title: state.title,
      message: state.message,
      actionLabel: state.actionLabel,
      cancelLabel: state.cancelLabel,
      onConfirm,
      onCancel,
      onClose: closeModal,
    }),
    [closeModal, onCancel, onConfirm, state],
  );

  return { modalProps, openAlert, openConfirm, closeModal };
}
