import React from "react";
import { useAppDispatch } from "../app/hooks";
import WarningIcon from "./svg/WarningIcon";
import { deleteReview } from "../features/review/reviewSlice";

export enum ConfirmTypes {
    DELETE_REVIEW = "DELETE_REVIEW"
}

interface ConfirmProps {
    title?: string;
    description?: string;
    active: { active: boolean; id: string; };
    setActive: (data: { active: boolean; id: string; }) => void;
    type: ConfirmTypes;
}

function ConfirmPopup({ title = "", description = "This action cannot be undone", active, setActive, type }: ConfirmProps) {
    const dispatch = useAppDispatch();
    
    return (
        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLDivElement;
            if (target.id === "confirm") {
                setActive({
                    active: false,
                    id: ""
                });
            }
        }} className="confirm" id="confirm">
            <div className="confirm__popup">
                <div className="confirm__popup-heading">
                    <WarningIcon />
                    <div className="confirm__popup-heading__details">
                        <p className="confirm__popup-heading__details-title">
                            DELETE {title}
                        </p>
                        <p className="confirm__popup-heading__details-description">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="confirm__popup-buttons">
                    <button onClick={() => setActive({ active: false, id: "" })} className="confirm__popup-buttons__cancel">
                        CANCEL
                    </button>
                    <button onClick={() => {
                        switch (type) {
                            case ConfirmTypes.DELETE_REVIEW:
                                dispatch(deleteReview(active.id));
                                break;
                            default:
                                break;
                        }
                        setActive({ active: false, id: "" });
                    }} className="confirm__popup-buttons__confirm">
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmPopup