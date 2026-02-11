import { useMemo } from "react";

import { useModal, type OpenAlertOptions, type OpenConfirmOptions } from "../modal/ModalContext";

const LEGACY_INACTIVE_PROPS = {
  isOpen: false,
  title: "오류",
  message: "",
  actionLabel: "확인",
  cancelLabel: "취소",
  onConfirm: undefined,
  onCancel: undefined,
  onClose: () => undefined,
};

export function useErrorModal() {
  const { openAlert, openConfirm, replaceAlert, replaceConfirm, closeModal } = useModal();

  const modalProps = useMemo(
    () => LEGACY_INACTIVE_PROPS,
    [],
  );

  return {
    modalProps,
    openAlert: (message: string, options?: OpenAlertOptions) => openAlert(message, options),
    openConfirm: (
      message: string,
      confirmAction: () => void,
      options?: OpenConfirmOptions,
    ) => openConfirm(message, confirmAction, options),
    replaceAlert: (message: string, options?: OpenAlertOptions) => replaceAlert(message, options),
    replaceConfirm: (
      message: string,
      confirmAction: () => void,
      options?: OpenConfirmOptions,
    ) => replaceConfirm(message, confirmAction, options),
    closeModal,
  };
}
