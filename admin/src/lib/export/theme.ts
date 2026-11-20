// Brand colours as [red, green, blue] for the PDF. hex() turns them into the format Excel wants
export const NAVY = [10, 37, 64] as const;
export const ORANGE = [249, 115, 22] as const;
export const GREEN = [22, 163, 74] as const;
export const RED = [220, 38, 38] as const;
export const GREY_TEXT = [100, 116, 139] as const;
export const LIGHT = [248, 250, 252] as const;
export const BORDER = [226, 232, 240] as const;

export const hex = (c: readonly [number, number, number]): string => "FF" + c.map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
