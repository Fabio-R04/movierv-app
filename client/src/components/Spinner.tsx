import React from "react";

interface SpinnerProps {
    height?: string;
    width?: string;
    flex?: boolean;
}

function Spinner({ height, width, flex }: SpinnerProps) {
    return (
        <span style={(height && width) ? { height, width, ...(flex) && { display: "flex", justifyContent: "center", alignItems: "center", position: "static" } } : {}} className="loader"></span>
    )
}

export default Spinner