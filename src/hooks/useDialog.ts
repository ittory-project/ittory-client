import { useEffect, useState } from 'react';

export const useDialog = <ParamType>({
  closeTimeout,
}: {
  closeTimeout?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogParams, setDialogParams] = useState<ParamType>();

  const openDialog = (params: ParamType) => {
    setIsOpen(true);
    setDialogParams(params);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (closeTimeout && isOpen) {
      setTimeout(closeDialog, closeTimeout);
    }
  }, [closeTimeout, isOpen]);

  return { isOpen, openDialog, closeDialog, dialogParams };
};
