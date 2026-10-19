import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"], theme:{extend:{colors:{ink:"#0B3B3C",care:"#1F8A70",mint:"#E3F2EE",paper:"#F7FAFA",pulse:"#E4572E"},fontFamily:{display:["var(--f-display)"],body:["var(--f-body)"]}}}, plugins:[] } satisfies Config;
