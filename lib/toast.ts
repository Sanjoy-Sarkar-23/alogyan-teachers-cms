'use client';

import { toast as sonnerToast } from 'sonner';

export function toast(message: string) {
  sonnerToast(message);
}

export function toastSuccess(message: string) {
  sonnerToast.success(message);
}

export function toastError(message: string) {
  sonnerToast.error(message);
}

export function toastInfo(message: string) {
  sonnerToast.info(message);
}

export function toastWarning(message: string) {
  sonnerToast.warning(message);
}

export const toastPromise = {
  promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};
