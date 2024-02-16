import { ReviewInteraction } from "./DislikeIcon"
import { useAppSelector } from "../../app/hooks"

function LikeIcon({ onClick, style }: ReviewInteraction) {
    const { reviews } = useAppSelector((state) => state.review);

    return (
        <svg onClick={onClick} style={style} fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" stroke="#ffffff" strokeWidth="0.00016"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.032"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_1-2"> <path d="M16,6c0-1.1-0.9-2-2-2H9.1l0.2-0.9c0.2-0.7,0-1.5-0.5-2.1c-0.5-0.6-1.2-1-2-1H6.5C6.3,0,6.1,0.1,6,0.4L5.3,3 C5.2,3.8,4.7,4.5,4.2,5.1L2.3,7H0.5C0.2,7,0,7.2,0,7.5v8C0,15.8,0.2,16,0.5,16h2C2.8,16,3,15.8,3,15.5v-0.6C3.7,15.6,4.6,16,5.5,16 h7c0.8,0,1.5-0.7,1.5-1.5l0,0c0-0.2-0.1-0.5-0.2-0.7c0.7-0.3,1.2-1,1.2-1.8c0-0.4-0.1-0.8-0.3-1.1c0.8-0.3,1.3-1,1.3-1.9 c0-0.6-0.2-1.1-0.7-1.5C15.8,7.1,16,6.6,16,6z M2,15H1V8h1V15z M12.5,8H14c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1.5c-0.3,0-0.5,0.2-0.5,0.5 s0.2,0.5,0.5,0.5H13c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1c0.3,0,0.5,0.2,0.5,0.5 S12.8,15,12.5,15h-7C4.1,15,3,13.9,3,12.5V7.7l1.9-1.9c0.7-0.7,1.2-1.6,1.5-2.5L6.9,1h0.1c0.5,0,0.9,0.2,1.2,0.6 c0.3,0.4,0.4,0.8,0.3,1.3L8.1,4H7.5C7.2,4,7,4.2,7,4.5S7.2,5,7.5,5H14c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1.5C12.2,7,12,7.2,12,7.5 S12.2,8,12.5,8z"></path> </g> </g></svg>
    )
}

export default LikeIcon