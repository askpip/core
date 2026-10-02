/**
 * The shared frame of Pip's two sitting images (see PipSitting in PipAvatar.tsx),
 * in image pixels: the edge he sits on is `seat` down from the top, and the
 * middle of his legs is `legs` in from the left. Both images use it, so he can
 * be placed on any straight edge and swapping between them never moves him.
 */
export const PIP_SITTING_FRAME = { width: 500, height: 570, seat: 432, legs: 288 } as const
