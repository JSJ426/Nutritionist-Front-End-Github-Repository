import {
  AlertDialog,
  AlertDialogAction,
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
  onClose: () => void;
};

export function ErrorModal({
  isOpen,
  title = "오류",
  message,
  actionLabel = "확인",
  onClose,
}: ErrorModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>{actionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
