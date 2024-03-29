import { ReviewInteraction } from "./DislikeIcon"

function DeleteIcon({ onClick }: ReviewInteraction) {
    return (
        <svg onClick={onClick} fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M381.621,65.523h-53.944V54.004C327.677,24.226,303.451,0,273.673,0h-35.346c-29.778,0-54.005,24.226-54.005,54.004 v11.519h-53.943c-34.76,0-63.04,28.28-63.04,63.04v44.365h21.113v308.14c0,17.056,13.877,30.933,30.934,30.933h273.227 c17.057,0,30.934-13.877,30.934-30.933v-308.14h21.113v-44.366C444.66,93.803,416.38,65.523,381.621,65.523z M214.74,54.004 c0-13.005,10.581-23.587,23.588-23.587h35.346c13.005,0,23.587,10.581,23.587,23.587v11.519h-82.52V54.004z M393.13,481.067 c0,0.284-0.231,0.516-0.516,0.516H119.387c-0.285,0-0.517-0.232-0.517-0.516v-308.14h274.26V481.067z M408.339,142.51H393.13 H118.869h-15.209h-5.904v-13.948c0-17.987,14.635-32.621,32.622-32.621h251.241c17.988,0,32.622,14.635,32.622,32.622v13.947 H408.339z"></path> </g> </g> <g> <g> <rect x="167.112" y="204.576" width="30.417" height="245.366"></rect> </g> </g> <g> <g> <rect x="240.793" y="204.576" width="30.417" height="245.366"></rect> </g> </g> <g> <g> <rect x="314.463" y="204.576" width="30.417" height="245.366"></rect> </g> </g> </g></svg>
    )
}

export default DeleteIcon