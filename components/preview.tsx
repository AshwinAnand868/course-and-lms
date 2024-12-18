"use client";

/*
    To prevent hydration errors
    we make use of dynamic import. 
    No doubt, by writing use client we make
    a component client component, however
    the component is still rendered on 
    the server side once, then it is rendered
    on the client. If we import react-quill
    directly, then it will give us hydration errors.
    Therefore, we make use of import dynamic.
*/

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return <ReactQuill theme="bubble" value={value} readOnly />;
};

export default Preview;
