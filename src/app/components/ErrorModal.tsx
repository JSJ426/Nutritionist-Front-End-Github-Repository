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
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
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
