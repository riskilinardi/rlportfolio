import { Fragment } from "react";

/**
 * Keeps each side of an en dash together so a name like
 * "University of London – Singapore Institute of Management" only ever
 * breaks after the dash, never in the middle of either half.
 */
export function NoWrapParts({ text }: { text: string }) {
  const parts = text.split(" – ");
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="whitespace-nowrap">
            {i < parts.length - 1 ? `${part} –` : part}
          </span>
        </Fragment>
      ))}
    </>
  );
}
