// resources/js/Components/ui/alert-dialog.jsx
import React from "react";
import { Dialog } from "@/Components/ui/dialog"; // Asumiendo que Dialog ya existe

export function AlertDialog({ children }) {
  return <>{children}</>;
}

export function AlertDialogTrigger({ children, ...props }) {
  return React.cloneElement(children, { ...props });
}

export function AlertDialogContent({ children, ...props }) {
  return <Dialog.Content {...props}>{children}</Dialog.Content>;
}

export function AlertDialogHeader({ children, ...props }) {
  return <Dialog.Header {...props}>{children}</Dialog.Header>;
}

export function AlertDialogFooter({ children, ...props }) {
  return <Dialog.Footer {...props}>{children}</Dialog.Footer>;
}

export function AlertDialogTitle({ children, ...props }) {
  return <Dialog.Title {...props}>{children}</Dialog.Title>;
}

export function AlertDialogDescription({ children, ...props }) {
  return <Dialog.Description {...props}>{children}</Dialog.Description>;
}

export function AlertDialogAction({ children, ...props }) {
  return <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" {...props}>{children}</button>;
}

export function AlertDialogCancel({ children, ...props }) {
  return <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" {...props}>{children}</button>;
}
