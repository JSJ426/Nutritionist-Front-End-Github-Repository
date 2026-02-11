import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type ErrorModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  actionLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function ErrorModal({
  isOpen,
  title = "오류",
  message,
  actionLabel = "확인",
  cancelLabel = "취소",
  onClose,
  onCancel,
  onConfirm,
}: ErrorModalProps) {
  const handleCancel = () => {
    onClose();
    if (!onCancel) return;
    try {
      onCancel();
    } catch (error) {
      console.error("[modal] onCancel callback failed:", error);
    }
  };

  const handleConfirm = () => {
    onClose();
    if (!onConfirm) return;
    try {
      onConfirm();
    } catch (error) {
      console.error("[modal] onConfirm callback failed:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onCancel ? (
            <AlertDialogCancel onClick={handleCancel}>{cancelLabel}</AlertDialogCancel>
          ) : null}
          <AlertDialogAction variant="brand" onClick={handleConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
